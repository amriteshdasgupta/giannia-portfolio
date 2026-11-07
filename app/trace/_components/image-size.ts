import { readFileSync } from "node:fs"
import path from "node:path"

export type Size = { width: number; height: number }

const FALLBACK: Size = { width: 1000, height: 1000 }

/** Pixel size of an image in /public, read from its header (PNG, WebP, JPEG). Server only. */
export function imageSize(publicPath: string): Size {
  try {
    const buf = readFileSync(path.join(process.cwd(), "public", publicPath))

    if (buf.readUInt32BE(0) === 0x89504e47) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
    }

    if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
      const chunk = buf.toString("ascii", 12, 16)
      if (chunk === "VP8X") {
        return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) }
      }
      if (chunk === "VP8L") {
        const bits = buf.readUInt32LE(21)
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
      }
      if (chunk === "VP8 ") {
        return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff }
      }
    }

    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let o = 2
      while (o + 9 < buf.length) {
        if (buf[o] !== 0xff) {
          o++
          continue
        }
        const marker = buf[o + 1]!
        const isFrame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)
        if (isFrame) return { height: buf.readUInt16BE(o + 5), width: buf.readUInt16BE(o + 7) }
        o += 2 + buf.readUInt16BE(o + 2)
      }
    }
  } catch {
    // missing or unreadable file: fall through
  }
  return FALLBACK
}
