module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    ok: true,
    mode: process.env.TRAIN_DATA_MODE || "live",
    hasApiKey: !!process.env.RAPIDAPI_KEY,
    timestamp: new Date().toISOString(),
  });
};
