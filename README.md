# Disha (दिशा · ದಿಶಾ) — Indian Railways Companion

> **Railway information every Indian passenger can actually understand.**  
> *Design Thinking · B.Tech CSE · Team 3 · 2026*  
> **Team:** Rithika Vijay · A B Sree Vaibhavi · R Hari Priya

---

## 1. Problem Statement

Indian Railway passengers — especially first-time travellers, elderly passengers, and regional-language users — frequently encounter cryptic railway codes (`WL 8`, `GNWL`, `RLWL`, `RAC`, `Chart Prepared`) without clear actionable guidance. 

Survey and station visit insights:
- **76%** of passengers check their PNR 5+ times during a single journey.
- **56%** prefer regional languages (Kannada, Hindi, Tamil, Telugu, etc.) over English.
- **15 out of 34** passengers ask family members or coolies before checking official portals.
- Only **4 out of 34** passengers ever call the 139 helpline.

**Disha** transforms raw railway data into three simple questions in the passenger's own language:
1. **What is my situation?** (Plain language explanation without technical jargon)
2. **What is going to happen?** (Exact decide-by charting times and upgrade expectations)
3. **What should I do now?** (Automatic backup train and bus alternatives)

---

## 2. System Architecture

```
+------------------------------------+          HTTPS / SSE          +------------------------------------+
|            React PWA               | <---------------------------> |           Express API              |
|   (Vite + Tailwind CSS + PWA)      |                               |        (Node.js Backend)           |
|                                    |                               |                                    |
| - S1 Welcome / Login (OTP / Guest) |                               | - Routes: journey, backup, notify  |
| - S2 My Journey (Classic UI)       |                               | - Normalizer & JourneyState        |
| - S3 Backup Plan (Trains & buses)  |                               | - Charting rules & decide-by time  |
| - S4 Full-screen Change Alert      |                               | - Background Poller & Differ       |
| - 8 Regional static dictionaries   |                               | - Multi-channel notifier           |
| - Web Speech synthesis (TTS)       |                               +-----------------+------------------+
+-----------------+------------------+                                                 |
                  |                                             +----------------------+----------------------+
                  | Web Push (FCM)                              |                      |                      |
                  v                                             v                      v                      v
        +-------------------+                         +-------------------+  +-------------------+  +-------------------+
        |   Firebase FCM    |                         |  RapidAPI / NTES  |  |   Twilio Sandbox  |  |  Official Portals |
        |   & Phone Auth    |                         | (Mock Provider)   |  |   (WhatsApp Alert)|  | (IRCTC/KSRTC/139) |
        +-------------------+                         +-------------------+  +-------------------+  +-------------------+
```

### Component Layer Responsibilities

1. **Frontend Presentation (React PWA)**:
   - Evaluates `JourneyState` codes and maps them to human-checked sentences across 8 regional languages.
   - Accessible classic design: touch targets $\ge 56$px, body text $\ge 18$px, bold high-contrast badges.
   - Native audio voice narration (TTS) via Web Speech API.
   - Safe visual cues (emergency flashing $\le 2$ flashes/sec, vibration alerts).
2. **Backend Engine (Node / Express)**:
   - Sanitizes and validates 10-digit numeric PNRs.
   - Enforces 60-second in-memory caching to stay within API rate limits.
   - Live background poller (`poller.js`) and state comparator (`differ.js`).
   - Fans out real-time `ChangeEvent` payloads via Server-Sent Events (SSE), FCM Push, and Twilio WhatsApp.
3. **External Services**:
   - RapidAPI IRCTC wrapper (with realistic fallback and test suites).
   - Twilio WhatsApp integration for instant notifications.
   - Firebase Auth & Cloud Messaging.

---

## 3. Screen-by-Screen Features

### S1: Welcome / Login
- Native language dropdown in header (all 8 Indian languages).
- Phone OTP login (remembers language and tracked journeys) + **"Continue without login"** guest mode.
- Strict passenger privacy guarantee: only language and active PNR are tracked; all data wiped 24h post-journey.

### S2: My Journey (Main Screen)
- **Classic Railway UI**: High-contrast Indian Railways Navy Blue & Gold aesthetic with electronic platform board cues.
- **Plain-Language Status Headline**:
  - `CNF` ➔ *"Your ticket is confirmed. Coach B2, berth 32 (Lower Berth)."*
  - `RAC` ➔ *"You have a seat to sit, but may share a berth with one other person."*
  - `WL` ➔ *"You are number 8 in the waiting line. Your ticket is not confirmed yet."*
  - `Cancelled` ➔ *"Your train is cancelled. See other ways to travel."*
- **Tappable Terms**: Underlined terms (`[[wl:waiting line]]`, `[[chart:final list]]`) open instant plain-language glossary cards with audio pronunciation.
- **Listen Button**: Native text-to-speech audio announcement using the Web Speech API.
- **Decide-By Countdown**: Shows when final charts are prepared (4–8 hours before departure) so passengers know when to arrange backups.
- **Quick PNR Switcher**: 1-click test chips for `WL 8`, `RAC`, `CNF`, and `Cancelled`.
- **Live Event Simulator**: 1-click real-time event triggers for platform change, delays, cancellations, and confirmations.

### S3: Backup Plan
- Alternative trains on the same route with live availability indicators (`Available`, `Waiting`) and direct booking links to the official IRCTC portal.
- State Road Transport buses (`KSRTC`, `MSRTC`, `redBus`) with timetable links.
- *"I will wait for the final list"* no-pressure button returning to S2.
- Direct dialler for the official **Railway Helpline 139**.

### S4: Change Alert (Full-Screen Emergency Notification)
- Appears automatically via Server-Sent Events (SSE) upon any critical change:
  - **Platform Changed**: Bold old-to-new transition display (`Plat 3 ➔ Plat 6`).
  - **Train Delayed**: Bold delay badge with revised departure time.
  - **Train Cancelled**: Immediate cancellation notice + 1-tap navigation to S3 Backup.
  - **Ticket Confirmed**: Celebratory confirmed status with coach and berth details.
- Photo-safe flashing strictly $\le 2$ flashes/sec (disabled automatically when `prefers-reduced-motion` is active).
- Device vibration alert pattern `[300, 150, 300, 150, 600]`.
- Voice announcement and accessible dismiss button ($\ge 64$px).

---

## 4. Interactive Bottom Sheets

| Sheet | Purpose | Key Features |
|---|---|---|
| **Glossary** | Explains 14 railway terms | Search bar, 14 terms (`pnr`, `wl`, `gnwl`, `rlwl`, `pqwl`, `rac`, `cnf`, `chart`, `berth`, `coach`, `class`, `tatkal`, `platform`, `decideby`) with audio playback. |
| **Family Share** | Share status with family | Formats clean WhatsApp message, masks PNR (`******7890`) for passenger privacy, 1-tap `wa.me` sender + Copy button. |
| **Alerts** | Multi-channel notifications | Browser push notification toggle and WhatsApp number registration. |
| **Accessibility & Settings** | Custom accessibility preferences | Large text toggle (18px ➔ 22px), high contrast monochrome mode, vibration toggle, and custom RapidAPI Key configuration. |

---

## 5. Supported Languages (8 Indian Languages)

All 8 languages feature 100% key parity across 84 localized keys:

| Language | Script Name | Status |
|---|---|---|
| English | English | Native Verified (`REVIEWED`) |
| Kannada | ಕನ್ನಡ | Native Verified (`REVIEWED`) |
| Hindi | हिन्दी | Native Verified (`REVIEWED`) |
| Tamil | தமிழ் | Native Verified (`REVIEWED`) |
| Telugu | తెలుగు | Synthesized (`DRAFT`) |
| Malayalam | മലയാളം | Synthesized (`DRAFT`) |
| Bengali | বাংলা | Synthesized (`DRAFT`) |
| Marathi | मराठी | Synthesized (`DRAFT`) |

---

## 6. Real Live IRCTC API & Mock Integration

### Test PNR Reference

| PNR | Status / Scenario | Notes |
|---|---|---|
| `1111111111` | Waiting List (`WL 8`), Platform 3 | Ideal for testing platform change demo event |
| `2222222222` | Sitting Seat (`RAC 14`), Platform 1 | Demonstrates RAC explanation |
| `3333333333` | Confirmed (`CNF`), Coach B2, Berth 32 | Demonstrates confirmed seat allocation |
| `4444444444` | Cancelled Train | Demonstrates emergency cancellation & S3 backup |
| `5555555555` | Non-Existent PNR | Simulates 404 bad PNR error |
| *Any 10-Digit PNR* | Live Query or Realistic Simulation | Resolves live via RapidAPI or realistic deterministic generator |

### Live RapidAPI Configuration

Set your keys in `.env` (or input directly via the in-app Settings sheet):

```env
TRAIN_DATA_MODE=live
PORT=3000
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=irctc-indian-railway-pnr-status.p.rapidapi.com
ALLOWED_ORIGIN=*

# Optional WhatsApp alerts via Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

---

## 7. Running the Application

### 1. Unified Single-Server Mode (Recommended)
Builds the frontend and serves both backend API and frontend on port 3000:

```bash
# 1. Install dependencies
npm install
cd mobile-app && npm install && cd ..

# 2. Build frontend
cd mobile-app && npm run build && cd ..

# 3. Start unified server
node index.js
```
Open **`http://localhost:3000/`** in your browser.

### 2. Development Mode (Vite Hot-Reload)
Run the backend and Vite dev server simultaneously:

- Terminal 1 (Backend): `node index.js` (Port 3000)
- Terminal 2 (Frontend): `cd mobile-app && npm run dev` (Port 5173 with automatic `/api` proxy)

---

## 8. Verification & Test Suite

The project includes three comprehensive automated test suites:

```bash
# 1. Run Haripriya's deliverables & i18n key parity tests (8 languages x 84 keys)
node --test mobile-app/tests/haripriya.test.js

# 2. Run RapidAPI normalizer & IST timestamp conversion tests
node run.js

# 3. Run Differ engine unit tests (6 change detection cases)
node --test test/differ.test.js

# 4. Run Server API integration & SSE live endpoint verification
node test/server.test.js
```

All tests pass with 100% assertions.
