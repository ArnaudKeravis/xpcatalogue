# Archived assets

Nothing in this folder is served by the app. It is a holding area for:

- **Superseded artwork** — e.g. the old area-level journey SVGs
  (`journey-work-*.svg`, `journey-learn.svg`, …) replaced by the per-persona
  JPEGs under `../journeys/`.
- **Duplicate imports** — e.g. `duplicate-of-play-client.png` kept until we
  confirm the canonical copy is correct everywhere.
- **Orphans** — assets that were exported at some point but are no longer
  referenced anywhere in the catalogue (e.g. `orphan-not-in-xp-catalogue.png`).

## Policy

- Nothing in `_archive/` may be linked from `src/**`.
- If you need an archived asset back, **move it out** of `_archive/` (don't
  reference it in place) and update this README so the folder stays accurate.
- Anything unused for > 2 releases can be deleted.

## Why keep them at all

The catalogue is still stabilising — keeping superseded artwork nearby makes
it easier to diff, restore, or compare against the newer per-persona maps
without going through git history.
