# Projexi — Global Business Network

A Vite + React + TypeScript web app styled with Tailwind CSS, using Supabase for backend services and authentication.

## Features

- React 18 with TypeScript and React Router
- Tailwind CSS utility-first styling
- Supabase SDK integration
- ESLint + TypeScript ESLint for linting
- Vite for fast dev/build/preview

## Requirements

- Node.js 18+
- npm 9+
- Supabase project (for API URL and Anon key)

## Quick start

```bash
# 1) Install dependencies
npm install

# 2) Create environment file
# Copy your Supabase credentials into .env
# (See Environment variables section)

# 3) Start the dev server
npm run dev

# 4) Type-check and lint (optional)
npm run typecheck
npm run lint

# 5) Build and preview
npm run build
npm run preview
```

## Scripts

- `npm run dev` — Start Vite dev server
- `npm run build` — Build production bundle
- `npm run preview` — Preview the production build
- `npm run lint` — Lint codebase
- `npm run typecheck` — TypeScript project type-check

## Environment variables

Create a `.env` in the project root with at least:

```bash
VITE_SUPABASE_URL=<your_supabase_project_url>
VITE_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

Notes:
- Variables prefixed with `VITE_` are exposed to the client at build time.
- Do not commit real secrets. `.env` is gitignored.

## Project structure

```
wtpro/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tailwind.config.js
├─ postcss.config.js
├─ eslint.config.js
├─ tsconfig.json
├─ tsconfig.app.json
├─ tsconfig.node.json
├─ .env                         # local only, not committed
├─ supabase/
│  └─ migrations/
│     ├─ 20251027045720_add_community_and_admin_tables.sql
│     └─ 20251027050418_allow_admin_role.sql
└─ src/
   ├─ App.tsx
   ├─ main.tsx
   ├─ index.css
   ├─ vite-env.d.ts
   ├─ components/
   │  └─ Layout.tsx
   ├─ contexts/
   │  └─ AuthContext.tsx
   ├─ lib/
   │  └─ supabase.ts            # Supabase client setup
   ├─ types/
   │  ├─ lordicon.d.ts
   │  └─ lottie-player.d.ts
   └─ pages/
      ├─ AddProduct.tsx
      ├─ Admin.tsx
      ├─ Community.tsx
      ├─ Events.tsx
      ├─ FindClients.tsx
      ├─ FindInvestors.tsx
      ├─ IdeaDetails.tsx
      ├─ Landing.tsx
      ├─ Messages.tsx
      ├─ MyIdeas.tsx
      ├─ MyProducts.tsx
      ├─ Opportunities.tsx
      ├─ Partnerships.tsx
      ├─ Portfolio.tsx
      ├─ PostIdea.tsx
      ├─ Recommendations.tsx
      ├─ Settings.tsx
      ├─ SignIn.tsx
      ├─ SignUp.tsx
      └─ dashboards/
         ├─ DealerDashboard.tsx
         ├─ EntrepreneurDashboard.tsx
         └─ InvestorDashboard.tsx
```

## Tech stack

- React 18, React Router DOM
- TypeScript 5
- Vite 5
- Tailwind CSS 3
- Supabase JS 2
- ESLint 9 (typescript-eslint, react-hooks, react-refresh)

## Supabase

- Client initialization: `src/lib/supabase.ts`
- SQL migrations: `supabase/migrations/*.sql`

Suggested workflow:
- Create a Supabase project and note URL and Anon key.
- Put them in `.env` (see above).
- Apply SQL in `supabase/migrations` to your database if needed, or recreate equivalent schema via Supabase Studio.

## Routing

- Pages live in `src/pages` and nested under `dashboards` for role-specific views.
- `App.tsx` defines the app shell and routes.

## Styling

- Tailwind is configured via `tailwind.config.js` with content scanning for `index.html` and `src/**/*.{ts,tsx}`.
- Global styles in `src/index.css`.

## Linting and type safety

- ESLint config in `eslint.config.js` (includes React Hooks and React Refresh rules).
- Type checking with `npm run typecheck`.

## Deployment notes

- Build with `npm run build`; output goes to `dist/`.
- Ensure environment variables are set in your hosting provider (as `VITE_*`).

## Contributing

- Create feature branches and open PRs.
- Keep components small and colocate page-specific components near their pages when reasonable.

## License

Proprietary. All rights reserved, unless otherwise specified by the repository owner.
