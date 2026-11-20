# Assumptions and Technical Limitations

This document openly records the technical trade-offs, constraints, and operational assumptions made in **Disha**. Being honest about limits is vital for passenger safety.

---

## 1. Third-Party PNR Data Sources

- **Unofficial APIs**: Indian Railways does not offer a free, officially public REST API for individual developers or student teams. All live data feeds utilize third-party RapidAPI wrappers around Indian Railways / NTES portals.
- **Downtime & IP Blocks**: These upstream endpoints occasionally change schemas, experience rate limits, or encounter transient CAPTCHA blocks.
- **Our Safeguards**:
  - We clearly mark the status with `"Last updated X min ago"` and always state: *"Always confirm with the official IRCTC app or railway helpline 139."*
  - An automatic 60-second in-memory cache shields the backend from exceeding quota.
  - A robust **Mock Mode** (`TRAIN_DATA_MODE=mock`) is preserved throughout production for reliable demonstration and offline verification.

---

## 2. Confirmation & Charting Estimates

- **Never a Guarantee**: Disha **never** displays confirmation probability percentages (e.g., "85% chance of confirmation") because such algorithms are speculative and risk misleading passengers.
- **Chart Preparation Time**: The reservation chart is typically finalized 4 hours prior to train departure (or around 8:00 PM the previous evening for early morning trains). Where the upstream API does not provide an exact charting timestamp, Disha displays a cautious estimate:
  > *"The final list (chart) is usually made 4–8 hours before the train leaves. Check IRCTC for the exact time."*

---

## 3. Web Speech API Voice Availability

Voice synthesis relies on the browser's native `speechSynthesis` engine. Voice availability varies by operating system:

| Language | Android (Google TTS) | iOS (Safari) | Windows / Desktop | Disha Handling |
|---|---|---|---|---|
| **English (`en-IN`)** | Supported | Supported | Supported | Speaks cleanly |
| **Hindi (`hi-IN`)** | Supported | Supported | Supported | Speaks cleanly |
| **Kannada (`kn-IN`)** | Supported (Google TTS pack) | Limited / Version-dependent | Varies | Falls back to visual prompt if voice pack is uninstalled |
| **Tamil (`ta-IN`)** | Supported | Supported | Supported | Speaks cleanly |
| **Telugu (`te-IN`)** | Supported | Limited | Varies | Checked via `getVoices()` |
| **Malayalam (`ml-IN`)**| Supported (Google TTS pack) | Limited | Varies | Friendly `ui.voice_unavailable` warning shown |
| **Bengali (`bn-IN`)** | Supported | Supported | Supported | Speaks cleanly |
| **Marathi (`mr-IN`)** | Supported | Limited | Varies | Checked via `getVoices()` |

*Safety rule*: If the required voice is missing on the client device, Disha displays a gentle, localized message (*"Voice is not available for this language on your phone"*) instead of reading Indic words using an English voice, which sounds unintelligible and alarming.

---

## 4. Push Notifications on iOS

- Apple requires web apps on iOS to be **explicitly added to the Home Screen** via Safari's Share menu ("Add to Home Screen", available from iOS 16.4+) before granting Web Push notification permissions.
- In desktop or non-installed mobile Safari, Disha's Alerts sheet provides clear, step-by-step guidance on how to enable alerts and highlights WhatsApp alerts as the cross-platform universal channel.

---

## 5. Scope: Not a Booking or Payment Portal

- Disha is strictly an **information translation and change-alert utility**.
- Disha does not process tickets, handle seat booking transactions, or accept payments.
- All "Book ↗" buttons on the S3 Backup screen link directly to official ticket portals (e.g., IRCTC, KSRTC, redBus) in a new browser tab (`target="_blank" rel="noopener noreferrer"`).
