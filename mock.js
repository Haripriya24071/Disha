// Mock train data. Same shape as the shared JourneyState contract (plan section 10.1).
const BASE = {
  "1111111111": { type: "WL",  wl_position: 8,    coach: null, berth: null, raw: "GNWL 8/WL 5", platform: "3" },
  "2222222222": { type: "RAC one", wl_position: null, coach: "S4", berth: "RAC 3", raw: "RAC 3", platform: "3" },
  "3333333333": { type: "CNF",  wl_position: null, coach: "S4", berth: "32", raw: "CNF", platform: "3" },
  "4444444444": { type: "CNF",  wl_position: null, coach: "S4", berth: "32", raw: "CNF", platform: "3", cancelled: true },
};
BASE["2222222222"].type = "RAC";

const store = new Map();

function build(pnr) {
  const s = BASE[pnr];
  if (!s) return null;
  const dep = new Date(Date.now() + 24 * 3600e3);
  return {
    pnr,
    train: { number: "12345", name: "Sample Express", class: "3A" },
    route: { from: "SBC", to: "MAS", from_name: "Bengaluru", to_name: "Chennai" },
    departure_iso: dep.toISOString(),
    ticket: { type: s.type, wl_position: s.wl_position, coach: s.coach, berth: s.berth, raw: s.raw },
    passengers: [{ n: 1, status: s.type, wl_position: s.wl_position, coach: s.coach, berth: s.berth ? Number(s.berth) || null : null, berth_code: null, berth_name: null, raw: s.raw }],
    platform: { current: s.platform, previous: null },
    delay_minutes: 0,
    train_state: s.cancelled ? "cancelled" : "scheduled",
    chart: { time_iso: null, source: "estimate", prepared: false },
    last_updated_iso: new Date().toISOString(),
    data_source: "mock",
  };
}

exports.has = (pnr) => Object.prototype.hasOwnProperty.call(BASE, pnr);

exports.getJourney = (pnr) => {
  if (!store.has(pnr)) {
    const j = build(pnr);
    if (!j) return null;
    store.set(pnr, j);
  }
  const j = store.get(pnr);
  j.last_updated_iso = new Date().toISOString();
  return j;
};

exports.reset = (pnr) => { store.delete(pnr); return exports.getJourney(pnr); };

// Apply a demo event to the journey and return a ChangeEvent (plan section 10.2).
exports.trigger = (pnr, event) => {
  const j = exports.getJourney(pnr);
  if (!j) return null;
  let data = {};
  if (event === "platform_changed") {
    data = { from: j.platform.current, to: j.platform.current === "6" ? "3" : "6" };
    j.platform.previous = data.from;
    j.platform.current = data.to;
  } else if (event === "delayed") {
    j.delay_minutes += 45;
    const nd = new Date(new Date(j.departure_iso).getTime() + j.delay_minutes * 60000);
    data = { minutes: j.delay_minutes, new_departure: nd.toISOString() };
    j.train_state = "running";
  } else if (event === "cancelled") {
    j.train_state = "cancelled";
  } else if (event === "confirmed") {
    j.ticket = { type: "CNF", wl_position: null, coach: "S4", berth: "32", raw: "CNF" };
    j.passengers = [{ n: 1, status: "CNF", wl_position: null, coach: "S4", berth: 32, berth_code: null, berth_name: null, raw: "CNF" }];
    data = { coach: "S4", berth: "32" };
  } else {
    return null;
  }
  j.last_updated_iso = new Date().toISOString();
  return { pnr, type: event, data, timestamp_iso: new Date().toISOString(), journey: j };
};
