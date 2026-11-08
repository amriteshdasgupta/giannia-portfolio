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


# White paper documents (essays), scanned on grey: cut exactly along the page
# and give it a white kiss-cut border, rather than following the text
RECT = {"on-thresholds", "reading-section"}


def page_sticker(img: Image.Image) -> Image.Image:
    rgb = img.convert("RGB")
    r, g, b = rgb.split()
    darkest = ImageChops.darker(ImageChops.darker(r, g), b)
    # the grey ground is flat; anything a few levels brighter is page
    w, h = darkest.size
    k = max(4, w // 40)
    ground = sorted(darkest.crop(c).resize((1, 1)).getpixel((0, 0)) for c in (
        (0, 0, k, k), (w - k, 0, w, k), (0, h - k, k, h), (w - k, h - k, w, h)))[1]
    cut = ground + 6
    paper = darkest.point(lambda v: 255 if v > cut else 0).filter(ImageFilter.MedianFilter(9))
    # keep only rows and columns that are mostly page, so a shadow or a
    # gradient in the ground can't widen the crop
    px = paper.load()
    cols = [x for x in range(w) if sum(px[x, y] > 0 for y in range(0, h, 4)) > h / 4 * 0.5]
    rows = [y for y in range(h) if sum(px[x, y] > 0 for x in range(0, w, 4)) > w / 4 * 0.5]
    box = (cols[0], rows[0], cols[-1] + 1, rows[-1] + 1) if cols and rows else (0, 0, w, h)
    page = rgb.crop(box)
    border = max(page.size) // 32
    out = Image.new("RGB", (page.width + 2 * border, page.height + 2 * border), "white")
    out.paste(page, (border, border))
    mask = Image.new("L", out.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, out.width - 1, out.height - 1), radius=border, fill=255)
    out = out.convert("RGBA")
    out.putalpha(mask)
    return out


def silhouette(img: Image.Image) -> Image.Image:
    small = img.convert("RGB").resize((WORK, WORK), Image.LANCZOS)
    r, g, b = small.split()
    darkest = ImageChops.darker(ImageChops.darker(r, g), b)
    ink = darkest.point(lambda v: 255 if v < INK_THRESHOLD else 0)
    ink = ink.filter(ImageFilter.MedianFilter(5))  # drop paper speckle

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

        if slug in RECT:
            sticker = page_sticker(img)
            sticker.thumbnail((900, 900), Image.LANCZOS)
            sticker.save(STICKER / f"{slug}.webp", quality=86, method=6)
            print(f"{slug}: page sticker {sticker.size[0]}x{sticker.size[1]}")
            continue

        # pad with white so drawings that touch the frame still get a closed outline
        pad = img.width // 14
        padded = Image.new("RGB", (img.width + 2 * pad, img.height + 2 * pad), "white")
        padded.paste(img, (pad, pad))
        img = padded

        mask = silhouette(img).resize((size, size), Image.LANCZOS)
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
