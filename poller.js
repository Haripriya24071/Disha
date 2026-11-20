// Background poller: polls active tracked PNRs and diffs against previous state
const { diffJourney } = require("./differ");
const mock = require("./mock");
const live = require("./rapidapi");
const { notify, hasListeners, getTrackedPnrs } = require("./notify");

const stateStore = new Map(); // pnr -> previous JourneyState
let intervalId = null;

async function pollOnce() {
  const activePnrs = getTrackedPnrs();
  if (activePnrs.length === 0) return;

  const LIVE = process.env.TRAIN_DATA_MODE === "live";

  for (const pnr of activePnrs) {
    try {
      let nextState = null;
      if (mock.has(pnr) || !LIVE) {
        nextState = mock.getJourney(pnr);
      } else {
        const res = await live.getJourney(pnr);
        nextState = res.journey;
      }

      if (!nextState) continue;

      const prevState = stateStore.get(pnr);
      if (prevState) {
        const events = diffJourney(prevState, nextState);
        for (const ev of events) {
          await notify(ev);
        }
      }
      stateStore.set(pnr, JSON.parse(JSON.stringify(nextState)));
    } catch (err) {
      console.warn(`[Poller] Poll check failed for ${pnr}:`, err.message);
    }
  }
}

function startPoller(intervalMs = 30000) {
  if (intervalId) return;
  intervalId = setInterval(pollOnce, intervalMs);
}

function stopPoller() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

module.exports = { startPoller, stopPoller, pollOnce, stateStore };
