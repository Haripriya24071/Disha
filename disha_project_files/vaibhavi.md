# Vaibhavi — App Shell, Language System & Main Screen

Part 3 — Vaibhavi — App Shell, Language
System & Main Screen
Read Part 1 (Project Plan) §3–§7 and §10 first. You build S1 (Login) and S2 (My Journey) — the
screen most people will use — plus the language engine the whole app depends on.
Your role in one line
You own the front door of the app: the language dropdown that changes the entire screen, the
plain-language status screen, tappable terms, the Listen button, and the settings sheets. If a 65-
year-old can't use S2 alone, the project fails — so S2 is yours to make perfect.
You own (files)
mobile-app/  setup (Vite, Tailwind, PWA), src/i18n/useT.js, src/components/  (Header, LangDropdown,
BigButton, Sheet, Term, ListenButton, StatusCard), src/screens/S1Login , src/screens/S2Journey ,
src/sheets/Glossary , src/sheets/Accessibility , src/hooks/ .
You do NOT touch
Translation text (Haripriya), S3/S4 screens and Share/Alerts sheets (Haripriya), backend (Rithika).
You use the dictionaries; you don't write them.
Day 0 — tonight (30 min)
Create the repo with 4 branches: main , rithika , vaibhavi , haripriya . Add the folder structure
from plan §19.
npm create vite@latest mobile-app -- --template react , add Tailwind, deploy the empty app
to Vercel (connect GitHub). Share the URL.
Add a base index.html  with <meta name="viewport">  and lang  attribute that updates with the
language.
Day 1 — Foundations (language engine first)
1. i18n engine (do this first — Haripriya and everyone else depends on it)
src/i18n/useT.js: a React context LangProvider  + hook useT() returning { t, lang, setLang 
} .
t('status.wl', { pos: 8 }) → looks up the key in the current language JSON and
replaces {pos} .
If a key is missing in the chosen language, fall back to en  and console.warn  the key (so
we catch gaps).
Load dictionaries on demand: import('./kn.json')  when the user picks Kannada (keeps
first load small). en  is always bundled.
Disha — Team 3 · page 20 of 29

---

Persist the choice: localStorage.setItem('lang', code) ; on first visit use the browser language
( navigator.language ), default en .
Set document.documentElement.lang = code whenever the language changes (screen readers
need this).
Font per language: when the language changes, load only that script's Noto Sans font
( font-display: swap ) and set font-family  on body . Language → font map: kn →Noto Sans
Kannada, hi / mr →Noto Sans Devanagari, ta →Noto Sans Tamil, te →Noto Sans Telugu,
ml →Noto Sans Malayalam, bn →Noto Sans Bengali, en →Noto Sans.
2. Language dropdown ( LangDropdown)
A button in the header that shows the current language in its own script plus a 🌐 icon and
▾. Min 56 px tall.
Tap → a large list (full-width sheet on mobile) of the 8 languages, each with the native name
only (English, ಕನ್ನಡ, हिन्दी, தமிழ், తెలుగు, മലയാളം, বাংলা, मराठी). Tap one → setLang(code) → the
entire screen re-renders at once → list closes.
Accessible: aria-haspopup, aria-expanded, each option is a <button>  with lang="kn"  etc.
Escape key / tap outside closes it.
Until Haripriya delivers real translations, test with en  + a dummy hi.json  containing 5 keys.
3. Shared components
Header (app name left, LangDropdown  right, sticky), BigButton  (icon + word, min height 56 px,
full width, variants: primary / secondary / danger), Sheet  (bottom sheet with title, close
button, focus trap, Esc to close), StatusCard .
Tailwind tokens (colours from the v2 design system are a good start; Haripriya checks
contrast — fix anything she flags): background #F0F4FF  light / #1A1A2E  dark, alert #E94560 ,
warning #F5A623 , confirmed #4CAF50 . Body text 18 px, heading 26 px, button text 20 px.
4. S2 using mock data
useJourney(pnr)  hook → GET {API}/api/journey/:pnr (API base from VITE_API_URL ). States:
idle | loading | ok | error .
State A: PNR input (10 digits, numeric keypad: inputMode="numeric" , maxLength=10 ), big
Check my ticket button, tappable "What is a PNR?".
State B: build the status text from codes:
ticket.type === 'WL'  → headline "⏳ …" + t('status.wl', { pos: ticket.wl_position })
'RAC'  → t('status.rac')
'CNF'  → t('status.cnf', { coach, berth })  with ✔ icon
decide-by line: if chart.source === 'api'  → t('status.decide', { time }) ; if 'estimate'
→ t('status.decide_est')  (never show a clock time for an estimate)
Show train number/name, departure time (format with Intl.DateTimeFormat(lang, …) ),
platform if not null.
"Show technical" small link → reveals ticket.raw .
Bottom: t('trust.note', { ago })  — "ago" = "2 min ago", computed from
last_updated_iso.
If data_source === 'cached'  show t('error.nodata')  banner above the status.
Error states: bad PNR → t('error.badpnr')  + try again; network down → last saved status
from localStorage  + Call 139 button + Try again.
Disha — Team 3 · page 21 of 29

---

Buttons below the status (all BigButton ): Listen · Refresh · I need a backup plan (navigates
to S3) · Meaning of words · Share with family · Alerts on WhatsApp · Settings · Call 139 ( <a 
href="tel:139"> ).
Share and Alerts sheets are Haripriya's — you just open them: <ShareSheet open onClose 
journey /> , <AlertsSheet open onClose pnr /> . Agree the prop names with her on Day 1.
Done for Day 1 when: you can switch English ↔︎ Hindi on S2 and see every word change, for PNRs
1111111111 , 2222222222 , 3333333333 .
Day 2 — Tappable terms, Listen, sheets, real-time
Tappable terms (the most important accessibility feature)
Term  component: <Term id="wl">WL</Term> renders a <button>  styled with a dotted underline
and a tiny "?" mark. Tap → opens a Sheet  with t('term.wl.name') , t('term.wl.meaning')  and a
Listen button.
Rich text: translation strings contain markers like {{wl|waiting line}}  or <term id="wl">…
</term> . Pick one format with Haripriya on Day 1 (recommended: [[wl:waiting line]] ). Write
renderRich(str)  that turns those markers into <Term> components. Make sure it works for
Indic scripts (no splitting on spaces).
Test: every one of the 14 terms in plan §6.2 opens the right sheet.
Listen button ( ListenButton + useSpeech)
Use window.speechSynthesis . Map app language → BCP-47: en-IN, kn-IN, hi-IN, ta-IN, te-IN, 
ml-IN, bn-IN, mr-IN .
Get voices with speechSynthesis.getVoices()  (they load asynchronously — wait for the
voiceschanged event). Pick the voice whose lang  starts with the code; if none exists, show
t('ui.voice_unavailable')  instead of speaking in the wrong language.
Read the visible text of the status block (headline + sentences + decide-by), not the
whole page. Tap again to stop. Button label changes Listen ↔︎ Stop.
Test on a real Android phone for every language and make a table in docs/voice-support.md :
language → works / doesn't. (Haripriya puts this in the docs.) If a key language has no voice,
ask Rithika/Haripriya about the optional Bhashini TTS.
Sheets you build
Glossary sheet: search box at the top (filters terms in the current language), list of the 14
terms; tap one → meaning + Listen.
Accessibility sheet: three big switches — Large text (adds class text-large  on <html>:
body 22 px, headings 32 px), High contrast (dark background, white text, thick borders),
Vibration alerts (stores a flag; S4 checks it). Save in localStorage ; apply at app start.
Realtime
useSSE(pnr)  using new EventSource(API + '/api/journey/'+pnr+'/stream'). On a ChangeEvent :
type in platform_changed | delayed | cancelled | confirmed  → show S4 with the event
(Haripriya's screen: <S4Alert event onDismiss /> ) and re-fetch the journey.
other types → just re-fetch silently.
Auto-reconnect on error; show nothing scary to the user if it drops.
Disha — Team 3 · page 22 of 29

---

If SSE is flaky on Render, fall back to setInterval  polling GET /api/journey/:pnr  every 15 s
and diff locally.
Day 3 — S1 Login, PWA, polish
S1 Login: layout from plan §4. Firebase Auth signInWithPhoneNumber  + invisible reCAPTCHA.
Use the Firebase test phone numbers for demo. After login: save language + last PNR to
Firestore users/{uid} . "Continue without login" goes straight to S2 (guest). Add one plain
sentence: what we store and why (privacy, plan §17).
Connect S3: BackupScreen  is Haripriya's; make sure the navigation from S2 works and that
S3 receives from , to , date  from the journey.
PWA: manifest.webmanifest  (name, icons, display: standalone , theme colour) + a service
worker that caches the app shell and the last journey response. Add a small "Add to Home
Screen" hint (needed for iPhone push — Rithika's alerts).
Register the FCM service worker and pass the token to Haripriya's Alerts sheet (or call POST 
/api/notify/subscribe  yourself if that's simpler — agree with her).
Test on 2 real phones (one Android, one other). Keyboard-only and TalkBack pass on S2.
Fix every console.warn  about missing translation keys.
Rules for you
No hard-coded visible text. Every word on screen comes from t(...). (Easy test: switch
language — if any English remains, it's a bug.)
One primary action per screen. Don't add buttons that aren't in plan §5.
Don't invent data. If a field is null , hide that line.
Every interactive element ≥ 56 px tall (≥ 48 × 48 minimum for small ones like the "?" mark
— give it padding).
Every icon button has a text label too, and every control has an aria-label  or visible text.
Done checklist
Language dropdown changes the entire screen instantly (8 languages)
S2 handles WL, RAC, CNF, error, cached states
Every term is tappable; glossary sheet works
Listen works on the demo phone in at least 4 languages
Large text + High contrast work
SSE → S4 appears; guest + OTP login both work
PWA installs on Android
Disha — Team 3 · page 23 of 29
