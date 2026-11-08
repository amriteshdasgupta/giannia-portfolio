import Link from "next/link"
import { kinds, works, type Kind } from "@/lib/works"
import { homeHref, type Filter } from "./scatter"

const options: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  ...kinds.map((k) => ({ value: k.value, label: k.label })),
]

const countOf = (f: Filter) => (f === "all" ? works.length : works.filter((w) => w.kind === f).length)

/** On the catalogue: one button per kind of work. */
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
          <span className="tab-count">
            <span className="sr-only">, </span>
            {countOf(o.value)}
            <span className="sr-only"> works</span>
          </span>
        </button>
      ))}
    </div>
  )
}

/** Off the catalogue: the same tabs as links back into it, the current kind marked. */
export function KindLinks({ current }: { current?: Kind }) {
  return (
    <nav aria-label="Catalogue" className="tabs">
      {options.map((o) => (
        <Link
          key={o.value}
          href={homeHref(o.value)}
          aria-current={o.value === current ? "page" : undefined}
          className="tab"
        >
          {o.label}
          <span className="tab-count">{countOf(o.value)}</span>
        </Link>
      ))}
    </nav>
  )
}
