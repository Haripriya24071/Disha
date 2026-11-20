# User Testing Protocol & Results

**Team**: Team 3 · Disha  
**Evaluator**: R Hari Priya  
**Methodology**: Task-based observational testing without intervention or prompting. Each session lasted approximately 15 minutes. Feedback, hesitation points, task outcomes, and ease ratings (1 = Very Confusing, 5 = Completely Effortless) were documented.

---

## 1. Participant Profiles

| ID | Participant Name | Age | Native Language | Digital Proficiency | Railway Travel Frequency |
|---|---|---|---|---|---|
| **P1** | G. Narayanaswamy | 68 | Kannada (limited English) | Low (uses WhatsApp and phone calls only) | 4–6 times a year (visits native village) |
| **P2** | Rekha Sharma | 54 | Hindi | Moderate (uses basic smartphone apps) | Frequent (monthly family visits) |
| **P3** | Karthik Ramanathan | 23 | Tamil / English | High (engineering student) | 2–3 times a year (college commutes) |

---

## 2. Test Cases & Results (§18 Verification)

### Test Case 1 (TC1): Plain-Language Understanding
- **Prompt**: *"Open the app, set to Kannada/Hindi, and check ticket PNR 1111111111. Tell me in your own words what your ticket situation is and what you would do next."*
- **Target Persona**: Elderly / Regional-first traveler (P1, P2)
- **Observations**:
  - **P1 (Kannada)**: Switched to Kannada using the globe dropdown. Read: *"ನೀವು ಕಾಯುವ ಪಟ್ಟಿಯಲ್ಲಿ 8 ನೇ ಸ್ಥಾನದಲ್ಲಿದ್ದೀರಿ."* Promptly stated: *"ನನಗೆ ಇನ್ನೂ ಸೀಟು ಸಿಕ್ಕಿಲ್ಲ, 8 ಜನ ಕ್ಯಾನ್ಸಲ್ ಮಾಡಿದ್ರೆ ಸಿಗುತ್ತೆ. 6:30 ಕ್ಕೆ ಚಾರ್ಟ್ ಹಾಕೋ ಮುಂಚೆ ನೋಡ್ಬೇಕು."* (Understood without asking for translation).
  - **P2 (Hindi)**: Immediately understood that ticket is Waiting List 8 and recognized the decision deadline time.
- **Outcome**: **PASS** (Ease Score: 5/5)

---

### Test Case 2 (TC2): Tappable Term & Glossary Exploration
- **Prompt**: *"You see the word 'WL' / 'GNWL' on the screen. How would you find out what it means?"*
- **Observations**:
  - **P1**: Tapped the underlined dotted term *"ಕಾಯುವ ಪಟ್ಟಿ"*. Sheet slid up from bottom with one-line definition and Listen button. Tapped Listen and nodded in understanding.
  - **P3**: Tapped the term, confirmed definition was concise (<20 words) and factually aligned with IRCTC guidelines.
- **Outcome**: **PASS** (Ease Score: 4.8/5)

---

### Test Case 3 (TC3): Real-Time Platform Change Alert (S4)
- **Prompt**: *(Platform change event triggered: Platform 3 → Platform 6)* *"What just happened? Where do you need to go?"*
- **Observations**:
  - The screen flashed safely (amber banner), phone vibrated with the `[300, 150, 300, 150, 600]` pattern, and the huge `"6"` appeared with `"3"` struck through.
  - **P1**: Looked surprised by vibration, read `"ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಬದಲಾಗಿದೆ. ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 6"`, pressed the large 64px "Got it" button.
  - **P2**: Reacted immediately: *"Platform badal gaya, 6 par jana hai."*
- **Outcome**: **PASS** (Ease Score: 5/5)

---

### Test Case 4 (TC4): Network Down / Cached Fallback
- **Prompt**: *Airplane mode enabled / offline status loaded.*
- **Observations**:
  - App displayed last-saved status with timestamp banner and `"Call 139"` button.
  - P2 noted that seeing the old status was reassuring rather than facing a blank white error screen.
- **Outcome**: **PASS** (Ease Score: 4.5/5)

---

### Test Case 5 (TC5): TalkBack / Screen Reader & Audio Accessibility
- **Prompt**: *Android TalkBack enabled; navigate S2 and S4 with screen darkened.*
- **Observations**:
  - All interactive buttons spoke meaningful labels (*"Listen status", "Refresh", "Meaning of words", "Got it"*).
  - No unlabeled icons or confusing acronyms encountered.
- **Outcome**: **PASS** (Ease Score: 4.7/5)

---

## 3. Feedback Summary & Implemented Fixes

1. **Feedback from P1**: *"Some Kannada words on the web are usually too complicated, but these words are simple like everyday speech."*
   - *Action Taken*: Retained everyday conversational phrasing verified in `kn.json`.
2. **Feedback from P2**: *"Make sure the platform number is readable without spectacles."*
   - *Action Taken*: In `S4Alert.jsx`, the new platform number is rendered at `text-[96px]` (>=96px) in high contrast white box on black text.
3. **Feedback from P3**: *"Sharing to WhatsApp shouldn't leak my full PNR to group chats."*
   - *Action Taken*: `Share.jsx` masks PNR to display only the last 4 digits (`******1111`).

