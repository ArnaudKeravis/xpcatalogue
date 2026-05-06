#!/usr/bin/env python3
"""Read `Moments.xlsx` (sheet Personae Journey), match rows to catalogue persona + step ids,
copy raster hero images from `Journey_Moments_Images/`, and emit:
  - src/lib/data/momentEditorial.generated.ts
  - src/lib/data/momentHeroRaster.generated.ts

Usage:
  python3 scripts/generate-moment-excel-assets.py \\
    [--xlsx ~/Downloads/Moments.xlsx] \\
    [--images-dir "<path>/Journey_Moments_Images"]
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

try:
    import openpyxl
except ImportError:
    print("Install openpyxl: pip install openpyxl", file=sys.stderr)
    raise

REPO = Path(__file__).resolve().parent.parent

# Normalized "area|personae" → catalogue persona id (must cover every Excel archetype row).
PAIR_TO_ID: dict[tuple[str, str], str] = {
    ("work", "portfolio manager"): "client-work",
    ("work", "site manager"): "operator-work",
    ("work", "production line worker"): "blue-collar",
    ("work", "lab researcher"): "grey-collar",
    ("work", "army officer"): "military",
    ("work", "admin function"): "white-collar",
    ("heal", "portfolio manager"): "client-heal",
    ("heal", "site manager"): "operator-heal",
    ("heal", "hospital physician"): "doctor",
    ("heal", "registered nurse"): "nurse",
    ("heal", "long-term resident"): "senior",
    ("heal", "outpatient & inpatient"): "patient",
    ("learn", "portfolio manager"): "client-learn",
    ("learn", "site manager"): "operator-learn",
    ("learn", "university student"): "student",
    ("learn", "middle school student"): "schoolchild",
    ("learn", "middle school teacher"): "teacher",
    ("learn", "working parent of school-age children"): "parent",
    ("play", "portfolio manager"): "client-play",
    ("play", "site manager"): "operator-play",
    ("play", "business traveller & vip guest"): "tourist",
    ("play", "cultural tourist & museum visitor"): "tourist",
    ("play", "executive & premium event guest"): "vip-guest",
    ("play", "parent & sports fan"): "sport-fan",
    ("play", "trade show & event attendent"): "participant",
}

# When Excel moment titles diverge from `personaJourneys` labels.
TITLE_TO_STEP: dict[tuple[str, str], str] = {
    ("tourist", "arrival & access"): "tou-welcome",
    ("tourist", "social time/work"): "tou-visit",
    ("tourist", "fast access to gate"): "tou-depart",
    ("schoolchild", "welcome at school"): "sch-welcome",
}


def norm_persona(s: Any) -> str:
    return re.sub(r"\s+", " ", str(s).replace("\n", " ")).strip()


def norm_title(t: Any) -> str:
    s = re.sub(r"\s+", " ", str(t).lower().strip())
    s = s.replace("kick-off", "kick off")
    s = re.sub(r"\s*/\s*", "/", s)
    s = s.replace("social time / work", "social time/work")
    return s


def sanitize_image_key(raw: Any) -> str:
    if raw is None:
        return ""
    s = str(raw).replace("\n", "").replace("\r", "").strip()
    return s


def norm_file_stem(stem: str) -> str:
    s = stem.lower()
    s = re.sub(r"_+", "_", s)
    return s


def load_moment_labels(repo: Path) -> dict[str, list[dict[str, str]]]:
    jpath = repo / "scripts/persona-moments.json"
    if not jpath.exists():
        raise SystemExit(f"missing {jpath} — run: npx tsx ... personaJourneys export")
    return json.loads(jpath.read_text(encoding="utf-8"))


def resolve_pair(area_raw: Any, persona_raw: Any) -> str | None:
    area = str(area_raw).strip().lower()
    pers = norm_persona(persona_raw).lower()
    return PAIR_TO_ID.get((area, pers))


def include_row_for_persona(persona_id: str, excel_persona_raw: Any) -> bool:
    """Multiple Excel archetypes can map to one catalogue id (e.g. tourist). Keep the row that
    matches the persona profile in `personaDefinitions` (role label)."""
    x = norm_persona(excel_persona_raw).lower()
    if persona_id == "tourist":
        return "business traveller" in x and "cultural tourist" not in x
    # All other merged mappings are single-archetype in this workbook.
    return True


def resolve_step_id(
    persona_id: str,
    excel_title: Any,
    moments: list[dict[str, str]],
) -> tuple[str | None, float]:
    alias = TITLE_TO_STEP.get((persona_id, norm_title(excel_title)))
    if alias:
        return alias, 1.0
    nt = norm_title(excel_title)
    for m in moments:
        if norm_title(m["label"]) == nt:
            return m["id"], 1.0
    best_id: str | None = None
    best = 0.0
    for m in moments:
        sc = SequenceMatcher(None, nt, norm_title(m["label"])).ratio()
        if sc > best:
            best = sc
            best_id = m["id"]
    return best_id, best


def build_image_index(images_dir: Path) -> dict[str, Path]:
    """Map normalized stem (no .png) → absolute path."""
    index: dict[str, Path] = {}
    for p in images_dir.glob("*.png"):
        stem = norm_file_stem(p.stem)
        index[stem] = p
    return index


def resolve_image_path(excel_key: str, index: dict[str, Path]) -> Path | None:
    k = sanitize_image_key(excel_key)
    if not k:
        return None
    stem = norm_file_stem(Path(k).name if "/" not in k else k.split("/")[-1])
    if stem.endswith(".png"):
        stem = stem[: -len(".png")]
        stem = norm_file_stem(stem)
    if stem in index:
        return index[stem]
    # Allow slight stem mismatches (double underscores, spacing around &).
    candidates = sorted(index.items(), key=lambda x: SequenceMatcher(None, stem, x[0]).ratio(), reverse=True)
    if candidates and SequenceMatcher(None, stem, candidates[0][0]).ratio() >= 0.92:
        return candidates[0][1]
    return None


def ts_escape(s: str) -> str:
    return (
        s.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\r\n", "\n")
        .replace("\r", "\n")
    )


def emit_editorial(data: dict[str, dict[str, dict[str, str]]]) -> str:
    lines = [
        "/** Auto-generated by scripts/generate-moment-excel-assets.py — do not edit by hand. */",
        "",
        "export interface MomentEditorialRow {",
        "  subtitle: string;",
        "  body: string;",
        "}",
        "",
        "export const MOMENT_EDITORIAL: Partial<",
        "  Record<string, Partial<Record<string, MomentEditorialRow>>>",
        "> = {",
    ]
    for pid in sorted(data):
        lines.append(f'  "{pid}": {{')
        for sid in sorted(data[pid]):
            row = data[pid][sid]
            lines.append(f'    "{sid}": {{')
            lines.append(f'      subtitle: "{ts_escape(row["subtitle"])}",')
            body = ts_escape(row["body"])
            lines.append(f'      body: "{body}",')
            lines.append("    },")
        lines.append("  },")
    lines.append("};")
    lines.append("")
    return "\n".join(lines)


def emit_raster(data: dict[str, dict[str, str]]) -> str:
    lines = [
        "/** Auto-generated by scripts/generate-moment-excel-assets.py — do not edit by hand. */",
        "",
        "export const MOMENT_HERO_RASTER: Partial<",
        "  Record<string, Partial<Record<string, string>>>",
        "> = {",
    ]
    for pid in sorted(data):
        lines.append(f'  "{pid}": {{')
        for sid in sorted(data[pid]):
            url = data[pid][sid]
            lines.append(f'    "{sid}": "{url}",')
        lines.append("  },")
    lines.append("};")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--xlsx", type=Path, default=Path.home() / "Downloads/Moments.xlsx")
    ap.add_argument(
        "--images-dir",
        type=Path,
        default=None,
        help="Folder containing image_moment_*.png (not the zip)",
    )
    args = ap.parse_args()

    images_dir = args.images_dir
    if images_dir is None:
        images_dir = (
            Path.home()
            / "Library/CloudStorage/OneDrive-SODEXO/Design Community Hub - Documents"
            / "05_Sodexo Labs/Catalogue/Images catalogue/Journey_Moments_Images"
        )

    if not args.xlsx.exists():
        print(f"error: xlsx not found: {args.xlsx}", file=sys.stderr)
        return 2
    if not images_dir.is_dir():
        print(f"error: images dir not found: {images_dir}", file=sys.stderr)
        return 2

    labels = load_moment_labels(REPO)
    img_index = build_image_index(images_dir)

    wb = openpyxl.load_workbook(args.xlsx, read_only=True, data_only=True)
    ws = wb["Personae Journey"]

    editorial: dict[str, dict[str, dict[str, str]]] = {}
    raster: dict[str, dict[str, str]] = {}
    out_dir = REPO / "public/images/catalogue/assets/journeys/moments-raster"

    weak: list[tuple[str, str, str | None, float]] = []
    missing_img: list[tuple[str, str, str]] = []
    skipped_pair: list[tuple[str, str]] = []
    skipped_merge: list[tuple[str, str]] = []

    for row in ws.iter_rows(min_row=2, values_only=True):
        if not row or row[0] is None:
            continue
        pid = resolve_pair(row[0], row[1])
        if not pid:
            skipped_pair.append((str(row[0]), norm_persona(row[1])))
            continue
        if not include_row_for_persona(pid, row[1]):
            skipped_merge.append((pid, norm_persona(row[1])))
            continue
        title = row[2]
        subtitle = row[3] or ""
        body = row[4] or ""
        img_key = sanitize_image_key(row[5])

        moments = labels.get(pid, [])
        step_id, score = resolve_step_id(pid, title, moments)
        if not step_id:
            weak.append((pid, str(title), None, score))
            continue
        if score < 0.86 and (pid, norm_title(title)) not in TITLE_TO_STEP:
            weak.append((pid, str(title), step_id, score))

        editorial.setdefault(pid, {})
        editorial[pid][step_id] = {
            "subtitle": str(subtitle).strip(),
            "body": str(body).strip(),
        }

        src = resolve_image_path(img_key, img_index)
        if not src:
            missing_img.append((pid, step_id, img_key))
            continue

        dest_dir = out_dir / pid
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest = dest_dir / f"{step_id}.png"
        shutil.copyfile(src, dest)
        rel = f"/images/catalogue/assets/journeys/moments-raster/{pid}/{step_id}.png"
        raster.setdefault(pid, {})[step_id] = rel

    (REPO / "src/lib/data/momentEditorial.generated.ts").write_text(
        emit_editorial(editorial), encoding="utf-8"
    )
    (REPO / "src/lib/data/momentHeroRaster.generated.ts").write_text(
        emit_raster(raster), encoding="utf-8"
    )

    print(f"wrote editorial keys: {sum(len(v) for v in editorial.values())} persona-rows")
    print(f"wrote raster files: {sum(len(v) for v in raster.values())}")
    print(f"output {out_dir.relative_to(REPO)}")
    if skipped_pair:
        print(f"WARNING: skipped unknown area/persona pairs ({len(skipped_pair)}):")
        for p in skipped_pair[:10]:
            print(" ", p)
    if skipped_merge:
        print(f"skipped duplicate archetype rows (same persona id): {len(skipped_merge)}")
    if weak:
        print(f"WARNING: weak title matches ({len(weak)}):")
        for w in weak[:12]:
            print(" ", w)
    if missing_img:
        print(f"WARNING: missing raster source ({len(missing_img)}):")
        for m in missing_img[:12]:
            print(" ", m)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
