"""Strip the solid black background of hero-composite and save as true PNG.

The source file at `public/images/catalogue/assets/home/hero-composite.png`
is actually a JPEG without alpha. We build an alpha channel from luminance:
pixels that are effectively black become transparent, bright pixels stay
opaque, and a soft ramp in between prevents jaggies and dark halos.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageFilter

SRC = Path("public/images/catalogue/assets/home/hero-composite.png")
OUT = SRC  # overwrite in place so the existing <img src> keeps working

# Luminance threshold range. Below LOW = fully transparent,
# above HIGH = fully opaque, linear ramp in between.
LOW = 12.0   # anything dimmer than this is considered background
HIGH = 48.0  # anything brighter is considered subject

def main() -> None:
    img = Image.open(SRC).convert("RGB")
    w, h = img.size
    px = img.load()

    # Build an 8-bit alpha mask from luminance (Rec. 601).
    alpha = Image.new("L", (w, h), 0)
    ax = alpha.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            if lum <= LOW:
                a = 0
            elif lum >= HIGH:
                a = 255
            else:
                a = int(255 * (lum - LOW) / (HIGH - LOW))
            ax[x, y] = a

    # Very light gaussian blur smooths the cutout without eating the subject.
    alpha = alpha.filter(ImageFilter.GaussianBlur(radius=0.6))

    out = img.convert("RGBA")
    out.putalpha(alpha)
    out.save(OUT, format="PNG", optimize=True)
    print(f"Wrote {OUT} ({out.size[0]}x{out.size[1]}, RGBA)")


if __name__ == "__main__":
    main()
