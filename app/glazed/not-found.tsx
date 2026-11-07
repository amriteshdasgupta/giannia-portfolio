import type { Metadata } from "next"
import Link from "next/link"
import { Arrow, FootBay, HeaderBay } from "./_components/bays"
import { grainOffset } from "./_components/elevation-map"

export const metadata: Metadata = {
  title: "Not found",
}

export default function GlazedNotFound() {
  return (
    <div className="wall wall--inner">
      <HeaderBay />
      <main className="inner">
        <div className="bay not-found">
          <div className="pane glass pane-pad" style={grainOffset("404:title")}>
            <h1 className="display title-xl relative z-[1]">Not found</h1>
          </div>
          <Link href="/glazed" className="pane glass lit link-pane back-pane pane-pad" style={grainOffset("404:back")}>
            <Arrow dir="left" />
            <span>All works</span>
          </Link>
          <div className="pane glass" style={grainOffset("404:gap")} aria-hidden="true" />
        </div>
      </main>
      <FootBay />
    </div>
  )
}
