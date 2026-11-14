# Abdelkarim Ait Yahia - Portfolio

Personal portfolio website showcasing projects, experience, and contact information.

Live site: https://abdelkarimaityahia.is-a.dev/

## Badges

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?logo=vercel&logoColor=white)

## Screenshot

<!-- TODO: add screenshot -->

## Features

- Animated hero, experience timeline, stacked project cards, and contact section
- Link-in-bio page at `/links` with theme-aware, animated cards
- Admin dashboard for managing projects, skills, experience, messages, and analytics
- Visitor analytics (sessions, countries, devices, browsers, referrers)
- Contact form that forwards messages to Telegram
- Dark/light theme toggle with saved preference
- SEO: meta tags, Open Graph, Twitter cards, JSON-LD, sitemap, robots.txt
- Accessibility: focus-visible rings, reduced-motion support, ARIA labels
- Smooth scrolling with Lenis

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Vite 8, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion, Lenis |
| Icons | Lucide React, React Icons |
| Routing | React Router 7 |
| Backend | Supabase (Auth, Postgres) |
| Serverless | Vercel Functions (@vercel/node) |
| Notifications | Telegram Bot API |
| Deployment | Vercel |

## Project structure

```
.
├── api/                 # Vercel serverless functions (contact, analytics tracking)
├── public/              # Static assets, favicon, sitemap, robots.txt
├── src/
│   ├── components/      # UI sections and layout components
│   ├── context/         # Theme context (dark/light)
│   ├── data/            # Static data (profile, projects, experience, stack, links)
│   ├── hooks/           # Custom hooks (Lenis smooth scroll)
│   ├── lib/             # Supabase client, analytics client
│   ├── pages/           # Route pages (home, admin, /links)
│   └── main.tsx         # Entry point
├── supabase-schema.sql
├── supabase-migration.sql
├── supabase-analytics.sql
├── vercel.json
└── vite.config.ts
```

## Getting started

Prerequisites: Node.js 20.19 or newer (Vite 8 requirement).

```bash
git clone https://github.com/karimait12/portfolio.git
cd portfolio
npm install
```

Create a `.env` file in the project root (see Environment variables below), then:

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run preview  # preview the production build
```

## Environment variables

| Variable | Purpose | Where used |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL | client |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | client |
| `SUPABASE_URL` | Supabase project URL (server) | server |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | server |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token for contact notifications | server |
| `TELEGRAM_CHAT_ID` | Telegram chat ID for contact notifications | server |

Variables prefixed with `VITE_` are exposed to the browser. The others are server-only.

## Database (Supabase)

1. Create a Supabase project.
2. Open the SQL Editor and run `supabase-schema.sql` (creates `projects`, `skills`, `experience`, `messages` with RLS).
3. Run `supabase-analytics.sql` (creates `visitor_sessions` with RLS).
4. `supabase-migration.sql` contains the same base tables plus sample data; use it instead of `supabase-schema.sql` only if you want the seed data.

## Deployment (Vercel)

1. Import the repository in Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add the environment variables from the table above.
6. Deploy. The `/api` functions run only on Vercel (not in `npm run dev` without the Vercel CLI).

## Contact

- Live site: https://abdelkarimaityahia.is-a.dev/
- GitHub: https://github.com/karimait12
- LinkedIn: https://ma.linkedin.com/in/abdelkarim-ait-yahia-ba2ab33a7

## License

No LICENSE file is present in this repository. Choose one (e.g. MIT) and add it if you want to define terms of use.
