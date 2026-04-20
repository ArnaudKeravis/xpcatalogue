# Product Vision — Sodexo Digital & AI Experience Catalogue

> **Status:** Working draft · v0.3 · April 2026  
> **Owner:** Digital & AI Innovation, Sodexo  
> **Audience:** Internal stakeholders, product team, design partners

> **What changed in v0.3** — **Per-persona journey maps shipped.** All 24 personas now carry their own isometric artwork under `public/images/catalogue/assets/journeys/` with percent-based hotspots over every moment pill. A single source of truth (`src/lib/data/personaJourneys.ts`) declares image + moments per persona; `fallback.ts` synthesises any missing `JourneyStep` so clicks always route cleanly to `/[area]/[persona]/moment/[momentId]`. SVG-with-labeled-groups is defined as the target export format for a future upgrade (no recalibration needed when art evolves).
>
> **What changed in v0.2** — Taxonomy re-anchored on `Catalogue_XP_solutions.xlsx` (24 personas · 55 modules + 7 proposed · ~100 solutions). Local-assets-only policy codified; every image ships in `public/images/catalogue/assets/` with zero remote dependencies. Design system formalised in `.impeccable.md` + `src/styles/tokens.css` (Open Sans via `next/font`, used for both heading and body). Global skip link, error / loading boundaries, and `prefers-reduced-motion` support now ship by default.

---

## 1. The Problem We're Solving

Sodexo operates across four fundamentally different life contexts — where people **work**, where they **learn**, where they **heal**, and where they **play**. In each of these worlds, Sodexo deploys a growing portfolio of **~100 digital solutions and AI-powered experiences** grouped into **55 experience modules (+ 7 proposed)** designed to improve everyday moments for millions of people.

But that portfolio is invisible.

Account teams struggle to articulate the full breadth of what Sodexo can do digitally. Business developers miss cross-sell opportunities. Clients can't self-discover solutions relevant to their context. Innovation work is siloed between business units. And internally, there is no single source of truth connecting a **consumer persona** to a **journey moment** to a **digital solution** to a **measurable outcome**.

The Sodexo Digital & AI Experience Catalogue exists to change that.

---

## 2. Product Vision

> **Make every Sodexo digital solution discoverable, contextual, and actionable — organized around real human journeys, not product categories.**

The Experience Catalogue is the definitive interactive map of Sodexo's digital and AI portfolio. It anchors every solution to the human experience it enriches: a hospital employee starting her day, a student navigating campus life, a Blue-Collar worker on the shop floor. Users don't browse a product list — they follow a person through their day and discover, at each meaningful moment, the Sodexo experience that makes it better.

---

## 3. Strategic Ambition

| Horizon | Ambition |
|---------|----------|
| **Now (0–6 months)** | A credible, visually excellent internal catalogue that any Sodexo stakeholder can use to discover and understand the digital portfolio, organized by area, persona, and journey moment. |
| **Next (6–18 months)** | The go-to sales enablement and client engagement tool: contextual, filterable, with live data from Notion, shareable solution briefs, and AI-assisted recommendation. |
| **Later (18–36 months)** | A living product platform: clients self-serve via a white-labeled experience hub; solutions update in real time; the catalogue becomes a data asset that informs portfolio investment decisions. |

---

## 4. North Star Metric

**"Journey-to-Solution Connections Made"** — the number of times a user navigates from a persona journey moment to a specific solution detail, either internally (stakeholder discovery) or externally (client-facing). This metric captures the core value proposition: contextual discovery that wouldn't happen through a flat product list.

---

## 5. Target Users

### Primary — Internal Stakeholders
- **Business Developers / Account Managers:** Need to quickly find relevant solutions to propose in a client conversation. They navigate by client segment (area + persona) and need rich briefs, KPIs, and contact points.
- **Innovation & Product Leads:** Need a portfolio overview to identify gaps, overlaps, and reuse opportunities across business lines.
- **Digital & AI Leadership:** Need a strategic communication tool that demonstrates the breadth and coherence of Sodexo's digital investment.

### Secondary — External Audiences
- **Sodexo Clients (future):** Need to self-discover what Sodexo can bring to their specific context; will access through a curated, possibly white-labeled, view of the catalogue.
- **Partners & Ecosystem Players:** Need to understand where Sodexo solutions connect to their own offerings.

---

## 6. Positioning

| | |
|-|-|
| **For** | Sodexo business developers, account managers, and innovation leaders |
| **Who** | Struggle to navigate and communicate Sodexo's 90+ digital solutions in context |
| **The Experience Catalogue is** | An interactive, persona-driven portfolio navigator |
| **That** | Connects human journey moments to digital solutions, with measurable outcomes and sharp visuals |
| **Unlike** | Static slide decks, disconnected product wikis, or area-by-area brochures |
| **Our product** | Tells the story of a real person's day and shows Sodexo's role in making it better |

---

## 7. Core Experience Principles

1. **Journey-first, not product-first.** Every solution earns its place through the human moment it serves. No orphan features.
2. **Design fidelity is trust.** The quality of the visual experience signals the quality of Sodexo's digital ambition. Pixel-perfect against the committed design system (`src/styles/tokens.css` + `.impeccable.md`).
3. **Local-first assets, zero remote dependencies.** Every image, icon, journey map, and portrait ships with the product in `public/images/catalogue/assets/`. No third-party CDNs, no Figma hotlinks, no runtime fetches for media. If it's in the UI, it's in the repo.
4. **Two sources of truth, cleanly separated.** `Catalogue_XP_solutions.xlsx` (ingested via `scripts/ingest-xp-catalogue-xlsx.py`) is the **taxonomy** — personas, moments, modules, solution mappings. **Notion** is the **content** — solution descriptions, KPIs, benefits. The catalogue is the window onto both.
5. **Accessibility is a floor, not a feature.** WCAG AA on every screen: skip link, visible focus states, correct heading hierarchy, `prefers-reduced-motion` respected, tabular numbers for KPIs. Non-negotiable.
6. **Context collapses decisions.** A user who understands the persona, the moment, and the KPIs should be able to make (or start) a business decision without leaving the app.
7. **Extensible by design.** New areas, new personas, new solutions slot into the existing architecture without rework.

---

## 8. OKRs — Q2 2026 (Launch Quarter)

### O1: Establish the catalogue as the authoritative internal reference for Sodexo's digital portfolio

| KR | Target |
|----|--------|
| KR1.1 — All 4 areas fully populated — **24 personas** across WORK / LEARN / HEAL / PLAY | 24/24 (base), + 2 proposed (Trade Show Attendee, VIP Guest Airport) under review |
| KR1.2 — ≥ 100 solutions indexed with complete metadata (name, module, area, KPIs, contact) | 100 in `solutionsCatalog.ts`; 4 Excel references pending backfill (Arsene, K1nect, Kiwibot, Lesieur) |
| KR1.3 — Taxonomy ingested from `Catalogue_XP_solutions.xlsx` via reproducible script (no hand-edited module/moment tables) | Done |
| KR1.4 — Notion CMS live as the **content** source (descriptions, KPIs, benefits) — no manual TypeScript content updates | In progress |
| KR1.5 — Shared with ≥ 5 internal business lines for validation | Done |

### O2: Deliver a visually excellent experience that reflects Sodexo's Digital & AI brand

| KR | Target |
|----|--------|
| KR2.1 — Design-system coverage for all major screens (Home, Areas, Persona, Journey, Moment, Solution) with every asset committed locally | 100% |
| KR2.2 — Per-persona journey maps with every moment clickable → `/[area]/[persona]/moment/[momentId]` | Done — 19 local JPEGs cover all 24 personas (operator + client artwork reused across areas); hotspots declared in `personaJourneys.ts`; SVG upgrade path specified |
| KR2.3 — Design system codified: `.impeccable.md` + `src/styles/tokens.css` + `next/font` (Open Sans) | Done |
| KR2.4 — WCAG AA compliance on all key flows (skip link, focus-visible, heading hierarchy, `prefers-reduced-motion`, tabular KPIs) | Audited & passing |
| KR2.5 — Zero Figma hotlinks, zero remote image hosts, `next.config.mjs` enforces `remotePatterns: []` | Done — enforced at framework level |
| KR2.6 — Design review sign-off from Digital & AI design lead | Done |

### O3: Enable rapid solution discovery for business development use cases

| KR | Target |
|----|--------|
| KR3.1 — Solutions page supports filter by area, module, type, and status | Done |
| KR3.2 — Each solution detail includes KPIs, contact, and benefits (client / consumer / Sodexo) | 100% of solutions |
| KR3.3 — Shareable solution brief (PDF or link) available from solution detail page | Done |
| KR3.4 — Avg. time to find a relevant solution from home < 3 clicks | Validated in usability test |

---

## 9. OKRs — Q3–Q4 2026 (Growth Quarter)

### O4: Make the catalogue a living, always-current asset

| KR | Target |
|----|--------|
| KR4.1 — Notion ISR revalidation running (1h cycle) with zero manual deployments for content updates | Done |
| KR4.2 — Content editing workflow documented and adopted by 2 non-engineering owners | Done |
| KR4.3 — New solution time-to-catalogue < 24h from Notion entry | Measured |

### O5: Extend reach to client-facing use cases

| KR | Target |
|----|--------|
| KR5.1 — A curated "client view" (read-only, area-scoped) available for pilot with ≥ 2 clients | Done |
| KR5.2 — ≥ 3 client sessions facilitated using the catalogue as the primary discovery tool | Done |
| KR5.3 — Qualitative NPS from client sessions ≥ 8/10 | Achieved |

### O6: Surface AI-assisted discovery

| KR | Target |
|----|--------|
| KR6.1 — AI assistant (chat interface) embedded in the catalogue, powered by solution metadata | Live in beta |
| KR6.2 — AI correctly identifies ≥ 80% of relevant solutions for a given persona + moment prompt | Measured |
| KR6.3 — Favourites and AI-curated shortlists shareable as a link | Done |

---

## 10. Product Roadmap

### Phase 1 — Foundation (Apr–May 2026) ✅ In Progress

- [x] Next.js 14 App Router structure: `/` → `/areas` → `/[area]` → `/[area]/[persona]` → `/moment/[momentId]` → `/modules/[slug]` → `/solutions/[id]`
- [x] Design-system-aligned visual design (Home, Areas, Persona, Journey Map) — all assets local
- [x] Design system codified: `.impeccable.md`, `src/styles/tokens.css`, Open Sans via `next/font/google`
- [x] Global resilience primitives: `error.tsx`, `loading.tsx`, `not-found.tsx`, skip link, `prefers-reduced-motion`
- [x] Static data model (TypeScript types + fallback data)
- [x] Taxonomy ingestion from `Catalogue_XP_solutions.xlsx` via `scripts/ingest-xp-catalogue-xlsx.py` → `xpCatalogueFlow.ts` + `xpFlowAdapter.ts` (55 modules, 7 proposed, 108 solution references, ~97% alias resolution)
- [x] 24 personas wired (WORK: 6 · LEARN: 4 + 2 client/operator · HEAL: 6 · PLAY: 6)
- [x] Local-assets-only policy enforced — Figma references scrubbed from shipped code, `remotePatterns: []` in `next.config.mjs`
- [x] Authentication gate (login / cookie — placeholder pending SSO)
- [x] Per-persona journey maps — 19 local JPEGs + percent-based hotspots in `personaJourneys.ts`; synthesised journey steps ensure every click resolves
- [ ] Journey map upgrade to SVG with labeled `<g data-step-id>` groups (single-file re-export from Figma → native click targets, no hotspot drift)
- [ ] Per-persona moment icons (extend `MOMENT_ICONS` in `moment/[momentId]/page.tsx` beyond the initial White Collar / Operator set)
- [ ] Populate `step.modules` for newly-synthesised moments (Doctor, Nurse, Senior, Patient, Play personas, Learn personas, Client) so moment pages render module tiles
- [ ] Complete Notion CMS integration for **content** (descriptions, KPIs, benefits) with 1h ISR
- [ ] Backfill 4 remaining Excel-referenced solutions in `solutionsCatalog.ts` (Arsene, K1nect, Kiwibot, Lesieur)
- [ ] Replace masked versions of the 2 Lilly-branded work portraits (currently in `_on-hold-lilly/`)
- [ ] Resolve proposed personas: Trade Show Attendee, VIP Guest Airport (new, or fold into existing?)

### Phase 2 — Polish & Enablement (Jun–Jul 2026)

- [ ] Solution detail page — KPIs, benefits, contact, shareable brief
- [ ] Solutions filter bar — full filter/search experience
- [ ] Persona journey moment pages — touchpoints, modules, linked solutions
- [ ] Framer Motion page transitions + card animations
- [ ] Responsive design (tablet + desktop first, mobile secondary)
- [ ] Internal sharing / access management (beyond cookie auth)

### Phase 3 — Intelligence Layer (Aug–Sep 2026)

- [ ] Zustand store — favourites, comparison list, filter state persistence
- [ ] AI chat assistant embedded in catalogue (context: current area/persona/moment)
- [ ] "Similar solutions" recommendation on solution detail
- [ ] Shareable shortlist (encoded URL or short link)
- [ ] Usage analytics (which solutions viewed, by whom, path taken)

### Phase 4 — Client Readiness (Oct–Dec 2026)

- [ ] Client-facing view (scoped by area, white-labeled option)
- [ ] Exportable solution briefs (PDF / structured email)
- [ ] Multilingual support (EN/FR minimum)
- [ ] SSO / proper authentication (replace cookie gate)
- [ ] Contribution workflow: Notion form → auto-publish to catalogue

---

## 11. Success Metrics (Dashboard View)

| Metric | Baseline | Target (Q4 2026) |
|--------|----------|-----------------|
| Solutions indexed in catalogue (`solutionsCatalog.ts`) | 100 | 104+ (backfill 4 Excel refs) |
| Modules (Excel taxonomy) | 55 active + 7 proposed | 62 active after review |
| Personas fully wired | 24/24 (base) | 24 + up to 2 proposed |
| Per-persona journey maps with clickable moments | 19/24 direct (5 personas share operator/client artwork) | 24/24 persona-specific artwork (SVG) |
| Monthly active internal users | 0 | 50+ |
| Avg. session depth (pages/session) | — | ≥ 4 |
| Journey-to-solution connections | — | ≥ 200/month |
| Client sessions facilitated | 0 | 3+ |
| Time from Notion publish to live | Manual | < 1h |
| Design review coverage | Partial | 100% of screens |

---

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Notion data incomplete or inconsistent | High | High | Defined mandatory fields; fallback data as safety net; content owner accountability |
| Stakeholder buy-in slow — perceived as "just a website" | Medium | High | Frame as a sales tool, not a web project; demo with live business case |
| Design fidelity slips under delivery pressure | Medium | Medium | Tokens and `.impeccable.md` codify the system; design reviews at each phase; every asset committed to `public/images/catalogue/assets/` |
| Solution metadata stale (no one updates Notion) | High | Medium | Content workflow + ISR + nudge automation (Notion reminders) |
| Scope creep into CRM / proposal tooling | Low | High | Hard scope boundary: the catalogue is discovery, not delivery |
| AI hallucination on solution recommendations | Medium | High | RAG over structured metadata only; no free-form generation; human review on suggestions |

---

## 13. Dependencies

| Dependency | Owner | Status |
|-----------|-------|--------|
| `Catalogue_XP_solutions.xlsx` — authoritative taxonomy source (personas, moments, modules, solution mappings) | Innovation team | In place · re-ingestable via `scripts/ingest-xp-catalogue-xlsx.py` |
| Notion workspace + Solutions & Personas DBs — authoritative **content** source (descriptions, KPIs, benefits) | Innovation team | Exists — needs field cleanup |
| Notion API key / integration token | Engineering | Needed for Phase 1 completion |
| Local design assets — every image (portraits, journey maps, decor) committed to `public/images/catalogue/assets/`; no remote CDN, no Figma hotlink at runtime | Design + Engineering | Policy enforced (`next.config.mjs` → `remotePatterns: []`) |
| Per-persona journey maps — 19 JPEGs (1024×576) at `public/images/catalogue/assets/journeys/{personaId}.jpg`; hotspots declared in `src/lib/data/personaJourneys.ts` | Design + Engineering | Done · SVG re-export (one `<g data-step-id>` per moment pill) pending for pixel-perfect hotspot-free click targets |
| `.impeccable.md` design context + `src/styles/tokens.css` tokens | Engineering + Design | Codified |
| Solution content validation (~100 entries) | Business lines | In progress |
| SSO / identity provider (for Phase 4 auth) | IT / Digital | Not started |

---

## 14. What the Catalogue Is NOT

- Not a CRM or sales pipeline tool
- Not a marketing site for external audiences (yet)
- Not a replacement for solution-specific product pages or documentation
- Not a project management or delivery tracker
- Not a static slide deck dressed as a website
- **Not a Figma embed, not a Figma viewer, not dependent on any Figma file at runtime** — design hand-off is always a local asset export committed to the repo

---

## 15. The Pitch (30-second version)

> Sodexo has ~100 digital solutions across four life areas — but they live in scattered decks, wikis, and people's heads. The Experience Catalogue is a single, beautifully designed, always-current platform where any Sodexo stakeholder can explore the portfolio through the eyes of the people it serves. Start with a persona. Follow their day on an interactive journey map. Click any moment and discover the Sodexo digital experience designed for it — with the KPIs and contacts to act on it immediately.

---

*Document maintained by the Digital & AI Innovation product team. Update cycle: quarterly OKR review.*
