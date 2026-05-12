#!/usr/bin/env python3
"""Rebuild persona journeys from **Personae Journey** (Classeur workbook).

Uses header names (not fixed letters) so column shifts are tolerated. Expected headers:
  - Areas | Personae | … | **Moments Title** | **Description Moment Subtitle** |
    **Description moment** | **Image left moment** | **Modules**

Row order in the sheet = journey order per persona. Column **Modules** is split on comma/semicolon;
each token is trimmed and stored verbatim on the `JourneyStep`.

Emits:
  - src/lib/data/personaeJourneyExcel.generated.ts
  - src/lib/data/journeyStepsFromExcel.generated.ts
  - src/lib/data/momentEditorial.generated.ts
  - src/lib/data/momentHeroRaster.generated.ts
  - src/lib/data/momentPersonaTop.generated.ts
  - scripts/persona-moments.json
  - copies under public/ for hero + persona-top rasters

Usage:
  python3 scripts/ingest_personae_journey_excel.py \\
    --xlsx ~/Downloads/Classeur\\ Journey.xlsx
"""

from __future__ import annotations

import argparse
import json
import platform
import re
import shutil
import subprocess
import sys
from collections import defaultdict
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

try:
    import openpyxl
except ImportError:
    print("pip install openpyxl", file=sys.stderr)
    raise

REPO = Path(__file__).resolve().parent.parent
BASE = "/images/catalogue/assets/journeys"

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

PERSONA_JOURNEY_IMAGE: dict[str, str] = {
    "white-collar": f"{BASE}/iso-journey-work-white-collar.svg",
    "blue-collar": f"{BASE}/iso-journey-work-blue-collar.svg",
    "grey-collar": f"{BASE}/iso-journey-work-grey-collar.svg",
    "military": f"{BASE}/iso-journey-work-army-officer.svg",
    "operator-work": f"{BASE}/iso-journey-operator-site-manager.svg",
    "operator-heal": f"{BASE}/iso-journey-operator-site-manager.svg",
    "operator-learn": f"{BASE}/iso-journey-operator-site-manager.svg",
    "operator-play": f"{BASE}/iso-journey-operator-site-manager.svg",
    "client-work": f"{BASE}/iso-journey-client-operation-director.svg",
    "client-heal": f"{BASE}/iso-journey-client-operation-director.svg",
    "client-learn": f"{BASE}/iso-journey-client-operation-director.svg",
    "client-play": f"{BASE}/iso-journey-client-operation-director.svg",
    "doctor": f"{BASE}/iso-journey-heal-doctor.svg",
    "nurse": f"{BASE}/iso-journey-heal-nurse.svg",
    "senior": f"{BASE}/iso-journey-heal-senior.svg",
    "patient": f"{BASE}/iso-journey-heal-patient.svg",
    "sport-fan": f"{BASE}/sport-fan.jpg",
    "participant": f"{BASE}/iso-journey-play-event-participant.svg",
    "vip-guest": f"{BASE}/iso-journey-play-vip-guest-stadium.svg",
    "tourist": f"{BASE}/iso-journey-play-vip-guest-airport.svg",
    "student": f"{BASE}/iso-journey-learn-student.svg",
    "schoolchild": f"{BASE}/iso-journey-learn-schoolchild.svg",
    "parent": f"{BASE}/iso-journey-learn-parent.svg",
    "teacher": f"{BASE}/iso-journey-learn-teacher.svg",
}

PILL_W, PILL_H = 16.0, 10.0


def norm_persona(s: Any) -> str:
    return re.sub(r"\s+", " ", str(s).replace("\n", " ")).strip()


def include_row_for_persona(persona_id: str, excel_persona_raw: Any) -> bool:
    x = norm_persona(excel_persona_raw).lower()
    if persona_id == "tourist":
        return "business traveller" in x and "cultural tourist" not in x
    return True


def resolve_pair(area_raw: Any, persona_raw: Any) -> str | None:
    area = str(area_raw).strip().lower()
    pers = norm_persona(persona_raw).lower()
    return PAIR_TO_ID.get((area, pers))


def slugify(title: str) -> str:
    s = re.sub(r"\s+", " ", str(title).strip()).lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return (s[:56] if s else "moment").strip("-")


def make_step_id(persona_id: str, title: str, used: set[str]) -> str:
    base = f"{persona_id}__{slugify(title)}"
    if len(base) > 80:
        base = base[:80].rstrip("-")
    k = base
    n = 2
    while k in used:
        suf = f"-{n}"
        trim = max(0, 80 - len(suf))
        k = (base[:trim].rstrip("-") + suf) if len(base) + len(suf) > 80 else base + suf
        n += 1
    used.add(k)
    return k


def layout_hotspots(n: int) -> list[tuple[float, float, float, float]]:
    """left, top, w, h in percent (0–100), same convention as legacy pill()."""
    if n <= 0:
        return []
    if n == 1:
        cx, cy = 50.0, 82.0
        return [(max(0.0, cx - PILL_W / 2), max(0.0, cy - PILL_H / 2), PILL_W, PILL_H)]
    out: list[tuple[float, float, float, float]] = []
    for i in range(n):
        cx = 10.0 + (80.0 * i / (n - 1))
        cy = 82.0
        out.append((max(0.0, cx - PILL_W / 2), max(0.0, cy - PILL_H / 2), PILL_W, PILL_H))
    return out


def header_indices(row1: tuple[Any, ...]) -> dict[str, int]:
    h: dict[str, int] = {}
    for i, cell in enumerate(row1):
        if cell is None:
            continue
        key = re.sub(r"\s+", " ", str(cell).strip().lower())
        h[key] = i

    def pick(*needles: str) -> int:
        for k, idx in h.items():
            if all(n in k for n in needles):
                return idx
        raise SystemExit(f"missing column containing {needles}; have {list(h.keys())}")

    def pick_body() -> int:
        best_i, best_len = -1, -1
        for k, idx in h.items():
            if "description" in k and "moment" in k and "subtitle" not in k:
                if len(k) > best_len:
                    best_len = len(k)
                    best_i = idx
        if best_i < 0:
            raise SystemExit(f"missing body column; have {list(h.keys())}")
        return best_i

    return {
        "area": pick("areas"),
        "personae": pick("personae"),
        "portrait": pick("personae", "portrait"),
        "moment_title": pick("moments", "title"),
        "subtitle": pick("description", "subtitle"),
        "body": pick_body(),
        "hero_key": pick("image", "left", "moment"),
        "modules": pick("modules"),
    }


def parse_modules(cell: Any) -> list[str]:
    if cell is None:
        return []
    s = str(cell).replace("\n", " ").strip()
    if not s:
        return []
    parts = re.split(r"[,;]", s)
    return [p.strip() for p in parts if p.strip()]


def norm_file_stem(stem: str) -> str:
    s = stem.lower()
    s = re.sub(r"_+", "_", s)
    return s


def build_image_index(images_dir: Path) -> dict[str, Path]:
    index: dict[str, Path] = {}
    for ext in ("*.png", "*.jpg", "*.jpeg", "*.webp"):
        for p in images_dir.glob(ext):
            index[norm_file_stem(p.stem)] = p
    return index


def resolve_image_path(excel_key: str, index: dict[str, Path], images_dir: Path) -> Path | None:
    k = str(excel_key or "").replace("\n", "").replace("\r", "").strip()
    if not k:
        return None
    stem = norm_file_stem(Path(k).name if "/" not in k else k.split("/")[-1])
    if stem.endswith(".png"):
        stem = norm_file_stem(stem[: -4])
    if stem in index:
        return index[stem]
    for ext in (".png", ".jpg", ".jpeg", ".webp"):
        cand = images_dir / f"{stem}{ext}"
        if cand.is_file():
            return cand
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


def shrink_tile(path: Path, max_edge: int = 512) -> None:
    if platform.system() != "Darwin":
        return
    if path.suffix.lower() not in (".png", ".jpg", ".jpeg"):
        return
    try:
        subprocess.run(
            ["sips", "-Z", str(max_edge), str(path), "--out", str(path)],
            check=True,
            capture_output=True,
        )
    except (FileNotFoundError, subprocess.CalledProcessError):
        pass


def emit_journey_steps(steps: dict[str, dict[str, Any]]) -> str:
    lines = [
        "/** Auto-generated by scripts/ingest_personae_journey_excel.py — do not edit by hand. */",
        "",
        "import type { JourneyStep } from './types';",
        "",
        "export const EXCEL_JOURNEY_STEP_IDS = new Set<string>([",
    ]
    for sid in sorted(steps):
        lines.append(f'  "{sid}",')
    lines.append("]);")
    lines.append("")
    lines.append("export const JOURNEY_STEPS_FROM_EXCEL: Record<string, JourneyStep> = {")
    for sid in sorted(steps):
        s = steps[sid]
        mods = ", ".join(f'"{ts_escape(m)}"' for m in s["modules"])
        desc = ts_escape(str(s.get("description") or ""))
        lab = ts_escape(str(s["label"]))
        lines.append(f'  "{sid}": {{')
        lines.append(f'    id: "{sid}",')
        lines.append(f'    label: "{lab}",')
        lines.append(f'    icon: "📍",')
        lines.append(f'    modules: [{mods}],')
        lines.append(f'    description: "{desc}",')
        lines.append("  },")
    lines.append("};")
    lines.append("")
    return "\n".join(lines)


def emit_persona_journeys(journeys: dict[str, dict[str, Any]]) -> str:
    lines = [
        "/** Auto-generated by scripts/ingest_personae_journey_excel.py — do not edit by hand. */",
        "",
        "export const PERSONA_JOURNEYS_EXCEL: Record<",
        "  string,",
        "  {",
        "    image: string;",
        "    moments: Array<{ id: string; label: string; left: number; top: number; w: number; h: number }>;",
        "  }",
        "> = {",
    ]
    for pid in sorted(journeys):
        j = journeys[pid]
        lines.append(f'  "{pid}": {{')
        lines.append(f'    image: "{ts_escape(j["image"])}",')
        lines.append("    moments: [")
        for m in j["moments"]:
            lines.append(
                "      { "
                + f'id: "{m["id"]}", label: "{ts_escape(m["label"])}", '
                + f'left: {m["left"]}, top: {m["top"]}, w: {m["w"]}, h: {m["h"]} '
                + "},"
            )
        lines.append("    ],")
        lines.append("  },")
    lines.append("};")
    lines.append("")
    return "\n".join(lines)


def emit_editorial(ed: dict[str, dict[str, dict[str, str]]]) -> str:
    lines = [
        "/** Auto-generated by scripts/ingest_personae_journey_excel.py — do not edit by hand. */",
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
    for pid in sorted(ed):
        lines.append(f'  "{pid}": {{')
        for sid in sorted(ed[pid]):
            row = ed[pid][sid]
            lines.append(f'    "{sid}": {{')
            lines.append(f'      subtitle: "{ts_escape(row["subtitle"])}",')
            lines.append(f'      body: "{ts_escape(row["body"])}",')
            lines.append("    },")
        lines.append("  },")
    lines.append("};")
    lines.append("")
    return "\n".join(lines)


def emit_raster(raster: dict[str, dict[str, str]]) -> str:
    lines = [
        "/** Auto-generated by scripts/ingest_personae_journey_excel.py — do not edit by hand. */",
        "",
        "export const MOMENT_HERO_RASTER: Partial<",
        "  Record<string, Partial<Record<string, string>>>",
        "> = {",
    ]
    for pid in sorted(raster):
        lines.append(f'  "{pid}": {{')
        for sid in sorted(raster[pid]):
            lines.append(f'    "{sid}": "{raster[pid][sid]}",')
        lines.append("  },")
    lines.append("};")
    lines.append("")
    return "\n".join(lines)


def emit_persona_top(top: dict[str, dict[str, str]]) -> str:
    lines = [
        "/** Auto-generated by scripts/ingest_personae_journey_excel.py — do not edit by hand. */",
        "",
        "export const MOMENT_PERSONA_TOP: Partial<",
        "  Record<string, Partial<Record<string, string>>>",
        "> = {",
    ]
    for pid in sorted(top):
        lines.append(f'  "{pid}": {{')
        for sid in sorted(top[pid]):
            lines.append(f'    "{sid}": "{top[pid][sid]}",')
        lines.append("  },")
    lines.append("};")
    lines.append("")
    lines.append(
        "export function momentPersonaTopUrl(personaId: string, stepId: string): string | undefined {"
    )
    lines.append("  return MOMENT_PERSONA_TOP[personaId]?.[stepId];")
    lines.append("}")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--xlsx", type=Path, default=Path.home() / "Downloads/Classeur Journey.xlsx")
    args = ap.parse_args()

    moments_img = (
        Path.home()
        / "Library/CloudStorage/OneDrive-SODEXO/Design Community Hub - Documents"
        / "05_Sodexo Labs/Catalogue/Images catalogue/Journey_Moments_Images"
    )
    portrait_dir = (
        Path.home()
        / "Library/CloudStorage/OneDrive-SODEXO/Design Community Hub - Documents"
        / "05_Sodexo Labs/Catalogue/Images catalogue/Personae_Images_Portrait"
    )

    if not args.xlsx.exists():
        print(f"error: xlsx not found: {args.xlsx}", file=sys.stderr)
        return 2
    if not moments_img.is_dir():
        print(f"error: Journey_Moments_Images not found: {moments_img}", file=sys.stderr)
        return 2
    if not portrait_dir.is_dir():
        print(f"error: portrait dir not found: {portrait_dir}", file=sys.stderr)
        return 2

    hero_index = build_image_index(moments_img)
    portrait_index = build_image_index(portrait_dir)

    wb = openpyxl.load_workbook(args.xlsx, read_only=True, data_only=True)
    ws = wb["Personae Journey"]
    row1 = next(ws.iter_rows(min_row=1, max_row=1, values_only=True))
    col = header_indices(row1)

    # persona_id -> ordered list of moment records
    ordered: dict[str, list[dict[str, Any]]] = defaultdict(list)
    skipped: list[tuple[str, str]] = []

    for row in ws.iter_rows(min_row=2, values_only=True):
        if not row or row[col["area"]] is None:
            continue
        pid = resolve_pair(row[col["area"]], row[col["personae"]])
        if not pid:
            skipped.append((str(row[col["area"]]), norm_persona(row[col["personae"]])))
            continue
        if not include_row_for_persona(pid, row[col["personae"]]):
            continue
        title = row[col["moment_title"]]
        if title is None or not str(title).strip():
            continue
        ordered[pid].append(
            {
                "title": str(title).strip(),
                "modules": parse_modules(row[col["modules"]]),
                "subtitle": str(row[col["subtitle"]] or "").strip(),
                "body": str(row[col["body"]] or "").strip(),
                "hero_key": str(row[col["hero_key"]] or "").strip(),
                "portrait_key": str(row[col["portrait"]] or "").strip(),
            }
        )

    used_ids: set[str] = set()
    journeys: dict[str, dict[str, Any]] = {}
    journey_steps: dict[str, dict[str, Any]] = {}
    editorial: dict[str, dict[str, dict[str, str]]] = {}
    raster: dict[str, dict[str, str]] = {}
    top: dict[str, dict[str, str]] = {}
    persona_moments_out: dict[str, list[dict[str, str]]] = {}

    hero_out = REPO / "public/images/catalogue/assets/journeys/moments-raster"
    top_out = REPO / "public/images/catalogue/assets/journeys/moment-persona-top"
    missing_hero: list[tuple[str, str, str]] = []
    missing_portrait: list[tuple[str, str, str]] = []

    for pid in sorted(ordered.keys()):
        rows = ordered[pid]
        img = PERSONA_JOURNEY_IMAGE.get(pid)
        if not img:
            print(f"error: no journey image for persona {pid}", file=sys.stderr)
            return 2
        coords = layout_hotspots(len(rows))
        moments_out: list[dict[str, Any]] = []
        pm_list: list[dict[str, str]] = []

        for i, r in enumerate(rows):
            sid = make_step_id(pid, r["title"], used_ids)
            left, topPct, w, h = coords[i]
            moments_out.append({"id": sid, "label": r["title"], "left": left, "top": topPct, "w": w, "h": h})
            pm_list.append({"id": sid, "label": r["title"]})
            journey_steps[sid] = {
                "id": sid,
                "label": r["title"],
                "modules": r["modules"],
                "description": r["body"],
            }
            editorial.setdefault(pid, {})[sid] = {"subtitle": r["subtitle"], "body": r["body"]}

            src_h = resolve_image_path(r["hero_key"], hero_index, moments_img)
            if src_h:
                dest_d = hero_out / pid
                dest_d.mkdir(parents=True, exist_ok=True)
                ext = src_h.suffix.lower() or ".png"
                dest = dest_d / f"{sid}{ext}"
                shutil.copyfile(src_h, dest)
                shrink_tile(dest)
                raster.setdefault(pid, {})[
                    sid
                ] = f"/images/catalogue/assets/journeys/moments-raster/{pid}/{sid}{ext}"
            else:
                missing_hero.append((pid, sid, r["hero_key"]))

            src_p = resolve_image_path(r["portrait_key"], portrait_index, portrait_dir)
            if src_p:
                dest_d = top_out / pid
                dest_d.mkdir(parents=True, exist_ok=True)
                ext = src_p.suffix.lower() or ".png"
                dest = dest_d / f"{sid}{ext}"
                shutil.copyfile(src_p, dest)
                shrink_tile(dest)
                top.setdefault(pid, {})[
                    sid
                ] = f"/images/catalogue/assets/journeys/moment-persona-top/{pid}/{sid}{ext}"
            else:
                missing_portrait.append((pid, sid, r["portrait_key"]))

        journeys[pid] = {"image": img, "moments": moments_out}
        persona_moments_out[pid] = pm_list

    (REPO / "src/lib/data/personaeJourneyExcel.generated.ts").write_text(
        emit_persona_journeys(journeys), encoding="utf-8"
    )
    (REPO / "src/lib/data/journeyStepsFromExcel.generated.ts").write_text(
        emit_journey_steps(journey_steps), encoding="utf-8"
    )
    (REPO / "src/lib/data/momentEditorial.generated.ts").write_text(emit_editorial(editorial), encoding="utf-8")
    (REPO / "src/lib/data/momentHeroRaster.generated.ts").write_text(emit_raster(raster), encoding="utf-8")
    (REPO / "src/lib/data/momentPersonaTop.generated.ts").write_text(emit_persona_top(top), encoding="utf-8")
    (REPO / "scripts/persona-moments.json").write_text(
        json.dumps(persona_moments_out, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print(f"personas: {len(journeys)}  steps: {len(journey_steps)}  hero tiles: {sum(len(v) for v in raster.values())}")
    if skipped:
        print(f"WARNING skipped unknown pairs: {len(skipped)}", skipped[:6])
    if missing_hero:
        print(f"WARNING missing hero ({len(missing_hero)}):", missing_hero[:5])
    if missing_portrait:
        print(f"WARNING missing portrait ({len(missing_portrait)}):", missing_portrait[:5])
    return 0 if not missing_hero and not missing_portrait else 1


if __name__ == "__main__":
    raise SystemExit(main())
