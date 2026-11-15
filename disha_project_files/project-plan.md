# Disha — Project Plan

Disha
Project Plan & Team Work Plans — 3-Day Build
Railway information every Indian passenger can actually understand.
Design Thinking · B.Tech CSE · Team 3 · Jain Deemed-to-be University · 2026
Team: Rithika Vijay · A B Sree Vaibhavi · R Hari Priya
Contents
Part 1 — Project Plan (problem, screens, features, flow, contract, APIs, architecture,
timeline)
Part 2 — Rithika: Backend, data & alerts
Part 3 — Vaibhavi: App shell, language system & main screen
Part 4 — Haripriya: Alerts & backup screens, languages, testing & submission
Disha — Team 3 · page 1 of 29

---

Part 1 — Disha — Project Plan (Design
Thinking, 3-Day Build)
Working name: Disha (rename later with one find-and-replace). Team 3 — Rithika,
Vaibhavi, Haripriya.
1. Problem, one paragraph
Railway passengers — especially first-time travellers, elderly people and regional-language users —
get raw data (WL 8, GNWL, "Platform changed") but no understanding and no next step, so they ask
a family member, a coolie or the enquiry counter. From our 5 interviews, 34-person survey and the
KSR Bengaluru station visit: 76% checked PNR 5+ times in one journey, 56% prefer
Kannada/Hindi/Tamil over English, 15/34 ask family first, only 4/34 ever called 139. Disha
takes a PNR and answers three things in the user's own language, in plain words: What is my
situation? What is going to happen? What should I do now? — and tells them the moment
something changes.
Deliverables: working web app (installable PWA), architecture diagram, ≤15-slide DT deck (format
in v2 plan §11), 2–3 min demo video, short documentation (tech choices, assumptions,
ethics/privacy).
2. What we cut from the v2 plan (and why)
The v2 plan had 23 features and 15 screens. For a 3-day, 3-person build we keep the idea and cut
the surface area.
v2 plan
This plan
Why
15 screens
4 screens + pop-up
sheets
Each feature becomes a button that opens a
sheet on the same screen. Simpler for a 65-year-
old too.
Chance indicator (Good / Low)
Removed
No API gives it. We would be inventing a number.
We only show a decide-by time.
"Walk via foot bridge — 6 min",
"Coach S4 stops near the front"
Removed
No reliable data source. Wrong precision at a
station is worse than none.
Push alerts + WhatsApp bot in
Phase 2
Alerts are Phase 1
"Tell them immediately" is the core promise. Done
with 3 channels (see §8).
8 languages via live translation
API
8 languages via a
static dictionary
Instant switch, works offline, and every core
sentence can be human-checked.
erail.in / NTES scraping
One main provider
+ mock mode
Unofficial APIs break. Mock mode means the demo
never fails.
Premium plan, B2B, journey
history, AI chat
Out of scope
Business slide only.
Disha — Team 3 · page 2 of 29

---

3. The product on one page — 4 screens
S1 WELCOME / LOGIN  ──►  S2 MY JOURNEY (main)  ──►  S3 BACKUP PLAN
                                  ▲                        │
                                  │                        ▼
                         S4 CHANGE ALERT  ◄── (appears automatically on any change)
Everything else is a button that opens a sheet (a panel sliding up from the bottom) on S2: Listen
· Glossary · Family Share · Get Alerts on WhatsApp · Accessibility · Call 139.
Rules every screen follows (the "65-year-old test")
1. One main thing per screen. One big primary button.
2. Language dropdown is always in the header, top-right, on every screen, shown in native
script (ಕನ್ನಡ, हिन्दी, தமிழ் …).
3. Body text ≥ 18 px, headings ≥ 26 px, buttons ≥ 56 px tall. "Large text" toggle goes to
22 px / 32 px.
4. Every button has an icon AND a word. Never an icon alone.
5. No railway code is shown without its meaning. Terms are underlined; tap one → one-line
explanation sheet in the chosen language, with a Listen button.
6. Never colour alone. Status always has an icon + word (✔ Confirmed, ⏳ Waiting, ⚠
Changed).
7. Always show "Last updated 2 min ago" and "Always confirm with the official IRCTC app
or 139."
8. No ads, no popups, no promotional banners.
9. Contrast ≥ 4.5:1 for all text (check every colour pair — see Haripriya's checklist).
4. Screen-by-screen design
S1 — Welcome / Login
┌──────────────────────────────────┐
│ Disha          [🌐 ಕನ್ನಡ ▾] │  ← language dropdown (all 8 languages)
│                                  │
│   Know your train status         │
│   in your own language.          │
│                                  │
│   Phone number                   │
│   [ +91 ____________________ ]   │
│   [   📩  Send code           ]  │  ← big primary button
│   [ 🔢 ______ ]  [ ✔ Log in ]    │  ← appears after code is sent
│                                  │
│   ─────────  or  ─────────       │
│   [   Continue without login  ]  │  ← secondary, always available
└──────────────────────────────────┘
Login = Firebase phone OTP. Purpose: remember language + tracked journeys, and later alert
the user. "Continue without login" always works (guest) so nobody is blocked.
Language dropdown here changes the entire screen instantly.
S2 — My Journey (the main screen)
State A — no journey yet:
Disha — Team 3 · page 3 of 29

---

┌──────────────────────────────────┐
│ Disha          [🌐 हिन्दी ▾]│
│  Enter your PNR number           │
│  [ ______________ ]  (10 digits) │
│  [ 🔍  Check my ticket        ]  │
│  (?) What is a PNR?   ← tappable │
└──────────────────────────────────┘
State B — journey loaded:
┌──────────────────────────────────┐
│ Disha          [🌐 हिन्दी ▾]│
│ ⏳ NOT CONFIRMED YET             │  ← status headline (icon + words)
│ You are number 8 in the waiting  │
│ line (WL 8). Your ticket is not  │  ← "waiting line (WL 8)": WL is tappable
│ confirmed yet.                   │
│                                  │
│ ⏰ Decide by 6:30 PM today        │  ← when the final list (chart) is made
│ 🚆 Train 12345 · 10:15 PM · Plat 3│
│ Updated 2 min ago · Check with 139│
│                                  │
│ [ 🔊 Listen ]  [ 🔁 Refresh ]    │
│ [ 🧭 I need a backup plan  ]     │  → S3
│ ──────── more ────────           │
│ [📖 Meaning of words] [👪 Share] │  → sheets
│ [💬 Alerts on WhatsApp][♿ Settings]│
│ [ 📞 Call railway helpline 139 ] │
└──────────────────────────────────┘
Status headline + 2–3 sentences max. Details (train name, platform, coach/berth) sit under it.
Show technical link (small, below the text) reveals the raw string, e.g. GNWL 8/WL 5  — hidden
by default.
Status text by type: WL, RAC, CNF (see §6.3 for exact sentences).
S3 — Backup Plan
┌──────────────────────────────────┐
│ ←  Backup plan      [🌐 ಕನ್ನಡ ▾] │
│ Your ticket may not confirm.     │
│ Here are other ways to go:       │
│ 🚆 OTHER TRAINS                  │
│  [12627 Karnataka Exp · 9:20 PM  │
│   Seats: Available  [Book ↗]]    │
│ 🚌 BUSES                         │
│  [KSRTC · Bengaluru → Chennai    │
│   Check times  [Open ↗]]         │
│ [ ⏳ I will wait for the final   │
│   list ]  ← no pressure option   │
└──────────────────────────────────┘
Only shown by the button — never forced.
"Book ↗" opens the official IRCTC / bus site in a new tab. We do not handle bookings or
payments.
If no data: show the two bus/IRCTC links and "Call 139".
Disha — Team 3 · page 4 of 29

---

S4 — Change Alert (full-screen, appears automatically)
┌──────────────────────────────────┐   background: strong colour + flashing
│        ⚠  PLATFORM CHANGED       │   phone vibrates (where supported)
│                                  │
│      ~~ 3 ~~   →   [  6  ]       │  ← old struck through, new huge
│                                  │
│  Your train will now come to     │
│  Platform 6.                     │
│                                  │
│ [ 🔊 Listen ]   [ ✔ Got it ]     │
└──────────────────────────────────┘
Triggers: platform change, delay (new time), cancellation, ticket now confirmed.
Delay version: "Your train is 45 minutes late. New departure 8:45 PM." Cancel version: "Your
train is cancelled." + button See other ways to travel → S3.
Works with no sound: flashing banner + vibration + large text. Listen is optional.
"Got it" returns to S2 with the updated status.
5. Features → buttons (everything the product does)
#
Feature
Where the
button is
What happens on tap
Needs
F1
Language
dropdown
Header of
every screen
List of 8 languages in native script. Tap one →
whole screen re-renders in that language
instantly. Saved in localStorage  (+ Firestore if
logged in). Browser language pre-selected on first
visit.
i18n dictionary
F2
Login / guest
S1
Phone OTP, or "Continue without login"
Firebase Auth
F3
Plain-language
status
S2 (automatic)
Status headline + short sentences + decide-by
time
Train data API +
templates
F4
Tappable terms
Any
underlined
word in text
Small sheet: one-line meaning + Listen
Glossary
dictionary
F5
Listen
S2, S3, S4,
every term
sheet
Reads the visible text aloud in the chosen
language
Web Speech API
(Bhashini TTS
optional)
F6
Meaning of
words
(Glossary)
S2
Sheet with search box + list of common terms;
tap a term → meaning
Glossary
dictionary
F7
Family share
S2
Sheet shows a preview card of the status; "Send
on WhatsApp" opens WhatsApp with the
message pre-filled; "Copy" as backup
wa.me  link
F8
Alerts on
WhatsApp /
phone
S2
Sheet: toggle "Tell me on this phone" (browser
push) and field "Also WhatsApp me" (number)
FCM + Twilio
WhatsApp
F9
Backup plan
S2 → S3
Other trains, buses, "I will wait"
Train search API
+ bus links
F10
Change alert
S4 (auto)
Full-screen alert + vibration
Change
detector
(backend)
Disha — Team 3 · page 5 of 29

---

#
Feature
Where the
button is
What happens on tap
Needs
F11
Accessibility
settings
S2
Sheet: Large text, High contrast, Vibration alerts
(3 switches)
CSS classes
F12
Call 139
S2 (also S3
error state)
tel:139  dials the railway helpline
none
F13
Trust note +
last updated
Bottom of
S2/S3
Always visible text
none
F14
Refresh
S2
Re-fetches status now
API
6. Content rules (what the text actually says)
6.1 The status data the app understands (codes, not sentences)
The backend never sends sentences. It sends codes + numbers. The frontend turns codes into
sentences using the language dictionary. That is why the language switch is instant, works on a bad
connection, and every sentence can be checked by a native speaker.
6.2 Terms that are tappable (glossary — 14 to start)
PNR · WL  (waiting list) · GNWL  · RLWL  · PQWL  · RAC · CNF · chart  (final list) · berth  · coach  · class  (SL /
3A / 2A / 1A) · Tatkal · platform  · Decide-by time  English one-liners are in Haripriya's file; she
translates them.
6.3 Core sentences (English master — all 8 languages must match in
meaning)
Code
English
status.wl
You are number {pos} in the waiting line. Your ticket is not confirmed yet.
status.rac
You have a seat to sit, but you may have to share a berth with one other person. It
can get better if others cancel.
status.cnf
Your ticket is confirmed. Coach {coach}, berth {berth}.
status.decide
The final list (chart) is made around {time}. If you want a backup, look before then.
status.decide_est
The final list (chart) is usually made 4–8 hours before the train leaves. Check IRCTC for
the exact time.
alert.platform
Platform changed. Your train will now come to Platform {to}.
alert.delay
Your train is {min} minutes late. New departure: {time}.
alert.cancelled
Your train is cancelled. See other ways to travel. For e-tickets, IRCTC usually refunds
automatically — check with IRCTC or 139.
alert.confirmed
Good news. Your ticket is now confirmed. Coach {coach}, berth {berth}.
trust.note
Always confirm with the official IRCTC app or 139. Last updated {ago}.
error.nodata
We could not get live information right now. Showing the last saved status.
Hard rules: never write "will confirm" or "will not confirm". Never show a percentage. If chart time
is not in the API, use status.decide_est  and label it as an estimate. Do not invent walking times or
coach positions.
Disha — Team 3 · page 6 of 29

---

Fact-check before the demo: chart timing rules for different trains. Do not hardcode "4
hours". Use the API field if present, otherwise the estimate sentence.
7. User flow
 Open site
    │
    ▼
 S1 Welcome ── pick language (dropdown) ── login with phone OTP  /  Continue as guest
    │
    ▼
 S2 My Journey — enter PNR
    │
    ├── status loads in plain language  (+ Listen / tap any underlined word)
    │        │
    │        ├─ [Meaning of words] ─► Glossary sheet
    │        ├─ [Share with family] ─► Preview sheet ─► WhatsApp opens
    │        ├─ [Alerts] ─► toggle phone alerts / add WhatsApp number
    │        ├─ [Settings] ─► Large text · High contrast · Vibration
    │        ├─ [Call 139] ─► phone dialler
    │        └─ [I need a backup plan] ─► S3 Backup Plan ─► [Book ↗] opens IRCTC/bus site
    │                                                   └► [I will wait] ─► back to S2
    │
    └── (app open OR notification tapped) something changes
             ▼
         S4 CHANGE ALERT (full screen + vibrate) ──► [Got it] ─► S2 updated
                                              └─(cancelled)─► [Other ways] ─► S3
 If the API fails at any point: S2 shows last saved status + "Try again" + "Call 139".
8. "Told immediately" — how alerts reach the user
Situation
Channel
How
App/tab is open
Server-Sent Events (SSE)
stream from backend
S4 appears within seconds
App closed, phone
has browser
Web Push (Firebase Cloud
Messaging)
Notification → tap opens S4. iPhone only works if the site
is "Add to Home Screen"-installed — tell users that.
Any phone with
WhatsApp
WhatsApp message via
Twilio sandbox
Demo-ready; production needs WhatsApp Business
approved templates
All three are triggered by the same change event from the backend, so the logic is written once.
Disha — Team 3 · page 7 of 29

---

9. Architecture
┌────────────────────┐      HTTPS / SSE       ┌──────────────────────────────────┐
│  React PWA         │ ◄────────────────────► │  Express API  (Render)           │
│  (Vercel)          │                        │                                  │
│  S1 S2 S3 S4       │                        │  routes ─ journey, backup,       │
│  i18n dictionary   │                        │           notify, demo, health   │
│  Web Speech (TTS)  │                        │  poller ─► differ ─► notifier    │
│  Service worker    │                        │  normalize (API → our contract)  │
└────────┬───────────┘                        └───┬──────────────┬───────────────┘
         │ FCM push                               │              │
         ▼                                        ▼              ▼
   Firebase Cloud Messaging           ┌─────────────────┐  ┌──────────────┐
   Firebase Auth (OTP)                │ Train data      │  │ Firestore    │
   Firestore (users, last status)     │ provider        │  │ (users,      │
         ▲                            │  ├ rapidapi.js  │  │  journeys,   │
         │                            │  └ mock.js      │  │  last state) │
         │                            └─────────────────┘  └──────────────┘
   Twilio WhatsApp ◄──────── notifier ──────────┘
Pattern to copy from CrowdShield: Rithika builds a mock server on Day 1 that returns data in
exactly the shape below. Vaibhavi and Haripriya build every screen against it from hour one. Later
TRAIN_DATA_MODE=live  swaps in the real API — nobody else's code changes.
10. THE SHARED CONTRACT (read this first, all three of you)
10.1 JourneyState — what GET /api/journey/:pnr returns
Allowed values: ticket.type  = "CNF" | "RAC" | "WL"  · train_state  = "scheduled" | "running" | 
"cancelled"  · chart.source  = "api" | "estimate"  · data_source  = "live" | "cached" | "mock". Any
field the API doesn't give = null . The frontend must handle null  for every optional field.
10.2 ChangeEvent — what the SSE stream and push notifications carry
{
  "pnr": "1111111111",
  "train": { "number": "12345", "name": "Sample Express", "class": "3A" },
  "route": { "from": "SBC", "to": "MAS", "from_name": "Bengaluru", "to_name": "Chennai" },
  "departure_iso": "2026-11-20T22:15:00+05:30",
  "ticket": {
    "type": "WL",
    "wl_position": 8,
    "coach": null,
    "berth": null,
    "raw": "GNWL 8/WL 5"
  },
  "platform": { "current": "3", "previous": null },
  "delay_minutes": 0,
  "train_state": "scheduled",
  "chart": { "time_iso": "2026-11-20T18:15:00+05:30", "source": "estimate", "prepared": false },
  "last_updated_iso": "2026-11-15T14:02:11+05:30",
  "data_source": "mock"
}
{
  "pnr": "1111111111",
  "type": "platform_changed",
  "data": { "from": "3", "to": "6" },
  "timestamp_iso": "2026-11-15T14:05:00+05:30",
  "journey": { "...full JourneyState..." }
}
Disha — Team 3 · page 8 of 29

---

type  = "platform_changed" | "delayed" | "cancelled" | "confirmed" | "wl_moved" | 
"chart_prepared". Only the first four open S4. The others just refresh S2 silently.
10.3 BackupOptions — what GET /api/backup?from=SBC&to=MAS&date=2026-11-20 returns
availability  = "Available" | "Waiting" | "Unknown" . Buses are links, not live data (no free bus
API).
10.4 i18n key contract (frontend ⇄ Haripriya)
Dictionary files live in mobile-app/src/i18n/{en,kn,hi,ta,te,ml,bn,mr}.json . Keys are identical in
all 8 files:
ui.*            button labels, headings, placeholders
status.*        wl, rac, cnf, decide, decide_est
alert.*         platform, delay, cancelled, confirmed
trust.*         note
error.*         nodata, badpnr, offline
term.<id>.name  and  term.<id>.meaning     (id = pnr, wl, gnwl, rlwl, pqwl, rac, cnf, chart, berth, coach, 
class, tatkal, platform, decideby)
lang.<code>     native name of the language (kn → "ಕನ್ನಡ")
Placeholders use {curly}  names exactly as in §6.3. Never change a key name without telling
the other two.
10.5 Mock PNRs (so everyone tests the same cases)
PNR
Shows
1111111111
WL 8, platform 3
2222222222
RAC
3333333333
CNF, coach S4 berth 32
4444444444
Train cancelled
5555555555
Invalid PNR → error.badpnr
Demo trigger (mock mode only): POST /api/demo/trigger { "pnr":"1111111111", 
"event":"platform_changed" }  fires a real ChangeEvent so we can demo S4 on command.
{
  "trains": [
    { "number": "12627", "name": "Karnataka Express", "departs": "21:20", "arrives": "05:10", 
"availability": "Available", "book_url": "https://www.irctc.co.in/" }
  ],
  "buses": [
    { "operator": "KSRTC", "note": "Check timings on the official site", "url": 
"https://ksrtc.in/" }
  ],
  "fallback_help": "139"
}
Disha — Team 3 · page 9 of 29

---

11. APIs and exactly how we connect them
#
API / service
Used for
How it connects
Cost /
limit
Fallback
1
RapidAPI — IRCTC
PNR / train status
(pick one provider
on the RapidAPI
site; Rithika
confirms exact
endpoint names on
Day 0)
PNR status, live
running
status/platform,
trains between
stations, seat
availability
Backend only (key never
in the browser).
providers/rapidapi.js
calls it and
normalize.js  converts
to JourneyState .
Header X-RapidAPI-Key
from .env .
Free tier is
small
(~100
calls/day).
Cache
each PNR
for 60 s
and poll
only
tracked
PNRs.
mock.js  (same output
shape). Switch with
TRAIN_DATA_MODE=mock .
2
Firebase Auth
(phone OTP)
Login
Web SDK in the PWA
Free tier
OTP limit.
Use
Firebase
"test
phone
numbers"
for the
demo
Guest mode
3
Firebase
Firestore
Users
(language,
tracked PNRs),
last known
state per PNR
(so "last saved"
works)
Admin SDK in backend,
Web SDK for user prefs
Free tier is
plenty
localStorage  only
4
Firebase Cloud
Messaging (Web
Push)
Alerts when the
app is closed
Service worker registers
a token → POST 
/api/notify/subscribe
→ backend sends push on
ChangeEvent
Free
SSE + WhatsApp
5
Twilio WhatsApp
Sandbox
WhatsApp
alerts
Each test phone sends
join <your-code>  to
the sandbox number
once; backend then
sends messages via
Twilio REST
Free trial
credit
Push + SSE
6
wa.me  link
Family share
Plain URL
https://wa.me/?text=
<URL-encoded message>
— no API, no key
Free
"Copy" button
Disha — Team 3 · page 10 of 29

---

#
API / service
Used for
How it connects
Cost /
limit
Fallback
7
Web Speech API
( speechSynthesis )
Listen button
Built into the browser.
Pick a voice matching the
language ( kn-IN , hi-IN ,
ta-IN , te-IN , ml-IN ,
bn-IN , mr-IN , en-IN ).
Voice availability
depends on the phone
— test each language on
a real Android phone.
Free
Bhashini TTS (optional, if
the key is approved) →
else show "Voice not
available for this
language on your
phone"
8
Bhashini
(optional)
Better regional
TTS; first-draft
translation help
Apply at bhashini.gov.in
— approval may take
days, so do not depend
on it
Free
Web Speech API
9
Bus and IRCTC
links
S3
Static list of official site
URLs; no API
none
—
10
tel:139
Call helpline
Plain link
none
—
Honest note for docs: third-party PNR APIs are unofficial wrappers. We say this in the
documentation, show the last updated time and the confirm with IRCTC / 139 note on every status,
and keep mock mode for the demo.
12. Tech stack
Layer
Tool
Why
Frontend
React + Vite + Tailwind CSS, built as a PWA
(manifest + service worker)
Mobile-first, no install, can "Add to Home
Screen" for push on iPhone
Font
Noto Sans / Noto Sans Kannada / Devanagari / Tamil
/ Telugu / Malayalam / Bengali — load only the
script for the chosen language
Keeps first load small
i18n
Own tiny useT()  hook + JSON dictionaries (no
heavy library)
Instant switching, no network
Backend
Node.js + Express
Simple, everyone knows JS
Realtime
Server-Sent Events (if flaky on Render, fall back to
15-second polling — same event shape)
Simpler than WebSockets
DB / Auth /
Push
Firebase (Auth, Firestore, FCM)
No server to run
WhatsApp
Twilio Sandbox
Free, demo-ready
Hosting
Vercel (frontend) + Render (backend, free tier)
Auto-deploy from GitHub. Render free
sleeps — open /api/health  2 min
before every demo.
Design
Figma (optional) — wireframes in §4 are enough to
start coding
Time is short
Performance goal (replaces "every page <100 KB"): first load under ~150 KB gzipped for
JS+CSS, one script font at a time, status page works with the last cached state on a slow network.
Disha — Team 3 · page 11 of 29

---

13. Roles — one-line summary
Person
Owns
Why this split
Rithika
Backend API, train-data adapter + mock server, plain-
language status data, change detector, SSE, push + WhatsApp
alerts, deployment of backend
The hardest and most failure-
prone part (data + realtime).
Needs one owner.
Vaibhavi
App shell, S1 Login, S2 Journey screen, language dropdown +
i18n engine, tappable terms, Listen, glossary + accessibility
sheets
The main screen and the
language system everything
depends on
Haripriya
S3 Backup Plan, S4 Change Alert, Family Share + Alerts
sheets, all 8 translations + glossary content, accessibility
checks, user testing, docs, deck, demo video
Citizen-facing polish + the
submission items that get
forgotten
Detailed tasks per person: Part 2 (Rithika), Part 3 (Vaibhavi), Part 4 (Haripriya).
14. Build order (what gets built in what order, project-wide)
1. Contract frozen + repo + accounts (Day 0 / Day 1 morning)
2. Mock server emitting the contract (Rithika) · en.json  first draft (Haripriya) · app shell +
useT() + language dropdown (Vaibhavi)
3. S2 status for WL / RAC / CNF from mock data — the core of the product
4. Tappable terms + Listen
5. S4 Change Alert driven by /api/demo/trigger
6. Real train-data adapter (RapidAPI) swapped in behind the same contract
7. Alerts: SSE → push → WhatsApp
8. S3 Backup Plan
9. Share + Glossary + Accessibility sheets
10. S1 Login (last — guest mode already works without it)
11. All 8 languages filled and checked, contrast + TalkBack checks, user test
12. Deck, video, docs, rehearsal
15. Timeline — 3 days
Rithika
Vaibhavi
Haripriya
Day 0 (30
min tonight)
Create RapidAPI account, test 1
real PNR. Create Firebase project
+ Twilio account. Share keys
privately.
Create repo + 4 branches,
scaffold Vite + Tailwind,
deploy empty site to Vercel
Start en.json  from §6.3 +
§10.4 key list
Day 1 —
Foundations
Express server + /api/health .
Mock provider + 5 mock
PNRs + JourneyState
endpoint (by midday).
/api/demo/trigger . SSE
endpoint skeleton. Deploy to
Render.
useT()  + language
dropdown (works with en
+ hi  first). App shell,
header, big-button
components. S2 State A
+ B for WL/RAC/CNF
from mock server.
en.json  finished (all keys)
by 11 AM. Machine-
translate first drafts for the
other 7 languages. S3
Backup screen layout (hard-
coded sample data). Share
sheet UI + wa.me link.
Disha — Team 3 · page 12 of 29

---

Rithika
Vaibhavi
Haripriya
Day 2 — Real
data + alerts
RapidAPI provider +
normalize.js . Cache. Poller +
differ.js  → ChangeEvent . SSE
live. FCM push. Twilio WhatsApp.
/api/backup .
Hook S2 to the real
backend. SSE client → open
S4. Tappable <Term>  +
Glossary sheet. Listen
button (voice per
language). Accessibility
sheet (large text, high
contrast, vibration).
S4 Change Alert screen
(platform, delay, cancelled,
confirmed) + vibration.
Alerts sheet (push toggle +
WhatsApp number). Get
native speakers to check
the 11 core sentences in
Kannada, Hindi, Tamil first.
Contrast check.
Day 3 —
Finish +
submit
Fix bugs, verify mock vs live
switch, keep-alive, privacy
cleanup job. Rehearse demo
triggers.
S1 Login (OTP + guest).
Connect S3 to
/api/backup . PWA install
+ offline last-state. Test on
2 real phones.
User test with 3 people (one
elderly). Fix text issues. Final
languages merged. Docs,
deck, demo video.
Submission package.
Merge rule: merge into main  via PR only when your piece works with the mock server. Day 3, 2
PM = feature freeze. After that, only bug fixes.
16. Demo script (2–3 minutes)
1. Open site on a phone. Switch language to Kannada via the dropdown — whole screen
changes. (10 s)
2. Guest → enter PNR 1111111111 . Plain-language WL status appears. Tap WL → meaning
appears. Tap Listen → it reads in Kannada. (40 s)
3. Tap Share with family → WhatsApp opens with the message. (15 s)
4. Tap Alerts on WhatsApp, then trigger platform_changed → full-screen S4 appears, phone
vibrates, WhatsApp message arrives. (40 s)
5. Tap I need a backup plan → S3 with trains and buses. (20 s)
6. Show Accessibility: large text + high contrast. (15 s)
7. Close with the problem stats and the "if a 65-year-old can use it alone, it works" line. (20 s)
17. Privacy and ethics (also goes into the documentation)
We store only: language, phone number (if logged in), tracked PNR, last known status. Delete
a PNR 24 hours after the journey date.
No ads, no tracking scripts, no selling data. Phone number is used only for login and alerts the
user turned on.
PNR is personal data — tell the user what is stored in one plain sentence on S1; comply with
India's DPDP Act, 2023 basics (consent, purpose, deletion).
Say clearly that status comes from a third-party source and may be delayed; never promise
confirmation.
Translations of the core sentences are reviewed by native speakers because a wrong delay or
platform message can send someone to the wrong place.
Disha — Team 3 · page 13 of 29

---

18. Testing — 5 cases (use real names in the deck)
TC
Scenario
Pass if
TC1
Elderly user, Kannada, PNR
1111111111
Can say in their own words what the status means, with no
help
TC2
Tap a term (GNWL)
Meaning appears in the chosen language in 1 tap
TC3
Platform change trigger
S4 appears within ~10 s; user states the new platform
TC4
API down (switch to broken key)
Last saved status + timestamp + "Call 139" shown, no crash
TC5
TalkBack on, S2
Status is read in a sensible order; every button has a label
Ask tasks, not opinions: "Find out what this means and tell me what you would do" — and watch
without helping. Add a 1–5 ease score.
19. Repo structure
Disha/
├── backend/                 (Rithika)
│   ├── src/routes/          journey.js  backup.js  notify.js  demo.js  health.js
│   ├── src/providers/       rapidapi.js  mock.js
│   ├── src/normalize.js  differ.js  poller.js  notifier.js  chartTime.js
│   └── .env.example
├── mobile-app/              (Vaibhavi + Haripriya) — the React PWA
│   ├── src/screens/         S1Login  S2Journey  S3Backup  S4Alert
│   ├── src/components/      Header  LangDropdown  BigButton  Sheet  Term  ListenButton  StatusCard
│   ├── src/sheets/          Glossary  Share  Alerts  Accessibility
│   ├── src/i18n/            en kn hi ta te ml bn mr .json  +  useT.js
│   └── src/hooks/           useJourney  useSSE  useSpeech
├── docs/                    (Haripriya owns, everyone contributes)
├── architecture-diagram/
└── README.md
20. Branches
main , rithika , vaibhavi , haripriya . Work on your branch; merge to main  via PR when a piece is
stable. Pull main  at least every morning and before lunch. File ownership above means you will
almost never edit the same file — if you need a change in someone else's file, ask them.
21. Definition of done
All 4 screens work on a real Android phone
Language dropdown changes the entire screen in all 8 languages
Core sentences in at least Kannada, Hindi, Tamil are native-speaker checked
Every railway term in status text is tappable
Listen works in at least 4 languages on the demo phone (document the rest)
Platform change shows S4 + vibrates + WhatsApp arrives (mock mode is fine)
Live API works for at least one real PNR, with mock fallback
Large text + High contrast work on every screen
Contrast ≥ 4.5:1 checked
Deck, demo video, docs done
Disha — Team 3 · page 14 of 29

---

22. Risks
Risk
Plan
RapidAPI free tier / provider breaks
Cache 60 s, mock mode, demo uses mock
Render cold start during demo
Hit /api/health  2 min before
No Kannada/Malayalam voice on a
phone
Test early; show a friendly "voice not available" message; try Bhashini
iPhone push doesn't fire
Say "install to home screen"; demo on Android
Translations wrong
Native-speaker check on the 11 core sentences first
Running out of time
Cut order: S1 login → Bhashini → Twilio → extra languages. Never cut S2,
S4, language dropdown
Disha — Team 3 · page 15 of 29
