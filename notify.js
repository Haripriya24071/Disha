// One change event -> three channels: SSE (open app), subscriptions store, WhatsApp (Twilio, optional).
const clients = new Map();        // pnr -> Set<res>
const subs = new Map();           // pnr -> [{ whatsapp, fcmToken, language }]

exports.addClient = (pnr, res) => {
  if (!clients.has(pnr)) clients.set(pnr, new Set());
  clients.get(pnr).add(res);
  res.on("close", () => {
    const s = clients.get(pnr);
    if (s) {
      s.delete(res);
      if (s.size === 0) clients.delete(pnr);
    }
  });
};

exports.subscribe = (pnr, sub) => {
  if (!subs.has(pnr)) subs.set(pnr, []);
  subs.get(pnr).push(sub);
};

exports.hasListeners = (pnr) => {
  const c = clients.get(pnr);
  const s = subs.get(pnr);
  return (c && c.size > 0) || (s && s.length > 0);
};

exports.getTrackedPnrs = () => {
  const set = new Set([...clients.keys(), ...subs.keys()]);
  return Array.from(set);
};

const TEXT = {
  platform_changed: (d) => `Disha: Platform changed. Your train will now come to Platform ${d.to}.`,
  delayed: (d) => `Disha: Your train is ${d.minutes} minutes late.`,
  cancelled: () => "Disha: Your train is cancelled. Open Disha to see other ways to travel.",
  confirmed: (d) => `Disha: Good news. Your ticket is now confirmed. Coach ${d.coach}, berth ${d.berth}.`,
  wl_moved: (d) => `Disha: Waiting list moved from ${d.from} to ${d.to}.`,
  chart_prepared: () => "Disha: Reservation chart has been prepared.",
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
  const sseClients = clients.get(event.pnr);
  if (sseClients) {
    for (const res of sseClients) {
      try {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      } catch (err) {
        console.warn("SSE write error:", err.message);
      }
    }
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
      } catch (e) {
        console.error("WhatsApp send failed:", e.message);
      }
    }
  }

  // 3. Web push (FCM stub)
  const registeredSubs = subs.get(event.pnr) || [];
  if (registeredSubs.some(s => s.fcmToken)) {
    console.log(`[FCM Push] Notification queued for PNR ${event.pnr}: ${event.type}`);
  }
};
