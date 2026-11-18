# ClearTrack backend (mock mode)

## Run
    npm install
    cp .env.example .env
    npm start            # http://localhost:3000

## Test PNRs
1111111111 WL 8 · 2222222222 RAC · 3333333333 Confirmed · 4444444444 Cancelled · anything else -> badpnr

## Endpoints
GET  /api/health
GET  /api/journey/:pnr
GET  /api/journey/:pnr/stream      (live events, Server-Sent Events)
GET  /api/backup?from=&to=&date=
POST /api/notify/subscribe         {pnr, whatsapp?:"+91XXXXXXXXXX", fcmToken?, language?}
POST /api/demo/trigger             {pnr, event}  event = platform_changed | delayed | cancelled | confirmed
POST /api/demo/reset               {pnr}

## Deploy on Render
Build: npm install   ·   Start: npm start
Env: TRAIN_DATA_MODE=mock, ALLOWED_ORIGIN=<your Vercel URL>
(Optional WhatsApp: add TWILIO_* and run `npm install twilio`)
Open /api/health 2 minutes before every demo (free tier sleeps).

## Live mode (RapidAPI)
1. In `.env` set `TRAIN_DATA_MODE=live`, `RAPIDAPI_KEY=...`, `RAPIDAPI_HOST=...` (both shown in the "Code snippet" tab on RapidAPI).
2. Restart. Real PNRs now come from the API (cached 60 s; last good copy returned as `data_source:"cached"` if the API fails).
3. Test PNRs 1111111111-4444444444 still use mock data, so the WL/RAC/cancelled cases and demo triggers keep working.
4. `npm test` runs the normalizer against a sample real response (`test/fixture.json`).

## Contract changes vs the plan (tell the frontend)
- NEW `passengers[]`: `{ n, status: CNF|RAC|WL, wl_position, coach, berth, berth_code, berth_name, raw }`. One entry per passenger. Mock PNRs also need this (see below).
- `ticket` is still there = the worst status among passengers (WL > RAC > CNF).
- CNF can have `coach: null, berth: null` (confirmed, seat assigned after the chart) -> needs its own sentence (`status.cnf_nocoach`).
- Live data never has `platform.current`, `delay_minutes` -> both `null`. Live PNRs have no change events (only the test PNRs do).
