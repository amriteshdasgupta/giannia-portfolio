import Link from "next/link"
import { about } from "@/lib/works"
import { grainOffset } from "./elevation-map"

/** The top transom: name pane, one clear pane, About and Contact. */
export function HeaderBay({ home = false }: { home?: boolean }) {
  const name = [about.name, about.surname].filter(Boolean).join(" ")
  return (
    <header className="bay-head">
      {home ? (
        <div className="pane glass bay-head__name" style={grainOffset("head:name")}>
          <h1 className="display name">{name}</h1>
          <p className="role">{about.role}</p>
        </div>
      ) : (
        <Link href="/glazed" className="pane glass lit bay-head__name" style={grainOffset("head:name")}>
          <span className="display name">{name}</span>
          <span className="role">{about.role}</span>
        </Link>
      )}
      <div className="pane glass bay-head__strip" style={grainOffset("head:strip")} aria-hidden="true" />
      <nav aria-label="Giannia" className="contents">
        <Link href="/glazed/about" className="pane glass lit bay-head__link" style={grainOffset("head:about")}>
          <span className="relative z-[1]">About</span>
        </Link>
        <Link href="/glazed/about#contact" className="pane glass lit bay-head__link" style={grainOffset("head:contact")}>
          <span className="relative z-[1]">Contact</span>
        </Link>
      </nav>
    </header>
  )
}

/** The bottom rail: one long low pane and a short one. */
export function FootBay({ children = "Placeholder works" }: { children?: React.ReactNode }) {
  return (
    <footer className="bay-foot">
      <p className="pane glass bay-foot__note" style={grainOffset("foot:note")}>
        <span className="relative z-[1]">{children}</span>
      </p>
      <div className="pane glass" style={grainOffset("foot:end")} aria-hidden="true" />
    </footer>
  )
}

/** Drawn arrow, one stroke weight, for back / previous / next panes. */
export function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      className="arrow"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      aria-hidden="true"
      style={dir === "left" ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  )
}
