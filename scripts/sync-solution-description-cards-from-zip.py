#!/usr/bin/env python3
"""Unpack Solution_Descriptions.zip — full marketing / infographic cards per solution.

Filenames use spaces and underscores: `solution_<Label>.png`. Labels align with
Excel / product naming. Assets are written to
  public/images/catalogue/assets/solution-descriptions/<id>.png
and `descriptionImage` in `solutionsCatalog.ts` is set to that URL (structured
copy + visuals). Use `sync-solution-hero-images-from-zip.py` for compact
`Solutions_Images` → `heroImage`.

Re-run:
  python3 scripts/sync-solution-description-cards-from-zip.py [path/to.zip]
"""

from __future__ import annotations

import argparse
import re
import shutil
import sys
import zipfile
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CATALOG_PATH = REPO / "src/lib/data/solutionsCatalog.ts"
PUBLIC_DIR = REPO / "public/images/catalogue/assets/solution-descriptions"
DEFAULT_ZIP = Path.home() / "Downloads/Solution_Descriptions.zip"

# Exact basename -> id (export quirks; characters like &, ', …)
BASENAME_TO_ID: dict[str, str] = {
    "solution_Aquablu_IH.png": "aquablu",
    "solution_In_reach_Smart_Fridge.png": "inReach",
    "solution_Nando_AI.png": "relearn",
    "solution_Neat_frame.png": "neatFrame",
    "solution_Greese_to_Goodness.png": "greaseToGoodness",
    "solution_Placer.AI.png": "placerAi",
    "solution_So'Eze.png": "soeze",
    "solution_Sensio_air.png": "sensioAir",
    "solution_Zippin_by_Fujitsu.png": "zippin",
    "solution_Starship_Technologies.png": "starship",
    "solution_uServe_Robot.png": "userveRobot",
    "solution_SoPro_AI.png": "soproAi",
    "solution_GoSpot Check.png": "gospoCheck",
    "solution_B2B Platform.png": "b2bPlatform",
    "solution_Sodexo_Wrx.png": "sodexoWrx",
    "solution_Sodexo_Direct.png": "sodexoDirect",
    "solution_Neurabody.png": "neurabody",
    "solution_Trayvisor.png": "trayvisor",
    "solution_Pricing.png": "pricing",
    "solution_Wando_App.png": "wandoAnalytics",
    "solution_EBar_beerwall.png": "eBarBeerwall",
    "solution_ABS_Urizap.png": "absUrizap",
    "solution_REPG.png": "repg",
    "solution_Product_Swap.png": "productSwap",
    "solution_Rego_AI.png": "regoAi",
    "solution_Releaf_Paper.png": "releafPaper",
}

ALSO_COPY_ID: dict[str, str] = {
    "sodexoWrx": "sodexoWrxConciergerie",
    "gospoCheck": "gogSpotCheck2",
}

# No matching catalogue row yet — skip (avoid fuzzy collision with B2B Platform, etc.)
SKIP_BASENAMES = frozenset({
    "solution_Dynamic Services Platform.png",
})


def norm_key(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def parse_catalog(path: Path) -> list[tuple[str, str]]:
    text = path.read_text(encoding="utf-8")
    entries: list[tuple[str, str]] = []
    for m in re.finditer(r'id:\s*"([^"]+)"', text):
        chunk = text[m.start() : m.start() + 2000]
        nm = re.search(r'name:\s*"([^"]*)"', chunk)
        if nm:
            entries.append((m.group(1), nm.group(1)))
    return entries


def label_from_basename(filename: str) -> str:
    m = re.match(r"solution_(.+)\.png$", filename, re.I)
    if not m:
        return ""
    stem = m.group(1)
    return re.sub(r"\s+", " ", stem.replace("_", " ")).strip()


def match_id_for_label(label: str, entries: list[tuple[str, str]]) -> str | None:
    if not label:
        return None
    l = label.lower().strip()
    l_key = norm_key(label)

    for sid, name in entries:
        if name.lower() == l:
            return sid
    for sid, name in entries:
        if norm_key(name) == l_key:
            return sid

    best: list[tuple[int, str]] = []
    for sid, name in entries:
        n = name.lower()
        if len(l) < 3 or len(n) < 3:
            continue
        if l in n or n in l:
            score = min(len(l), len(n)) * 10 + (100 if n.startswith(l) else 0)
            best.append((score, sid))
    if best:
        best.sort(key=lambda x: -x[0])
        return best[0][1]

    l_tokens = set(re.findall(r"[a-z0-9]+", l))
    if not l_tokens:
        return None
    best2: list[tuple[int, str]] = []
    for sid, name in entries:
        t = set(re.findall(r"[a-z0-9]+", name.lower()))
        inter = l_tokens & t
        if len(inter) >= 2 or (len(inter) == 1 and len(l_tokens) == 1):
            best2.append((len(inter) * 10, sid))
    if best2:
        best2.sort(key=lambda x: -x[0])
        return best2[0][1]
    return None


def extract_object_span(full: str, solution_id: str) -> tuple[int, int] | None:
    needle = f'id: "{solution_id}"'
    pos = 0
    while True:
        idx = full.find(needle, pos)
        if idx < 0:
            return None
        brace_open = full.rfind("{", 0, idx)
        if brace_open < 0:
            pos = idx + 1
            continue
        depth = 0
        i = brace_open
        while i < len(full):
            c = full[i]
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    return brace_open, i + 1
            i += 1
        return None


def inject_or_replace_description_image(block: str, public_path: str) -> str:
    if re.search(r"\bdescriptionImage\s*:", block):
        return re.sub(
            r'(descriptionImage:\s*)"[^"]*"',
            rf'\1"{public_path}"',
            block,
            count=1,
        )

    def _after_img(m: re.Match[str]) -> str:
        return m.group(1) + f'\n    descriptionImage: "{public_path}",'

    return re.sub(
        r'(\n\s*img:\s*(?:"[^"]*"|\[[^\]]*\]),)',
        _after_img,
        block,
        count=1,
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("zip", type=Path, nargs="?", default=DEFAULT_ZIP)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    if not args.zip.exists():
        sys.stderr.write(f"error: zip not found: {args.zip}\n")
        return 2

    entries = parse_catalog(CATALOG_PATH)
    by_id = {i: n for i, n in entries}

    z = zipfile.ZipFile(args.zip, "r")
    plan: list[tuple[str, str, str]] = []
    skipped: list[str] = []

    for name in z.namelist():
        if name.endswith("/"):
            continue
        base = Path(name).name
        if not re.match(r"solution_.+\.png$", base, re.I):
            skipped.append(name)
            continue
        if base in SKIP_BASENAMES:
            skipped.append(f"{name} (skipped — no catalogue id)")
            continue

        target_id: str | None = None
        if base in BASENAME_TO_ID:
            target_id = BASENAME_TO_ID[base]
        else:
            label = label_from_basename(base)
            target_id = match_id_for_label(label, entries)
        if not target_id or target_id not in by_id:
            label = label_from_basename(base)
            skipped.append(f"{name} (unmapped label: {label!r})")
            continue
        plan.append((name, base, target_id))

    id_to_src: dict[str, str] = {}
    for member, base, sid in plan:
        if sid in id_to_src:
            print(f"warning: duplicate for id {sid!r}: keeping {base!r}, was {Path(id_to_src[sid]).name!r}")
        id_to_src[sid] = member

    print(f"mapped {len(id_to_src)} solution ids from {len(plan)} png files")

    public_url_prefix = "/images/catalogue/assets/solution-descriptions"

    if args.dry_run:
        for sid in sorted(id_to_src.keys()):
            print(f"  {sid}.png <= {Path(id_to_src[sid]).name} | {by_id.get(sid)}")
        if skipped:
            print(f"\nskipped {len(skipped)}:")
            for s in skipped:
                print(" ", s)
        return 0

    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    for sid, member in id_to_src.items():
        target = PUBLIC_DIR / f"{sid}.png"
        with z.open(member) as src, open(target, "wb") as out:
            shutil.copyfileobj(src, out)
        for primary, alias in ALSO_COPY_ID.items():
            if sid == primary:
                shutil.copy2(target, PUBLIC_DIR / f"{alias}.png")

    z.close()

    text = CATALOG_PATH.read_text(encoding="utf-8")

    for sid in sorted(id_to_src.keys()):
        span = extract_object_span(text, sid)
        if not span:
            sys.stderr.write(f"warning: could not find object for id {sid}\n")
            continue
        a, b = span
        block = text[a:b]
        path = f"{public_url_prefix}/{sid}.png"
        text = text[:a] + inject_or_replace_description_image(block, path) + text[b:]

    for primary, alias in ALSO_COPY_ID.items():
        if primary not in id_to_src:
            continue
        span = extract_object_span(text, alias)
        if not span:
            sys.stderr.write(f"warning: could not find object for alias id {alias}\n")
            continue
        a, b = span
        block = text[a:b]
        path = f"{public_url_prefix}/{alias}.png"
        text = text[:a] + inject_or_replace_description_image(block, path) + text[b:]

    CATALOG_PATH.write_text(text, encoding="utf-8")

    print(f"wrote {len(id_to_src)} png files under {PUBLIC_DIR.relative_to(REPO)}")
    print(f"updated descriptionImage → {public_url_prefix}/<id>.png in {CATALOG_PATH.relative_to(REPO)}")
    if skipped:
        print(f"note: skipped {len(skipped)} entries")
    return 0


if __name__ == "__main__":
    sys.exit(main())
