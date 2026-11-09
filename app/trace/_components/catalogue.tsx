"use client"

import Image from "next/image"
import Link from "next/link"
import { startTransition, useEffect, useState, ViewTransition, type CSSProperties } from "react"
import { about, kinds, kindLabel, stickerOf, works, type Work } from "@/lib/works"
import { FilterTabs } from "./filter-tabs"
import type { Size } from "./image-size"
import { homeHref, scatter, type Filter } from "./scatter"
import { Page, pad } from "./shell"

const years = works.map((w) => w.year)
const span = `${Math.min(...years)}–${Math.max(...years)}`

export function Catalogue({ initialKind, sizes }: { initialKind: Filter; sizes: Record<string, Size> }) {
  const [kind, setKind] = useState<Filter>(initialKind)
  // items rise in on first load only, not every time the filter brings one back
  const [intro, setIntro] = useState(true)
  useEffect(() => {
    const t = window.setTimeout(() => setIntro(false), 1800)
    return () => window.clearTimeout(t)
  }, [])

  const choose = (k: Filter) => {
    window.history.replaceState(null, "", homeHref(k))
    // a transition, so the grid reflows through a view transition
    startTransition(() => setKind(k))
  }

  const shown = works.filter((w) => kind === "all" || w.kind === kind)
  const label = kinds.find((k) => k.value === kind)?.label

  return (
    <Page
      strip={[
        <span key="name">{about.name}</span>,
        <h1 key="title">Catalogue of works</h1>,
        <span key="years">{span}</span>,
        <span key="count">
          {shown.length === works.length ? `${works.length} items` : `${shown.length} of ${works.length} items`}
        </span>,
      ]}
      side={<FilterTabs value={kind} onChange={choose} />}
      foot="Placeholder works"
    >
      <p className="sr-only" aria-live="polite">
        {label ? `${label}: ${shown.length} of ${works.length} works` : `All ${works.length} works`}
      </p>
      <ul className={`grid-cat ${intro ? "intro" : ""}`} aria-label="Works">
        {shown.map((w, i) => (
          <ViewTransition key={w.slug} name={`item-${w.slug}`}>
            <Item work={w} size={sizes[w.slug]!} index={i} big={!!w.featured && kind === "all"} />
          </ViewTransition>
        ))}
      </ul>
    </Page>
  )
}

function Item({ work: w, size, index, big }: { work: Work; size: Size; index: number; big: boolean }) {
  const { rot } = scatter(w.slug)
  return (
    <li className={`item ${big ? "is-big" : ""}`} style={{ "--i": index } as CSSProperties}>
      <Link href={`/trace/${w.slug}`} className="item-link">
        <span className="item-head" aria-hidden>
          <span>Nº {pad(w.no)}</span>
          <span>{kindLabel(w.kind)}</span>
        </span>
        <span className="item-plate">
          <ViewTransition name={`art-${w.slug}`} share="morph">
            <Image
              src={stickerOf(w)}
              alt=""
              width={size.width}
              height={size.height}
              sizes={big ? "(min-width: 1280px) 40vw, (min-width: 768px) 60vw, 92vw" : "(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 46vw"}
              loading={index < 6 ? "eager" : "lazy"}
              fetchPriority={big ? "high" : undefined}
              className="item-art"
              style={{ "--tilt": `${(rot * 0.6).toFixed(2)}deg` } as CSSProperties}
              draggable={false}
            />
          </ViewTransition>
        </span>
        <span className="item-foot">
          <span className="item-title">{w.title}</span>
          <span className="item-meta">
            {w.context}, {w.year}
          </span>
        </span>
      </Link>
    </li>
  )
}
