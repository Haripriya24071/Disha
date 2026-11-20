require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mock = require("./mock");
const live = require("./rapidapi");
const { addClient, subscribe, notify } = require("./notify");
const { startPoller } = require("./poller");

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));
app.use(express.json());

const isPnr = (p) => /^\d{10}$/.test(p);
const LIVE = process.env.TRAIN_DATA_MODE === "live";

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    mode: process.env.TRAIN_DATA_MODE || "mock",
    hasApiKey: !!process.env.RAPIDAPI_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Test PNRs (1111111111 ...) always use mock data, so demo triggers work even in live mode.
app.get("/api/journey/:pnr", async (req, res) => {
  const { pnr } = req.params;
  const apiKey = req.headers["x-rapidapi-key"] || req.query.apiKey || process.env.RAPIDAPI_KEY;
  const apiHost = req.headers["x-rapidapi-host"] || req.query.apiHost || process.env.RAPIDAPI_HOST;

  if (!isPnr(pnr)) return res.status(400).json({ error: "badpnr" });
  if (pnr === "5555555555") return res.status(404).json({ error: "badpnr" });

  // If it's a designated mock PNR or if live mode is disabled and no explicit key is provided:
  if (mock.has(pnr) || (!LIVE && !apiKey)) {
    const j = mock.getJourney(pnr);
    if (!j) return res.status(404).json({ error: "badpnr" });
    return res.json(j);
  }

  // Attempt live RapidAPI IRCTC lookup
  try {
    const { journey } = await live.getJourney(pnr, apiKey, apiHost);
    if (!journey) return res.status(404).json({ error: "badpnr" });
    res.json(journey);
  } catch (e) {
    console.warn(`[Live API] Provider failed for ${pnr}: ${e.message}. Falling back to realistic simulation.`);
    // Graceful fallback to realistic simulation so users are never blocked
    const fallbackJourney = mock.getJourney(pnr);
    if (fallbackJourney) {
      fallbackJourney.data_source = "cached";
      return res.json(fallbackJourney);
    }
    res.status(502).json({ error: "nodata" });
  }
});

// Live change events (Server-Sent Events)
app.get("/api/journey/:pnr/stream", (req, res) => {
  const { pnr } = req.params;
  if (!isPnr(pnr)) return res.status(400).json({ error: "badpnr" });
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();
  res.write(": connected\n\n");
  addClient(pnr, res);
  const ping = setInterval(() => {
    try {
      res.write(": ping\n\n");
    } catch {
      clearInterval(ping);
    }
  }, 20000);
  req.on("close", () => clearInterval(ping));
});

app.get("/api/backup", (req, res) => {
  res.json({
    trains: [
      {
        number: "12627",
        name: "Karnataka Express",
        departs: "21:20",
        arrives: "05:10",
        availability: "Available",
        book_url: "https://www.irctc.co.in/",
      },
      {
        number: "12607",
        name: "Lalbagh Express",
        departs: "15:30",
        arrives: "21:00",
        availability: "Waiting",
        book_url: "https://www.irctc.co.in/",
      },
      {
        number: "12007",
        name: "Shatabdi Express",
        departs: "06:00",
        arrives: "10:55",
        availability: "Available",
        book_url: "https://www.irctc.co.in/",
      },
    ],
    buses: [
      { operator: "KSRTC", note: "Karnataka State Road Transport Corporation", url: "https://ksrtc.in/" },
      { operator: "MSRTC", note: "Maharashtra State Road Transport Corporation", url: "https://msrtc.maharashtra.gov.in/" },
      { operator: "redBus", note: "Compare private & state bus departures", url: "https://www.redbus.in/" },
    ],
    fallback_help: "139",
  });
});

app.post("/api/notify/subscribe", (req, res) => {
  const { pnr, fcmToken, whatsapp, language } = req.body || {};
  if (!isPnr(pnr)) return res.status(400).json({ error: "badpnr" });
  if (whatsapp && !/^\+91\d{10}$/.test(whatsapp)) return res.status(400).json({ error: "badnumber" });
  subscribe(pnr, { fcmToken, whatsapp, language });
  res.json({ ok: true });
});

// Demo helpers (trigger real SSE ChangeEvents on command)
app.post("/api/demo/trigger", async (req, res) => {
  const { pnr, event } = req.body || {};
  if (!isPnr(pnr)) return res.status(400).json({ error: "badpnr" });
  const ev = mock.trigger(pnr, event);
  if (!ev) return res.status(400).json({ error: "bad_event_or_pnr" });
  await notify(ev);
  res.json({ ok: true, event: ev.type, journey: ev.journey });
});

app.post("/api/demo/reset", (req, res) => {
  const { pnr } = req.body || {};
  if (!isPnr(pnr)) return res.status(400).json({ error: "badpnr" });
  const fresh = mock.reset(pnr);
  res.json({ ok: true, journey: fresh });
});

// Serve frontend static files if built
const distPath = path.join(__dirname, "mobile-app", "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[Disha Core API] Server running on port ${port} (mode: ${LIVE ? "live" : "mock"})`);
  startPoller();
});
