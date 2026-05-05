#!/usr/bin/env python3
"""Unpack Solutions_Images.zip — compact product / tile imagery per solution (`heroImage`).

Naming convention in the zip: `solution_image_<Label>.<ext>` where <Label> uses
underscores instead of spaces (Excel / export naming). We resolve labels to
`solutionsCatalog.ts` entries primarily by **display name** (same approach as
the workbook’s Solution Name column), with fuzzy substring matching and a few
explicit overrides where filenames abbreviate or typo the official name.

Writes files under:
  public/images/catalogue/assets/solutions/<id>.<ext>

Then updates each matched solution's `heroImage` to that public URL. For full
infographic cards use `sync-solution-description-cards-from-zip.py` → `descriptionImage`.
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
PUBLIC_DIR = REPO / "public/images/catalogue/assets/solutions"
DEFAULT_ZIP = Path.home() / "Downloads/Solutions_Images.zip"

# Basename (exact) -> solution id. Use when fuzzy match is wrong or impossible.
BASENAME_TO_ID: dict[str, str] = {
    "solution_image_Wando_App.png": "wandoAnalytics",
    "solution_image_Greese_to_goodness.png": "greaseToGoodness",  # spelling in export
    "solution_image_PowerPricing.jpeg": "pricing",
    "solution_image_Bunzl.png": "instarinse",
    "solution_image_Nando.png": "relearn",
    "solution_image_Patiss3_Printer.webp": "patissPrinter",
    "solution_image_Intervallo_Nespresso.png": "intervalloNespresso",
    "solution_image_Costa_Alto_machine.png": "costaCoffeeMachine",
    "solution_image_LeanPath.png": "leanpath",
    "solution_image_Leanpath: WasteWatch.png": "leanpath",  # if ever exported
    "solution_image_Dishtracker.png": "dishTracker",
    "solution_image_GoSpot_Check.png": "gospoCheck",
    "solution_image_Placer.ai.png": "placerAi",
    "solution_image_Sodexo_WRX.png": "sodexoWrx",  # primary row; conciergerie WRX reuses file below
}

# Also map second Sodexo WRX + second GoSpot to same files (copy in FS step)
ALSO_COPY_ID: dict[str, str] = {
    "sodexoWrx": "sodexoWrxConciergerie",  # copy sodexoWrx file to this id as well
    "gospoCheck": "gogSpotCheck2",
}


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
    m = re.match(r"solution_image_(.+)\.(png|jpe?g|webp|avif)$", filename, re.I)
    if not m:
        return ""
    stem = m.group(1)
    return re.sub(r"\s+", " ", stem.replace("_", " ")).strip()


def match_id_for_label(
    label: str, entries: list[tuple[str, str]], used_ids: set[str] | None = None
) -> str | None:
    """Return best-matching solution id for a zip label, or None."""
    if not label:
        return None
    l = label.lower().strip()
    l_key = norm_key(label)
    used_ids = used_ids or set()

    # 1) Exact norm match on full name
    for sid, name in entries:
        if name.lower() == l:
            return sid
    for sid, name in entries:
        if norm_key(name) == l_key:
            return sid

    # 2) Substring (export name inside catalogue name or vice versa)
    best: list[tuple[int, str]] = []
    for sid, name in entries:
        if sid in used_ids:
            continue
        n = name.lower()
        if len(l) < 3 or len(n) < 3:
            continue
        if l in n or n in l:
            # Prefer longer name to disambiguate "Nando" vs many hits
            score = min(len(l), len(n)) * 10 + (100 if n.startswith(l) else 0)
            best.append((score, sid))
    if best:
        best.sort(key=lambda x: -x[0])
        return best[0][1]

    # 3) Token overlap (e.g. Placer ai)
    l_tokens = set(re.findall(r"[a-z0-9]+", l))
    if not l_tokens:
        return None
    best2: list[tuple[int, str]] = []
    for sid, name in entries:
        if sid in used_ids:
            continue
        t = set(re.findall(r"[a-z0-9]+", name.lower()))
        inter = l_tokens & t
        if len(inter) >= 2 or (len(inter) == 1 and len(l_tokens) == 1):
            best2.append((len(inter) * 10, sid))
    if best2:
        best2.sort(key=lambda x: -x[0])
        return best2[0][1]
    return None


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

    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    # First pass: map each zip member to a primary id
    z = zipfile.ZipFile(args.zip, "r")
    plan: list[tuple[str, str, str, str]] = []  # member, basename, id, ext
    skipped: list[str] = []

    for name in z.namelist():
        if name.endswith("/"):
            continue
        base = Path(name).name
        ext = Path(base).suffix.lower().lstrip(".")
        if ext not in ("png", "jpg", "jpeg", "webp", "avif"):
            skipped.append(name)
            continue

        target_id: str | None = None
        if base in BASENAME_TO_ID:
            target_id = BASENAME_TO_ID[base]
        else:
            label = label_from_basename(base)
            target_id = match_id_for_label(label, entries)
        if not target_id or target_id not in by_id:
            skipped.append(f"{name} (unmapped label: {label_from_basename(base)!r})")
            continue
        plan.append((name, base, target_id, ext))

    # Deduplicate: if two files map to same id, last wins (warn)
    id_to_file: dict[str, tuple[str, str]] = {}
    for member, base, sid, ext in plan:
        if sid in id_to_file:
            print(f"warning: duplicate image for id {sid!r}: keeping {base!r}, was {id_to_file[sid][0]!r}")
        id_to_file[sid] = (member, ext)

    print(f"mapped {len(id_to_file)} unique solution ids from {len(plan)} zip files")

    if args.dry_run:
        for sid, (member, ext) in sorted(id_to_file.items()):
            print(f"  {sid}.{ext} <= {Path(member).name} | {by_id.get(sid)}")
        if skipped:
            print(f"\nskipped {len(skipped)}:")
            for s in skipped[:30]:
                print(" ", s)
        return 0

    # Copy / extract
    for sid, (member, ext) in id_to_file.items():
        target = PUBLIC_DIR / f"{sid}.{ext}"
        with z.open(member) as src, open(target, "wb") as out:
            shutil.copyfileobj(src, out)
        # Extra aliases (same bytes)
        for primary, alias in ALSO_COPY_ID.items():
            if sid == primary:
                alias_path = PUBLIC_DIR / f"{alias}.{ext}"
                shutil.copy2(target, alias_path)

    z.close()

    text = CATALOG_PATH.read_text(encoding="utf-8")

    def extract_object_span(full: str, solution_id: str) -> tuple[int, int] | None:
        needle = f'id: "{solution_id}"'
        pos = 0
        while True:
            idx = full.find(needle, pos)
            if idx < 0:
                return None
            # Opening brace of this solution object (catalog uses `{` then newline then spaces then id)
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

    def inject_or_replace_hero(block: str, public_path: str) -> str:
        if re.search(r"\bheroImage\s*:", block):
            return re.sub(
                r'(heroImage:\s*)(?:HERO|"[^"]*")',
                rf'\1"{public_path}"',
                block,
                count=1,
            )
        # Insert after `img: …` line (every solution has emoji img)
        def _after_img(m: re.Match[str]) -> str:
            return m.group(1) + f'\n    heroImage: "{public_path}",'

        return re.sub(
            r'(\n\s*img:\s*(?:"[^"]*"|\[[^\]]*\]),)',
            _after_img,
            block,
            count=1,
        )

    for sid, (member, ext) in sorted(id_to_file.items()):
        span = extract_object_span(text, sid)
        if not span:
            sys.stderr.write(f"warning: could not find object for id {sid}\n")
            continue
        a, b = span
        block = text[a:b]
        path = f"/images/catalogue/assets/solutions/{sid}.{ext}"
        new_block = inject_or_replace_hero(block, path)
        text = text[:a] + new_block + text[b:]

    for primary, alias in ALSO_COPY_ID.items():
        if primary not in id_to_file:
            continue
        _, ext = id_to_file[primary]
        span = extract_object_span(text, alias)
        if not span:
            sys.stderr.write(f"warning: could not find object for alias id {alias}\n")
            continue
        a, b = span
        block = text[a:b]
        path = f"/images/catalogue/assets/solutions/{alias}.{ext}"
        new_block = inject_or_replace_hero(block, path)
        text = text[:a] + new_block + text[b:]

    CATALOG_PATH.write_text(text, encoding="utf-8")

    print(f"wrote assets under {PUBLIC_DIR.relative_to(REPO)}")
    print(f"updated heroImage in {CATALOG_PATH.relative_to(REPO)}")
    if skipped:
        print(f"note: skipped {len(skipped)} zip entries (see dry-run for detail)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
