# CoolPro Landing (Next.js)

Production landing page with AC heat load calculator and lead capture for CoolPro Lipa.

## Stack

- **Next.js 15** + Tailwind CSS 4
- **Supabase** — lead storage
- **Cloudflare Turnstile** — captcha (optional in dev)
- **PostHog** — analytics (optional)

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with Supabase + Turnstile keys
```

Run Supabase migration: `supabase/migrations/001_leads.sql`

```bash
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm test` | HVAC engine unit tests |

## Deploy (Vercel)

1. Import repo, set root directory to this folder
2. Add env vars from `.env.example`
3. Set `NEXT_PUBLIC_SITE_URL` to your Vercel URL

Legacy static HTML is in `/legacy` with redirects in `vercel.json`.

## HVAC engine

Calculation logic is ported from `hvac_app` → `lib/hvac-engine/calculator-core.js`. Keep in sync with Flutter/Dart source when formulas change.
