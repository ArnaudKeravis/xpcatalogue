#!/usr/bin/env python3
"""
Make persona portrait backgrounds transparent.

Most persona PNGs ship with a solid (near-black) background baked in rather
than an alpha channel. This script:

1. Samples each image's four corners to determine the background colour.
2. Builds a "near-background" candidate mask with a tolerance in RGB space.
3. Flood-fills that mask from the four corners so that ONLY pixels connected
   to the image border are marked as background — internal dark regions
   (hair, dark clothing, shadows) are preserved.
4. Writes alpha=0 on the flooded pixels and saves the image back in-place.

Run:
  .venv-img/bin/python scripts/knockout-persona-backgrounds.py [--dry-run] [--tolerance N]

Originals are safe in git history; `git restore public/images/...` if needed.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
PERSONA_DIR = ROOT / "public/images/catalogue/assets/personas"


def knockout(path: Path, tolerance: int, dry_run: bool) -> tuple[bool, str]:
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    h, w = arr.shape[:2]

    sample_size = min(20, w // 20, h // 20, 10)
    sample_size = max(sample_size, 4)

    corners = np.vstack(
        [
            arr[:sample_size, :sample_size].reshape(-1, 4),
            arr[:sample_size, w - sample_size :].reshape(-1, 4),
            arr[h - sample_size :, :sample_size].reshape(-1, 4),
            arr[h - sample_size :, w - sample_size :].reshape(-1, 4),
        ]
    )
    bg = corners[:, :3].mean(axis=0)
    corner_alpha = corners[:, 3].mean()

    if corner_alpha < 250:
        return False, f"skipped — corners already partially transparent (alpha≈{int(corner_alpha)})"

    if bg.max() > 20:
        return False, f"skipped — corners not dark enough (bg RGB≈{tuple(int(c) for c in bg)})"

    diff = arr[..., :3].astype(np.int32) - bg.astype(np.int32)
    dist = np.sqrt((diff**2).sum(axis=2))
    candidate = dist <= tolerance

    candidate_coverage = candidate.mean() * 100
    if candidate_coverage < 5:
        return False, f"skipped — only {candidate_coverage:.1f}% near-bg pixels (already clean)"

    mask_img = Image.fromarray((candidate * 255).astype(np.uint8)).copy()
    SENTINEL = 128
    for sx, sy in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        if candidate[sy, sx]:
            ImageDraw.floodfill(mask_img, (sx, sy), SENTINEL, thresh=0)

    filled = np.array(mask_img)
    bg_mask = filled == SENTINEL
    if not bg_mask.any():
        return False, "skipped — no border-connected background"

    arr[bg_mask, 3] = 0
    affected = bg_mask.mean() * 100

    if dry_run:
        return True, f"would knock out {affected:.1f}% (bg RGB ≈ {tuple(int(c) for c in bg)})"

    Image.fromarray(arr, "RGBA").save(path, format="PNG", optimize=True)
    return True, f"knocked out {affected:.1f}% (bg RGB ≈ {tuple(int(c) for c in bg)})"


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--tolerance", type=int, default=40, help="RGB distance threshold (0-441). Default 40.")
    p.add_argument("--dry-run", action="store_true", help="Report only, don't write.")
    p.add_argument("files", nargs="*", help="Specific files (default: all PNGs in personas/).")
    args = p.parse_args()

    paths = [Path(f) for f in args.files] if args.files else sorted(PERSONA_DIR.glob("*.png"))
    if not paths:
        print(f"No PNGs found in {PERSONA_DIR}", file=sys.stderr)
        return 1

    changed = 0
    for path in paths:
        try:
            did, msg = knockout(path, args.tolerance, args.dry_run)
        except Exception as e:  # noqa: BLE001
            print(f"  !! {path.name}: {e}")
            continue
        prefix = "✓ " if did else "  "
        print(f"{prefix}{path.name}: {msg}")
        if did:
            changed += 1

    verb = "would change" if args.dry_run else "changed"
    print(f"\n{verb} {changed}/{len(paths)} files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
