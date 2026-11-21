let mock, live;
try {
  mock = require("../../mock");
} catch {
  mock = null;
}
try {
  live = require("../../rapidapi");
} catch {
  live = null;
}

function generateJourney(pnr) {
  const seed = Array.from(pnr).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const statusType = seed % 3 === 0 ? "CNF" : seed % 3 === 1 ? "RAC" : "WL";
  const wlPos = statusType === "WL" ? (seed % 15) + 1 : null;
  const coach = statusType === "CNF" ? `B${(seed % 4) + 1}` : statusType === "RAC" ? "S2" : null;
  const berth = statusType === "CNF" ? `${(seed % 64) + 1}` : statusType === "RAC" ? `RAC ${(seed % 20) + 1}` : null;
  const platform = String((seed % 6) + 1);
  const dep = new Date(Date.now() + 18 * 3600e3);

  return {
    pnr,
    train: { number: "12658", name: "Chennai Mail", class: "3A" },
    route: { from: "SBC", to: "MAS", from_name: "KSR Bengaluru", to_name: "Chennai Central" },
    departure_iso: dep.toISOString(),
    ticket: {
      type: statusType,
      wl_position: wlPos,
      coach,
      berth,
      raw: statusType === "CNF" ? `CNF/${coach}/${berth}` : statusType === "RAC" ? `${berth}` : `GNWL ${wlPos}`,
    },
    passengers: [{
      n: 1,
      status: statusType,
      wl_position: wlPos,
      coach,
      berth: berth ? Number(String(berth).replace(/\D/g, "")) || null : null,
      berth_code: statusType === "CNF" ? "LB" : null,
      berth_name: statusType === "CNF" ? "Lower Berth" : null,
      raw: statusType === "CNF" ? `CNF/${coach}/${berth}` : statusType === "RAC" ? `${berth}` : `GNWL ${wlPos}`,
    }],
    platform: { current: platform, previous: null },
    delay_minutes: 0,
    train_state: "scheduled",
    chart: { time_iso: new Date(dep.getTime() - 4 * 3600e3).toISOString(), source: "estimate", prepared: false },
    last_updated_iso: new Date().toISOString(),
    data_source: "mock",
  };
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-RapidAPI-Key, X-RapidAPI-Host");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const pnr = req.query?.pnr || (req.url ? req.url.split("/").pop().split("?")[0] : "");
  const isPnr = /^\d{10}$/.test(pnr || "");

  if (!isPnr) return res.status(400).json({ error: "badpnr" });
  if (pnr === "5555555555") return res.status(404).json({ error: "badpnr" });

  const apiKey = req.headers["x-rapidapi-key"] || req.query?.apiKey || process.env.RAPIDAPI_KEY;
  const apiHost = req.headers["x-rapidapi-host"] || req.query?.apiHost || process.env.RAPIDAPI_HOST;

  if (apiKey && live) {
    try {
      const { journey } = await live.getJourney(pnr, apiKey, apiHost);
      if (journey) return res.json(journey);
    } catch (e) {
      console.warn("Live API fallback:", e.message);
    }
  }

  if (mock) {
    const j = mock.getJourney(pnr);
    if (j) return res.json(j);
  }

  return res.json(generateJourney(pnr));
};
