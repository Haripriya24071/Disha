# Rithika — Backend, Data & Alerts

Part 2 — Rithika — Backend, Data & Alerts
Read Part 1 (Project Plan) §9–§11 first. The contract in §10 is your law: every response you
send must match it exactly, because Vaibhavi and Haripriya build against it.
Your role in one line
You own everything that happens before the screen: getting train data, turning it into the shared
JourneyState , noticing when something changes, and telling people — over the open app, phone
push and WhatsApp.
You own (files)
backend/  (everything), the Render deployment, the Firebase project settings, the Twilio sandbox,
and .env.example .
You do NOT touch
React screens, translations, glossary text. If a screen needs a new field, the other person asks you,
you add it to the contract, and you tell both.
Day 0 — tonight (30 min)
Create a RapidAPI account. Search "IRCTC PNR status", subscribe to the free tier of one
provider, test with one real PNR in the RapidAPI tester. Write down the exact endpoint
names and the fields you get back. Also check what it offers for: live train status, trains
between stations, seat availability.
Create a Firebase project (Auth with Phone, Firestore, Cloud Messaging). Add 2–3 test
phone numbers (Auth → Phone → test numbers) for the demo.
Create a Twilio account → WhatsApp Sandbox. Note the sandbox number and the join code.
Share keys with the team privately (not in the repo). Commit only .env.example .
Write in the team chat: which fields the real API gives and which it doesn't. Anything it doesn't
give is null  in the contract.
Day 1 — Foundations (the mock server is your first deadline)
By midday — this unblocks everyone:
Node + Express project, GET /api/health  → { "ok": true } .
providers/mock.js  returning JourneyState  (see §10.1) for the 5 mock PNRs in §10.5:
1111111111  WL 8, platform 3, departure ~tomorrow 22:15
2222222222  RAC
3333333333  CNF coach S4 berth 32
4444444444  train_state: "cancelled"
5555555555  → HTTP 404 { "error": "badpnr" }
Disha — Team 3 · page 16 of 29

---

GET /api/journey/:pnr  → returns JourneyState . Validate the PNR is exactly 10 digits, else 400
{ "error": "badpnr" } .
Enable CORS for the Vercel domain + localhost:5173 .
Deploy to Render and send Vaibhavi + Haripriya the URL.
Afternoon:
POST /api/demo/trigger { pnr, event }  (only works when TRAIN_DATA_MODE=mock ). event  ∈
platform_changed | delayed | cancelled | confirmed . It mutates the mock state and emits a
ChangeEvent  (§10.2). Platform change = 3 → 6 ; delay = 45 min.
GET /api/journey/:pnr/stream  — SSE: set headers Content-Type: text/event-stream , Cache-
Control: no-cache , Connection: keep-alive ; send data: <ChangeEvent JSON>\n\n ; send a :ping
comment every 20 s so Render doesn't drop it. Keep a Map<pnr, Set<res>>  of open
connections and remove on req.on('close') .
chartTime.js : if the provider gives a chart time, use it ( source:"api" ); otherwise estimate and
set source:"estimate" . The estimate should be the departure time minus 4 hours — but
never present it as a fact (the frontend uses the "usually made 4–8 hours before"
sentence). Check current Railways chart rules and note them in a comment.
Done for Day 1 when: Vaibhavi can open https://<render-url>/api/journey/1111111111  and see
the contract JSON, and curl  on the trigger endpoint makes an SSE client receive an event.
Day 2 — Real data + alerts
providers/rapidapi.js : functions getPnr(pnr) , getLiveStatus(trainNo, date) ,
getTrainsBetween(from,to,date) , getSeatAvailability(...) . Key from
process.env.RAPIDAPI_KEY . Timeout 8 s. Never send the key to the browser.
normalize.js : convert the provider's response into exactly JourneyState . Map every status
string:
contains CNF → type:"CNF" , fill coach/berth
contains RAC → type:"RAC"
anything WL  (GNWL, RLWL, PQWL, WL) → type:"WL" , wl_position  = the current
waiting-list number, raw = the original string
unknown → null  fields, never crash.
Cache: in-memory Map keyed by PNR, TTL 60 s. Also write the last good JourneyState  to
Firestore journeys/{pnr} . When the provider fails, return the cached/Firestore copy with
data_source:"cached" .
TRAIN_DATA_MODE  env switch: mock  | live . Provider chosen in one place.
poller.js : every 30 s, for each PNR that has an open SSE connection or a notify subscription,
fetch fresh state (use the cache first so you stay inside the free quota). Stop polling PNRs with
no listeners.
differ.js : compare previous vs new JourneyState  and return ChangeEvent[]:
platform changed → platform_changed {from,to}
delay increased by ≥10 min → delayed {minutes, new_departure}
train_state  became cancelled → cancelled
ticket moved to CNF → confirmed {coach,berth}
WL position decreased → wl_moved  · chart became prepared → chart_prepared  Write 6
small unit tests with hand-made before/after objects.
notifier.js  — one function notify(event) that fans out to three channels:
1. SSE → all open connections for that PNR
Disha — Team 3 · page 17 of 29

---

2. FCM push → every token subscribed for that PNR; title/body are short English + the
type  and data  so the app can open S4 (the app renders the language text, so put codes
in the push data  payload and a generic title like "Disha: your train changed" in the
notification)
3. WhatsApp (Twilio) → send a short message to each subscribed number. Message text
should be built from the user's saved language if known; for the demo English +
Hindi/Kannada is enough. Use Twilio's client.messages.create({ from:'whatsapp:+
<sandbox>', to:'whatsapp:+91...', body }) .
POST /api/notify/subscribe body { pnr, fcmToken?, whatsapp?, language? }  → store in
Firestore subscriptions/{pnr} . Validate the WhatsApp number format. Return { ok:true } .
GET /api/backup?from=&to=&date=  → BackupOptions (§10.3). Real: trains between stations +
availability (limit to 3 trains to save quota). Mock/fallback: 2 hard-coded trains. Buses: static
list of official links (KSRTC, MSRTC, redBus homepage); no booking logic.
Test that killing the RapidAPI key (put a wrong one) still returns cached data with
data_source:"cached"  — this is TC4.
Done for Day 2 when: typing a real PNR in live mode returns normalised data; triggering a
change in mock mode delivers an SSE event, a push on Android Chrome, and a WhatsApp message
to a joined sandbox phone.
Day 3 — Harden and demo-proof
Keep-alive: note in the README to hit /api/health  2 minutes before demo. (Optional: a free
uptime pinger every 10 min.)
Privacy job: a daily cleanup that deletes journeys  and subscriptions older than 24 h after
the journey date.
Rate-limit POST  endpoints (e.g. express-rate-limit , 60/min per IP). Log errors without logging
PNRs or phone numbers in full.
Rehearse the demo triggers 5 times in a row. Make sure the second trigger on the same PNR
still works (reset endpoint: POST /api/demo/reset { pnr } ).
Write backend/README.md : how to run, env variables, endpoint list, mock PNRs.
Help Haripriya with the architecture diagram and the "data sources and limits" paragraph of
the docs.
Endpoints you deliver (checklist)
Method
Path
Returns
GET
/api/health
{ok:true}
GET
/api/journey/:pnr
JourneyState
GET
/api/journey/:pnr/stream
SSE of ChangeEvent
GET
/api/backup?from&to&date
BackupOptions
POST
/api/notify/subscribe
{ok:true}
POST
/api/demo/trigger
{ok:true}  + emits event (mock only)
POST
/api/demo/reset
{ok:true}  (mock only)
Disha — Team 3 · page 18 of 29

---

.env.example
TRAIN_DATA_MODE=mock          # mock | live
RAPIDAPI_KEY=
RAPIDAPI_HOST=
FIREBASE_SERVICE_ACCOUNT=     # JSON string or path
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
ALLOWED_ORIGIN=https://<your-vercel-app>.vercel.app
Rules for you
Never rename or remove a contract field without telling both teammates. Adding
optional fields is fine.
Every field the provider doesn't give → null . Never invent data (no fake chance %, no walking
time, no coach position).
Mock mode must keep working all the way to the end — it is our safety net for the demo.
Done checklist
All 7 endpoints work on Render
5 mock PNRs behave as in §10.5
One real PNR works in live mode
Change event reaches SSE + push + WhatsApp
Wrong API key → cached data, no crash
Cleanup job + README done
Disha — Team 3 · page 19 of 29
