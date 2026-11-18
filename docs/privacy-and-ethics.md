# Privacy and Ethics Charter

Disha was conceived to empower Indian railway passengers with clarity, peace of mind, and dignity. Because our users often include elderly citizens, first-time travelers, and non-tech-savvy passengers, upholding privacy, data ethics, and transparency is our highest priority.

---

## 1. Compliance with the Digital Personal Data Protection (DPDP) Act, 2023

Disha adheres to the core tenets of India's **DPDP Act, 2023**:

1. **Principle of Purpose Limitation**:
   - We collect only the data strictly necessary to retrieve ticket status and deliver timely alerts:
     - 10-digit PNR number
     - Preferred regional language
     - Phone number (only if explicitly opted-in for WhatsApp alerts or phone OTP)
   - Data is used solely for the stated purpose: providing train status and sending real-time platform/delay alerts.
2. **Principle of Storage Limitation & Deletion**:
   - PNR numbers and passenger journey records are automatically pruned and permanently deleted from our servers **24 hours after the scheduled date of travel**.
   - Subscriptions to WhatsApp and Push notifications expire automatically upon journey completion.
3. **No Commercial Exploitation or Profiling**:
   - Zero advertising trackers, zero behavioural profiling scripts, and zero data brokers.
   - We will never sell, monetize, or transfer passenger travel itineraries to third-party travel agencies or marketing networks.

---

## 2. PNR Privacy & Masking

A Passenger Name Record (PNR) can reveal sensitive travel information. Disha implements privacy safeguards:

- **Masked Family Sharing**: When sharing status updates with family over WhatsApp or clipboard (`ShareSheet`), the PNR number is automatically masked, displaying only the last 4 digits (e.g., `******1111`).
- **No Full PNR in Logs**: The backend logging system truncates or omits PNR numbers and phone numbers to ensure sensitive data does not persist in server logs.

---

## 3. Ethical Content & Truthful Communication

- **No Speculative Confirmation Percentages**: Third-party apps frequently display misleading predictions such as *"82% chance of confirmation"* to encourage booking alternate paid tickets or commission-based flights. Disha refuses to display invented confirmation probabilities.
- **Clear Demarcation of Estimates**: If the official chart preparation time is not available via the API, Disha clearly marks the chart time as an estimate (*"usually made 4–8 hours before the train leaves"*) and directs passengers to verify with official channels.
- **Safety in Language Translation**: A mistranslated platform number or delay notice can cause a passenger to miss their train or board the wrong carriage. For this reason, core sentences in key languages (Kannada, Hindi, Tamil) are verified by native speakers, and numbers and railway station codes are never machine-garbled.
