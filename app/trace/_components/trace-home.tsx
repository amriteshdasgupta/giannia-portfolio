"use client"

import { LayoutGroup, MotionConfig, motion } from "framer-motion"
import { useState } from "react"
import { kinds, works, type Work } from "@/lib/works"
import { FilterTabs } from "./filter-tabs"
import type { Size } from "./image-size"
import { Masthead } from "./masthead"
import { homeHref, type Filter, type View } from "./scatter"
import { Schedule } from "./schedule"
import { TitleStamp, TraceShell } from "./shell"
import { SINK, Sticker } from "./sticker"

export function TraceHome({
  initialKind,
  initialView,
  sizes,
}: {
  initialKind: Filter
  initialView: View
  sizes: Record<string, Size>
}) {
  const [kind, setKind] = useState<Filter>(initialKind)
  const [view, setView] = useState<View>(initialView)

  // Keep the address shareable without a server round trip
  const sync = (k: Filter, v: View) => window.history.replaceState(null, "", homeHref({ kind: k, view: v }))
  const choose = (k: Filter) => {
    setKind(k)
    sync(k, view)
  }
  const showView = (v: View) => {
    setView(v)
    sync(kind, v)
    window.scrollTo({ top: 0 })
  }

  const matches = (w: Work) => kind === "all" || w.kind === kind
  const shown = works.filter(matches)
  const under = works.filter((w) => !matches(w))
  const label = kinds.find((k) => k.value === kind)?.label

  return (
    <MotionConfig reducedMotion="user">
      <TraceShell
        header={
          <Masthead
            current={view === "index" ? "index" : "sheet"}
            indexHref={homeHref({ kind, view: view === "index" ? "sheet" : "index" })}
            onIndexClick={() => showView(view === "index" ? "sheet" : "index")}
          />
        }
        aside={<FilterTabs value={kind} onChange={choose} />}
        footer={<TitleStamp>Sheet 01 of 01 · placeholder works</TitleStamp>}
      >
        <p className="sr-only" aria-live="polite">
          {label ? `${label}: ${shown.length} of ${works.length} works` : `All ${works.length} works`}
        </p>
        {view === "index" ? (
          <Schedule rows={shown} onShowSheet={() => showView("sheet")} />
        ) : (
          <StickerField shown={shown} under={under} sizes={sizes} onShowAll={() => choose("all")} />
        )}
      </TraceShell>
    </MotionConfig>
  )
}

function StickerField({
  shown,
  under,
  sizes,
  onShowAll,
}: {
  shown: Work[]
  under: Work[]
  sizes: Record<string, Size>
  onShowAll: () => void
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  // The red loop belongs to whatever you point at, else the featured work
  const current = hovered ?? shown.find((w) => w.featured)?.slug ?? null

  return (
    <LayoutGroup>
      <ul className="trace-field" aria-label="Works">
        {shown.map((w, i) => (
          <Sticker
            key={w.slug}
            work={w}
            size={sizes[w.slug]!}
            big={!!w.featured}
            hot={current === w.slug}
            onHot={setHovered}
            priority={i < 5}
          />
        ))}
      </ul>

      {under.length > 0 ? (
        <div className="relative mt-14 lg:mt-24">
          <p className="relative z-10 font-hand text-[1.0625rem] text-pencil-blue lg:text-[1.1875rem]">
            {under.length} more under the next sheet ·{" "}
            <button
              type="button"
              onClick={onShowAll}
              className="cursor-pointer underline decoration-1 underline-offset-[0.22em] hover:decoration-2"
            >
              lift them all back
            </button>
          </p>
          <div aria-hidden inert className="relative mt-8">
            <ul className="trace-sunk">
              {under.map((w) => (
                <Sticker key={w.slug} work={w} size={sizes[w.slug]!} sunk />
              ))}
            </ul>
            <motion.div
              className="trace-overlay tex-trace"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={SINK}
            />
          </div>
        </div>
      ) : null}
    </LayoutGroup>
  )
}
