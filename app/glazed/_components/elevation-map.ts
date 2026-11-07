// Where each pane sits in the desktop elevation: a 12-column, 8-row bay.
// [column, column span, row, row span]. Every cell of the bay is glazed, so
// filler panes close the gaps between works. Order here is reading order,
// which is also the stacking order on tablet and phone.

export type Glass = "clear" | "cobalt" | "amber" | "oxblood"

type Area = [c: number, cs: number, r: number, rs: number]

export type Cell =
  | { type: "work"; slug: string; area: Area }
  | {
      type: "filler"
      glass: Glass
      area: Area
      /** Shown as a thin strip in the single-column phone stack */
      keepOnPhone?: boolean
      /** Closes the last gap in the two-column tablet stack */
      keepOnTablet?: boolean
    }

export const elevation: Cell[] = [
  { type: "work", slug: "bathhouse-canal", area: [1, 5, 1, 3] },
  { type: "filler", glass: "cobalt", area: [6, 1, 1, 2], keepOnPhone: true },
  { type: "work", slug: "threshold-library", area: [7, 5, 1, 2] },
  { type: "filler", glass: "clear", area: [12, 1, 1, 2] },
  { type: "filler", glass: "amber", area: [6, 1, 3, 1] },
  { type: "work", slug: "courtyard-housing", area: [7, 3, 3, 2] },
  { type: "work", slug: "ridge-pavilion", area: [10, 3, 3, 2] },
  { type: "work", slug: "stair-study", area: [1, 2, 4, 2] },
  { type: "work", slug: "timber-joints", area: [3, 3, 4, 2] },
  { type: "filler", glass: "oxblood", area: [6, 1, 4, 2], keepOnPhone: true },
  { type: "work", slug: "civita-sketches", area: [7, 4, 5, 2] },
  { type: "work", slug: "market-hall", area: [1, 4, 6, 2] },
  { type: "work", slug: "on-thresholds", area: [11, 2, 5, 2] },
  { type: "work", slug: "reading-section", area: [5, 2, 6, 2] },
  { type: "work", slug: "pavilion-rain", area: [7, 4, 7, 2] },
  { type: "work", slug: "wetland-observatory", area: [11, 2, 7, 2] },
  { type: "filler", glass: "clear", area: [1, 4, 8, 1] },
  { type: "filler", glass: "amber", area: [5, 1, 8, 1], keepOnPhone: true },
  { type: "filler", glass: "cobalt", area: [6, 1, 8, 1], keepOnTablet: true },
]

/** Offsets the glass texture so neighbouring panes are cut from different parts of the sheet. */
export const grainOffset = (i: number) => ({
  "--gx": `${(i * 173) % 520}px`,
  "--gy": `${(i * 311) % 520}px`,
})
