#!/usr/bin/env python3
"""
Generates public/og-default.png — the single site-wide Open Graph card (Q24/B).

Deliberately simple: one static card for every page, rather than per-Post
generated images. Re-run after editing NAME/TAGLINE below, or once you have a
domain:

    python3 scripts/make-og-image.py

If you later want per-Post cards, replace this with astro-og-canvas or satori;
nothing in the content model has to change.
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

# Keep these in step with src/site.config.ts
NAME = "Fu Lim"
TAGLINE = "Backend Engineer"
BLURB = "Projects, career, and writing about how software works."

W, H = 1200, 630
BG = (22, 22, 31)
FG = (214, 214, 230)
MUTED = (154, 154, 181)

# The five accent colours from the top stripe, so the card is recognisably
# part of the same site.
STRIPE = [
    (213, 94, 0),
    (230, 159, 0),
    (0, 158, 115),
    (86, 180, 233),
    (204, 121, 167),
]

FONT_CANDIDATES = {
    "bold": [
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ],
    "regular": [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ],
    "mono": [
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    ],
}


def load(kind: str, size: int):
    for path in FONT_CANDIDATES[kind]:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default(size)


def main() -> None:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # Top stripe, matching the site chrome.
    seg = W / len(STRIPE)
    for i, colour in enumerate(STRIPE):
        d.rectangle([i * seg, 0, (i + 1) * seg, 14], fill=colour)

    pad = 90
    d.text((pad, 150), TAGLINE.upper(), font=load("mono", 26), fill=STRIPE[0])
    d.text((pad, 200), NAME, font=load("bold", 92), fill=FG)
    d.text((pad, 330), BLURB, font=load("regular", 34), fill=MUTED)

    d.line([(pad, 470), (W - pad, 470)], fill=(51, 51, 74), width=2)
    d.text((pad, 500), "Read the blog", font=load("regular", 30), fill=MUTED)

    out = Path(__file__).resolve().parent.parent / "public" / "og-default.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)
    print(f"wrote {out} ({out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
