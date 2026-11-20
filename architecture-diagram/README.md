# Disha Architecture Diagram & System Workflow

This folder contains the architectural diagram and visual layout representing the three-tier system topology of **Disha**.

---

## 1. Visual Diagram

The vector source diagram is rendered in [`disha-architecture.svg`](./disha-architecture.svg).

```
+------------------------------------+          HTTPS / SSE          +------------------------------------+
|            React PWA               | <---------------------------> |           Express API              |
|        (Deployed on Vercel)        |                               |        (Hosted on Render)          |
|                                    |                               |                                    |
| - S1 Welcome / Login               |                               | - Routes: journey, backup, notify  |
| - S2 My Journey (Plain status)     |                               | - Normalizer & JourneyState        |
| - S3 Backup Plan (Trains & buses)  |                               | - Charting rules (4h estimate)     |
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

---

## 2. Component Layer Responsibilities

1. **Frontend Presentation (React PWA)**:
   - Evaluates JourneyState codes and maps them to human-checked sentences across 8 regional languages.
   - Provides safe visual cues (flashing $\le 2$ flashes/sec, bold high-contrast borders, minimum 56px touch buttons).
   - Audio narration of plain status text using the Web Speech API.
2. **Backend Engine (Node / Express)**:
   - Sanitizes and validates 10-digit numeric PNRs.
   - Enforces a 60-second in-memory cache to stay strictly within API rate limits.
   - Polls active journeys every 30 seconds, runs `differ.js`, and fans out `ChangeEvent` payloads via Server-Sent Events (SSE), FCM Push, and WhatsApp.
3. **External Services**:
   - RapidAPI IRCTC wrapper (with mock fallback).
   - Twilio WhatsApp messaging for instant passenger notifications.
   - Firebase Auth & Cloud Messaging.

