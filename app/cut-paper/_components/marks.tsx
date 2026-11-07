// Hand-made marks: crayon strokes and cut-paper shapes. All decorative,
// all aria-hidden, all deterministic (seeded, never Math.random).

export const ink = {
  cobalt: "#1f4fbf",
  leaf: "#2f8a3b",
  poppy: "#db3b27",
  ochre: "#e4a72a",
  ink: "#1c1b19",
} as const

type Svg = { className?: string }

const crayon = {
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const

/** Small seeded generator so every render draws the same strokes. */
export function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const r1 = (n: number) => Math.round(n * 10) / 10

/** Cobalt underline that overshoots its word, with a second lighter pass. */
export function Underline({ className, color = ink.cobalt }: Svg & { color?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 240 22" preserveAspectRatio="none" className={`cp-crayon ${className ?? ""}`}>
      <g stroke={color} {...crayon}>
        <path d="M3 16 C 60 10, 140 7, 236 5" strokeWidth="5" />
        <path d="M22 18 C 90 13, 170 10, 226 9" strokeWidth="2.5" opacity="0.7" />
      </g>
    </svg>
  )
}

/** Wobbly hand-drawn box whose corners overshoot, for the nav links. */
export function CrayonBox({ className, color = ink.cobalt }: Svg & { color?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 120 50" preserveAspectRatio="none" className={`cp-crayon ${className ?? ""}`}>
      <g stroke={color} {...crayon} vectorEffect="non-scaling-stroke">
        <path
          d="M14 6 C 45 2, 85 5, 110 4 C 118 5, 118 12, 117 22 C 116 32, 119 41, 112 45 C 80 48, 40 45, 10 47 C 3 45, 3 38, 4 26 C 4 16, 2 7, 12 5 C 20 3, 30 5, 40 7"
          strokeWidth="3.2"
          vectorEffect="non-scaling-stroke"
        />
        <path d="M16 10 C 50 6, 88 9, 111 7 M 112 43 C 80 45, 42 42, 9 44" strokeWidth="1.5" opacity="0.55" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  )
}

/** Three little ticks fanned off one side, like the active chip's sparks. */
export function Sparks({ className, side = "left", color = ink.cobalt }: Svg & { side?: "left" | "right"; color?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 34 40"
      className={`cp-crayon ${className ?? ""}`}
      style={side === "right" ? { transform: "scaleX(-1)" } : undefined}
    >
      <g stroke={color} strokeWidth="3.6" {...crayon}>
        <path d="M30 11 L 17 4" />
        <path d="M30 20 L 12 20" />
        <path d="M30 29 L 17 36" />
      </g>
    </svg>
  )
}

/** Full-width cobalt crayon rule. */
export function CrayonRule({ className, color = ink.cobalt }: Svg & { color?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 1000 14" preserveAspectRatio="none" className={`cp-crayon block h-3.5 w-full ${className ?? ""}`}>
      <g stroke={color} {...crayon}>
        <path d="M2 8 C 200 5, 420 9, 640 6 S 900 7, 998 5" strokeWidth="4" vectorEffect="non-scaling-stroke" />
        <path d="M30 10 C 260 8, 520 10, 760 8" strokeWidth="1.6" opacity="0.6" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  )
}

/**
 * Crayon hatching bleeding off the top-right edge: cobalt rays, a leaf-green
 * scribble fill, a few poppy-red strokes. Anchored to the page corner.
 */
export function CornerFlourish({ className }: Svg) {
  const rand = seeded(1979)
  const O = { x: 384, y: -18 }
  const at = (r: number, deg: number) => {
    const a = (deg * Math.PI) / 180
    return [r1(O.x + r * Math.cos(a)), r1(O.y + r * Math.sin(a))] as const
  }

  const rays = (count: number, from: number, to: number, rIn: [number, number], rOut: [number, number]) =>
    Array.from({ length: count }, (_, i) => {
      const deg = from + ((to - from) * i) / (count - 1) + (rand() - 0.5) * 1.6
      const a = at(rIn[0] + rand() * (rIn[1] - rIn[0]), deg)
      const b = at(rOut[0] + rand() * (rOut[1] - rOut[0]), deg + (rand() - 0.5) * 2)
      const bend = (rand() - 0.5) * 8
      const mx = r1((a[0] + b[0]) / 2 + bend)
      const my = r1((a[1] + b[1]) / 2 - bend)
      return { d: `M${a[0]} ${a[1]} Q ${mx} ${my}, ${b[0]} ${b[1]}`, w: r1(5 + rand() * 3.5) }
    })

  // a scribble fill: one stroke zig-zagging between two radii across a wedge
  const scribble = (from: number, to: number, rA: number, rB: number, steps: number) => {
    const pts: string[] = []
    for (let i = 0; i <= steps; i++) {
      const deg = from + ((to - from) * i) / steps
      const [x, y] = at((i % 2 ? rB : rA) + (rand() - 0.5) * 14, deg + (rand() - 0.5) * 1.2)
      pts.push(`${i === 0 ? "M" : "L"}${x} ${y}`)
    }
    return pts.join(" ")
  }

  const blue = rays(15, 152, 176, [96, 130], [250, 310])
  const red = rays(7, 132, 146, [40, 64], [150, 200])

  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 384 260" preserveAspectRatio="xMaxYMin meet" className={`cp-crayon ${className ?? ""}`}>
      <g {...crayon}>
        <g stroke={ink.cobalt}>
          {blue.map((s) => (
            <path key={s.d} d={s.d} strokeWidth={s.w} />
          ))}
        </g>
        <g stroke={ink.leaf}>
          <path d={scribble(100, 128, 110, 250, 30)} strokeWidth="7" />
          <path d={scribble(103, 125, 140, 236, 18)} strokeWidth="4" opacity="0.8" />
        </g>
        <g stroke={ink.poppy}>
          {red.map((s) => (
            <path key={s.d} d={s.d} strokeWidth={s.w - 1} />
          ))}
          <path d={scribble(92, 104, 18, 92, 12)} strokeWidth="6" />
        </g>
      </g>
    </svg>
  )
}

/** Cut-paper mark beside the name: a green arch with its doorway cut out. */
export function ArchMark({ className }: Svg) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 96 112" className={`overflow-visible ${className ?? ""}`}>
      <g className="cp-torn">
        <path
          fill={ink.leaf}
          fillRule="evenodd"
          d="M14 108 L 15 50 C 16 24, 31 13, 49 12 C 68 12, 82 25, 83 51 L 85 109 Z M 38 109 L 39 72 C 40 63, 44 58, 50 58 C 56 58, 61 63, 61 72 L 62 109 Z"
        />
      </g>
      <g className="cp-crayon" stroke={ink.poppy} strokeWidth="3.6" {...crayon}>
        <path d="M14 22 L 4 14" />
        <path d="M26 9 L 22 -2" />
        <path d="M73 9 L 79 -1" />
      </g>
    </svg>
  )
}

/** Small crayon arrow pointing back, for "all works". */
export function CrayonArrow({ className, color = ink.cobalt }: Svg & { color?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 40 24" className={`cp-crayon ${className ?? ""}`}>
      <g stroke={color} strokeWidth="3.2" {...crayon}>
        <path d="M38 13 C 28 12, 16 12, 4 12" />
        <path d="M13 3 L 3 12 L 14 21" />
      </g>
    </svg>
  )
}

/** Cut-paper arrow for prev / next, pointing left or right. */
export function PaperArrow({ className, color = ink.cobalt, dir = "right" }: Svg & { color?: string; dir?: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 120 64"
      className={`cp-torn overflow-visible ${className ?? ""}`}
      style={dir === "left" ? { transform: "scaleX(-1)" } : undefined}
    >
      <path fill={color} d="M3 22 L 72 20 L 70 4 L 117 33 L 71 61 L 73 44 L 4 43 Z" />
    </svg>
  )
}
