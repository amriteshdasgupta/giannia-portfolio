import type { ReactNode } from "react"

/** A catalogue page: ruled strip on top, tab column hanging off the left edge, the page beside it. */
export function Page({
  strip,
  side,
  foot,
  children,
}: {
  strip: ReactNode[]
  side?: ReactNode
  foot?: ReactNode
  children: ReactNode
}) {
  return (
    <>
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
    </>
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
