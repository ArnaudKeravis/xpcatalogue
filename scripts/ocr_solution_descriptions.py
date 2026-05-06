#!/usr/bin/env python3
"""
OCR Sodexo solution description PNGs → emit solutionOcrOverrides.generated.ts

Reads PNGs from --input-dir (default: OneDrive Solution_Descriptions folder).
Maps solution_<Name>.png → catalogue id via solutionsCatalog.ts name/id matching.

Requires: pip install easyocr
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG_TS = ROOT / "src/lib/data/solutionsCatalog.ts"
OUT_TS = ROOT / "src/lib/data/solutionOcrOverrides.generated.ts"


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", (s or "").lower())


def parse_catalog(path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8")
    entries: list[dict] = []
    for m in re.finditer(r'id:\s*"([^"]+)"\s*,\s*\n\s*name:\s*"([^"]+)"', text):
        entries.append({"id": m.group(1), "name": m.group(2)})
    return entries


def stem_from_filename(name: str) -> str:
    base = Path(name).stem
    if base.lower().startswith("solution_"):
        base = base[9:]
    return base.strip()


# When automatic matching fails, map filename stem → catalogue id (re-run full OCR after edits).
STEM_MANUAL_TO_ID: dict[str, str] = {
    "Alberts": "albertsSmoothie",
    "Aquablu_IH": "aquablu",
    "Blue_Ocean": "blueOceanUvd",
    "Costa_Alto_machine": "costaCoffeeMachine",
    "Greese_to_Goodness": "greaseToGoodness",
    "In_reach_Smart_Fridge": "inReach",
    "Nando_AI": "regoAi",
    "Wando_App": "wandoAnalytics",
}


def resolve_id(stem: str, catalog: list[dict]) -> str | None:
    """Match filename stem (e.g. 'B2B Platform', '4Site', 'ABS_Urizap') to catalogue id."""
    variants = [
        stem,
        stem.replace("_", " "),
        stem.replace("_", ""),
        re.sub(r"([a-z])([A-Z])", r"\1 \2", stem.replace("_", " ")),
    ]
    manual = STEM_MANUAL_TO_ID.get(stem) or STEM_MANUAL_TO_ID.get(stem.replace(" ", "_"))
    if manual and any(rec["id"] == manual for rec in catalog):
        return manual

    for v in variants:
        n = norm(v)
        if not n:
            continue
        for rec in catalog:
            if norm(rec["name"]) == n:
                return rec["id"]
            if norm(rec["id"]) == n:
                return rec["id"]
        # camelCase stem → split words rough
        spaced = re.sub(r"([a-z])([A-Z])", r"\1 \2", stem.replace("_", " "))
        nn = norm(spaced)
        for rec in catalog:
            if norm(rec["name"]) == nn:
                return rec["id"]
    return None


def clean_text(t: str) -> str:
    t = t.replace("_", " ").replace("  ", " ")
    t = re.sub(r"[ \t]+", " ", t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    return t.strip()


def parse_ocr_body(text: str) -> dict:
    """
    Extract Context, Description, Benefits, KPI-ish lines, Contact from slide OCR.
    Layout varies; use tolerant regexes.
    """
    raw = text
    # Drop hashtag / region noise at top for section detection (keep in description if needed)
    ctx = ""
    desc = ""
    ben_client = ""
    ben_consumer = ""
    ben_sodexo = ""
    kpis: list[dict] = []
    contact = ""

    # Context
    m_ctx = re.search(
        r"(?:^|\n)Context\s+(.+?)(?=\n\s*Description\s+|\n\s*Benefits\s+|$)",
        raw,
        re.DOTALL | re.IGNORECASE,
    )
    if m_ctx:
        ctx = clean_text(m_ctx.group(1))
        ctx = re.sub(r"^[:;\s]+", "", ctx)

    # Description
    m_desc = re.search(
        r"Description\s+(.+?)(?=\n\s*Benefits\s+|\n\s*Deployment|$)",
        raw,
        re.DOTALL | re.IGNORECASE,
    )
    if m_desc:
        desc = clean_text(m_desc.group(1))

    # Benefits: labels Client / Consumer / Sodexo then three blocks (best-effort)
    m_ben = re.search(
        r"Benefits\s+(.+?)(?=\n\s*Deployment|\n\s*Contacts?\s|$)",
        raw,
        re.DOTALL | re.IGNORECASE,
    )
    if m_ben:
        block = clean_text(m_ben.group(1))
        # Strip standalone column labels
        lines = [ln.strip() for ln in block.split("\n") if ln.strip()]
        lines = [ln for ln in lines if ln.lower() not in ("client", "consumer", "sodexo")]
        # Typical slide: 3 benefit lines + optional 4th continuation for column 1
        if len(lines) >= 4 and not re.search(r"[.!?]$", lines[3]):
            ben_client = clean_text(lines[0] + " " + lines[3])
            ben_consumer = clean_text(lines[1])
            ben_sodexo = clean_text(lines[2])
        elif len(lines) >= 3:
            ben_client, ben_consumer, ben_sodexo = clean_text(lines[0]), clean_text(lines[1]), clean_text(lines[2])
        elif len(lines) == 2:
            ben_client, ben_consumer = clean_text(lines[0]), clean_text(lines[1])
        elif len(lines) == 1:
            ben_client = clean_text(lines[0])

    # KPI section
    m_dep = re.search(
        r"Deployment[^\n]*(.+?)(?=\n\s*Contacts?\s|$)",
        raw,
        re.DOTALL | re.IGNORECASE,
    )
    if m_dep:
        dep_text = m_dep.group(1)
        # Pairs like "Clients: 20+" or "85%+ report"
        for line in re.split(r"[\n•]", dep_text):
            line = line.strip()
            if not line or len(line) < 3:
                continue
            kv = re.match(r"^([^:]{2,40}):\s*(.+)$", line)
            if kv:
                kpis.append({"v": clean_text(kv.group(2))[:40], "l": clean_text(kv.group(1))[:48]})
            else:
                # number-first snippets
                nm = re.search(r"(\d[\d+.,]*[%+]?|\+\d+)\s+(.+)", line)
                if nm:
                    kpis.append({"v": nm.group(1), "l": clean_text(nm.group(2))[:48]})
        kpis = kpis[:8]

    # Contact
    m_co = re.search(r"Contacts?\s+([A-Za-z][^\n]{2,120})", raw, re.IGNORECASE)
    if m_co:
        contact = clean_text(m_co.group(1))
        contact = re.sub(r"\s*Deployment.*$", "", contact, flags=re.DOTALL | re.IGNORECASE)

    # Fallbacks
    if not desc and not ctx:
        desc = clean_text(raw)
    elif not desc and ctx:
        desc = ctx

    return {
        "context": ctx,
        "description": desc,
        "benefits": {"client": ben_client, "consumer": ben_consumer, "sodexo": ben_sodexo},
        "kpis": kpis,
        "contact": contact,
    }


def ts_escape(s: str) -> str:
    return json.dumps(s, ensure_ascii=True)


def emit_ts(overrides: dict[str, dict]) -> None:
    lines = [
        "/**",
        " * Auto-generated by scripts/ocr_solution_descriptions.py — OCR text from Solution_Descriptions PNGs.",
        " * Merged at catalogue load; does not store images in the UI.",
        " */",
        "",
        'import type { KPI } from "./types";',
        "",
        "export interface SolutionOcrOverride {",
        "  context: string;",
        "  description: string;",
        "  benefits: { client: string; consumer: string; sodexo: string };",
        "  kpis: KPI[];",
        "  contact: string;",
        "}",
        "",
        "export const SOLUTION_OCR_OVERRIDES: Record<string, SolutionOcrOverride> = {",
    ]
    for sid in sorted(overrides.keys()):
        o = overrides[sid]
        kpis_lit = (
            "[" + ", ".join(f"{{ v: {ts_escape(k['v'])}, l: {ts_escape(k['l'])} }}" for k in o["kpis"]) + "]"
            if o["kpis"]
            else "[]"
        )
        lines.append(f"  {json.dumps(sid)}: {{")
        lines.append(f"    context: {ts_escape(o['context'])},")
        lines.append(f"    description: {ts_escape(o['description'])},")
        lines.append("    benefits: {")
        lines.append(f"      client: {ts_escape(o['benefits']['client'])},")
        lines.append(f"      consumer: {ts_escape(o['benefits']['consumer'])},")
        lines.append(f"      sodexo: {ts_escape(o['benefits']['sodexo'])},")
        lines.append("    },")
        lines.append(f"    kpis: {kpis_lit},")
        lines.append(f"    contact: {ts_escape(o['contact'])},")
        lines.append("  },")
    lines.append("};")
    lines.append("")
    OUT_TS.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--input-dir",
        type=Path,
        default=None,
        help="Folder containing solution_*.png",
    )
    args = ap.parse_args()
    input_dir = args.input_dir
    if input_dir is None:
        input_dir = Path.home() / (
            "Library/CloudStorage/OneDrive-SODEXO/Design Community Hub - Documents/"
            "05_Sodexo Labs/Catalogue/Images catalogue/Solution_Descriptions"
        )
    if not input_dir.is_dir():
        print(f"Missing input dir: {input_dir}", file=sys.stderr)
        sys.exit(1)

    catalog = parse_catalog(CATALOG_TS)
    if not catalog:
        print("Could not parse solutionsCatalog.ts", file=sys.stderr)
        sys.exit(1)

    try:
        import easyocr  # noqa: WPS433
    except ImportError:
        print("Install easyocr: pip install easyocr", file=sys.stderr)
        sys.exit(1)

    reader = easyocr.Reader(["en"], gpu=False, verbose=False)

    pngs = sorted(input_dir.glob("solution_*.png")) + sorted(input_dir.glob("solution_*.PNG"))
    overrides: dict[str, dict] = {}
    unmatched: list[str] = []

    for i, png in enumerate(pngs):
        stem = stem_from_filename(png.name)
        sid = resolve_id(stem, catalog)
        if not sid:
            unmatched.append(png.name)
            continue
        print(f"[{i+1}/{len(pngs)}] OCR {png.name} → {sid}", flush=True)
        try:
            lines = reader.readtext(str(png), detail=0, paragraph=True)
            if isinstance(lines, list):
                body = "\n".join(lines)
            else:
                body = str(lines)
            parsed = parse_ocr_body(body)
            # Skip nearly-empty
            if len(parsed["description"]) + len(parsed["context"]) < 20:
                continue
            overrides[sid] = parsed
        except Exception as e:
            print(f"  ERROR {png.name}: {e}", file=sys.stderr)

    emit_ts(overrides)
    print(f"\nWrote {OUT_TS} ({len(overrides)} solutions)")
    if unmatched:
        print(f"Unmatched files ({len(unmatched)}):", ", ".join(unmatched[:15]), "..." if len(unmatched) > 15 else "")


if __name__ == "__main__":
    main()
