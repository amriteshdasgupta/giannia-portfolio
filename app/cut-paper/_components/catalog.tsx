"use client"

import { motion, useReducedMotion, type Transition } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { kindLabel, kinds, works, type Kind, type Work } from "@/lib/works"
import { Mark, markUrl } from "./marks"
import { kindColour, pack, sizeOf, type Size } from "./sheet"
import type { Dims } from "./sticker-size"
import { Sticker } from "./sticker"

export type Filter = "all" | Kind
export type View = "stickers" | "list"

// the one authored motion on this page: paper reshuffled on a desk
const settle: Transition = { type: "spring", stiffness: 420, damping: 38, mass: 0.8 }
const peel: Transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
const instant: Transition = { duration: 0 }

const options: { value: Filter; label: string; count: number }[] = [
  { value: "all", label: "All", count: works.length },
  ...kinds.map((k) => ({ value: k.value, label: k.label, count: works.filter((w) => w.kind === k.value).length })),
]

/* ---------- filter chips ---------- */

function Chips({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  return (
    <div
      role="group"
      aria-label="Filter works by kind"
      className="cp-chips -mx-5 flex w-[calc(100%+2.5rem)] items-center gap-x-5 overflow-x-auto px-5 py-4 sm:-mx-10 sm:w-[calc(100%+5rem)] sm:px-10 lg:mx-0 lg:w-auto lg:flex-wrap lg:gap-y-3 lg:overflow-visible lg:p-0"
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`relative flex h-11 shrink-0 cursor-pointer items-center px-5 pb-px text-[0.9375rem] leading-none font-semibold ${
              active ? "text-white" : "text-ink hover:text-cobalt"
            }`}
            style={{ background: `${markUrl(active ? "chipCobalt" : "chip")} no-repeat center / 100% 100%` }}
          >
            {o.label}
            <sup className="ml-0.5 -translate-y-1 text-[0.6875rem] font-medium tabular-nums">{o.count}</sup>
            {active ? (
              <>
                <Mark name="sparks" className="absolute -top-3 right-full h-6 w-5" />
                <Mark name="sparks" className="absolute -top-3 left-full h-6 w-5 -scale-x-100" />
              </>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

function ViewToggle({ value, onChange }: { value: View; onChange: (v: View) => void }) {
  const item = (v: View, label: string) => {
    const active = v === value
    return (
      <button
        type="button"
        aria-pressed={active}
        onClick={() => onChange(v)}
        className={`relative min-h-11 cursor-pointer px-2 text-[0.9375rem] font-semibold ${active ? "text-ink" : "text-ink-soft hover:text-ink"}`}
      >
        {label}
        {active ? <Mark name="underline" className="absolute right-1 bottom-2 left-1 h-1.5" /> : null}
      </button>
    )
  }
  return (
    <div role="group" aria-label="Show works as" className="flex items-center">
      {item("stickers", "Stickers")}
      {item("list", "List")}
    </div>
  )
}

/* ---------- the sheet of stickers ---------- */

const phoneWidth: Record<Size, string> = { xl: "100%", l: "90%", m: "84%", s: "76%" }
const sizesFor: Record<Size, string> = {
  xl: "(min-width: 1024px) 520px, (min-width: 640px) 46vw, 92vw",
  l: "(min-width: 1024px) 420px, (min-width: 640px) 46vw, 86vw",
  m: "(min-width: 1024px) 340px, (min-width: 640px) 46vw, 80vw",
  s: "(min-width: 1024px) 280px, (min-width: 640px) 46vw, 72vw",
}

function Sheet({ shown, aside, dims, reduce }: { shown: Work[]; aside: Work[]; dims: Record<string, Dims>; reduce: boolean }) {
  const layout = reduce ? false : ("position" as const)
  const ar = (w: Work) => (dims[w.slug]!.w / dims[w.slug]!.h).toFixed(3)
  const slots = pack(shown)
  const firstAsideRow = Math.max(0, ...slots.map((s) => s.row + s.rows - 1)) + 1

  return (
    <ul className="cp-sheet m-0 list-none p-0">
      {shown.map((w, i) => {
        const size = sizeOf(w)
        const slot = slots[i]!
        return (
          <motion.li
            key={w.slug}
            layout={layout}
            initial={false}
            animate={{ opacity: 1, scale: 1, filter: "grayscale(0)" }}
            transition={reduce ? instant : { ...peel, layout: settle }}
            className="cp-cell"
            data-ghost="false"
            style={
              {
                "--ar": ar(w),
                "--size": `var(--maxh-${size})`,
                "--size-lg": `var(--maxh-${slot.size === "xl" ? "xl" : slot.size})`,
                "--wpct-sm": phoneWidth[size],
                "--mi-sm": size === "xl" ? "auto" : i % 2 ? "auto 0" : "0 auto",
                "--gc": `${slot.col} / span ${slot.span}`,
                "--gr": `${slot.row} / span ${slot.rows}`,
                // earlier rows lie on top, so a lower piece never covers a label above it
                "--z": 40 - slot.row,
              } as React.CSSProperties
            }
          >
            <Sticker work={w} dims={dims[w.slug]!} sizes={sizesFor[slot.size]} />
          </motion.li>
        )
      })}

      {aside.length > 0 ? <li key="break" aria-hidden="true" className="cp-break" /> : null}

      {aside.map((w, i) => (
        <motion.li
          key={w.slug}
          layout={layout}
          initial={false}
          animate={{ opacity: 0.14, scale: 0.92, filter: "grayscale(1)" }}
          transition={reduce ? instant : { ...peel, layout: settle }}
          className="cp-cell"
          data-ghost="true"
          aria-hidden="true"
          inert
          style={
            {
              "--ar": ar(w),
              "--gc": `${(i % 6) * 2 + 1} / span 2`,
              "--gr": `${firstAsideRow + Math.floor(i / 6)}`,
              "--z": 0,
            } as React.CSSProperties
          }
        >
          <Sticker work={w} dims={dims[w.slug]!} sizes="140px" bare />
        </motion.li>
      ))}
    </ul>
  )
}

/* ---------- the index list ---------- */

function KindDot({ kind }: { kind: Kind }) {
  return <span aria-hidden="true" className="inline-block size-2.5 shrink-0 rounded-full" style={{ background: kindColour[kind] }} />
}

function IndexList({ items }: { items: Work[] }) {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">Index of works</caption>
      <thead>
        <tr className="border-b-2 border-ink text-[0.8125rem] text-ink-soft">
          <th scope="col" className="w-14 py-2 pr-3 font-semibold sm:w-20">
            No.
          </th>
          <th scope="col" className="py-2 pr-4 font-semibold">
            Title
          </th>
          <th scope="col" className="hidden py-2 pr-4 font-semibold sm:table-cell">
            Kind
          </th>
          <th scope="col" className="py-2 pr-4 text-right font-semibold sm:text-left">
            Year
          </th>
          <th scope="col" className="hidden py-2 pr-4 font-semibold md:table-cell">
            Context
          </th>
          <th scope="col" className="hidden py-2 font-semibold lg:table-cell">
            Medium
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((w) => (
          <tr key={w.slug} className="group relative border-b border-rule align-baseline hover:bg-cobalt/[0.05]">
            <td className="py-3 pr-3 text-[0.8125rem] text-ink-soft tabular-nums">{String(w.no).padStart(2, "0")}</td>
            <td className="py-3 pr-4 leading-snug">
              <Link
                href={`/cut-paper/${w.slug}`}
                className="text-[1.0625rem] font-semibold text-ink underline decoration-transparent decoration-2 underline-offset-4 after:absolute after:inset-0 group-hover:decoration-poppy"
              >
                {w.title}
              </Link>
              <span className="mt-1.5 flex items-center gap-2 text-[0.875rem] text-ink-soft sm:hidden">
                <KindDot kind={w.kind} />
                {kindLabel(w.kind)}
              </span>
              <span className="mt-1 block text-[0.875rem] text-ink-soft md:hidden">{w.context}</span>
            </td>
            <td className="hidden py-3 pr-4 text-[0.9375rem] sm:table-cell">
              <span className="flex items-center gap-2 whitespace-nowrap">
                <KindDot kind={w.kind} />
                {kindLabel(w.kind)}
              </span>
            </td>
            <td className="py-3 pr-4 text-right text-[0.9375rem] tabular-nums sm:text-left">{w.year}</td>
            <td className="hidden py-3 pr-4 text-[0.9375rem] md:table-cell">{w.context}</td>
            <td className="hidden py-3 text-[0.9375rem] text-ink-soft lg:table-cell">{w.medium}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ---------- catalog ---------- */

export function Catalog({ dims, initialFilter, initialView }: { dims: Record<string, Dims>; initialFilter: Filter; initialView: View }) {
  const [filter, setFilter] = useState<Filter>(initialFilter)
  const [view, setView] = useState<View>(initialView)
  const reduce = useReducedMotion() ?? false

  // keep the choice in the address so Back from a work returns to it
  useEffect(() => {
    const url = new URL(window.location.href)
    if (filter === "all") url.searchParams.delete("kind")
    else url.searchParams.set("kind", filter)
    if (view === "list") url.searchParams.set("view", "list")
    else url.searchParams.delete("view")
    if (url.href !== window.location.href) window.history.replaceState(null, "", url)
  }, [filter, view])

  const matches = (w: Work) => filter === "all" || w.kind === filter
  const shown = works.filter(matches)
  const aside = works.filter((w) => !matches(w))
  const label = options.find((o) => o.value === filter)!.label

  return (
    <section aria-labelledby="cp-works-heading" className="mt-6 sm:mt-10">
      <h2 id="cp-works-heading" className="sr-only">
        Works
      </h2>
      <div className="flex flex-wrap items-center gap-x-10 gap-y-1 lg:pr-[240px]">
        <Chips value={filter} onChange={setFilter} />
        <ViewToggle value={view} onChange={setView} />
      </div>

      <p className="sr-only" aria-live="polite">
        {filter === "all" ? `All ${shown.length} works` : `${label}: ${shown.length} of ${works.length}`}
      </p>

      <div className="mt-6 sm:mt-8">
        {view === "stickers" ? <Sheet shown={shown} aside={aside} dims={dims} reduce={reduce} /> : <IndexList items={shown} />}
      </div>
    </section>
  )
}
