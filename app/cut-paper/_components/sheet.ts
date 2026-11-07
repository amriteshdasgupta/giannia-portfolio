import type { Kind, Work } from "@/lib/works"
import { ink } from "./marks"

export type Size = "xl" | "l" | "m" | "s"

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

const cycle: Size[] = ["l", "s", "m", "s", "l", "m"]

/**
 * Each sticker keeps one size wherever it sits: the featured one is always
 * the largest, the rest are dealt from a fixed cycle by catalogue number.
 */
export function sizeOf(w: Work): Size {
  return w.featured ? "xl" : cycle[w.no % cycle.length]!
}

/** Per-slug hand placement: a resting tilt, a hover tilt and a small nudge. */
export function placement(slug: string) {
  const h = hash(slug)
  const unit = (shift: number) => ((h >>> shift) & 0xff) / 255 // 0..1
  const sign = h & 1 ? 1 : -1
  return {
    r: Math.round(sign * (1.2 + unit(8) * 2.6) * 10) / 10,
    // hover swings it back past level, a few degrees the other way
    r2: Math.round(-sign * (0.8 + unit(16) * 1.6) * 10) / 10,
    dx: Math.round((unit(4) - 0.5) * 16),
    dy: Math.round((unit(20) - 0.5) * 36),
  }
}

/** The colour each kind is filed under in the list view. */
export const kindColour: Record<Kind, string> = {
  studio: ink.cobalt,
  model: ink.leaf,
  sketch: ink.poppy,
  writing: ink.ink,
  competition: ink.ochre,
}
