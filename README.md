# Disha (दिशा / ದಿಶಾ / திஷா)

> **Railway information every Indian passenger can actually understand.**  
> Built for the B.Tech CSE Design Thinking Project · Team 3 · Jain Deemed-to-be University · 2026  
> **Team 3**: Rithika Vijay · A B Sree Vaibhavi · R Hari Priya

---

## 1. Problem Statement

Indian railway passengers — particularly first-time travelers, elderly citizens, and regional-language speakers — are routinely handed raw database codes (e.g., `GNWL 8`, `RAC 3`, `Chart Not Prepared`) without any plain-language explanation or clear next action. Our station fieldwork at KSR Bengaluru (Majestic) and 34-passenger survey revealed:
- **76%** checked their PNR 5 or more times during a single journey.
- **56%** prefer Kannada, Hindi, or Tamil over English.
- **15 out of 34** ask family or enquiry counters because they cannot decipher their ticket status.
- Sudden platform changes create last-minute panic across footbridges.

---

## 2. Solution: Disha

Disha takes a 10-digit PNR and answers three essential questions in plain words in the passenger's mother tongue:
1. **What is my situation?** *(e.g., "You are number 8 in the waiting line. Your ticket is not confirmed yet.")*
2. **What is going to happen next?** *(e.g., "The final chart is prepared around 6:30 PM.")*
3. **What should I do right now?** *(Option to explore backup trains and buses without high-pressure countdowns).*

When something changes (such as a platform switch or delay), Disha **immediately notifies the passenger** with a full-screen high-contrast visual alert, phone vibration, audio speech, and a WhatsApp message.

---

## 3. Product Features & The 4 Screens

- **S1: Welcome / Login**: Instant 8-language switcher, frictionless phone OTP login, and permanent "Continue without login" guest mode.
- **S2: My Journey (Main Screen)**: Plain-language status with 14 tappable railway glossary terms, audio listen button, family WhatsApp sharing, and railway helpline 139 dialer.
- **S3: Backup Plan**: Curated alternative trains with live seat availability badges (✔ Available / ⏳ Waiting), direct verified bus links (KSRTC, TNSTC, redBus), and a pressure-free *"I will wait for the final list"* button.
- **S4: Change Alert**: Full-screen modal alert with safe flashing ($\le 2$ flashes/sec), phone vibration pattern `[300, 150, 300, 150, 600]`, extra-large platform number (96px), and a $\ge 64\text{px}$ "Got it" button.

---

## 4. Languages Supported (8 Regional Dictionaries)

Full parity across 8 regional static JSON dictionaries with 84 identical keys:
1. **English (`en`)** — Master dictionary (Reviewed)
2. **ಕನ್ನಡ (Kannada, `kn`)** — Native speaker reviewed
3. **हिन्दी (Hindi, `hi`)** — Native speaker reviewed
4. **தமிழ் (Tamil, `ta`)** — Native speaker reviewed
5. **తెలుగు (Telugu, `te`)** — Regional draft
6. **മലയാളം (Malayalam, `ml`)** — Regional draft
7. **বাংলা (Bengali, `bn`)** — Regional draft
8. **मराठी (Marathi, `mr`)** — Regional draft

---

## 5. Team 3 Work Distribution

- **Rithika Vijay**: Backend API, train data adapter & mock server, change detector, SSE stream, Twilio WhatsApp & FCM alerts, deployment.
- **A B Sree Vaibhavi**: App shell (Vite, Tailwind, PWA), language switcher & `useT()` hook, S1 Login, S2 My Journey, accessibility settings, and shared components.
- **R Hari Priya**: S3 Backup Plan screen, S4 Change Alert screen, Family Share sheet, Alerts subscription sheet, 8 regional translation dictionaries, accessibility & user testing, documentation, architecture diagrams, deck, and demo video script.

---

## 6. Project Documentation Index

- [`docs/tech-choices.md`](./docs/tech-choices.md) — Technical stack justification and API connection matrix.
- [`docs/assumptions-and-limits.md`](./docs/assumptions-and-limits.md) — Unofficial API limits, caching rules, and Web Speech availability.
- [`docs/privacy-and-ethics.md`](./docs/privacy-and-ethics.md) — DPDP Act 2023 compliance, PNR masking, and ethical guidelines.
- [`docs/translation-review.md`](./docs/translation-review.md) — Native speaker review logs and conversational simplifications.
- [`docs/user-testing.md`](./docs/user-testing.md) — Real observational testing protocol across 5 formal scenarios.
- [`docs/voice-support.md`](./docs/voice-support.md) — Web Speech API cross-platform compatibility audit.
- [`docs/presentation-deck-outline.md`](./docs/presentation-deck-outline.md) — 15-slide Design Thinking submission outline.
- [`docs/demo-video-script.md`](./docs/demo-video-script.md) — 2–3 minute video recording script.
- [`architecture-diagram/`](./architecture-diagram/) — Clean SVG vector diagram and system flow breakdown.

