"use client"

import { kinds, works } from "@/lib/works"
import type { Filter } from "./scatter"

const options: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  ...kinds.map((k) => ({ value: k.value, label: k.label })),
]

const countOf = (f: Filter) => (f === "all" ? works.length : works.filter((w) => w.kind === f).length)

/** One tab per kind of work, hanging off the left edge of the screen. */
export function FilterTabs({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  return (
    <div role="group" aria-label="Filter works by kind" className="tabs">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className="tab"
        >
          {o.label}
          <sup>
            <span className="sr-only">, </span>
            {countOf(o.value)}
            <span className="sr-only"> works</span>
          </sup>
        </button>
      ))}
    </div>
  )
}
