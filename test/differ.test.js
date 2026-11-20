const test = require("node:test");
const assert = require("node:assert");
const { diffJourney } = require("../differ");

const base = {
  pnr: "1111111111",
  train: { number: "12345", name: "Sample Express", class: "3A" },
  route: { from: "SBC", to: "MAS", from_name: "Bengaluru", to_name: "Chennai" },
  departure_iso: "2026-11-21T22:15:00+05:30",
  ticket: { type: "WL", wl_position: 8, coach: null, berth: null, raw: "GNWL 8/WL 5" },
  platform: { current: "3", previous: null },
  delay_minutes: 0,
  train_state: "scheduled",
  chart: { time_iso: null, source: "estimate", prepared: false },
};

test("1. diffJourney detects platform change", () => {
  const updated = JSON.parse(JSON.stringify(base));
  updated.platform.current = "6";
  const events = diffJourney(base, updated);
  assert.strictEqual(events.length, 1);
  assert.strictEqual(events[0].type, "platform_changed");
  assert.strictEqual(events[0].data.from, "3");
  assert.strictEqual(events[0].data.to, "6");
});

test("2. diffJourney detects delay >= 10 mins", () => {
  const updated = JSON.parse(JSON.stringify(base));
  updated.delay_minutes = 45;
  const events = diffJourney(base, updated);
  assert.strictEqual(events.length, 1);
  assert.strictEqual(events[0].type, "delayed");
  assert.strictEqual(events[0].data.minutes, 45);
});

test("3. diffJourney detects cancellation", () => {
  const updated = JSON.parse(JSON.stringify(base));
  updated.train_state = "cancelled";
  const events = diffJourney(base, updated);
  assert.strictEqual(events.length, 1);
  assert.strictEqual(events[0].type, "cancelled");
});

test("4. diffJourney detects ticket confirmed", () => {
  const updated = JSON.parse(JSON.stringify(base));
  updated.ticket = { type: "CNF", wl_position: null, coach: "B1", berth: "45", raw: "CNF" };
  const events = diffJourney(base, updated);
  assert.strictEqual(events.length, 1);
  assert.strictEqual(events[0].type, "confirmed");
  assert.strictEqual(events[0].data.coach, "B1");
  assert.strictEqual(events[0].data.berth, "45");
});

test("5. diffJourney detects WL movement", () => {
  const updated = JSON.parse(JSON.stringify(base));
  updated.ticket.wl_position = 4;
  const events = diffJourney(base, updated);
  assert.strictEqual(events.length, 1);
  assert.strictEqual(events[0].type, "wl_moved");
  assert.strictEqual(events[0].data.from, 8);
  assert.strictEqual(events[0].data.to, 4);
});

test("6. diffJourney detects chart prepared", () => {
  const updated = JSON.parse(JSON.stringify(base));
  updated.chart.prepared = true;
  updated.chart.time_iso = "2026-11-21T18:15:00+05:30";
  const events = diffJourney(base, updated);
  assert.strictEqual(events.length, 1);
  assert.strictEqual(events[0].type, "chart_prepared");
});
