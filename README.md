# Nereus

Nereus is a Next.js 16 app that experiments with prediction-market style interfaces on top of the Sui blockchain tooling. The UI is built with the App Router, Zustand for state, and Mysten's dApp Kit for wallet connectivity.

## Prerequisites

- Node.js 18.18+ (Next.js 16 requirement) or Node.js 20 LTS
- `pnpm` ≥ 9.x (preferred) – run `npm install -g pnpm` if you do not have it yet
- A Sui wallet for end-to-end testing (e.g. Sui Wallet, Ethos)

## Quick Start

```bash
pnpm install
cp .env.example .env.local # edit values as needed
pnpm dev
```

Then visit [http://localhost:3000](http://localhost:3000). The app auto-reloads when you edit files inside `app/` or `components/`.

### Useful Scripts

- `pnpm dev` – start the Next.js dev server
- `pnpm lint` – run ESLint with the repo config
- `pnpm build` – create a production build
- `pnpm start` – serve the production build locally

## Environment

Copy `.env.example` to `.env.local` and override as needed:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

When `NEXT_PUBLIC_API_URL` is omitted the client falls back to `http://localhost:3001/api`. In development, API calls are currently mocked via `MockApiService` (`services/api-service.ts`). Set `NODE_ENV=production` to switch to the live REST client.

## Project Layout

```text
app/              # Next.js App Router pages and layout
components/       # Reusable UI building blocks
lib/              # Shared utilities (category helpers, etc.)
services/         # API clients and mock services
stores/           # Active Zustand stores used by the UI layer
store/            # Legacy/unused Zustand experiment (cleanup pending)
types/            # Shared TypeScript types
```

Stateful UI logic lives in `stores/ui-store.ts`. There is an older `store/display-store.ts` that is not referenced; consider consolidating under `stores/` before shipping.

## Tooling Notes

- Query caching uses `@tanstack/react-query` – the provider is created in `app/providers.tsx`.
- Wallet integration is handled by `@mysten/dapp-kit`. Network URLs default to Sui devnet; adjust in `app/providers.tsx` as needed.
- Tailwind CSS v4 PostCSS pipeline is ready but not yet customised; add tokens and utilities in `app/globals.css`.

## Next Steps for Contributors

1. Decide whether to keep `pnpm` or `npm` and remove the unused lockfile (`package-lock.json`) to avoid accidental dependency drift.
2. Align on a single store directory (`stores/`) and delete or migrate the legacy `store/` module.
3. Flesh out API integrations in `services/api-service.ts` and replace mock data once an endpoint is available.

Questions? Open an issue or drop a note in the team chat so we can un-block you quickly.
