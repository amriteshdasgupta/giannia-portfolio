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
        footer={<TitleStamp cells={["Giannia — portfolio", "Sheet 01", "Placeholder works"]} />}
      >
        <p className="sr-only" aria-live="polite">
          {label ? `${label}: ${shown.length} of ${works.length} works` : `All ${works.length} works`}
        </p>
        {view === "index" ? (
          <Schedule rows={shown} />
        ) : (
          <StickerField shown={shown} under={under} sizes={sizes} />
        )}
      </TraceShell>
    </MotionConfig>
  )
}

function StickerField({ shown, under, sizes }: { shown: Work[]; under: Work[]; sizes: Record<string, Size> }) {
  const [pointed, setPointed] = useState<string | null>(null)
  // The red loop belongs to whatever you point at, else the featured work
  const looped = pointed ?? shown.find((w) => w.featured)?.slug ?? null

  return (
    <LayoutGroup>
      <ul className="trace-field" aria-label="Works">
        {shown.map((w, i) => (
          <Sticker
            key={w.slug}
            work={w}
            size={sizes[w.slug]!}
            big={!!w.featured}
            looped={looped === w.slug}
            pointed={pointed === w.slug}
            onPoint={setPointed}
            eager={i < 5}
          />
        ))}
      </ul>

      {under.length > 0 ? (
        <div aria-hidden inert className="relative mt-20 lg:mt-28">
          <ul className="trace-sunk">
            {under.map((w) => (
              <Sticker key={w.slug} work={w} size={sizes[w.slug]!} sunk />
            ))}
          </ul>
          <motion.div
            className="trace-overlay tex-trace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.62 }}
            transition={SINK}
          />
        </div>
      ) : null}
    </LayoutGroup>
  )
}
