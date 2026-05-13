"""Detect isometric journey map markers (green/teal/blue dots) in rasterized artwork.

Used by ``ingest_personae_journey_excel.py`` to place moment pills from pixel analysis
only (no hand-tuned per-persona coordinates in TS).

Requires ``pillow`` and ``numpy`` when running ingest with journey hotspot detection.
"""

from __future__ import annotations

import math
import platform
import shutil
import subprocess
import tempfile
from pathlib import Path
from typing import Iterable

import numpy as np
from PIL import Image


def rasterize_journey_asset(src: Path, dest_png: Path) -> bool:
    """Rasterize SVG (or copy raster) to ``dest_png``. Returns True on success."""
    dest_png.parent.mkdir(parents=True, exist_ok=True)
    suf = src.suffix.lower()
    if suf in (".png", ".jpg", ".jpeg", ".webp"):
        shutil.copyfile(src, dest_png)
        return dest_png.is_file()
    if suf != ".svg":
        return False

    if platform.system() == "Darwin" and shutil.which("qlmanage"):
        td = Path(tempfile.mkdtemp())
        try:
            subprocess.run(
                ["qlmanage", "-t", "-s", "2000", "-o", str(td), str(src)],
                check=True,
                capture_output=True,
            )
            produced = td / f"{src.name}.png"
            if produced.is_file():
                shutil.copyfile(produced, dest_png)
                return dest_png.is_file()
        except (FileNotFoundError, subprocess.CalledProcessError):
            pass

    if shutil.which("magick"):
        try:
            subprocess.run(
                ["magick", str(src), "-resize", "2000x2000", str(dest_png)],
                check=True,
                capture_output=True,
            )
            return dest_png.is_file()
        except (FileNotFoundError, subprocess.CalledProcessError):
            pass

    if shutil.which("rsvg-convert"):
        try:
            subprocess.run(
                ["rsvg-convert", "-w", "2000", str(src), "-o", str(dest_png)],
                check=True,
                capture_output=True,
            )
            return dest_png.is_file()
        except (FileNotFoundError, subprocess.CalledProcessError):
            pass

    return False


def _connected_components(mask: np.ndarray) -> list[list[tuple[int, int]]]:
    h, w = mask.shape
    vis = np.zeros_like(mask, dtype=bool)
    comps: list[list[tuple[int, int]]] = []
    for y in range(h):
        for x in range(w):
            if not mask[y, x] or vis[y, x]:
                continue
            stack = [(y, x)]
            vis[y, x] = True
            pts: list[tuple[int, int]] = []
            while stack:
                cy, cx = stack.pop()
                pts.append((cx, cy))
                for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                    ny, nx = cy + dy, cx + dx
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not vis[ny, nx]:
                        vis[ny, nx] = True
                        stack.append((ny, nx))
            comps.append(pts)
    return comps


def _rgb_to_hsv(rgb: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    diff = mx - mn + 1e-8
    h = np.zeros_like(mx)
    h = np.where((mx == r) & (diff > 1e-6), np.mod(((g - b) / diff), 6), h)
    h = np.where((mx == g) & (diff > 1e-6), (b - r) / diff + 2, h)
    h = np.where((mx == b) & (diff > 1e-6), (r - g) / diff + 4, h)
    h = (h / 6.0) % 1.0
    mx_safe = np.maximum(mx, 1e-6)
    s = diff / mx_safe
    v = mx
    return h, s, v


def _mask_rgb_dots(rgb: np.ndarray) -> np.ndarray:
    r = rgb[:, :, 0].astype(np.int16)
    g = rgb[:, :, 1].astype(np.int16)
    b = rgb[:, :, 2].astype(np.int16)
    green = (g > r + 52) & (g > b + 52) & (g > 115)
    blue = (b > r + 38) & (b > g + 22) & (b > 108)
    return green | blue


def _mask_hsv_markers(rgb_u8: np.ndarray) -> np.ndarray:
    img = rgb_u8.astype(np.float64) / 255.0
    hv, sv, vv = _rgb_to_hsv(img)
    return (sv > 0.32) & (vv > 0.28) & (vv < 0.98) & (
        ((hv > 0.22) & (hv < 0.58)) | ((hv > 0.52) & (hv < 0.78))
    ) & ~((sv < 0.10) & (vv > 0.90))


def _blob_chroma_score(rgb: np.ndarray, pts: list[tuple[int, int]]) -> float:
    acc = 0.0
    for cx, cy in pts:
        r, g, b = int(rgb[cy, cx, 0]), int(rgb[cy, cx, 1]), int(rgb[cy, cx, 2])
        acc += max(0, g - r) + max(0, g - b) + max(0, b - r) + max(0, b - g)
    return acc / max(len(pts), 1)


def _analyze_blobs(
    rgb: np.ndarray,
    mask: np.ndarray,
    y_min_ratio: float,
    area_lo: int,
    area_hi: int,
    max_side_ratio: float,
) -> list[tuple[float, float, float, int]]:
    """Return (cx%, cy%, score, area) per blob."""
    h, w, _ = rgb.shape
    max_side = max_side_ratio * max(h, w)
    out: list[tuple[float, float, float, int]] = []
    for pts in _connected_components(mask):
        area = len(pts)
        if not (area_lo < area < area_hi):
            continue
        xs = [p[0] for p in pts]
        ys = [p[1] for p in pts]
        bw = max(xs) - min(xs) + 1
        bh = max(ys) - min(ys) + 1
        side = max(bw, bh)
        cx = sum(xs) / len(xs)
        cy = sum(ys) / len(ys)
        if cy <= y_min_ratio * h or side > max_side:
            continue
        score = _blob_chroma_score(rgb, pts)
        out.append((100.0 * cx / w, 100.0 * cy / h, score, area))
    return out


def _dedupe(points: list[tuple[float, float, float, int]], thr_pct: float) -> list[tuple[float, float, float, int]]:
    kept: list[tuple[float, float, float, int]] = []
    for row in sorted(points, key=lambda p: -p[2]):
        x, y, sc, a = row
        if any(math.hypot(x - kx, y - ky) < thr_pct for kx, ky, _, _ in kept):
            continue
        kept.append(row)
    return kept


def _merge_close(points: list[tuple[float, float, float, int]], thr_pct: float) -> list[tuple[float, float, float, int]]:
    pts = sorted(points, key=lambda p: p[0])
    merged: list[list[float]] = []
    scores: list[float] = []
    areas: list[int] = []
    for x, y, sc, a in pts:
        if not merged:
            merged.append([x, y])
            scores.append(sc)
            areas.append(a)
            continue
        lx, ly = merged[-1]
        if math.hypot(x - lx, y - ly) < thr_pct:
            wa = float(areas[-1])
            wb = float(a)
            t = wa + wb
            merged[-1][0] = (lx * wa + x * wb) / t
            merged[-1][1] = (ly * wa + y * wb) / t
            scores[-1] = max(scores[-1], sc)
            areas[-1] = int(t)
        else:
            merged.append([x, y])
            scores.append(sc)
            areas.append(a)
    return [(m[0], m[1], scores[i], areas[i]) for i, m in enumerate(merged)]


def collect_marker_centroids_percent(png_path: Path) -> list[tuple[float, float]]:
    """Merged candidate marker centers (x%, y%) using RGB + HSV masks and chroma scoring."""
    rgb = np.array(Image.open(png_path).convert("RGB"))
    h, w, _ = rgb.shape
    raw: list[tuple[float, float, float, int]] = []
    for mask_fn, y_min, alo, ahi, msr in (
        (_mask_rgb_dots, 0.24, 125, 460, 0.038),
        (_mask_hsv_markers, 0.24, 100, 520, 0.042),
    ):
        m = mask_fn(rgb)
        raw.extend(_analyze_blobs(rgb, m, y_min, alo, ahi, msr))
    raw = _dedupe(raw, thr_pct=1.0)
    raw = _merge_close(raw, thr_pct=1.15)
    # Keep strongest chroma when still crowded
    raw = sorted(raw, key=lambda p: -p[2])
    trimmed = _dedupe(raw, thr_pct=1.6)
    return [(x, y) for x, y, _, _ in trimmed]


def _greedy_pick_n_along_x(points: list[tuple[float, float]], n: int) -> list[tuple[float, float]]:
    if n <= 0 or not points:
        return []
    sx = sorted(points, key=lambda p: p[0])
    for gap in (7.5, 6.0, 4.8, 3.5, 2.5, 1.8, 1.2):
        out: list[tuple[float, float]] = [sx[0]]
        for p in sx[1:]:
            if len(out) >= n:
                break
            if p[0] - out[-1][0] >= gap:
                out.append(p)
        if len(out) >= n:
            return out[:n]
    # Evenly subsample by index along sorted-x
    if len(sx) <= n:
        return sx
    idxs = [round(i * (len(sx) - 1) / max(n - 1, 1)) for i in range(n)]
    return [sx[i] for i in idxs]


def _order_nn_path(points: list[tuple[float, float]]) -> list[tuple[float, float]]:
    if not points:
        return []
    pool = list(points)
    start = min(pool, key=lambda p: p[0] + 0.32 * p[1])
    path = [start]
    pool.remove(start)
    while pool:
        last = path[-1]
        nxt = min(pool, key=lambda p: math.hypot(p[0] - last[0], p[1] - last[1]))
        path.append(nxt)
        pool.remove(nxt)
    return path


def hotspot_boxes_for_moments(
    png_path: Path,
    num_moments: int,
    pill_w: float,
    pill_h: float,
    above_dot_pct: float = 3.2,
) -> list[tuple[float, float, float, float]]:
    """Return ``(left, top, w, h)`` in % for each moment, aligned to detected markers."""
    if num_moments <= 0:
        return []
    centers = collect_marker_centroids_percent(png_path)
    if len(centers) < num_moments:
        raise ValueError(
            f"marker detection found {len(centers)} blob(s), need {num_moments}: {png_path}"
        )

    if len(centers) > num_moments:
        centers = _greedy_pick_n_along_x(centers, num_moments)
    if len(centers) < num_moments:
        raise ValueError(
            f"after spacing, only {len(centers)} marker(s), need {num_moments}: {png_path}"
        )

    ordered = _order_nn_path(list(centers))[:num_moments]

    boxes: list[tuple[float, float, float, float]] = []
    for cx, cy in ordered:
        tcx = max(pill_w / 2, min(100.0 - pill_w / 2, cx))
        tcy = max(pill_h / 2, min(100.0 - pill_h / 2, cy - above_dot_pct))
        left = tcx - pill_w / 2
        top = tcy - pill_h / 2
        boxes.append((left, top, pill_w, pill_h))
    return boxes
