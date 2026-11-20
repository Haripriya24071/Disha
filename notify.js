// One change event -> three channels: SSE (open app), subscriptions store, WhatsApp (Twilio, optional).
const clients = new Map();        // pnr -> Set<res>
const subs = new Map();           // pnr -> [{ whatsapp, fcmToken, language }]

exports.addClient = (pnr, res) => {
  if (!clients.has(pnr)) clients.set(pnr, new Set());
  clients.get(pnr).add(res);
  res.on("close", () => clients.get(pnr)?.delete(res));
};

exports.subscribe = (pnr, sub) => {
  if (!subs.has(pnr)) subs.set(pnr, []);
  subs.get(pnr).push(sub);
};

const TEXT = {
  platform_changed: (d) => `ClearTrack: Platform changed. Your train will now come to Platform ${d.to}.`,
  delayed: (d) => `ClearTrack: Your train is ${d.minutes} minutes late.`,
  cancelled: () => "ClearTrack: Your train is cancelled. Open ClearTrack to see other ways to travel.",
  confirmed: (d) => `ClearTrack: Good news. Your ticket is now confirmed. Coach ${d.coach}, berth ${d.berth}.`,
};

let twilioClient = null;
function getTwilio() {
  if (twilioClient !== null) return twilioClient || null;
  try {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      twilioClient = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    } else twilioClient = false;
  } catch { twilioClient = false; }
  return twilioClient || null;
}

exports.notify = async (event) => {
  // 1. SSE
  for (const res of clients.get(event.pnr) || []) {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  }
  // 2. WhatsApp (only if Twilio is configured)
  const tw = getTwilio();
  const text = TEXT[event.type]?.(event.data || {});
  if (tw && text) {
    for (const s of subs.get(event.pnr) || []) {
      if (!s.whatsapp) continue;
      try {
        await tw.messages.create({
          from: process.env.TWILIO_WHATSAPP_FROM,
          to: `whatsapp:${s.whatsapp}`,
          body: text,
        });
      } catch (e) { console.error("WhatsApp send failed:", e.message); }
    }
  }
  // 3. Web push (FCM) is left as a stub: store tokens now, wire firebase-admin later if time allows.
};
