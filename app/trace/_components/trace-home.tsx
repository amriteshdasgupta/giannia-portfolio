"use client"

import { LayoutGroup, MotionConfig } from "framer-motion"
import { useState } from "react"
import { kinds, works, type Work } from "@/lib/works"
import { FilterTabs } from "./filter-tabs"
import type { Size } from "./image-size"
import { homeHref, type Filter } from "./scatter"
import { Page } from "./shell"
import { Sticker } from "./sticker"

export function TraceHome({ initialKind, sizes }: { initialKind: Filter; sizes: Record<string, Size> }) {
  const [kind, setKind] = useState<Filter>(initialKind)

  // Keep the address shareable without a server round trip
  const choose = (k: Filter) => {
    setKind(k)
    window.history.replaceState(null, "", homeHref(k))
  }

  const matches = (w: Work) => kind === "all" || w.kind === kind
  const shown = works.filter(matches)
  const aside = works.filter((w) => !matches(w))
  const label = kinds.find((k) => k.value === kind)?.label

  return (
    <MotionConfig reducedMotion="user">
      <Page home aside={<FilterTabs value={kind} onChange={choose} />} foot="Placeholder works">
        <p className="sr-only" aria-live="polite">
          {label ? `${label}: ${shown.length} of ${works.length} works` : `All ${works.length} works`}
        </p>
        <LayoutGroup>
          <ul className="field" aria-label="Works">
            {shown.map((w, i) => (
              <Sticker key={w.slug} work={w} size={sizes[w.slug]!} big={!!w.featured} eager={i < 6} />
            ))}
          </ul>
          {aside.length > 0 ? (
            <ul aria-hidden inert className="set-aside">
              {aside.map((w) => (
                <Sticker key={w.slug} work={w} size={sizes[w.slug]!} setAside />
              ))}
            </ul>
          ) : null}
        </LayoutGroup>
      </Page>
    </MotionConfig>
  )
}
