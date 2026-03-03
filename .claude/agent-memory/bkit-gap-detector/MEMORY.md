# Gap Detector Memory - paran-quote-site

## Project Info
- Design doc: `ParanCompany_v7_VersionB.md` (project root, NOT in docs/)
- CLAUDE.md says docs/ but actual path is project root
- Tech: Next.js 14 App Router + TypeScript + Tailwind + Supabase (quote_site schema)
- Supabase project ID: aiarnrhftmuffmcninyl
- Dev port: 4000 (npm run dev -p 4000)

## Analysis History
- v1 (2026-02-11): 63% - Missing Supabase, admin, P5-P8
- v2 (2026-02-11): 93% - Full implementation confirmed
- v3 (2026-02-11): 94% - Price filter, confetti, GNB fix added; Drawer removed; masonry re-evaluated

## Key Architecture Patterns
- siteDataStore: Zustand store with Supabase fetch + static constant fallback
- SiteDataLoader: Layout-level data preloader component
- lib/queries.ts: 18 CRUD functions with mapRow<T> snake->camelCase converter
- Separate page ONLY for service detail (P3) -- Drawer.tsx REMOVED
- drawerStore.ts also REMOVED (only cartStore + siteDataStore remain)
- Admin pages use inline SlidePanels (not shared component)
- Button system: 6 variants + 3 sizes via @layer components in globals.css

## Corrected Counts (v3)
- Total source files: 35 (NOT 42 as v1 report claimed)
- CRUD functions: 18 (NOT 17 as v2 claimed -- fetchPortfolios was missed)
- Stores: 2 (NOT 3 -- drawerStore removed)
- Components: 12 (NOT 13 -- Drawer.tsx removed, only Toast.tsx in ui/)

## Remaining Gaps (for future analysis)
- Admin Auth (role-based access) - INTENTIONALLY DEFERRED
- CREATE operations for services/packages/portfolios - buttons exist but no functionality
- .env.example missing
- Dynamic badge count in admin sidebar (hardcoded "3")
- Masonry layout: grid used instead of CSS columns-3 (react-masonry-css not installed)
- Scale slider in P4 build wizard not implemented
- Custom delete modal: window.confirm used instead of styled modal

## Resolved Since v2
- Price filter: IMPLEMENTED in services/page.tsx (5-tier PRICE_RANGES)
- Confetti: IMPLEMENTED via canvas-confetti in complete/page.tsx
- GNB transition: FIXED with duration-500 ease-in-out
