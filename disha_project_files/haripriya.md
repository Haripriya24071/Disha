# Haripriya — Alerts & Backup Screens, Languages, Testing & Submission

Part 4 — Haripriya — Alerts & Backup
Screens, Languages, Testing and
Submission
Read Part 1 (Project Plan) fully, especially §4, §6, §8, §10.4, §17, §18. You own S3, S4, the
Share and Alerts sheets, every translation and glossary word, accessibility checks,
user testing, documentation, the deck and the demo video.
Your role in one line
You make Disha understandable and safe: the words in 8 languages, the screens people see
in a stressful moment (backup plan, change alert), and the proof that it works for real users — then
you package everything for submission.
You own (files)
src/screens/S3Backup , src/screens/S4Alert , src/sheets/Share, src/sheets/Alerts , src/i18n/*.json
(all 8), docs/ , architecture-diagram/ , the deck and demo video.
You do NOT touch
useT.js , LangDropdown , S1/S2 (Vaibhavi), backend (Rithika). Use Vaibhavi's components ( Header,
BigButton , Sheet , Term , ListenButton ) — don't rebuild them.
Day 0 — tonight (30 min)
Open Part 1 (Project Plan) §6.3 and §10.4 and start en.json  with all keys.
Find native speakers for Kannada, Hindi, Tamil first (family, friends, classmates). Ask them
now for a 15-minute check on Day 2. Then Telugu, Malayalam, Bengali, Marathi.
Day 1 — Words first (everyone is waiting on this)
1. en.json complete by 11 AM
Create mobile-app/src/i18n/en.json . Use exactly the keys in plan §10.4. Starter:
Disha — Team 3 · page 24 of 29

---

Agree the "tappable term" markup with Vaibhavi (recommended: [[wl:waiting line]]
inside strings). Then mark the terms in en.json , e.g. "status.wl": "You are number {pos} in 
the [[wl:waiting line]]. …" .
Add the 14 glossary entries ( term.<id>.name  / term.<id>.meaning ). English one-liners (edit if
you like, but keep each under 20 words):
pnr — A 10-digit number on your ticket. It is how the railway finds your booking.
wl — Waiting list. You do not have a seat yet. You move up when others cancel.
gnwl — General waiting list. The most common waiting list. It usually has the best
chance to move.
rlwl — Remote location waiting list. Waiting list for stations in the middle of the route.
{
  "ui.app_name": "Disha",
  "ui.enter_pnr": "Enter your PNR number",
  "ui.check_ticket": "Check my ticket",
  "ui.what_is_pnr": "What is a PNR?",
  "ui.listen": "Listen",
  "ui.stop": "Stop",
  "ui.refresh": "Refresh",
  "ui.backup_plan": "I need a backup plan",
  "ui.glossary": "Meaning of words",
  "ui.share": "Share with family",
  "ui.alerts": "Alerts on WhatsApp",
  "ui.settings": "Settings",
  "ui.call_139": "Call railway helpline 139",
  "ui.show_technical": "Show technical details",
  "ui.got_it": "Got it",
  "ui.try_again": "Try again",
  "ui.continue_guest": "Continue without login",
  "ui.send_code": "Send code",
  "ui.login": "Log in",
  "ui.large_text": "Large text",
  "ui.high_contrast": "High contrast",
  "ui.vibration": "Vibration alerts",
  "ui.voice_unavailable": "Voice is not available for this language on your phone.",
  "ui.wait": "I will wait for the final list",
  "ui.other_trains": "Other trains",
  "ui.buses": "Buses",
  "ui.book": "Book",
  "ui.open_site": "Open website",
  "ui.send_whatsapp": "Send on WhatsApp",
  "ui.copy": "Copy",
  "ui.copied": "Copied",
  "ui.alerts_phone": "Tell me on this phone",
  "ui.alerts_whatsapp": "Also tell me on WhatsApp",
  "ui.whatsapp_join": "First, send the word “join <code>” to our WhatsApp number once.",
  "ui.see_other_ways": "See other ways to travel",
  "status.wl": "You are number {pos} in the waiting line. Your ticket is not confirmed yet.",
  "status.rac": "You have a seat to sit, but you may have to share a berth with one other person. 
It can get better if others cancel.",
  "status.cnf": "Your ticket is confirmed. Coach {coach}, berth {berth}.",
  "status.decide": "The final list (chart) is made around {time}. If you want a backup, look 
before then.",
  "status.decide_est": "The final list (chart) is usually made 4–8 hours before the train leaves. 
Check IRCTC for the exact time.",
  "alert.platform": "Platform changed. Your train will now come to Platform {to}.",
  "alert.delay": "Your train is {min} minutes late. New departure: {time}.",
  "alert.cancelled": "Your train is cancelled. See other ways to travel. For e-tickets, IRCTC 
usually refunds automatically — check with IRCTC or 139.",
  "alert.confirmed": "Good news. Your ticket is now confirmed. Coach {coach}, berth {berth}.",
  "trust.note": "Always confirm with the official IRCTC app or 139. Last updated {ago}.",
  "error.nodata": "We could not get live information right now. Showing the last saved status.",
  "error.badpnr": "This PNR number does not look right. It should have 10 digits.",
  "error.offline": "You are offline. Showing the last saved status.",
  "lang.en": "English", "lang.kn": "ಕನ್ನಡ", "lang.hi": "हिन्दी", "lang.ta": "தமிழ்",
  "lang.te": "తెలుగు", "lang.ml": "മലയാളം", "lang.bn": "বাংলা", "lang.mr": "मराठी"
}
Disha — Team 3 · page 25 of 29

---

pqwl — Pooled quota waiting list. Waiting list for short-distance or middle-station seats.
rac — Reservation against cancellation. You have a seat to sit, but you may share a
berth.
cnf — Confirmed. You have your own seat or berth.
chart — The final passenger list. After it is made, your status is decided.
berth — The bed or seat you are given in a coach.
coach — One railway carriage, like S4 or B2. Your coach is printed on the ticket.
class — The type of coach: SL is sleeper, 3A/2A/1A are air-conditioned.
tatkal — A quick-booking window one day before travel, for last-minute tickets.
platform — The raised area where the train stops and you get in.
decideby — The time by which you should decide about a backup plan.
(Fact-check each one against the IRCTC site/139 before it goes into the deck.)
Push en.json  and tell the team. Then create the 7 other files with the same keys, filling a
machine-translated first draft (Google Translate / Bhashini) so Vaibhavi can test the dropdown
end-to-end. Mark them "_status":"DRAFT"  until a native speaker checks.
2. S3 Backup screen layout (sample data first)
S3Backup  with Header (back arrow + title + language dropdown), intro sentence, section
Other trains (card list), section Buses (card list), and a full-width "I will wait for the final
list" button that returns to S2 — no pressure, no countdown.
Each train card: number + name, departs/arrives, availability word + icon (✔ Available / ⏳
Waiting / ? Unknown — never colour only), Book ↗ button ( target="_blank" rel="noopener" ).
Each bus card: operator, note, Open website ↗.
Use hard-coded JSON matching §10.3 for now.
3. Share sheet
ShareSheet({ open, onClose, journey }) : a preview card of the status in the current language
(headline + 1–2 sentences + train + date), button Send on WhatsApp →
window.open('https://wa.me/?text=' + encodeURIComponent(message), '_blank') , secondary
Copy ( navigator.clipboard.writeText, then show "Copied").
Message format: Disha — {headline}\n{sentences}\nTrain {number} · {date}\nAlways 
confirm with IRCTC or 139. Build it from t() so it is in the user's language. Do not include
the full PNR in the shared text (privacy) — show only the last 4 digits.
Day 2 — S4, Alerts, native-speaker checks, accessibility
S4 Change Alert
S4Alert({ event, onDismiss }) — full-screen, shown on top of everything. Layout in plan §4.
Variants by event.type :
platform_changed: old platform struck through, new platform huge (≥ 96 px), sentence
alert.platform .
delayed : big "+45 min", alert.delay .
cancelled : alert.cancelled  + button See other ways to travel → S3.
confirmed : green, ✔, alert.confirmed .
Flashing background: CSS animation alternating two colours at ≤ 2 flashes per second
(accessibility safety — must stay under 3 flashes/second) and respect prefers-reduced-motion
(no flashing, just a bold border).
Disha — Team 3 · page 26 of 29

---

Vibration: if (settings.vibration && navigator.vibrate) 
navigator.vibrate([300,150,300,150,600]) . Note iPhone Safari doesn't support it — the visual
alert still works.
Buttons: Listen (use ListenButton ) and Got it (≥ 64 px high). Focus moves to the alert
heading when it opens, with role="alertdialog"  and aria-live="assertive" .
Test with Rithika's POST /api/demo/trigger  for all 4 events.
Alerts sheet
AlertsSheet({ open, onClose, pnr }) : switch Tell me on this phone → asks
Notification.requestPermission() , gets the FCM token (Vaibhavi's service worker) and calls
POST /api/notify/subscribe { pnr, fcmToken, language } .
Field Also tell me on WhatsApp (10-digit Indian number) + short instruction
ui.whatsapp_join with the sandbox join code from Rithika → POST /api/notify/subscribe { 
pnr, whatsapp:"+91…", language } . Show a green "Done" state with ✔ and words.
If notifications are blocked or unsupported (e.g. iPhone not installed), show a plain-language
message and the "Add to Home Screen" hint.
Translation quality (the safety-critical task)
Send the 11 core sentences + button labels + 14 glossary terms to native speakers:
Kannada, Hindi, Tamil first (Day 2 morning). Ask them to fix wording so a 65-year-old would
understand, not just correctness. Record who checked what in docs/translation-review.md
(language, reviewer, date, changes).
Keep sentences short. Don't translate "PNR", "IRCTC", "139", platform numbers — keep them
as they are.
Replace _status:"DRAFT"  with "REVIEWED"  per language only after a native speaker checks it.
In the deck, say honestly which languages are reviewed and which are draft.
Check every file has exactly the same keys (small script: compare key sets of en.json  vs
the others).
Accessibility checks
Contrast: check every text/background pair with a contrast checker (target ≥ 4.5:1). Known
risks from the earlier design: white on #E94560  (~4:1) and #F5A623  on #F0F4FF  (very low). Tell
Vaibhavi the fixed colours.
Never colour alone — check every status has an icon + word.
Run Lighthouse → Accessibility on S1–S4; fix anything under 90.
TalkBack (Android): swipe through S2 and S4 with the screen off — does it make sense in
order? Do all buttons speak their labels?
Day 3 — User testing, docs, deck, video, submission
User test (morning, 3 people, ~15 min each — one must be 55+ or non-
English-first)
Do tasks, not opinions. Do not help. Note where they hesitate.
1. "Open the site and make it speak your language." (TC language)
2. "Check this ticket (PNR 1111111111 ). Tell me in your own words what it means and what you'd
do next." (TC1)
Disha — Team 3 · page 27 of 29

---

3. "You see the word GNWL. Find out what it means." (TC2)
4. (Rithika triggers a platform change) "What just happened? Where do you go?" (TC3)
5. "The ticket may not confirm. Find another way to travel." (S3)
6. After: ease score 1–5, "What was confusing?", "Would you send this to your parent?"
Record results in docs/user-testing.md  using the table in plan §18 (real names, real results
— don't invent passes). Fix quick text fixes immediately; log bigger ones as "next
iteration".
Documentation ( docs/)
README section for the submission: problem, solution, how to run.
docs/tech-choices.md : stack table (plan §12), API list (plan §11), why each.
docs/assumptions-and-limits.md : unofficial PNR API, free-tier limits, voice availability per
language (from Vaibhavi's table), iPhone push limits, not a booking tool, not a promise of
confirmation.
docs/privacy-and-ethics.md: plan §17 in your words.
architecture-diagram/  — redraw plan §9 cleanly (draw.io / Figma) as PNG + source.
Deck (use the Design Thinking format from the v2 plan §11)
Keep 15 slides: Title · Problem story · 5 interviews · Station + survey · Define (problem + pain
points) · HMW + opportunities · Ideation methods · 45 ideas → features · Screen overview (the 4
screens) · Key screens walkthrough with live screenshots · Accessibility + 8 languages · Testing (5
real cases) · Feedback + iterations · Feasibility + roadmap · Business approach.
Be honest on slide 12–13 about test results. Business slide: mark market numbers as
estimates.
Demo video (2–3 min) — follow plan §16 script
Record on a real phone (screen recording) with mock mode on, Render warmed up. Do 2
takes. Add captions.
Submission
Final PR to main ; tag v1 . Check that the live Vercel URL works from a fresh browser.
Zip: deck, video, docs, diagram, repo link.
Rules for you
Never ship a translation without the same keys as English. Missing keys silently fall
back to English and ruin the demo.
Never write "will confirm"/"will not confirm", never add a percentage.
Don't invent walking times, coach positions or test results.
Simple words. If a 65-year-old would pause, rewrite it.
Done checklist
8 dictionaries with identical keys; 3+ languages native-checked
S3 and S4 built, S4 flashes safely (≤ 2/s) and vibrates
Disha — Team 3 · page 28 of 29

---

Share → WhatsApp works; Alerts sheet subscribes
Contrast, Lighthouse, TalkBack checks done
3 real user tests recorded honestly
Docs, diagram, deck, demo video, submission zip
Disha — Team 3 · page 29 of 29
