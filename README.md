# Sodexo Experience Catalogue

Interactive catalogue of Sodexo's 90+ digital & AI solutions, browsable by
**area** (WORK / LEARN / HEAL / PLAY) → **persona** → **journey moment** →
**module** → **solution**.

- Product vision, OKRs, roadmap: see [`PRODUCT_VISION.md`](./PRODUCT_VISION.md)
- Design-language guardrails (per `/impeccable`): see [`.impeccable.md`](./.impeccable.md)

## Stack

- **Next.js 14** App Router + TypeScript
- **Tailwind CSS** + CSS variables in `src/styles/tokens.css`
- **Phosphor Icons** for all UI iconography (no emoji in UI)
- **Notion** as eventual CMS (`src/lib/notion.ts`) — currently stubbed with
  `FALLBACK_DATA` so the app runs offline
- No Figma links at runtime — every asset is local under
  `public/images/catalogue/assets/`

## Getting started

```bash
npm install
npm run dev           # http://localhost:3000
npm run lint
npx tsc --noEmit      # type-check
npm run build         # production bundle
```

Auth is a single shared password behind cookie-based middleware
(`src/middleware.ts`). Default flow: `/login` → `/` → `/areas` →
`/[area]` → `/[area]/[persona]` → `/[area]/[persona]/moment/[momentId]` →
`/modules/[slug]` → `/solutions/[id]`.

## Repo layout

```
.
├── PRODUCT_VISION.md          Vision, OKRs, roadmap
├── .impeccable.md             Design-language rules
├── scripts/                   Ingestion + generator utilities (python)
│   ├── ingest-xp-catalogue-xlsx.py     XLSX → src/lib/data/xpCatalogueFlow.ts
│   └── generate-static-personas.py     Legacy — updates reference/static-home
├── reference/
│   └── static-home/           Legacy HTML/CSS prototype kept for reference
├── public/
│   └── images/catalogue/
│       ├── assets/
│       │   ├── home/          Home-page artwork (hero, bokeh, sparkle…)
│       │   ├── areas/         Isometric area maps (work/learn/heal/play)
│       │   ├── personas/      24 persona portraits + background dots
│       │   ├── journeys/      19 per-persona journey-map JPEGs
│       │   ├── decor/         Per-area page-level decoration
│       │   ├── ui/            UI chrome (chevrons, dividers, back arrow)
│       │   ├── brand/         Sodexo logotype + wordmark
│       │   ├── _archive/      Deprecated artwork (kept for history)
│       │   ├── _on-hold-lilly/ 2 Lilly-branded portraits pending replacement
│       │   └── _legacy/       Prototype-only assets not referenced by the app
│       └── placeholder-*.svg  Fallback shapes
└── src/
    ├── app/                   Next.js App Router
    │   ├── page.tsx                            Home
    │   ├── areas/page.tsx                      Areas isometric hub
    │   ├── [area]/page.tsx                     Personas grid
    │   ├── [area]/[persona]/page.tsx           Persona profile + journey
    │   ├── [area]/[persona]/moment/[momentId]  Moment detail + modules
    │   ├── modules/[slug]/page.tsx             Module aggregation
    │   └── solutions/[id]/page.tsx             Solution detail
    ├── components/
    │   ├── catalogue/         Catalogue-specific components
    │   └── layout/            Navbar etc.
    ├── lib/
    │   ├── data/              Typed static data + types
    │   │   ├── types.ts
    │   │   ├── fallback.ts               Assembly of FALLBACK_DATA
    │   │   ├── personaDefinitions.ts     24 personas (profile, quote, pains…)
    │   │   ├── personaJourneys.ts        Per-persona journey maps + hotspots
    │   │   ├── personaPortraits.ts       Portrait URL resolver
    │   │   ├── solutionsCatalog.ts       Solution catalog (mirror of XLSX)
    │   │   ├── xpCatalogueFlow.ts        Raw flow from XLSX ingestion
    │   │   └── xpFlowAdapter.ts          Flow → modules / journey steps
    │   ├── queries/           Pure filter + resolver helpers
    │   │   ├── filterSolutions.ts
    │   │   └── journey.ts
    │   ├── notion.ts          Notion CMS fetch (falls back to FALLBACK_DATA)
    │   └── utils/cn.ts        Tailwind class merge helper
    ├── styles/tokens.css      Design-system CSS variables
    └── middleware.ts          Cookie auth
```

## Conventions

- **Naming** — `PascalCase` for components/types, `camelCase` for
  functions/hooks/vars, `kebab-case` for route segments + CSS classes, `use`
  prefix for hooks.
- **Components** — typed props, named export, Tailwind via `cn()` helper,
  presentational only (no direct Notion/API calls).
- **Data fetching** — `async/await` in `page.tsx` (server-side);
  `revalidate: 3600` ISR; every page works offline via `FALLBACK_DATA`.
- **Icons** — `@phosphor-icons/react` only; never emoji for UI icons
  (allowed as inline punctuation in copy).
- **Assets** — local only under `public/images/catalogue/assets/{bucket}/`.
  No Figma or remote hotlinks.

## Working with Notion (optional)

When `NOTION_TOKEN` + database IDs are set as env vars, `src/lib/notion.ts`
will fetch live data instead of `FALLBACK_DATA`. Essential field schemas for
the **Solutions** and **Personas** DBs are documented in
[`.cursor/rules/sodexo-experience-catalogue.mdc`](./.cursor/rules/sodexo-experience-catalogue.mdc).

## Working with Figma (design only)

The Figma file (`JW5MGQvB3itG9AXBKVVnuO`) is used at **design time** only —
via the Figma MCP plugin during development. No Figma URLs or references
ship in the runtime bundle; every asset is downloaded and stored locally.
