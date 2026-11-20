# Web Speech API Voice Support Across 8 Languages

This document records the cross-platform speech synthesis compatibility audit conducted for **Disha** using the browser's native `window.speechSynthesis` API.

---

## 1. Voice Compatibility Matrix

Tested across:
- **Android**: Pixel 7 / Samsung Galaxy M31 (Android 13/14, Google Speech Services)
- **iOS**: iPhone 13 (iOS 17.2, Apple Siri/Compact Voices)
- **Desktop**: Google Chrome / Microsoft Edge (Windows 11)

| Language | BCP-47 Code | Android (Google TTS) | iOS (Safari) | Desktop (Edge/Chrome) | Pronunciation Quality | App Fallback Behaviour |
|---|---|---|---|---|---|---|
| **English** | `en-IN` | ✅ Available | ✅ Available | ✅ Available | Clear, Indian English inflection | Speaks natively |
| **Kannada** | `kn-IN` | ✅ Available (Google Speech Pack) | ⚠️ Limited / iOS 17+ | ✅ Available | Natural phonetics for conjunct consonants | If missing: shows `ui.voice_unavailable` |
| **Hindi** | `hi-IN` | ✅ Available | ✅ Available | ✅ Available | Highly clear, widely supported | Speaks natively |
| **Tamil** | `ta-IN` | ✅ Available (Google Speech Pack) | ✅ Available | ✅ Available | Natural rhythm and pacing | Speaks natively |
| **Telugu** | `te-IN` | ✅ Available | ⚠️ Requires manual voice download | ✅ Available | Clear articulation | If missing: shows `ui.voice_unavailable` |
| **Malayalam** | `ml-IN` | ✅ Available | ⚠️ Limited | ⚠️ Pack dependent | Accurate syllable stress | If missing: shows `ui.voice_unavailable` |
| **Bengali** | `bn-IN` | ✅ Available | ✅ Available | ✅ Available | High fidelity | Speaks natively |
| **Marathi** | `mr-IN` | ✅ Available | ⚠️ Limited | ✅ Available | Smooth Devanagari pronunciation | If missing: shows `ui.voice_unavailable` |

---

## 2. Safety & Fallback Rules Implemented

1. **Strict Language Matching**:  
   We match the exact language prefix (`kn`, `hi`, `ta`, etc.). We **never** fall back to an English voice to read regional script text. Reading Indic scripts with an English synthesizer sounds like random gibberish and causes severe distress to elderly users.
2. **Graceful Notice**:  
   When a device lacks a regional voice pack, the app displays:  
   `"Voice is not available for this language on your phone."` (`ui.voice_unavailable`).
3. **Chunking for Long Sentences**:  
   Utterances are constrained to short, discrete phrases to prevent iOS Safari audio buffer timeouts.

