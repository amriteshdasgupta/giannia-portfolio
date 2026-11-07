import Link from "next/link"
import type { MouseEvent } from "react"
import { about } from "@/lib/works"
import { GraphiteRule, PencilUnderline } from "./pencil"

type Current = "sheet" | "index" | "about" | "detail"

/** Name top left; Sheet / Index / About / Contact top right. */
export function Masthead({
  current,
  sheetHref = "/trace",
  indexHref = "/trace?view=index",
  onView,
}: {
  current: Current
  sheetHref?: string
  indexHref?: string
  /** On the home page, Sheet and Index switch views in place instead of navigating */
  onView?: (view: "sheet" | "index") => void
}) {
  const Name = current === "sheet" || current === "index" ? "h1" : "p"

  const switchTo = (view: "sheet" | "index") =>
    onView
      ? (e: MouseEvent<HTMLAnchorElement>) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
          e.preventDefault()
          onView(view)
        }
      : undefined

  const links = [
    { label: "Sheet", href: sheetHref, on: current === "sheet", onClick: switchTo("sheet") },
    { label: "Index", href: indexHref, on: current === "index", onClick: switchTo("index") },
    { label: "About", href: "/trace/about", on: current === "about" },
    { label: "Contact", href: `mailto:${about.email}`, on: false },
  ]

  return (
    <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
      <div>
        <Name className="font-tech text-[clamp(3rem,6vw,5.25rem)] leading-[0.9] tracking-[0.005em]">
          {current === "sheet" ? (
            about.name
          ) : (
            <Link href={sheetHref} onClick={switchTo("sheet")} className="no-underline">
              {about.name}
            </Link>
          )}
        </Name>
        <GraphiteRule className="-ml-1 mt-2 w-[calc(100%+2rem)]" />
      </div>
      <nav aria-label="Main" className="pb-3">
        <ul className="caps flex gap-6 text-[1rem] sm:gap-9">
          {links.map((l) => (
            <li key={l.label}>
              {l.href.startsWith("mailto:") ? (
                <a href={l.href} className="group relative inline-block no-underline">
                  {l.label}
                  <NavRule on={l.on} />
                </a>
              ) : (
                <Link
                  href={l.href}
                  onClick={l.onClick}
                  aria-current={l.on ? "page" : undefined}
                  className="group relative inline-block no-underline"
                >
                  {l.label}
                  <NavRule on={l.on} />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

function NavRule({ on }: { on: boolean }) {
  return on ? (
    <PencilUnderline on />
  ) : (
    <GraphiteRule className="absolute top-[calc(100%+0.2em)] left-0 w-full opacity-0 transition-opacity group-hover:opacity-100" />
  )
}
