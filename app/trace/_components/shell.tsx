import Link from "next/link"
import type { ReactNode } from "react"

/** The light table and its stack of trace; every page is drawn on the top sheet. */
export function TraceShell({
  header,
  aside,
  footer,
  children,
}: {
  header: ReactNode
  aside?: ReactNode
  footer?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="trace-desk">
      <div aria-hidden className="trace-stack">
        <div className="trace-sheet" data-layer="1" />
        <div className="trace-sheet" data-layer="2" />
        <div className="trace-sheet" data-layer="3" />
      </div>
      <div className="trace-layout">
        <div className="trace-head">{header}</div>
        {aside ? <aside className="trace-aside">{aside}</aside> : null}
        <main className="trace-main">
          {children}
          {footer ? <footer className="mt-16 flex justify-end lg:mt-20">{footer}</footer> : null}
        </main>
      </div>
    </div>
  )
}

/** The small drafted stamp in the sheet's bottom-right corner. */
export function TitleStamp({ children }: { children: ReactNode }) {
  return (
    <p className="w-fit border-[1.5px] border-graphite px-3 py-1.5 font-mono text-[0.8125rem] tracking-[0.01em] text-graphite [font-variant-numeric:tabular-nums]">
      {children}
    </p>
  )
}

/** Drafted title block: a ruled box of label/value cells in mono. */
export function TitleBlock({
  rows,
  className = "",
}: {
  rows: { label: string; value: ReactNode; wide?: boolean }[]
  className?: string
}) {
  return (
    <dl
      className={`grid grid-cols-2 overflow-hidden border-[1.5px] border-graphite font-mono text-[0.875rem] [font-variant-numeric:tabular-nums] sm:grid-cols-3 ${className}`}
    >
      {rows.map((r) => (
        <div
          key={r.label}
          className={`-mb-px -mr-px border-b border-r border-graphite/45 px-3 py-2 ${r.wide ? "col-span-2 sm:col-span-3" : ""}`}
        >
          <dt className="text-[0.6875rem] uppercase tracking-[0.06em] text-graphite-soft">{r.label}</dt>
          <dd className="mt-0.5 text-graphite">{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** A single trace tab on the left edge that links somewhere (used off the home sheet). */
export function LinkTab({ href, children }: { href: string; children: ReactNode }) {
  return (
    <div className="trace-tabs">
      <Link href={href} className="trace-tab no-underline" style={{ ["--tilt" as string]: "-0.8deg" }}>
        {children}
      </Link>
    </div>
  )
}
