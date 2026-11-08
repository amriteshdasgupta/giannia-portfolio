import type { CSSProperties } from "react"
import type { Kind } from "@/lib/works"
import type { Filter } from "./scatter"

// One colour per kind of work, taken from the drafting desk: blueprint
// cobalt, chipboard, sage pencil, red correction pencil, marker yellow.
// `on` is the text colour that holds contrast on the full swatch.
const swatches: Record<Kind | "all", { k: string; on: string }> = {
  all: { k: "#141413", on: "#f3f2ee" },
  studio: { k: "#2f4fb5", on: "#ffffff" },
  model: { k: "#8a6236", on: "#ffffff" },
  sketch: { k: "#4b7650", on: "#ffffff" },
  writing: { k: "#b63f2e", on: "#ffffff" },
  competition: { k: "#dba92a", on: "#141413" },
}

/** CSS variables for a kind's colour: --k (swatch) and --on (text on it). */
export const kindVars = (kind: Filter): CSSProperties =>
  ({ "--k": swatches[kind].k, "--on": swatches[kind].on }) as CSSProperties
