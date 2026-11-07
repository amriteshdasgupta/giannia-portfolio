// Pencil linework: crisp vector strokes drawn the way a hand would,
// overshooting at the ends. Red is reserved for whatever is current.

const scalePath = (d: string, sx: number, sy: number) =>
  d.replace(/(-?\d+(?:\.\d+)?)[ ,]+(-?\d+(?:\.\d+)?)/g, (_, x, y) =>
    `${+(x * sx).toFixed(1)} ${+(y * sy).toFixed(1)}`,
  )

const ELLIPSE =
  "M150 6 C196 7 218 18 214 31 C209 47 160 53 104 52 C46 51 6 45 6 29 C6 13 52 5 112 4 C140 3 168 5 186 10"

/** Red pencil loop around a title. Draws itself when `on`. */
export function PencilEllipse({ on, big = false }: { on: boolean; big?: boolean }) {
  const [w, h] = big ? [440, 84] : [220, 56]
  const d = big ? scalePath(ELLIPSE, w / 220, h / 56) : ELLIPSE
  return (
    <svg
      aria-hidden
      className="pencil-draw pencil-ellipse"
      data-on={on}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      fill="none"
    >
      <path d={d} pathLength={1} stroke="currentColor" strokeWidth={big ? 2.2 : 1.7} strokeLinecap="round" />
    </svg>
  )
}

const UNDERLINE = "M3 6.5 C30 3.5 72 8.5 117 4.5 M16 10 C44 7.5 82 10 110 8"

/** Red double-stroke underline for the active tab or nav link. */
export function PencilUnderline({ on }: { on: boolean }) {
  return (
    <svg
      aria-hidden
      className="pencil-draw pencil-underline text-pencil-red"
      data-on={on}
      viewBox="0 0 120 12"
      preserveAspectRatio="none"
      fill="none"
    >
      <path d={UNDERLINE} pathLength={1} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  )
}

/** Graphite rule drawn under lettering, slightly longer than the word. */
export function GraphiteRule({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`block h-2 overflow-visible text-graphite ${className}`}
      viewBox="0 0 240 8"
      preserveAspectRatio="none"
      fill="none"
    >
      <path d="M1 4.5 C60 3 140 5.5 239 3.5" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" opacity={0.8} />
    </svg>
  )
}

/** Blue pencil leader: from the note down-left to a dot on the drawing. */
export function LeaderLine({ className = "leader", draw = false }: { className?: string; draw?: boolean }) {
  return (
    <svg aria-hidden className={`${className} ${draw ? "pencil-draw" : ""}`} viewBox="0 0 36 68" fill="none">
      <path d="M34 2 C24 8 12 24 5 61" pathLength={1} stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
      <circle cx={4.6} cy={63.5} r={2.4} fill="currentColor" />
    </svg>
  )
}

/** Small hand-drawn arrow; points left unless `dir="right"`. */
export function PencilArrow({ dir = "left" }: { dir?: "left" | "right" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 26 12"
      fill="none"
      className="inline-block h-[0.6em] w-[1.3em] shrink-0 overflow-visible"
      style={dir === "right" ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M25 6.3 C17 5.6 9 6.2 2.5 6 M8 1.5 C6 3.4 4 5 2 6 C4.2 7.3 6.2 8.8 8.2 10.6"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
