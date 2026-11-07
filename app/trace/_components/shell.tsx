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

/** The drafted title block in the sheet's bottom-right corner. */
export function TitleStamp({ cells }: { cells: string[] }) {
  return (
    <p className="caps flex w-fit flex-wrap border-[1.5px] border-graphite text-[0.75rem] leading-none text-graphite">
      {cells.map((c, i) => (
        <span key={c} className={`px-3 py-2 ${i > 0 ? "border-l border-graphite/60" : ""}`}>
          {c}
        </span>
      ))}
    </p>
  )
}

/** Label / value facts, ruled like a drawing's title block. */
export function TitleBlock({
  rows,
  className = "",
}: {
  rows: { label: string; value: ReactNode; wide?: boolean }[]
  className?: string
}) {
  return (
    <dl className={`grid grid-cols-2 overflow-hidden border-[1.5px] border-graphite ${className}`}>
      {rows.map((r) => (
        <div
          key={r.label}
          className={`-mb-px -mr-px border-b border-r border-graphite/45 px-3 pt-2 pb-2.5 ${r.wide ? "col-span-2" : ""}`}
        >
          <dt className="caps text-[0.6875rem] text-graphite-soft">{r.label}</dt>
          <dd className="mt-1 font-tech text-[1rem] leading-snug text-graphite">{r.value}</dd>
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
