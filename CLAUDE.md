# CLAUDE.md

## Commands

- `pnpm dev` — start dev server (Turbopack)
- `pnpm build` — production build
- `pnpm start` — serve production build
- `pnpm lint` — run ESLint

## Tech

- Next.js 16 App Router, React 19, TypeScript 5
- Tailwind CSS v4 (via PostCSS plugin, config in `globals.css`)
- Radix UI primitives + CVA for component variants
- Framer Motion for animations
- API route (`/api/fire-incidents`) proxies SF DataSF SODA API
- Data: SF Fire Incidents (wr8u-xric) + Building Permits (i98e-djp9)

## Conventions

- Path alias: `@/*` maps to `./src/*`
- All page/component files use `"use client"` directive (except layout.tsx)
- UI components in `src/components/ui/` follow Radix + CVA pattern
- Domain components in `src/components/incidents/`
- Custom hooks in `src/hooks/` encapsulate business logic
- CSS custom properties for theme tokens defined in `src/app/globals.css`
- Dark mode via `next-themes` with class strategy

## Important

- Requires Node.js 22 LTS (Node 25+ breaks SSR)
- No test framework is set up
- No environment variables needed (SODA API is public)
- Don't change dependency versions without asking
- Do NOT deploy until explicitly told to
