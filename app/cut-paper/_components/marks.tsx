// The hand-made marks: wax crayon and cut paper, scanned and cut out as
// transparent WebP (public/cut-paper/marks, made by scripts/make-marks.py).
// Always decorative, so they are CSS backgrounds rather than images.

export const ink = {
  cobalt: "#1a3bd1",
  leaf: "#4fa82a",
  poppy: "#e3261b",
  ochre: "#e4a72a",
  ink: "#1c1b19",
} as const

const files = {
  ring: "crayon-ring",
  sparks: "crayon-sparks",
  underline: "crayon-underline",
  box: "crayon-box",
  corner: "crayon-corner",
  chip: "paper-chip",
  chipCobalt: "paper-chip-cobalt",
  arch: "arch",
} as const

export type MarkName = keyof typeof files

export const markUrl = (name: MarkName) => `url(/cut-paper/marks/${files[name]}.webp)`

/** One mark, stretched to whatever box it is given. */
export function Mark({ name, className, style }: { name: MarkName; className?: string; style?: React.CSSProperties }) {
  return <span aria-hidden="true" className={`cp-mark ${className ?? ""}`} style={{ backgroundImage: markUrl(name), ...style }} />
}
