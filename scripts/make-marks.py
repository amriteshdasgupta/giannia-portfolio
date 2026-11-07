"""Cut the cut-paper direction's hand-made marks out of their scans.

assets/cut-paper-raw/
  crayon-*.png        wax crayon on white paper  -> unmixed from white, so the
                                                    crayon keeps its grain on any ground
  paper-chip*.png     torn/cut paper on black    -> silhouette keyed off the black
  arch.png            cut paper on white          -> keyed off the white

Writes transparent WebP to public/cut-paper/marks/<name>.webp.
Run: python3 scripts/make-marks.py   (needs Pillow)
"""

import pathlib

from PIL import Image, ImageChops, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "assets" / "cut-paper-raw"
OUT = ROOT / "public" / "cut-paper" / "marks"


def unmix_from_white(img: Image.Image) -> Image.Image:
    """Alpha = how far a pixel is from white; colour = what it would be at full alpha."""
    rgb = img.convert("RGB")
    r, g, b = rgb.split()
    darkest = ImageChops.darker(ImageChops.darker(r, g), b)
    # paper tooth below ~12 counts as blank paper
    alpha = darkest.point(lambda v: 0 if v > 243 else min(255, int((255 - v) * 1.15)))
    px, al = rgb.load(), alpha.load()
    out = Image.new("RGBA", rgb.size)
    op = out.load()
    w, h = rgb.size
    for y in range(h):
        for x in range(w):
            a = al[x, y]
            if a == 0:
                continue
            k = 255 / a
            p = px[x, y]
            op[x, y] = tuple(max(0, min(255, int(255 - (255 - c) * k))) for c in p) + (a,)
    return out


def key_off(img: Image.Image, background: str) -> Image.Image:
    rgb = img.convert("RGB")
    r, g, b = rgb.split()
    if background == "black":
        lightest = ImageChops.lighter(ImageChops.lighter(r, g), b)
        mask = lightest.point(lambda v: 255 if v > 45 else 0)
    else:
        darkest = ImageChops.darker(ImageChops.darker(r, g), b)
        mask = darkest.point(lambda v: 255 if v < 225 else 0)
    mask = mask.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(0.8))
    out = rgb.convert("RGBA")
    out.putalpha(mask)
    return out


def trim(img: Image.Image, pad: int = 6) -> Image.Image:
    box = img.getchannel("A").point(lambda v: 255 if v > 10 else 0).getbbox()
    if not box:
        return img
    l, t, r, b = box
    return img.crop((max(l - pad, 0), max(t - pad, 0), min(r + pad, img.width), min(b + pad, img.height)))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for path in sorted(RAW.glob("*.png")):
        name = path.stem
        img = Image.open(path)
        img.thumbnail((1200, 1200), Image.LANCZOS)
        if name.startswith("crayon"):
            out = unmix_from_white(img)
        elif name.startswith("paper-chip"):
            out = key_off(img, "black")
        else:
            out = key_off(img, "white")
        out = trim(out)
        out.save(OUT / f"{name}.webp", quality=88, method=6)
        print(f"{name}: {out.size[0]}x{out.size[1]}")


if __name__ == "__main__":
    main()
