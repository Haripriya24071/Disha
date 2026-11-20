# Demo Video Script (2–3 Minutes)

**Target Duration**: 2 minutes 30 seconds  
**Tooling**: Mobile screen recording on a real Android device (Mock mode enabled).

---

## Shot-by-Shot Walkthrough

### 0:00 – 0:25 | Scene 1: The Everyday Dilemma & Instant Language Switch
- **Visual**: Start on phone screen showing Disha home screen.
- **Action**: Tap the top-right language dropdown and select **ಕನ್ನಡ (Kannada)**.
- **Narrator**: *"Every day, millions of Indian railway passengers receive cryptic ticket codes like GNWL 8 or RAC 3. In Disha, the entire app switches instantly into your mother tongue with zero reloading. Notice how every single button, status, and message changes into clear, conversational Kannada."*

---

### 0:25 – 0:55 | Scene 2: Plain-Language Ticket Status (S2)
- **Visual**: Enter mock PNR `1111111111` and tap **"ನನ್ನ ಟಿಕೆಟ್ ಪರಿಶೀಲಿಸಿ"** (Check my ticket).
- **Action**: Status card loads:
  - Big icon + plain words: *"ನೀವು ಕಾಯುವ ಪಟ್ಟಿಯಲ್ಲಿ 8 ನೇ ಸ್ಥಾನದಲ್ಲಿದ್ದೀರಿ."* (You are number 8 in the waiting line).
  - Tap the underlined term **"ಕಾಯುವ ಪಟ್ಟಿ"** (Waiting list). Bottom sheet slides up with a simple 1-line meaning.
  - Tap the **"ಆಲಿಸಿ"** (Listen) button — Web Speech reads the status aloud in clear Kannada.
- **Narrator**: *"No fake confirmation probabilities, no advertisements. Just three answers: What is my situation? What is going to happen? What should I do now? Notice how complex jargon is underlined — tapping it explains the meaning in plain words."*

---

### 0:55 – 1:15 | Scene 3: Family Sharing with Privacy
- **Visual**: Tap **"ಕುಟುಂಬದೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ"** (Share with family).
- **Action**: The share sheet appears displaying the preview message.
- **Narrator**: *"With one tap, Disha prepares an update for your family on WhatsApp. In compliance with data privacy, the full PNR is never leaked — only the last 4 digits are shared."*

---

### 1:15 – 1:55 | Scene 4: Real-Time S4 Change Alert & Immediate Action
- **Visual**: Keep app open on S2. Trigger `platform_changed` via mock backend.
- **Action**:
  - The screen immediately transitions to the high-contrast **S4 Alert dialog**.
  - Background flashes safely ($\le 2$ times per second), phone vibrates.
  - Old platform `3` is struck through; giant `6` appears at 96px.
  - Tap **"ತಿಳಿಯಿತು"** (Got it) to dismiss and see S2 updated to Platform 6.
  - Next, trigger cancellation to show the **"ಪ್ರಯಾಣದ ಇತರ ಮಾರ್ಗಗಳನ್ನು ನೋಡಿ"** (See other ways to travel) button navigating to **S3 Backup Plan**.
- **Narrator**: *"When a platform changes or a train is delayed, you don't need to stand in front of a crowded enquiry counter. Disha immediately alerts you with high-contrast visuals, vibration, and audio narration. If a train is cancelled, S3 offers verified alternate trains and buses without high-pressure countdowns."*

---

### 1:55 – 2:20 | Scene 5: Accessibility & Offline Resilience
- **Visual**: Open settings. Toggle **Large Text** (22px/32px) and **High Contrast**. Disconnect Wi-Fi to show cached fallback status with `"Call 139"`.
- **Narrator**: *"Disha is built to pass the '65-year-old test'. High contrast modes, large fonts, and seamless offline caching ensure that when mobile connectivity drops at a remote station, your last status and the 139 helpline are always one tap away."*

---

### 2:20 – 2:30 | Scene 6: Closing Summary
- **Visual**: Show the team name, GitHub link, and closing tagline:
  - *Disha — Making Indian Railways understandable for everyone.*
- **Narrator**: *"Disha empowers every passenger with clarity, safety, and dignity in their own language. Thank you."*

