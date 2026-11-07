import Link from "next/link"
import type { MouseEvent } from "react"
import { about } from "@/lib/works"
import { GraphiteRule, PencilUnderline } from "./pencil"

type Current = "sheet" | "index" | "about" | "detail"

/** Name in hand lettering, top left; Index / About / Contact, top right. */
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
    <header className="flex flex-wrap items-start justify-between gap-x-10 gap-y-5">
      <div>
        <Name className="font-hand text-[clamp(3rem,5.4vw,4.75rem)] leading-[0.95] tracking-[-0.01em]">
          {onHome ? (
            about.name
          ) : (
            <Link href="/trace" className="no-underline">
              {about.name}
            </Link>
          )}
        </Name>
        <GraphiteRule className="-ml-1 w-[calc(100%+1.5rem)]" />
        <p className="mt-2 font-hand text-[1.3rem] text-graphite-soft lg:text-[1.65rem]">
          works &amp; words, {about.years}
        </p>
      </div>
      <nav aria-label="Main" className="lg:pt-3">
        <ul className="flex gap-6 font-hand text-[1.25rem] sm:gap-8 lg:gap-12 lg:text-[1.65rem]">
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
    <GraphiteRule className="absolute top-full left-0 w-full opacity-60 transition-opacity group-hover:opacity-100" />
  )
}
