"""Turn raw work images (drawn on white) into web assets.

For every assets/works-raw/<slug>.png this writes:
  public/works/<slug>.jpg          the image as-is, 1400px, for framed/pane use
  public/works/sticker/<slug>.webp a die-cut sticker: the drawing's silhouette,
                                   closed into a smooth outline and grown by a
                                   white kiss-cut border, transparent outside.

Run: python3 scripts/make-stickers.py   (needs Pillow)
"""

import pathlib
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "assets" / "works-raw"
OUT = ROOT / "public" / "works"
STICKER = OUT / "sticker"

WORK = 512  # mask is computed at this size, then scaled back up
INK_THRESHOLD = 222  # any channel darker than this counts as drawing; faint vignette wash is cut away
CLOSE = 31  # px at WORK size: bridges gaps so the outline reads as one shape
BORDER = 13  # px at WORK size: width of the white kiss-cut border


# Paper documents (essays) are cut as a clean rounded rectangle, not a silhouette
RECT = {"on-thresholds", "reading-section"}


def page_rect(ink: Image.Image) -> Image.Image:
    box = ink.getbbox() or (0, 0, WORK, WORK)
    m = 14
    box = (max(box[0] - m, 0), max(box[1] - m, 0), min(box[2] + m, WORK), min(box[3] + m, WORK))
    mask = Image.new("L", (WORK, WORK), 0)
    ImageDraw.Draw(mask).rounded_rectangle(box, radius=10, fill=255)
    return mask


def silhouette(img: Image.Image, rect: bool = False) -> Image.Image:
    small = img.convert("RGB").resize((WORK, WORK), Image.LANCZOS)
    r, g, b = small.split()
    darkest = ImageChops.darker(ImageChops.darker(r, g), b)
    ink = darkest.point(lambda v: 255 if v < INK_THRESHOLD else 0)
    ink = ink.filter(ImageFilter.MedianFilter(5))  # drop paper speckle
    if rect:
        return page_rect(ink)

    # close: dilate then erode
    closed = ink.filter(ImageFilter.MaxFilter(CLOSE)).filter(ImageFilter.MinFilter(CLOSE))

    # fill holes: flood the background from a padded border, invert
    pad = Image.new("L", (WORK + 2, WORK + 2), 0)
    pad.paste(closed, (1, 1))
    ImageDraw.floodfill(pad, (0, 0), 128)
    filled = pad.crop((1, 1, WORK + 1, WORK + 1)).point(lambda v: 0 if v == 128 else 255)

    # grow by the border, then smooth the edge
    grown = filled.filter(ImageFilter.MaxFilter(BORDER | 1))
    return grown.filter(ImageFilter.GaussianBlur(4)).point(lambda v: 255 if v > 127 else 0)


def main() -> None:
    STICKER.mkdir(parents=True, exist_ok=True)
    raws = sorted(RAW.glob("*.png"))
    if not raws:
        sys.exit("no raw images in assets/works-raw")
    for path in raws:
        slug = path.stem
        img = Image.open(path).convert("RGB")
        size = 1400
        img.resize((size, size), Image.LANCZOS).save(OUT / f"{slug}.jpg", quality=86, optimize=True)

        # pad with white so drawings that touch the frame still get a closed outline
        pad = img.width // 14
        padded = Image.new("RGB", (img.width + 2 * pad, img.height + 2 * pad), "white")
        padded.paste(img, (pad, pad))
        img = padded

        mask = silhouette(img, slug in RECT).resize((size, size), Image.LANCZOS)
        mask = mask.filter(ImageFilter.GaussianBlur(1.2))
        sticker = img.resize((size, size), Image.LANCZOS).convert("RGBA")
        sticker.putalpha(mask)
        box = mask.point(lambda v: 255 if v > 8 else 0).getbbox()
        if box:
            sticker = sticker.crop(box)
        sticker.thumbnail((900, 900), Image.LANCZOS)
        sticker.save(STICKER / f"{slug}.webp", quality=86, method=6)
        print(f"{slug}: sticker {sticker.size[0]}x{sticker.size[1]}")


if __name__ == "__main__":
    main()
