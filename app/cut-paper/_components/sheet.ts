import type { Kind } from "@/lib/works"
import { ink } from "./marks"

export type Size = "xl" | "l" | "m" | "s"
export type Slot = { span: number; start?: number; size: Size }

// three stickers to a row, the big one wandering left, middle, right
const rows = [
  [5, 4, 3],
  [3, 5, 4],
  [4, 3, 5],
]
const sizeOf: Record<number, Size> = { 5: "l", 4: "m", 3: "s", 6: "m" }

/**
 * How stickers sit on the 12-column sheet. The first sticker, the featured
 * one in the full list, is always the biggest. A short last row is widened
 * and centred instead of leaving a hole.
 */
export function arrange(n: number): Slot[] {
  const slots: Slot[] = []
  for (let row = 0; slots.length < n; row++) {
    const left = n - slots.length
    if (left >= 3) rows[row % rows.length]!.forEach((span) => slots.push({ span, size: sizeOf[span]! }))
    else if (left === 2) slots.push({ span: 6, size: "m" }, { span: 6, size: "m" })
    else slots.push({ span: 6, start: 4, size: "m" })
  }
  if (slots[0]) slots[0].size = "xl"
  return slots
}

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

/** Per-slug hand placement: a resting tilt, a hover tilt and a small nudge. */
export function placement(slug: string) {
  const h = hash(slug)
  const unit = (shift: number) => ((h >>> shift) & 0xff) / 255 // 0..1
  const sign = h & 1 ? 1 : -1
  const r = sign * (1.2 + unit(8) * 2.8) // 1.2..4 deg either way
  return {
    r: Math.round(r * 10) / 10,
    // hover swings it back past level, a few degrees the other way
    r2: Math.round(-sign * (0.8 + unit(16) * 1.6) * 10) / 10,
    dx: Math.round((unit(4) - 0.5) * 24),
    dy: Math.round((unit(20) - 0.5) * 28),
  }
}

/** The cut-paper colour each kind is filed under. */
export const kindColour: Record<Kind, string> = {
  studio: ink.cobalt,
  model: ink.leaf,
  sketch: ink.poppy,
  writing: ink.ink,
  competition: ink.ochre,
}

/** Text colour that reads on that paper (white on the dark ones). */
export const kindText: Record<Kind, string> = {
  studio: "#fff",
  model: "#fff",
  sketch: "#fff",
  writing: "#fff",
  competition: ink.ink,
}
