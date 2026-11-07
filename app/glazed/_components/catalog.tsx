"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { kindLabel, kinds, works, type Kind, type Work } from "@/lib/works"
import { elevation, grainOffset } from "./elevation-map"
import { WorkPane, pad } from "./work-pane"

type Filter = Kind | "all"
type View = "wall" | "list"
type Style = React.CSSProperties

const filters: { value: Filter; label: string }[] = [{ value: "all", label: "All" }, ...kinds]
const bySlug = new Map(works.map((w) => [w.slug, w]))
const countOf = (f: Filter) => (f === "all" ? works.length : works.filter((w) => w.kind === f).length)

const asFilter = (v: string | null): Filter =>
  kinds.some((k) => k.value === v) ? (v as Kind) : "all"
const asView = (v: string | null): View => (v === "list" ? "list" : "wall")

/** Reads filter and view from the URL so they survive opening a pane and coming back. */
export function CatalogFromParams() {
  const params = useSearchParams()
  const pathname = usePathname()

  const set = (key: "kind" | "view", value: string, fallback: string) => {
    const next = new URLSearchParams(params.toString())
    if (value === fallback) next.delete(key)
    else next.set(key, value)
    const qs = next.toString()
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <Catalog
      filter={asFilter(params.get("kind"))}
      view={asView(params.get("view"))}
      onFilter={(f) => set("kind", f, "all")}
      onView={(v) => set("view", v, "wall")}
    />
  )
}

export function Catalog({
  filter,
  view,
  onFilter,
  onView,
}: {
  filter: Filter
  view: View
  onFilter?: (f: Filter) => void
  onView?: (v: View) => void
}) {
  const lit = (w: Work) => filter === "all" || w.kind === filter
  const litCount = works.filter(lit).length

  return (
    <>
      <section className="side" aria-label="Filter and view">
        <ul className="side__group side__group--filters" aria-label="Filter by kind">
          {filters.map((f) => (
            <li key={f.value}>
              <button
                type="button"
                className="pane glass lit toggle"
                style={grainOffset(`filter:${f.value}`)}
                aria-pressed={filter === f.value}
                onClick={() => onFilter?.(f.value)}
              >
                <span>
                  {f.label}
                  <sup>{countOf(f.value)}</sup>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="view-pair" role="group" aria-label="View">
          <button
            type="button"
            className="pane glass lit toggle toggle--view"
            style={grainOffset("view:wall")}
            aria-pressed={view === "wall"}
            onClick={() => onView?.("wall")}
          >
            <span>Wall</span>
          </button>
          <button
            type="button"
            className="pane glass lit toggle toggle--view"
            style={grainOffset("view:list")}
            aria-pressed={view === "list"}
            onClick={() => onView?.("list")}
          >
            <span>List</span>
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {litCount} of {works.length} works shown
        </p>
        <div className="side__fill" aria-hidden="true">
          <div className="pane glass" style={grainOffset("side:fill-a")} />
          <div className="pane glass" style={grainOffset("side:fill-b")} />
          <div className="side__fill-row">
            <div className="pane glass" style={grainOffset("side:fill-c")} />
            <div className="pane glass" style={grainOffset("side:fill-d")} />
          </div>
        </div>
      </section>

      <main className="field" id="works">
        <h2 className="sr-only">Works</h2>
        {view === "wall" ? <Elevation lit={lit} /> : <Schedule lit={lit} />}
      </main>
    </>
  )
}

function Elevation({ lit }: { lit: (w: Work) => boolean }) {
  return (
    <ul className="elevation">
      {elevation.map((cell, i) => {
        const [c, cs, r, rs] = cell.area
        const place = { "--c": c, "--cs": cs, "--r": r, "--rs": rs } as Style

        if (cell.type === "filler") {
          return (
            <li key={`f${i}`} className={cell.closer ? "filler filler--closer" : "filler"} style={place} aria-hidden="true">
              <div className="pane glass" style={grainOffset(`filler:${i}`)} />
            </li>
          )
        }

        const work = bySlug.get(cell.slug)!
        const on = lit(work)
        return (
          <li
            key={work.slug}
            className={work.featured ? "is-featured" : undefined}
            style={place}
            data-frosted={on ? undefined : ""}
            aria-hidden={on ? undefined : true}
            inert={!on}
          >
            <WorkPane work={work} />
          </li>
        )
      })}
    </ul>
  )
}

function Schedule({ lit }: { lit: (w: Work) => boolean }) {
  return (
    <div className="schedule">
      <div className="pane glass schedule__head schedule__cols" style={grainOffset("schedule:head")} aria-hidden="true">
        <span>No.</span>
        <span>Title</span>
        <span>Kind</span>
        <span>Year</span>
        <span>Context</span>
        <span>Medium</span>
      </div>
      <ol className="schedule" aria-label="Schedule of works">
        {works.map((w) => {
          const on = lit(w)
          return (
            <li
              key={w.slug}
              className="grid"
              data-frosted={on ? undefined : ""}
              aria-hidden={on ? undefined : true}
              inert={!on}
            >
              <Link
                href={`/glazed/${w.slug}`}
                className="pane glass lit schedule__row schedule__cols"
                style={grainOffset(`row:${w.slug}`)}
              >
                <span className="schedule__no">{pad(w.no)}</span>
                <span className="schedule__title">{w.title}</span>
                <span className="schedule__kind">
                  <span className="sr-only">, </span>
                  {kindLabel(w.kind)}
                </span>
                <span className="schedule__year">
                  <span className="sr-only">, </span>
                  {w.year}
                </span>
                <span className="schedule__context soft">
                  <span className="sr-only">, </span>
                  {w.context}
                </span>
                <span className="schedule__medium soft">
                  <span className="sr-only">, </span>
                  {w.medium}
                </span>
                <span className="frost" aria-hidden="true" />
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
