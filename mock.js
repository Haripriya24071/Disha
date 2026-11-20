// Mock train data. Same shape as the shared JourneyState contract (plan section 10.1).
const BASE = {
  "1111111111": { type: "WL",  wl_position: 8,    coach: null, berth: null, raw: "GNWL 8/WL 5", platform: "3", number: "12345", name: "Sample Express", from: "SBC", to: "MAS", from_name: "Bengaluru", to_name: "Chennai", class: "3A" },
  "2222222222": { type: "RAC", wl_position: null, coach: "S4", berth: "RAC 14", raw: "RAC 14", platform: "1", number: "12627", name: "Karnataka Express", from: "SBC", to: "NDLS", from_name: "Bengaluru", to_name: "New Delhi", class: "SL" },
  "3333333333": { type: "CNF",  wl_position: null, coach: "B2", berth: "32", raw: "CNF/B2/32/LB", platform: "4", number: "12007", name: "Shatabdi Express", from: "MAS", to: "SBC", from_name: "Chennai", to_name: "Bengaluru", class: "CC" },
  "4444444444": { type: "WL",  wl_position: 4,    coach: null, berth: null, raw: "GNWL 4", platform: null, number: "16526", name: "Island Express", from: "SBC", to: "CAPE", from_name: "Bengaluru", to_name: "Kanyakumari", class: "3A", cancelled: true },
};

const store = new Map();

const REALISTIC_TRAINS = [
  { number: "12628", name: "Karnataka Express", from: "SBC", to: "NDLS", from_name: "Bengaluru", to_name: "New Delhi", class: "3A" },
  { number: "12007", name: "Shatabdi Express", from: "MAS", to: "SBC", from_name: "Chennai", to_name: "Bengaluru", class: "CC" },
  { number: "12951", name: "Mumbai Rajdhani", from: "MMCT", to: "NDLS", from_name: "Mumbai Central", to_name: "New Delhi", class: "2A" },
  { number: "20608", name: "Vande Bharat Express", from: "MYS", to: "MAS", from_name: "Mysuru", to_name: "Chennai Central", class: "EC" },
  { number: "12626", name: "Kerala Express", from: "NDLS", to: "TVC", from_name: "New Delhi", to_name: "Thiruvananthapuram", class: "SL" },
];

function build(pnr) {
  // Test PNR 5555555555 is an invalid/non-existent PNR
  if (pnr === "5555555555") return null;

  const s = BASE[pnr];
  if (s) {
    const dep = new Date(Date.now() + 24 * 3600e3);
    return {
      pnr,
      train: { number: s.number, name: s.name, class: s.class },
      route: { from: s.from, to: s.to, from_name: s.from_name, to_name: s.to_name },
      departure_iso: dep.toISOString(),
      ticket: { type: s.type, wl_position: s.wl_position, coach: s.coach, berth: s.berth, raw: s.raw },
      passengers: [{
        n: 1,
        status: s.type,
        wl_position: s.wl_position,
        coach: s.coach,
        berth: s.berth ? Number(s.berth.replace(/\D/g, "")) || null : null,
        berth_code: s.berth?.includes("LB") ? "LB" : null,
        berth_name: s.berth?.includes("LB") ? "Lower" : null,
        raw: s.raw
      }],
      platform: { current: s.platform, previous: null },
      delay_minutes: 0,
      train_state: s.cancelled ? "cancelled" : "scheduled",
      chart: { time_iso: new Date(dep.getTime() - 4 * 3600e3).toISOString(), source: "estimate", prepared: false },
      last_updated_iso: new Date().toISOString(),
      data_source: "mock",
    };
  }

  // Realistic deterministic synthesis for any other 10-digit PNR
  const seed = Array.from(pnr).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const trainMeta = REALISTIC_TRAINS[seed % REALISTIC_TRAINS.length];
  const dep = new Date(Date.now() + 18 * 3600e3);
  const statusType = seed % 3 === 0 ? "CNF" : seed % 3 === 1 ? "RAC" : "WL";
  const wlPos = statusType === "WL" ? (seed % 15) + 1 : null;
  const coach = statusType === "CNF" ? `B${(seed % 4) + 1}` : statusType === "RAC" ? "S2" : null;
  const berth = statusType === "CNF" ? `${(seed % 64) + 1}` : statusType === "RAC" ? `RAC ${(seed % 20) + 1}` : null;
  const platform = String((seed % 6) + 1);

  return {
    pnr,
    train: { number: trainMeta.number, name: trainMeta.name, class: trainMeta.class },
    route: { from: trainMeta.from, to: trainMeta.to, from_name: trainMeta.from_name, to_name: trainMeta.to_name },
    departure_iso: dep.toISOString(),
    ticket: {
      type: statusType,
      wl_position: wlPos,
      coach,
      berth,
      raw: statusType === "CNF" ? `CNF/${coach}/${berth}` : statusType === "RAC" ? `${berth}` : `GNWL ${wlPos}/WL ${wlPos}`,
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

exports.has = (pnr) => Object.prototype.hasOwnProperty.call(BASE, pnr);

exports.getJourney = (pnr) => {
  if (pnr === "5555555555") return null;
  if (!store.has(pnr)) {
    const j = build(pnr);
    if (!j) return null;
    store.set(pnr, j);
  }
  const j = store.get(pnr);
  j.last_updated_iso = new Date().toISOString();
  return j;
};

exports.reset = (pnr) => {
  store.delete(pnr);
  return exports.getJourney(pnr);
};

// Apply a demo event to the journey and return a ChangeEvent (plan section 10.2).
exports.trigger = (pnr, event) => {
  const j = exports.getJourney(pnr);
  if (!j) return null;
  let data = {};
  if (event === "platform_changed") {
    data = { from: j.platform.current || "3", to: j.platform.current === "6" ? "3" : "6" };
    j.platform.previous = data.from;
    j.platform.current = data.to;
  } else if (event === "delayed") {
    j.delay_minutes = (j.delay_minutes || 0) + 45;
    const nd = new Date(new Date(j.departure_iso).getTime() + j.delay_minutes * 60000);
    data = { minutes: j.delay_minutes, new_departure: nd.toISOString() };
    j.train_state = "running";
  } else if (event === "cancelled") {
    j.train_state = "cancelled";
  } else if (event === "confirmed") {
    j.ticket = { type: "CNF", wl_position: null, coach: "B2", berth: "32", raw: "CNF" };
    j.passengers = [{ n: 1, status: "CNF", wl_position: null, coach: "B2", berth: 32, berth_code: "LB", berth_name: "Lower", raw: "CNF" }];
    data = { coach: "B2", berth: "32" };
  } else {
    return null;
  }
  j.last_updated_iso = new Date().toISOString();
  return { pnr, type: event, data, timestamp_iso: new Date().toISOString(), journey: j };
};
