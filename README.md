# Animals' WorldCup 2026

The Lovable "Animal Kingdom Cup" design, rebuilt on a clean Vite + React + Vercel
stack and wired to live API-Football data. Deploys to Vercel (no Cloudflare / Lovable
platform lock-in). Real mascot art for Group E is bundled; every other team falls back
to a clean coloured badge until more art is added.

## Run locally

```bash
npm install

# A) design + mock data only (no API):
npm run dev            # http://localhost:5173

# B) with live data, run the API proxy too:
npm i -g vercel
vercel dev             # serves the app AND /api on one port
```

The site always renders: if the API is unreachable it shows the built-in demo data,
and swaps to live data the moment the key is configured.

## Deploy to Vercel

1. Link the project to the AWC26 team's Vercel project.
2. Add the environment variable (Settings -> Environment Variables):
   - `API_FOOTBALL_KEY` = your API-Sports key   (Production)
   - optional: `AWC_LEAGUE` (default 1), `AWC_SEASON` (default 2026)
3. Deploy. The serverless function in `api/awc.js` holds the key server-side and
   caches upstream calls for 60s, so the key never reaches the browser.

> The key MUST be set in Vercel. Vercel does not read the local `.env` in production.

## How data flows

- `api/awc.js` — Vercel serverless proxy (key server-side, 60s cache, live->upcoming
  fixture fallback).
- `src/lib/transforms.ts` — maps API-Football into the exact shapes the UI expects.
- `src/lib/mascots.ts` — maps real nations to the animal skin (name, colour, image).
- `src/context/data.tsx` — fetches every 60s, applies transforms, falls back to mock.
- Live sections: Live Matches, Group Standings, Top Scorers, Best Player, Schedule,
  Statistics, Live Centre. Editorial sections (Hero stories, Highlights, Latest News)
  use placeholder content until real material is added.

Pre-tournament, scorers/best-player show a tidy "appears once matches begin" state.
