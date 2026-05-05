#!/usr/bin/env python3
"""Split catalogue image roles: solution-descriptions → descriptionImage; solutions/ → heroImage.

Run once after adopting two-zip workflow. Safe to re-run (skips rows that already have descriptionImage).

Reads hero file extensions from public/images/catalogue/assets/solutions/.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CAT = REPO / "src/lib/data/solutionsCatalog.ts"
SOL_DIR = REPO / "public/images/catalogue/assets/solutions"


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


def disk_hero_ext_by_id() -> dict[str, str]:
    out: dict[str, str] = {}
    if not SOL_DIR.is_dir():
        return out
    for p in SOL_DIR.iterdir():
        if p.is_file():
            out[p.stem] = p.suffix.lower().lstrip(".")
    return out


def transform_block(block: str, sid: str, ext_map: dict[str, str]) -> str:
    if re.search(r"\bdescriptionImage\s*:", block):
        return block

    m = re.search(r"heroImage\s*:\s*(\"[^\"]+\"|HERO)", block)
    if not m:
        return block
    raw = m.group(1)
    if raw == "HERO":
        return block

    hero_path = raw.strip('"')
    if "solution-descriptions" in hero_path:
        ext = ext_map.get(sid, "")
        if ext:
            new_hero = f'"/images/catalogue/assets/solutions/{sid}.{ext}"'
        else:
            new_hero = "HERO"
        replacement = f'descriptionImage: "{hero_path}",\n    heroImage: {new_hero}'
        return block[: m.start()] + replacement + block[m.end() :]

    if "solutions/" in hero_path and (REPO / hero_path.lstrip("/")).is_file():
        desc_file = REPO / f"public/images/catalogue/assets/solution-descriptions/{sid}.png"
        if not desc_file.is_file():
            return block
        insert = f'    descriptionImage: "/images/catalogue/assets/solution-descriptions/{sid}.png",\n'
        # place descriptionImage before heroImage line
        return block[: m.start()] + insert + block[m.start() :]

    return block


def main() -> int:
    text = CAT.read_text(encoding="utf-8")
    ext_map = disk_hero_ext_by_id()
    ids = re.findall(r'^\s+id:\s*"([^"]+)"\s*,?\s*$', text, re.MULTILINE)

    patches: list[tuple[int, int, str]] = []
    seen: set[str] = set()
    for sid in ids:
        if sid in seen:
            continue
        seen.add(sid)
        span = extract_object_span(text, sid)
        if not span:
            print(f"warn: no span for {sid}")
            continue
        a, b = span
        new_block = transform_block(text[a:b], sid, ext_map)
        if new_block != text[a:b]:
            patches.append((a, b, new_block))

    patches.sort(key=lambda x: -x[0])
    for a, b, nb in patches:
        text = text[:a] + nb + text[b:]

    CAT.write_text(text, encoding="utf-8")
    print(f"updated {len(patches)} solution entries in {CAT.relative_to(REPO)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
