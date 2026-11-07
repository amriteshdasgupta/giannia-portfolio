"use client"

import { motion, useReducedMotion, type Transition } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { kindLabel, kinds, works, type Kind, type Work } from "@/lib/works"
import { Sparks, Underline } from "./marks"
import { arrange, kindColour, placement, type Size } from "./sheet"
import type { Dims } from "./sticker-size"
import { Sticker } from "./sticker"

export type Filter = "all" | Kind
export type View = "stickers" | "list"

const settle: Transition = { type: "spring", stiffness: 420, damping: 36, mass: 0.8 }
const peel: Transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
const instant: Transition = { duration: 0 }

const options: { value: Filter; label: string }[] = [{ value: "all", label: "All" }, ...kinds]

/* ---------- filter chips ---------- */

function Chips({ value, onChange, reduce }: { value: Filter; onChange: (f: Filter) => void; reduce: boolean }) {
  return (
    <div
      role="group"
      aria-label="Filter works by kind"
      className="cp-chips -mx-5 flex items-center gap-x-6 overflow-x-auto px-12 py-3 sm:mx-0 sm:flex-wrap sm:gap-x-8 sm:gap-y-3 sm:overflow-visible sm:p-0"
    >
      {options.map((o, i) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className="group relative min-h-11 shrink-0 cursor-pointer px-4 pt-1 pb-2 font-marker text-[1.3rem] leading-none sm:px-5 sm:text-[1.5rem]"
            style={{ rotate: `${((i * 37) % 5) * 0.5 - 1}deg` }}
          >
            <span
              aria-hidden="true"
              className="cp-torn absolute inset-0 bg-sheet transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
            />
            {active ? (
              <motion.span
                aria-hidden="true"
                layoutId="cp-chip-active"
                transition={reduce ? instant : settle}
                className="absolute inset-0"
              >
                <span className="cp-torn absolute -inset-px bg-cobalt" />
                <Sparks side="left" className="absolute top-1/2 right-full mr-0.5 h-8 w-6 -translate-y-1/2" />
                <Sparks side="right" className="absolute top-1/2 left-full ml-0.5 h-8 w-6 -translate-y-1/2" />
              </motion.span>
            ) : null}
            <span className={`relative transition-colors duration-150 ${active ? "text-white" : "text-ink"}`}>{o.label}</span>
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
        className={`relative min-h-11 cursor-pointer px-2 text-[0.95rem] font-semibold tracking-[0.01em] transition-colors ${
          active ? "text-ink" : "text-ink-soft hover:text-ink"
        }`}
      >
        {label}
        {active ? <Underline className="pointer-events-none absolute right-0 bottom-1.5 left-0 h-2.5 w-full" /> : null}
      </button>
    )
  }
  return (
    <div role="group" aria-label="Show works as" className="flex items-center">
      {item("stickers", "Stickers")}
      <span aria-hidden="true" className="text-ink-soft">
        /
      </span>
      {item("list", "List")}
    </div>
  )
}

/* ---------- the sheet of stickers ---------- */

const maxh: Record<Size, string> = { xl: "var(--maxh-xl)", l: "var(--maxh-l)", m: "var(--maxh-m)", s: "var(--maxh-s)" }
const mobileWidth: Record<Size, string> = { xl: "100%", l: "92%", m: "88%", s: "80%" }
const sizesFor: Record<Size, string> = {
  xl: "(min-width: 768px) 36vw, 92vw",
  l: "(min-width: 768px) 30vw, 86vw",
  m: "(min-width: 768px) 26vw, 82vw",
  s: "(min-width: 768px) 22vw, 74vw",
}

function Sheet({ shown, aside, dims, filter, reduce }: { shown: Work[]; aside: Work[]; dims: Record<string, Dims>; filter: Filter; reduce: boolean }) {
  const slots = arrange(shown.length)
  const layout = reduce ? false : ("position" as const)

  return (
    <ul className="cp-sheet m-0 list-none p-0">
      {shown.map((w, i) => {
        const slot = slots[i]!
        return (
          <motion.li
            key={w.slug}
            layout={layout}
            initial={false}
            animate={{ opacity: 1, scale: 1, rotate: 0, filter: "grayscale(0)" }}
            transition={reduce ? instant : { ...peel, layout: settle }}
            className="cp-cell"
            data-ghost="false"
            style={
              {
                "--span": slot.span,
                "--start": slot.start,
                "--maxh": maxh[slot.size],
                "--wpct-sm": mobileWidth[slot.size],
                "--justify-sm": slot.size === "xl" ? "center" : i % 2 ? "flex-end" : "flex-start",
              } as React.CSSProperties
            }
          >
            <Sticker work={w} dims={dims[w.slug]!} sizes={sizesFor[slot.size]} eager={i < 2} flag={filter === "all" && w.featured} />
          </motion.li>
        )
      })}

      {aside.length > 0 ? (
        <motion.li
          key="set-aside"
          layout={layout}
          transition={reduce ? instant : { layout: settle }}
          aria-hidden="true"
          className="col-span-full -mb-6 pt-4 text-[0.875rem] text-ink-soft italic md:-mb-10"
        >
          Set aside for now: {aside.length} other {aside.length === 1 ? "work" : "works"}
        </motion.li>
      ) : null}

      {aside.map((w) => {
        const turn = placement(w.slug).r > 0 ? 1 : -1
        return (
          <motion.li
            key={w.slug}
            layout={layout}
            initial={false}
            animate={{ opacity: 0.13, scale: 0.88, rotate: turn * 7, filter: "grayscale(1)" }}
            transition={reduce ? instant : { ...peel, layout: settle }}
            className="cp-cell"
            data-ghost="true"
            aria-hidden="true"
            inert
            style={{ "--maxh": "var(--maxh-g)" } as React.CSSProperties}
          >
            <Sticker work={w} dims={dims[w.slug]!} sizes="(min-width: 768px) 12vw, 40vw" bare />
          </motion.li>
        )
      })}
    </ul>
  )
}

/* ---------- the index list ---------- */

function KindDot({ kind }: { kind: Kind }) {
  return (
    <span
      aria-hidden="true"
      className="cp-torn inline-block size-3.5 shrink-0 rounded-[48%_52%_44%_56%/55%_45%_55%_45%]"
      style={{ background: kindColour[kind] }}
    />
  )
}

function IndexList({ items }: { items: Work[] }) {
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Index of works</caption>
        <thead>
          <tr className="border-b-2 border-ink text-[0.8125rem] font-semibold tracking-[0.02em] text-ink-soft">
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
            <tr key={w.slug} className="group relative border-b border-rule align-baseline transition-colors hover:bg-cobalt/[0.05]">
              <td className="py-3 pr-3 font-marker text-[1.75rem] leading-none text-cobalt tabular-nums sm:text-[2rem]">
                {String(w.no).padStart(2, "0")}
              </td>
              <td className="py-3 pr-4 leading-snug">
                <Link
                  href={`/cut-paper/${w.slug}`}
                  className="text-[1.0625rem] font-semibold text-ink underline decoration-poppy/0 decoration-2 underline-offset-4 transition-colors after:absolute after:inset-0 group-hover:decoration-poppy"
                >
                  {w.title}
                </Link>
                {w.featured ? <span className="ml-2 font-marker text-[1.1rem] text-poppy">featured</span> : null}
                <span className="mt-1.5 flex items-center gap-2 text-[0.875rem] text-ink-soft sm:hidden">
                  <KindDot kind={w.kind} />
                  {kindLabel(w.kind)}
                </span>
                <span className="mt-1 block text-[0.875rem] text-ink-soft md:hidden">
                  {w.context}
                  <span className="lg:hidden"> · {w.medium}</span>
                </span>
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
    </div>
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
    <section aria-labelledby="cp-works-heading" className="mt-8 sm:mt-10">
      <h2 id="cp-works-heading" className="sr-only">
        Works
      </h2>
      <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-2 sm:gap-y-4 sm:pl-8">
        <Chips value={filter} onChange={setFilter} reduce={reduce} />
        <ViewToggle value={view} onChange={setView} />
      </div>

      <p className="sr-only" aria-live="polite">
        {filter === "all" ? `Showing all ${shown.length} works` : `Showing ${shown.length} of ${works.length}: ${label}`}
      </p>

      <div className="mt-10 sm:mt-12">
        {shown.length === 0 ? (
          <p className="py-20 text-center font-marker text-[2rem] text-ink-soft">Nothing filed under {label} yet.</p>
        ) : view === "stickers" ? (
          <Sheet shown={shown} aside={aside} dims={dims} filter={filter} reduce={reduce} />
        ) : (
          <IndexList items={shown} />
        )}
      </div>
    </section>
  )
}
