// Server only: reads files from public/.
import { readFileSync } from "node:fs"
import path from "node:path"
import { imageOf, stickerOf, type Work } from "@/lib/works"

export type Dims = { w: number; h: number }

/** Reads width/height straight from the WebP header (VP8X, VP8L or VP8). */
function webpSize(buf: Buffer): Dims | null {
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") return null
  const chunk = buf.toString("ascii", 12, 16)
  if (chunk === "VP8X") {
    return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) }
  }
  if (chunk === "VP8L") {
    const b = buf.readUInt32LE(21)
    return { w: 1 + (b & 0x3fff), h: 1 + ((b >> 14) & 0x3fff) }
  }
  if (chunk === "VP8 ") {
    return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff }
  }
  return null
}

/** Reads width/height from a JPEG's start-of-frame marker. */
function jpegSize(buf: Buffer): Dims | null {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null
  let i = 2
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) return null
    const marker = buf[i + 1]!
    const len = buf.readUInt16BE(i + 2)
    // SOF0..SOF15, minus DHT (C4), JPG (C8) and DAC (CC)
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) }
    }
    i += 2 + len
  }
  return null
}

/** Intrinsic size of a work's full rectangular drawing. */
export function imageDims(w: Work): Dims {
  try {
    return jpegSize(readFileSync(path.join(process.cwd(), "public", imageOf(w)))) ?? { w: 1400, h: 1000 }
  } catch {
    return { w: 1400, h: 1000 }
  }
}

/** Intrinsic sticker sizes, so the sheet lays out before the images arrive. */
export function stickerDims(list: Work[]): Record<string, Dims> {
  const out: Record<string, Dims> = {}
  for (const w of list) {
    try {
      const file = path.join(process.cwd(), "public", stickerOf(w))
      out[w.slug] = webpSize(readFileSync(file)) ?? { w: 1000, h: 1000 }
    } catch {
      out[w.slug] = { w: 1000, h: 1000 }
    }
  }
  return out
}
