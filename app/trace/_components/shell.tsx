import type { CSSProperties, ReactNode } from "react"
import { kindVars } from "./colours"
import type { Filter } from "./scatter"

/** A catalogue page: ruled strip on top, tab column hanging off the left edge, the page beside it. */
export function Page({
  strip,
  side,
  foot,
  kind = "all",
  wash = 0,
  children,
}: {
  strip: ReactNode[]
  /** Colour the page takes on */
  kind?: Filter
  /** How strongly the page is washed in that colour, in percent */
  wash?: number
  side?: ReactNode
  foot?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="wash" style={{ ...kindVars(kind), "--wash": `${wash}%` } as CSSProperties}>
      <header className="strip">
        {strip.map((cell, i) => (
          <div key={i}>{cell}</div>
        ))}
      </header>
      <div className="body">
        <aside className="side">
          <div className="side-inner">{side}</div>
        </aside>
        <main className="min-w-0">
          {children}
          {foot ? <footer className="px-5 py-4 text-sm text-ink-soft lg:px-6">{foot}</footer> : null}
        </main>
      </div>
    </div>
  )
}

/** Label / value lines, ruled like a spec sheet. */
export function Spec({ rows, className = "" }: { rows: { label: string; value: ReactNode }[]; className?: string }) {
  return (
    <dl className={`spec ${className}`}>
      {rows.map((r) => (
        <div key={r.label}>
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export const pad = (n: number) => String(n).padStart(2, "0")
