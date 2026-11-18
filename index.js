require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mock = require("./mock");
const live = require("./rapidapi");
const { addClient, subscribe, notify } = require("./notify");

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));
app.use(express.json());

const isPnr = (p) => /^\d{10}$/.test(p);
const LIVE = process.env.TRAIN_DATA_MODE === "live";

app.get("/api/health", (req, res) => res.json({ ok: true, mode: process.env.TRAIN_DATA_MODE || "mock" }));

// Test PNRs (1111111111 ...) always use mock data, so demo triggers work even in live mode.
app.get("/api/journey/:pnr", async (req, res) => {
  const { pnr } = req.params;
  if (!isPnr(pnr)) return res.status(400).json({ error: "badpnr" });
  if (mock.has(pnr) || !LIVE) {
    const j = mock.getJourney(pnr);
    if (!j) return res.status(404).json({ error: "badpnr" });
    return res.json(j);
  }
  try {
    const { journey } = await live.getJourney(pnr);
    if (!journey) return res.status(404).json({ error: "badpnr" });
    res.json(journey);
  } catch (e) {
    console.error("live provider failed:", e.message);
    res.status(502).json({ error: "nodata" });
  }
});

// Live change events (Server-Sent Events)
app.get("/api/journey/:pnr/stream", (req, res) => {
  const { pnr } = req.params;
  if (!isPnr(pnr)) return res.status(400).json({ error: "badpnr" });
  res.set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
  res.flushHeaders();
  res.write(": connected\n\n");
  addClient(pnr, res);
  const ping = setInterval(() => res.write(": ping\n\n"), 20000);
  req.on("close", () => clearInterval(ping));
});

app.get("/api/backup", (req, res) => {
  res.json({
    trains: [
      { number: "12627", name: "Karnataka Express", departs: "21:20", arrives: "05:10", availability: "Available", book_url: "https://www.irctc.co.in/" },
      { number: "12607", name: "Lalbagh Express", departs: "15:30", arrives: "21:00", availability: "Waiting", book_url: "https://www.irctc.co.in/" },
    ],
    buses: [
      { operator: "KSRTC", note: "Check timings on the official site", url: "https://ksrtc.in/" },
      { operator: "redBus", note: "Compare private buses", url: "https://www.redbus.in/" },
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

// Demo helpers (mock mode only)
app.post("/api/demo/trigger", async (req, res) => {
  const { pnr, event } = req.body || {};
  if (!isPnr(pnr) || !mock.has(pnr)) return res.status(400).json({ error: "demo_only_for_test_pnrs" });
  const ev = mock.trigger(pnr, event);
  if (!ev) return res.status(400).json({ error: "bad_event_or_pnr" });
  await notify(ev);
  res.json({ ok: true, event: ev.type });
});

app.post("/api/demo/reset", (req, res) => {
  const { pnr } = req.body || {};
  if (!isPnr(pnr) || !mock.has(pnr)) return res.status(400).json({ error: "demo_only_for_test_pnrs" });
  mock.reset(pnr);
  res.json({ ok: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`ClearTrack backend running on ${port} (mode: ${process.env.TRAIN_DATA_MODE || "mock"})`));
