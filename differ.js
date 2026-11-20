// Differ: Compares previous and new JourneyState and returns ChangeEvent[]
// Contract reference: plan section 10.2 & rithika.md

function diffJourney(prev, next) {
  if (!prev || !next) return [];
  const events = [];
  const pnr = next.pnr || prev.pnr;
  const now = new Date().toISOString();

  // 1. Platform changed
  const prevPlat = prev.platform?.current;
  const nextPlat = next.platform?.current;
  if (prevPlat && nextPlat && prevPlat !== nextPlat) {
    events.push({
      pnr,
      type: "platform_changed",
      data: { from: prevPlat, to: nextPlat },
      timestamp_iso: now,
      journey: next,
    });
  }

  // 2. Delayed (increase of >= 10 minutes)
  const prevDelay = Number(prev.delay_minutes) || 0;
  const nextDelay = Number(next.delay_minutes) || 0;
  if (nextDelay >= prevDelay + 10) {
    events.push({
      pnr,
      type: "delayed",
      data: { minutes: nextDelay, new_departure: next.departure_iso },
      timestamp_iso: now,
      journey: next,
    });
  }

  // 3. Train state cancelled
  if (prev.train_state !== "cancelled" && next.train_state === "cancelled") {
    events.push({
      pnr,
      type: "cancelled",
      data: {},
      timestamp_iso: now,
      journey: next,
    });
  }

  // 4. Ticket moved to CNF
  if (prev.ticket?.type !== "CNF" && next.ticket?.type === "CNF") {
    events.push({
      pnr,
      type: "confirmed",
      data: {
        coach: next.ticket?.coach || "S4",
        berth: next.ticket?.berth || "32",
      },
      timestamp_iso: now,
      journey: next,
    });
  }

  // 5. WL position moved (silent update in S2)
  const prevWl = Number(prev.ticket?.wl_position) || 0;
  const nextWl = Number(next.ticket?.wl_position) || 0;
  if (prev.ticket?.type === "WL" && next.ticket?.type === "WL" && nextWl < prevWl && nextWl > 0) {
    events.push({
      pnr,
      type: "wl_moved",
      data: { from: prevWl, to: nextWl },
      timestamp_iso: now,
      journey: next,
    });
  }

  // 6. Chart prepared (silent update in S2)
  if (!prev.chart?.prepared && next.chart?.prepared) {
    events.push({
      pnr,
      type: "chart_prepared",
      data: { time: next.chart?.time_iso || now },
      timestamp_iso: now,
      journey: next,
    });
  }

  return events;
}

module.exports = { diffJourney };
