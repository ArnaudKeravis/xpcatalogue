# Scripts

One-off Python utilities used to (re)generate TypeScript data files from
out-of-band sources. None of these are part of the runtime — they are
developer tools run manually.

## `ingest-xp-catalogue-xlsx.py`

Parses `~/Downloads/Catalogue_XP_solutions.xlsx` (the authoritative taxonomy
maintained by Design & AI) and emits `src/lib/data/xpCatalogueFlow.ts`.

Sheets it reads:

| Sheet         | What it produces                                    |
| ------------- | --------------------------------------------------- |
| `Modules`     | Canonical module list + "new/proposed" flags        |
| `Consumer WK` | WORK / LEARN / HEAL / PLAY consumer moments         |
| `Operator`    | Operator-side moments (one set, reused across areas)|
| `Solutions`   | Per-solution metadata (module, type, status, …)     |

### When to run

- Whenever the `.xlsx` is updated by the taxonomy owner.
- Before a release, to reconcile new solutions / modules.

### How

```bash
python3 scripts/ingest-xp-catalogue-xlsx.py
```

After running, `git diff src/lib/data/xpCatalogueFlow.ts` and commit.

## `generate-static-personas.py`

Legacy generator for the `reference/static-home/` HTML prototype. **Not used
for the Next.js app.** Kept only while the prototype is still a design
reference. Do not run unless you intentionally want to update the static site.

## Conventions

- All scripts write into the repo; the diff is the audit trail.
- No runtime imports — these run via `python3`, not `npx`.
- If you add a script, add it to this README.
