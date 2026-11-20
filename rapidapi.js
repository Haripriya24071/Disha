// Live provider (RapidAPI IRCTC PNR). Converts the provider response into our JourneyState contract.
const CACHE_MS = 60 * 1000;
const cache = new Map(); // pnr -> { at, journey }

const BERTH = { LB: "Lower", MB: "Middle", UB: "Upper", SL: "Side Lower", SU: "Side Upper" };

// "Dec 23, 2026 9:50:00 PM" (IST) -> ISO string with +05:30
function parseIST(str) {
  const m = /^([A-Za-z]{3}) (\d{1,2}), (\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/.exec(str || "");
  if (!m) return null;
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(m[1]);
  if (mon < 0) return null;
  let h = Number(m[4]) % 12;
  if (m[7] === "PM") h += 12;
  const p = (n) => String(n).padStart(2, "0");
  return `${m[3]}-${p(mon + 1)}-${p(m[2])}T${p(h)}:${m[5]}:${m[6]}+05:30`;
}

function mapPassenger(p) {
  const cur = String(p.currentStatus || "").toUpperCase();
  const book = String(p.bookingStatus || "").toUpperCase();
  let status = null, wl_position = null, coach = null, berth = null, berth_code = null;

  if (cur.includes("CNF")) status = "CNF";
  else if (cur.includes("RAC")) status = "RAC";
  else if (cur.includes("WL")) status = "WL";

  if (status === "WL") {
    // Position format varies by source: try currentBerthNo, then first number in the details string.
    const n = Number(p.currentBerthNo) || Number((String(p.currentStatusDetails).match(/\d+/) || [])[0]);
    wl_position = n || null;
  }
  if (status === "CNF") {
    // Use the current coach/berth if present, otherwise the original booking seat (only if it was CNF at booking).
    if (p.currentCoachId) { coach = p.currentCoachId; berth = p.currentBerthNo || null; berth_code = p.currentBerthCode || null; }
    else if (book === "CNF" && p.bookingCoachId) { coach = p.bookingCoachId; berth = p.bookingBerthNo || null; berth_code = p.bookingBerthCode || null; }
  }
  return {
    n: p.passengerSerialNumber ?? null,
    status, wl_position, coach, berth, berth_code,
    berth_name: berth_code ? (BERTH[berth_code] || null) : null,
    raw: p.currentStatusDetails || p.currentStatus || null,
  };
}

const RANK = { WL: 3, RAC: 2, CNF: 1 };

function normalize(resp) {
  if (!resp || resp.success !== true || !resp.data) return null; // caller turns this into "badpnr"
  const d = resp.data;
  const passengers = (d.passengerList || []).map(mapPassenger);
  const worst = passengers.reduce((a, b) => ((RANK[b.status] || 0) > (RANK[a?.status] || 0) ? b : a), null) || {};
  const chartPrepared = /prepared/i.test(d.chartStatus || "") && !/not/i.test(d.chartStatus || "");
  return {
    pnr: String(d.pnrNumber),
    train: { number: d.trainNumber ?? null, name: d.trainName ?? null, class: d.journeyClass ?? null },
    route: {
      from: d.boardingPoint || d.sourceStation || null,
      to: d.reservationUpto || d.destinationStation || null,
      from_name: d.boardingPoint || d.sourceStation || null, // provider gives codes only
      to_name: d.reservationUpto || d.destinationStation || null,
    },
    departure_iso: parseIST(d.dateOfJourney),
    ticket: {
      type: worst.status || null, wl_position: worst.wl_position ?? null,
      coach: worst.coach ?? null, berth: worst.berth ?? null, raw: worst.raw ?? null,
    },
    passengers,
    platform: { current: null, previous: null },   // not provided by this API
    delay_minutes: null,                           // not provided by this API
    train_state: "scheduled",
    chart: { time_iso: null, source: "estimate", prepared: chartPrepared },
    last_updated_iso: new Date().toISOString(),
    data_source: "live",
  };
}

async function getJourney(pnr) {
  const hit = cache.get(pnr);
  if (hit && Date.now() - hit.at < CACHE_MS) return { journey: hit.journey };
  const host = process.env.RAPIDAPI_HOST, key = process.env.RAPIDAPI_KEY;
  if (!host || !key) throw new Error("RAPIDAPI_KEY / RAPIDAPI_HOST not set");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(`https://${host}/getPNRStatus/${pnr}`, {
      headers: { "X-RapidAPI-Key": key, "X-RapidAPI-Host": host },
      signal: ctrl.signal,
    });
    const body = await r.json();
    if (!r.ok && r.status !== 200) throw new Error(`provider status ${r.status}`);
    const journey = normalize(body);
    if (!journey) return { journey: null };            // success:false -> bad / flushed PNR
    cache.set(pnr, { at: Date.now(), journey });
    return { journey };
  } catch (e) {
    if (hit) return { journey: { ...hit.journey, data_source: "cached" } }; // last good copy
    throw e;
  } finally { clearTimeout(timer); }
}

module.exports = { getJourney, normalize, parseIST };
