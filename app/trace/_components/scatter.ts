import type { Kind } from "@/lib/works"

/** Deterministic 0..1 values seeded by a string (FNV-1a into xorshift). */
function seeded(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return ((h >>> 0) % 10000) / 10000
  }
}

/** How a sticker sits on the sheet: tilt, nudge and a little size variance. */
export function scatter(slug: string) {
  const next = seeded(slug)
  const rot = (next() * 2 - 1) * 3.2
  return {
    rot,
    rotSmall: rot * 0.45,
    dx: (next() * 2 - 1) * 9,
    dy: Math.round((next() * 2 - 1) * 26),
    grow: next(),
  }
}

export type Filter = Kind | "all"

export function homeHref(kind: Filter) {
  return kind === "all" ? "/trace" : `/trace?kind=${kind}`
}
