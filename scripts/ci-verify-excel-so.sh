#!/usr/bin/env bash
# Regenerate Modules + Solutions SoT from Excel and enforce Modules↔Solutions token alignment.
# Usage:
#   - Place Classeur workbooks under excel-source/ (see excel-source/README.md), or
#   - Set EXCEL_SOLUTIONS_PATH and EXCEL_MODULES_PATH to absolute paths.
# Optional:
#   - CHECK_GENERATED_DIFF=1 — fail if generated .ts files differ from git (run after generators).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SOL="${EXCEL_SOLUTIONS_PATH:-}"
MOD="${EXCEL_MODULES_PATH:-}"

if [[ -z "$SOL" && -f "$ROOT/excel-source/Classeur Solutions.xlsx" ]]; then
  SOL="$ROOT/excel-source/Classeur Solutions.xlsx"
fi
if [[ -z "$MOD" && -f "$ROOT/excel-source/Classeur Modules.xlsx" ]]; then
  MOD="$ROOT/excel-source/Classeur Modules.xlsx"
fi

if [[ -z "$SOL" || ! -f "$SOL" ]]; then
  echo "ci-verify-excel-so: No Solutions workbook — skip (set EXCEL_SOLUTIONS_PATH or add excel-source/Classeur Solutions.xlsx)."
  exit 0
fi
if [[ -z "$MOD" || ! -f "$MOD" ]]; then
  echo "ci-verify-excel-so: No Modules workbook — skip (set EXCEL_MODULES_PATH or add excel-source/Classeur Modules.xlsx)."
  exit 0
fi

echo "ci-verify-excel-so: Solutions → $SOL"
echo "ci-verify-excel-so: Modules   → $MOD"

python3 scripts/generate_modules_excel_sot.py "$MOD"
python3 scripts/generate_solutions_excel_sot.py "$SOL" --modules "$MOD" --strict

if [[ "${CHECK_GENERATED_DIFF:-}" == "1" ]]; then
  git diff --exit-code \
    src/lib/data/modulesExcelSoT.generated.ts \
    src/lib/data/solutionsExcelSoT.generated.ts || {
    echo "ci-verify-excel-so: Generated TypeScript differs from committed files. Run the generators locally and commit." >&2
    exit 1
  }
fi

echo "ci-verify-excel-so: OK."
