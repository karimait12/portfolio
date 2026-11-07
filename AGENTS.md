# AGENTS.md

## Stack
- Vite 8 + React 19 + TypeScript SPA (no SSR). React Router v7 with `BrowserRouter`. Tailwind CSS v4 via `@tailwindcss/postcss`. Supabase is the backend (auth + Postgres). Also Framer Motion, Lucide, Recharts.
- This is NOT Next.js. There is no server, API routes, or SSR in this repo.

## Commands
- Dev server: `npm run dev` (Vite)
- Production build: `npm run build` -> `dist/`
- Preview build: `npm run preview`
- `npm test` is a placeholder that always exits 1. There are no tests, no lint config, and no typecheck. Do not rely on it.
- There is no single-test or single-package command.

## Structure
- Entry: `src/main.tsx` -> `src/App.tsx`. Routes: `/`, `/admin/login`, `/admin` (admin guarded by Supabase session + `app_metadata.role === 'admin'`).
- `src/lib/supabase/client.ts` creates the client from `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` with placeholder fallbacks.
- Admin managers: `src/pages/admin/{Projects,Skills,Experience,Messages}Manager.tsx`.
- DB schema: `supabase-schema.sql` and `supabase-migration.sql` (run in the Supabase SQL editor). They define `projects`, `skills`, `experience`, `messages` with RLS.

## Setup / env
- Put secrets in `.env` with the `VITE_` prefix (Vite only exposes those to the client). No `.env.example` exists. `.env` is NOT in `.gitignore` — do not commit secrets.
- Admin login requires a Supabase auth user whose `app_metadata.role === 'admin'`. The RLS policies only check `auth.role() = 'authenticated'`, so the admin gate is UI-only; any signed-in user can mutate data via the API.

## Toolchain quirks
- Tailwind v4 does NOT auto-load `tailwind.config.js`. `src/index.css` now wires it via `@config "../tailwind.config.js"`; keep that line or migrate to `@theme`. Removing it makes `text-accent`/`bg-background`/etc. disappear from the build.
- `package.json` sets `"type": "commonjs"`; `tailwind.config.js` still uses ESM `export default`, but Tailwind loads it via `@config` (jiti), so it works. Keep the config as plain JS (no TS-only syntax) so jiti can parse it.
- No `tsconfig.json`; TypeScript is transpiled by esbuild and type errors do not fail the build. Verify with `npm run build` plus manual checks.
- `dist/` is committed to git. Rebuilding changes tracked files; keep build artifacts out of commits unless intentional.

## Data-layer gotchas
- DB skills column is `order_index`; the `Skill` type and managers now use `order_index` end-to-end (fixed). If you add skill-ordering UI, keep using `order_index`.
- The Supabase client falls back to placeholders, so data fetches fail silently outside the admin managers (errors are only logged there).
- Admin managers now surface fetch/save errors via an error banner; keep that pattern for new managers.

## Dead code
- `AboutSection`, `DevTerminal`, and `ThemeToggle` are defined but never imported. Do not assume they are wired into the app.

## Hosting
- `BrowserRouter` requires an `index.html` fallback on static hosts for `/admin` routes. There is no `vercel.json` currently.
