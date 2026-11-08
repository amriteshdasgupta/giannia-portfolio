import Link from "next/link"
import type { ReactNode } from "react"
import { about } from "@/lib/works"

/** Name at the top, tabs hanging off the left edge, the page beside them. */
export function Page({
  home = false,
  aside,
  foot,
  children,
}: {
  /** On the home page the name is the page heading and links nowhere */
  home?: boolean
  aside?: ReactNode
  foot?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="page">
      <header className="page-head">
        {home ? <h1>{about.name}</h1> : <Link href="/trace">{about.name}</Link>}
      </header>
      {aside ? <aside className="page-aside">{aside}</aside> : null}
      <main className="page-main">
        {children}
        {foot ? <footer className="page-foot">{foot}</footer> : null}
      </main>
    </div>
  )
}

/** A single tab that links somewhere, used off the home page. */
export function LinkTab({ href, children }: { href: string; children: ReactNode }) {
  return (
    <nav aria-label="Back" className="tabs">
      <Link href={href} className="tab">
        {children}
      </Link>
    </nav>
  )
}

/** Label / value facts, one per ruled line. */
export function Facts({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="border-t border-rule">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[8rem_minmax(0,1fr)] gap-4 border-b border-rule py-2.5">
          <dt className="text-ink-soft">{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}
