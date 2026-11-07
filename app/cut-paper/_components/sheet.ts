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

export type Slot = {
  col: number
  span: number
  row: number
  rows: number
  size: Size
}

// the two rows beside the featured piece, by how many pieces share them
const besideRows: Record<number, number[][]> = {
  1: [[7]],
  2: [[4, 3]],
  3: [[4, 3], [5]],
  4: [[4, 3], [3, 4]],
  5: [[3, 2, 2], [4, 3]],
  6: [[3, 2, 2], [2, 2, 3]],
}

const want: Record<Size, number> = { xl: 5, l: 4, m: 4, s: 3 }
const bySpan = (span: number): Size => (span >= 5 ? "l" : span === 4 ? "m" : "s")

/**
 * Lays the stickers on a 12-column desk (≥1024px). The featured sticker
 * takes five columns and two rows, and the next pieces are dealt into the two
 * rows beside it; the rest fill rows below in reading order. A piece that
 * would leave a sliver takes the rest of its row, and a short row is centred,
 * so rows never have holes.
 */
export function pack(list: Work[]): Slot[] {
  const slots: Slot[] = []
  const centre = (from: number, free: number) => {
    if (free > 0) for (let k = from; k < slots.length; k++) slots[k]!.col += Math.floor(free / 2)
  }

  let row = 1
  if (list[0]?.featured) {
    slots.push({ col: 1, span: 5, row: 1, rows: 2, size: "xl" })
    const rows = besideRows[Math.min(6, list.length - 1)] ?? []
    rows.forEach((spans, r) => {
      const from = slots.length
      let col = 6
      for (const span of spans) {
        slots.push({ col, span, row: 1 + r, rows: 1, size: span >= 4 ? "m" : "s" })
        col += span
      }
      centre(from, 13 - col)
    })
    row = 3
  }

  let col = 1
  let left = 12
  let rowStart = slots.length
  for (const w of list.slice(slots.length)) {
    let span = want[sizeOf(w)]
    // never leave a sliver: a piece that nearly fills the row takes all of it
    if (span > left || left - span < 3) span = left
    slots.push({ col, span, row, rows: 1, size: bySpan(span) })
    col += span
    left -= span
    if (left === 0) {
      row++
      col = 1
      left = 12
      rowStart = slots.length
    }
  }
  if (left < 12) centre(rowStart, left)
  return slots
}

/** Per-slug hand placement: a resting tilt, a hover tilt and a nudge off the grid. */
export function placement(slug: string) {
  const h = hash(slug)
  const unit = (shift: number) => ((h >>> shift) & 0xff) / 255 // 0..1
  const sign = h & 1 ? 1 : -1
  return {
    r: Math.round(sign * (1.2 + unit(8) * 2.6) * 10) / 10,
    // hover swings it back past level, a few degrees the other way
    r2: Math.round(-sign * (0.8 + unit(16) * 1.6) * 10) / 10,
    dx: Math.round((unit(4) - 0.5) * 80),
    dy: Math.round((unit(20) - 0.5) * 48),
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
