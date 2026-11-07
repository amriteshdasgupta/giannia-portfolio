// Where each pane sits in the desktop elevation: a 12-column, 8-row bay.
// [column, column span, row, row span]. Every cell of the bay is glazed, so
// clear filler panes close the gaps between works. Order here is reading order,
// which is also the stacking order on tablet and phone.

type Area = [c: number, cs: number, r: number, rs: number]

export type Cell =
  | { type: "work"; slug: string; area: Area }
  | {
      type: "filler"
      area: Area
      /** The one filler kept in the stacked layouts, to close the last gap in the two-column wall */
      closer?: boolean
    }

export const elevation: Cell[] = [
  { type: "work", slug: "bathhouse-canal", area: [1, 5, 1, 3] },
  { type: "filler", area: [6, 1, 1, 2] },
  { type: "work", slug: "threshold-library", area: [7, 5, 1, 2] },
  { type: "filler", area: [12, 1, 1, 2] },
  { type: "filler", area: [6, 1, 3, 1] },
  { type: "work", slug: "courtyard-housing", area: [7, 3, 3, 2] },
  { type: "work", slug: "ridge-pavilion", area: [10, 3, 3, 2] },
  { type: "work", slug: "stair-study", area: [1, 2, 4, 2] },
  { type: "work", slug: "timber-joints", area: [3, 3, 4, 2] },
  { type: "filler", area: [6, 1, 4, 2] },
  { type: "work", slug: "civita-sketches", area: [7, 4, 5, 2] },
  { type: "work", slug: "market-hall", area: [1, 4, 6, 2] },
  { type: "work", slug: "on-thresholds", area: [11, 2, 5, 2] },
  { type: "work", slug: "reading-section", area: [5, 2, 6, 2] },
  { type: "work", slug: "pavilion-rain", area: [7, 4, 7, 2] },
  { type: "work", slug: "wetland-observatory", area: [11, 2, 7, 2] },
  { type: "filler", area: [1, 4, 8, 1] },
  { type: "filler", area: [5, 1, 8, 1] },
  { type: "filler", area: [6, 1, 8, 1], closer: true },
]

/** FNV-1a: a small stable hash so every pane gets the same light on every render. */
const hash = (key: string) => {
  let h = 0x811c9dc5
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/**
 * Each pane is cut from a different part of the seeded sheet and catches a
 * slightly different amount of light from behind, so the wall reads as
 * separate panes of real glass rather than one flat print.
 */
export const grainOffset = (key: string | number) => {
  const h = hash(String(key))
  return {
    "--gx": `${h % 860}px`,
    "--gy": `${(h >>> 10) % 860}px`,
    // Daylight wash between 0.48 and 0.64: subtle, and always enough for text contrast.
    "--lum": (0.48 + ((h >>> 20) % 17) / 100).toFixed(2),
  } as React.CSSProperties
}

/** Applied by hand: every sticker sits 1–2° off square, the same way every time. */
export const tiltOf = (no: number) => {
  const deg = 1 + ((no * 7) % 3) * 0.5
  return { "--tilt": `${no % 2 ? deg : -deg}deg` } as React.CSSProperties
}
