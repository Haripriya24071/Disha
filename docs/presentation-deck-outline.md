# Presentation Deck Outline — Design Thinking Submission

**Team**: Team 3 · B.Tech CSE · Jain University · 2026  
**Product**: Disha — Railway information every Indian passenger can actually understand  
**Format**: 15 Slides strictly adhering to the Design Thinking project structure.

---

### Slide 1: Title & Purpose
- **Heading**: Disha (दिशा / ದಿಶಾ / திஷா)
- **Subheading**: Railway information Indian passengers can actually understand.
- **Team Members**: Rithika Vijay (Backend/Realtime), A B Sree Vaibhavi (Frontend/Language Engine), R Hari Priya (Alerts, Languages & Validation).
- **Core Hook**: What happens when an elderly passenger traveling alone sees "GNWL 18 / WL 9, Charting at 18:00"?

---

### Slide 2: Empathize — The Problem Story
- The emotional experience of traveling by Indian Railways: crowded platforms, chaotic enquiry counters, noisy announcements, and high anxiety.
- Passengers repeatedly check PNR status (76% check 5+ times during a journey).
- Unofficial apps bombard users with fake probability scores ("78% chance of confirmation"), gambling predictions, and misleading ads.

---

### Slide 3: Research & Fieldwork (Station Visit + Survey)
- **Fieldwork**: KSR Bengaluru (Majestic) station visit: enquiry counter observations and interviews.
- **Survey Findings (34 Respondents)**:
  - 56% prefer Kannada, Hindi, or Tamil over English.
  - 15 out of 34 call a family member or friend to interpret raw PNR codes.
  - Only 4 out of 34 ever called railway helpline 139.

---

### Slide 4: 5 In-Depth Passenger Interviews
- Profile of real user interviews: elderly rural traveler, migrant worker, working mother, student traveling on Tatkal, and railway coolie.
- Key quote from a 68-year-old traveler: *"The app tells me 'RAC 4'. Does that mean I can sleep or will they ask me to leave the train?"*

---

### Slide 5: Define — Problem Statement & Pain Points
- **Core Insight**: Passengers don't need raw database codes. They need answers to three plain questions:
  1. *What is my situation?*
  2. *What is going to happen next?*
  3. *What should I do right now?*
- **Primary Pain Point**: The sudden, quiet platform change that causes last-minute panic across footbridges.

---

### Slide 6: How Might We (HMW) & Opportunities
- *How might we explain railway jargon in under 20 plain words in regional languages?*
- *How might we alert a passenger immediately when their platform or timing changes without requiring them to stare at an open screen?*
- *How might we offer backup options without inducing panic or high-pressure countdown timers?*

---

### Slide 7: Ideation Methods
- Brainstorming matrix, crazy 8s sketching, and persona journey mapping.
- 45 initial concepts filtered down to high-impact, accessible essentials.

---

### Slide 8: Feature Prioritization & What We Cut
- **Cut**: Speculative AI confirmation probabilities, footbridge walking times, coach physical distance estimates.
- **Kept**: 4 clean screens, instant 8-language switcher, full-screen change alert dialog, WhatsApp notifications, 14 tappable glossary definitions.

---

### Slide 9: 4-Screen Product Architecture
- **S1**: Welcome & OTP / Guest Access.
- **S2**: Plain-language My Journey with tappable terms and audio narration.
- **S3**: Low-pressure Backup Plan (trains and buses with official booking links).
- **S4**: Full-screen Change Alert with safe flashing ($\le 2/\text{s}$) and phone vibration.

---

### Slide 10: Key Screen Walkthrough with Live UI
- Screenshots of S2 in Kannada and Hindi demonstrating status clarity.
- Tappable terms (`[[wl:waiting line]]`) opening instant sheets.
- 1-tap Family Share formatting with privacy-preserving masked PNR.

---

### Slide 11: Accessibility & 8 Regional Languages
- High contrast ($\ge 4.5:1$ text contrast ratio), minimum 56px touch targets, 64px primary action buttons.
- Full parity across 8 regional dictionaries: English, Kannada, Hindi, Tamil, Telugu, Malayalam, Bengali, Marathi.
- Safe visual alert animations respecting `prefers-reduced-motion`.

---

### Slide 12: Real User Testing & Observations (§18)
- Summary of 3 testing sessions (including 68-year-old non-English speaker).
- 100% comprehension of Waiting List and RAC status without external assistance.
- Ease score: 4.8 / 5.0 across 5 formal scenarios.

---

### Slide 13: Honest Feedback & Rapid Iterations
- Documenting real iterations:
  - Enlarged platform change font to 96px for reading without glasses.
  - Masked PNR on WhatsApp sharing for DPDP compliance.
  - Added "I will wait for the final list" button to remove decision pressure.

---

### Slide 14: Technical Feasibility & Scalability Roadmap
- Scalable micro-architecture: React PWA, Node.js event bus, Server-Sent Events, Firebase FCM, Twilio Sandbox.
- Future roadmap: Offline SMS alerts, automatic station audio announcements sync, accessibility braille display compatibility.

---

### Slide 15: Conclusion & The "65-Year-Old Test"
- Summary: If a 65-year-old traveler standing on a crowded platform can understand their ticket and know where to walk within 5 seconds, the product succeeds.
- Link to live web application and GitHub repository.

