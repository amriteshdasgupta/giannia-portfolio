import Link from "next/link"
import type { MouseEvent } from "react"
import { about } from "@/lib/works"
import { GraphiteRule, PencilUnderline } from "./pencil"

type Current = "sheet" | "index" | "about" | "detail"

/** Name top left; Index / About / Contact top right. */
export function Masthead({
  current,
  indexHref = "/trace?view=index",
  onIndexClick,
}: {
  current: Current
  indexHref?: string
  /** On the home sheet, Index switches views in place instead of navigating */
  onIndexClick?: () => void
}) {
  const onHome = current === "sheet" || current === "index"
  const Name = onHome ? "h1" : "p"

  const handleIndex = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!onIndexClick || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    onIndexClick()
  }

  const links = [
    { label: "Index", href: indexHref, on: current === "index", onClick: onIndexClick ? handleIndex : undefined },
    { label: "About", href: "/trace/about", on: current === "about" },
    { label: "Contact", href: `mailto:${about.email}`, on: false },
  ]

  return (
    <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
      <div>
        <Name className="font-tech text-[clamp(3rem,6vw,5.25rem)] leading-[0.9] tracking-[0.005em]">
          {onHome ? (
            about.name
          ) : (
            <Link href="/trace" className="no-underline">
              {about.name}
            </Link>
          )}
        </Name>
        <GraphiteRule className="-ml-1 mt-2 w-[calc(100%+2rem)]" />
      </div>
      <nav aria-label="Main" className="pb-3">
        <ul className="caps flex gap-7 text-[1rem] sm:gap-10">
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
