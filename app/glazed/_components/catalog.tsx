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
  const filterLabel = filters.find((f) => f.value === filter)!.label

  return (
    <>
      <section className="side" aria-label="Filter and view">
        <ul className="side__group side__group--filters" aria-label="Filter by kind">
          {filters.map((f, i) => (
            <li key={f.value}>
              <button
                type="button"
                className="pane glass lit toggle"
                style={grainOffset(20 + i) as Style}
                aria-pressed={filter === f.value}
                onClick={() => onFilter?.(f.value)}
              >
                <span className="relative z-[1]">{f.label}</span>
                <span className="toggle__count relative z-[1]">{countOf(f.value)}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="side__group side__group--view">
          <div className="view-pair" role="group" aria-label="View works as">
            <button
              type="button"
              className="pane glass lit toggle toggle--view"
              style={grainOffset(30) as Style}
              aria-pressed={view === "wall"}
              onClick={() => onView?.("wall")}
            >
              <span className="relative z-[1]">Wall</span>
            </button>
            <button
              type="button"
              className="pane glass lit toggle toggle--view"
              style={grainOffset(31) as Style}
              aria-pressed={view === "list"}
              onClick={() => onView?.("list")}
            >
              <span className="relative z-[1]">List</span>
            </button>
          </div>
          <p className="pane glass count" style={grainOffset(32) as Style} aria-live="polite">
            {filter === "all"
              ? `All ${works.length} works lit`
              : `${litCount} of ${works.length} lit: ${filterLabel.toLowerCase()}`}
          </p>
        </div>
        <div className="side__fill" aria-hidden="true">
          <div className="pane glass glass--oxblood" style={grainOffset(33) as Style} />
          <div className="side__fill-row">
            <div className="pane glass" style={grainOffset(34) as Style} />
            <div className="pane glass glass--amber" style={grainOffset(35) as Style} />
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
        const grain = grainOffset(40 + i) as Style

        if (cell.type === "filler") {
          const keep = [cell.keepOnPhone && "keep-1", cell.keepOnTablet && "keep-2"].filter(Boolean).join(" ")
          return (
            <li key={`f${i}`} className={`filler ${keep}`} style={place} aria-hidden="true">
              <div className={`pane glass glass--${cell.glass}`} style={grain} />
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
            <WorkPane work={work} style={grain} />
          </li>
        )
      })}
    </ul>
  )
}

function Schedule({ lit }: { lit: (w: Work) => boolean }) {
  return (
    <div className="schedule">
      <div className="pane glass schedule__head schedule__cols" style={grainOffset(60) as Style} aria-hidden="true">
        <span>No.</span>
        <span>Title</span>
        <span>Kind</span>
        <span>Year</span>
        <span>Context</span>
        <span>Medium</span>
      </div>
      <ol className="schedule" aria-label="Schedule of works">
        {works.map((w, i) => {
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
                style={grainOffset(61 + i) as Style}
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
                <span className="schedule__context schedule__muted">
                  <span className="sr-only">, </span>
                  {w.context}
                </span>
                <span className="schedule__medium schedule__muted">
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
