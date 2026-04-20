# `static-home/` — legacy static prototype

**Not shipped. Not imported. Not routed.** This folder is a legacy HTML/JS
prototype of the catalogue that predates the Next.js app. It is kept in the
repo only as a visual reference while the live app in `src/` reaches parity.

## What's in here

- `index.html` — single-page prototype
- `home-static.css` — prototype styles
- `catalog-solutions.js` — hard-coded solutions list (snapshot)
- `personas-full.js` — hard-coded personas (snapshot)
- `assets/` — images local to the prototype

## Do NOT

- Import anything from this folder into `src/`.
- Treat this as a source of truth — the Next.js app + `Catalogue_XP_solutions.xlsx`
  are authoritative.
- Link users here from the live app.

## Safe to delete when

- All prototype screens have a production counterpart in `src/app/`.
- No external stakeholder still references the prototype URL.

It is ~70 MB and can be removed in a single commit when the above is true.
