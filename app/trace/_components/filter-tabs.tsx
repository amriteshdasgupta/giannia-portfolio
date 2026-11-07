"use client"

import type { CSSProperties } from "react"
import { kinds, works } from "@/lib/works"
import { PencilUnderline } from "./pencil"
import type { Filter } from "./scatter"

// Each tab is cut and stuck on by hand, so none of them sit quite square
const TILTS = [-1.1, 0.7, -0.4, 0.9, -0.7, 0.4]

const options: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  ...kinds.map((k) => ({ value: k.value, label: k.label })),
]

const countOf = (f: Filter) => (f === "all" ? works.length : works.filter((w) => w.kind === f).length)

/** Index tabs sticking out of the sheet stack; one per kind of work. */
export function FilterTabs({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  return (
    <div role="group" aria-label="Filter works by kind" className="trace-tabs">
      {options.map((o, i) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className="trace-tab"
            style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` } as CSSProperties}
          >
            <span className="relative">
              {o.label}
              <PencilUnderline on={on} />
            </span>
            <span className="trace-tab-count">
              <span className="sr-only">, </span>
              {countOf(o.value)}
              <span className="sr-only"> works</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
