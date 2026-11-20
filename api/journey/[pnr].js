const mock = require("../../mock");
const live = require("../../rapidapi");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-RapidAPI-Key, X-RapidAPI-Host");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { pnr } = req.query;
  const isPnr = /^\d{10}$/.test(pnr || "");

  if (!isPnr) return res.status(400).json({ error: "badpnr" });
  if (pnr === "5555555555") return res.status(404).json({ error: "badpnr" });

  const apiKey = req.headers["x-rapidapi-key"] || req.query.apiKey || process.env.RAPIDAPI_KEY;
  const apiHost = req.headers["x-rapidapi-host"] || req.query.apiHost || process.env.RAPIDAPI_HOST;

  if (apiKey) {
    try {
      const { journey } = await live.getJourney(pnr, apiKey, apiHost);
      if (journey) return res.json(journey);
    } catch (e) {
      console.warn("Live API fallback:", e.message);
    }
  }

  const j = mock.getJourney(pnr);
  if (!j) return res.status(404).json({ error: "badpnr" });
  return res.json(j);
};
