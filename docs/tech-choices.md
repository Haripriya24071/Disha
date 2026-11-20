# Technology Choices & Architecture Decisions

This document outlines the architectural stack and third-party services selected for **Disha**, explaining why each technology was chosen and how it serves our target audience (especially elderly travellers, regional-language users, and first-time passengers).

---

## 1. Stack Overview

| Layer | Tool / Library | Justification & Why Chosen |
|---|---|---|
| **Frontend** | React + Vite + Tailwind CSS | Fast initial load, tiny footprint, rapid component composition, modern mobile-first utility styling. |
| **PWA Layer** | Service Worker + Web App Manifest | Allows offline caching of last-known journey status, installable without Play Store hurdles, provides Web Push capabilities on Android and iOS (iOS 16.4+ standalone). |
| **Fonts** | Google Noto Sans (Script-specific) | Native font scripts loaded dynamically per language (`kn`, `hi`, `ta`, `te`, `ml`, `bn`, `mr`), ensuring crisp rendering of complex conjunct consonants without bloated bundled fonts. |
| **i18n System** | Static JSON dictionaries + lightweight custom `useT()` hook | Zero external framework weight, instantaneous language switching, works 100% offline, ensures human review parity across all keys. |
| **Backend API** | Node.js + Express | Lightweight, universal language across team, non-blocking asynchronous I/O ideal for polling and SSE dispatch. |
| **Realtime Updates** | Server-Sent Events (SSE) | Unidirectional event stream requiring zero WebSocket handshake overhead; easily recovers upon connection drops and works smoothly across mobile browsers. |
| **Authentication** | Firebase Phone Auth (with Guest mode fallback) | Frictionless OTP login to store preferences, paired with a permanent "Continue without login" option so no passenger is ever blocked at a railway counter. |
| **Alerts & Messaging** | Twilio WhatsApp Sandbox + Web Push (FCM) | Delivers critical change alerts across multiple channels without requiring the user to keep the app active in the foreground. |
| **Speech Synthesizer** | Web Speech API (`window.speechSynthesis`) | Built natively into mobile browsers (Chrome on Android, Safari on iOS); zero latency, zero cloud API fees, native pronunciation for Indic accents. |

---

## 2. API Integrations & Fallbacks

| API / Service | Purpose | Connection Method | Limits & Mitigations | Fallback Strategy |
|---|---|---|---|---|
| **RapidAPI IRCTC Provider** | Live PNR status, platform changes, train delay | Server-side REST with 8s timeout | Free tier limit (~100 calls/day). Mitigated with 60s in-memory caching and polling only active PNRs. | Graceful fallback to cached state with `data_source: "cached"` flag or mock server. |
| **Web Speech API** | Read aloud status & terms in chosen language | Browser native client API | Voice availability depends on phone OS and downloaded language packs. | If language voice is missing, UI displays non-intrusive `ui.voice_unavailable` warning rather than speaking English incorrectly. |
| **Twilio WhatsApp** | Critical platform/delay alerts directly on WhatsApp | Server REST API to WhatsApp Sandbox | Sandbox requires user to join once via code. | In-app visual flash banner (S4) + Web Push notifications. |
| **Firebase Cloud Messaging** | Web push alerts when browser tab is closed | Service Worker push event listener | Free tier quota is generous. iOS requires "Add to Home Screen". | In-app SSE stream and WhatsApp alert. |
| **wa.me Deep Link** | 1-tap Family Share | Standard URI schema (`https://wa.me/?text=...`) | Requires WhatsApp installed on phone. | Clipboard "Copy" button fallback. |
| **Helpline 139** | Urgent human assistance | `tel:139` HTML anchor | Available on all telecom operators across India. | Primary fallback link present on all error and backup states. |

---

## 3. Why Not a Heavy Framework?

- **Zero Bloat**: A 65-year-old on a 3G network at an Indian railway station cannot wait for a 5MB bundle to download. By using lightweight custom hooks and script-isolated fonts, first-paint load remains under 150KB.
- **Deterministic Reliability**: We never invent seat confirmation probabilities, coach layouts, or fake walking distances. If the railway API does not provide a fact, we state it plainly or omit it.
