#!/usr/bin/env python3
"""Apply module → solution lists from `XP catalogue.csv` (QA / S18 source) onto
`xpCatalogueFlow.ts` by updating the `modules` array only.

The CSV uses catalogue naming; the flow file uses journey Excel naming. Rows are
mapped to TypeScript `name` strings (exact casing as in the file) via:
  - case-insensitive equality when unambiguous
  - MANUAL_CSV_TO_TS for renamed modules

When several CSV rows map to the same TS module name, solution lists are merged
(first-seen order, deduplicated).
"""

from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path
from collections import OrderedDict

REPO = Path(__file__).resolve().parent.parent
DEFAULT_CSV = Path.home() / "Downloads" / "XP catalogue.csv"
TARGET_TS = REPO / "src" / "lib" / "data" / "xpCatalogueFlow.ts"

# CSV module title → exact `name` in xpCatalogueFlow.modules (must match file)
MANUAL_CSV_TO_TS: dict[str, str] = {
    "Robotic Cooking": "Robot cooking",
    "Food 3D printing": "3D Printing",
    "Autonomous Store / Micro-market": "Store / micromarket",
    "Autonomous Fridge": "Store / micromarket",
    "Alternative Protein": "Alternative F&B",
    "Beverage Self-pouring": "Advanced / smart vending",
    "Customer Interaction Support": "Reception",
    "Digital Food Ordering": "Catering",
    "Disinfection in Healthcare": "Hygiene & Sanitation",
    "F&B Experience": "Snacking",
    "Feedback & behavioral analysis": "Feedback",
    "Floor Cleaning": "Cleaning efficiency",
    "Washroom Cleaning": "Cleaning efficiency",
    "Window Cleaning": "Cleaning efficiency",
    "Sustainable Cleaning/Bio Cleaning": "Cleaning efficiency",
    "Food Waste Management": "Waste management",
    "Waste & Resource Performance": "Waste management",
    "Footfall & Flow Intelligence": "Footfall & Space analytics",
    "Footfall & Market Intelligence": "Real time insights",
    "Performance & KPI Cockpit": "Real time insights",
    "Proposal & Win-rate Acceleration": "Real time insights",
    "Maintenance Management": "Maintenance & Asset mgmt",
    "Pricing Assistant": "Price management",
    "Supply Optimization": "Menu planning",
    "Robotic Kitchen Back of House": "Automated food processing",
    "Run the Site (Ops Cockpit)": "IOT",
    "Safety & Compliance Monitoring": "Food Safety",
    "Service Robots": "Robots",
    "Sustainability & CSR Dashboarding": "Sustainability measured",
    "Carbon Management": "Sustainability measured",
    "Sustainable Packaging & Reusable Management": "Circular & Upcycling",
    "Logistics support": "Work Order Management",
    "Workforce Analytics & Retention": "Workforce management",
    "Food as Medicine": "Snacking",
}


def load_csv(path: Path) -> list[dict]:
    rows: list[dict] = []
    with open(path, encoding="utf-8") as f:
        r = csv.reader(f, delimiter=";")
        next(r, None)
        for row in r:
            if not row or not row[0].strip():
                continue
            raw = row[2] if len(row) > 2 else ""
            solutions = [x.strip() for x in raw.split(",") if x.strip()]
            rows.append(
                {
                    "csv_name": row[0].strip(),
                    "solutions": solutions,
                }
            )
    return rows


def find_modules_array_span(ts_text: str) -> tuple[int, int]:
    """Return [start, end) slice indices: start = index of `[` after `"modules":`,
    end = index just after the matching `]` that closes that array."""
    m = re.search(r"export const XP_CATALOGUE_FLOW:\s*XpCatalogueFlow\s*=\s*\{", ts_text)
    if not m:
        raise SystemExit("could not find XP_CATALOGUE_FLOW")
    i = ts_text.find('"modules":', m.end())
    if i < 0:
        raise SystemExit("could not find modules key")
    start = ts_text.find("[", i)
    if start < 0:
        raise SystemExit("could not find [ after modules")
    depth = 0
    j = start
    while j < len(ts_text):
        c = ts_text[j]
        if c == "[":
            depth += 1
        elif c == "]":
            depth -= 1
            if depth == 0:
                j += 1
                break
        j += 1
    return start, j


def main() -> int:
    csv_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_CSV
    if not csv_path.exists():
        sys.stderr.write(f"error: CSV not found: {csv_path}\n")
        return 2

    ts_text = TARGET_TS.read_text(encoding="utf-8")
    start, end = find_modules_array_span(ts_text)
    inner = ts_text[start + 1 : end - 1]
    modules: list[dict] = json.loads("[" + inner.strip().rstrip(",") + "]")

    # Index TS display names (exact strings)
    ts_names = {m["name"] for m in modules}

    def resolve_ts_name(csv_name: str) -> str | None:
        if csv_name in MANUAL_CSV_TO_TS:
            return MANUAL_CSV_TO_TS[csv_name]
        for n in ts_names:
            if n.lower() == csv_name.lower():
                return n
        return None

    # csv_ts_name -> ordered unique solutions
    merged: "OrderedDict[str, list[str]]" = OrderedDict()

    for row in load_csv(csv_path):
        ts_name = resolve_ts_name(row["csv_name"])
        if not ts_name:
            sys.stderr.write(
                f"warning: no TS mapping for CSV module {row['csv_name']!r} — skipped\n"
            )
            continue
        if ts_name not in ts_names:
            sys.stderr.write(
                f"warning: mapped name {ts_name!r} not in modules — skipped\n"
            )
            continue
        if ts_name not in merged:
            merged[ts_name] = []
        seen = set(merged[ts_name])
        for s in row["solutions"]:
            if s not in seen:
                seen.add(s)
                merged[ts_name].append(s)

    updated = 0
    for m in modules:
        if m["name"] in merged:
            m["solutions"] = merged[m["name"]]
            updated += 1

    dumped = json.dumps(modules, indent=2, ensure_ascii=False).split("\n")
    if not dumped or dumped[0] != "[" or dumped[-1] != "]":
        raise SystemExit("unexpected JSON array shape from dumps")
    body_lines = dumped[1:-1]
    indented = "\n".join("    " + ln for ln in body_lines)
    # Preserve `  ],` style closing: `end` is the index *after* the modules `]`.
    new_ts = ts_text[: start + 1] + "\n" + indented + "\n  ]" + ts_text[end:]

    TARGET_TS.write_text(new_ts, encoding="utf-8")
    print(f"wrote {TARGET_TS.relative_to(REPO)} — updated solutions on {updated} module row(s) from {csv_path.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
