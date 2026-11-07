import Link from "next/link"
import { about } from "@/lib/works"
import { grainOffset } from "./elevation-map"

type Style = React.CSSProperties

/** The top transom: name pane, a strip of clear glass, one cobalt pane, About and Contact. */
export function HeaderBay({ home = false }: { home?: boolean }) {
  const name = (
    <>
      <span className="block">Giannia —</span>
      <span className="block">works &amp; words</span>
    </>
  )
  return (
    <header className="bay-head">
      {home ? (
        <div className="pane glass bay-head__name" style={grainOffset(1) as Style}>
          <h1 className="display m-0">{name}</h1>
        </div>
      ) : (
        <Link
          href="/glazed"
          className="pane glass lit bay-head__name"
          style={grainOffset(1) as Style}
          aria-label="Giannia, works and words: all works"
        >
          <span className="display relative z-[1]">{name}</span>
        </Link>
      )}
      <p className="pane glass bay-head__strip m-0" style={grainOffset(2) as Style}>
        {about.role}. Draws by hand, builds models, writes.
      </p>
      <div className="pane glass bay-head__strip bay-head__strip--extra" style={grainOffset(3) as Style} aria-hidden="true" />
      <div className="pane glass bay-head__strip bay-head__strip--extra" style={grainOffset(4) as Style} aria-hidden="true" />
      <div className="pane glass glass--cobalt" style={grainOffset(5) as Style} aria-hidden="true" />
      <nav aria-label="Giannia" className="contents">
        <Link href="/glazed/about" className="pane glass lit bay-head__link" style={grainOffset(6) as Style}>
          <span className="relative z-[1]">About</span>
        </Link>
        <Link href="/glazed/about#contact" className="pane glass lit bay-head__link" style={grainOffset(7) as Style}>
          <span className="relative z-[1]">Contact</span>
        </Link>
      </nav>
    </header>
  )
}

/** The bottom rail: one long low pane and a cobalt light. */
export function FootBay({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="bay-foot">
      <p className="pane glass bay-foot__note" style={grainOffset(9) as Style}>
        {children ?? "Placeholder works: titles, years and images stand in until the real list arrives."}
      </p>
      <div className="pane glass glass--cobalt" style={grainOffset(10) as Style} aria-hidden="true" />
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
