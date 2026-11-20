const assert = require("assert");
const fx = require("./fixture.json");
const { normalize, parseIST } = require("./rapidapi");

assert.strictEqual(parseIST("Dec 23, 2026 9:50:00 PM"), "2026-12-23T21:50:00+05:30");
assert.strictEqual(parseIST("Dec 24, 2026 12:05:00 AM"), "2026-12-24T00:05:00+05:30");
assert.strictEqual(parseIST("Dec 24, 2026 12:05:00 PM"), "2026-12-24T12:05:00+05:30");
assert.strictEqual(parseIST("garbage"), null);

const j = normalize(fx);
assert.strictEqual(j.train.number, "16236");
assert.strictEqual(j.route.from, "CRLM");
assert.strictEqual(j.passengers.length, 3);
assert.deepStrictEqual([j.passengers[0].status, j.passengers[0].coach, j.passengers[0].berth, j.passengers[0].berth_name], ["CNF", "B2", 6, "Upper"]);
assert.deepStrictEqual([j.passengers[2].status, j.passengers[2].coach, j.passengers[2].berth], ["CNF", null, null]); // confirmed, seat not yet assigned
assert.strictEqual(j.chart.prepared, false);
assert.strictEqual(j.platform.current, null);
assert.strictEqual(normalize({ success: false, message: "FLUSHED PNR / PNR NOT YET GENERATED" }), null);

// WL / RAC mix: headline = worst status
const mix = JSON.parse(JSON.stringify(fx));
mix.data.passengerList[1].currentStatus = "WL"; mix.data.passengerList[1].currentBerthNo = 8; mix.data.passengerList[1].currentStatusDetails = "GNWL/8";
const m = normalize(mix);
assert.deepStrictEqual([m.ticket.type, m.ticket.wl_position], ["WL", 8]);
console.log("normalize tests passed");
