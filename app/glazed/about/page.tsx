import type { Metadata } from "next"
import Link from "next/link"
import { about } from "@/lib/works"
import { Arrow, FootBay, HeaderBay } from "../_components/bays"
import { grainOffset } from "../_components/elevation-map"

type Style = React.CSSProperties

export const metadata: Metadata = {
  title: "About",
  description: `${about.name}, ${about.role.toLowerCase()}: bio, contact and CV.`,
}

export default function AboutPage() {
  const fullName = [about.name, about.surname].filter(Boolean).join(" ")
  const cvReady = about.cv !== "#"

  return (
    <div className="wall wall--inner">
      <HeaderBay />
      <main className="inner">
        <div className="bay about-top">
          <div className="pane glass pane-pad flex flex-col justify-between gap-6" style={grainOffset(11) as Style}>
            <h1 className="display title-xl">{fullName}</h1>
            <p className="m-0 text-[1.0625rem]">{about.role}</p>
          </div>
          <div className="pane glass pane-pad flex flex-col gap-4" style={grainOffset(12) as Style}>
            {about.bio.map((para) => (
              <p key={para} className="prose">
                {para}
              </p>
            ))}
          </div>
        </div>

        <div className="bay about-mid">
          <div className="pane glass pane-pad" style={grainOffset(13) as Style}>
            <p className="label">School</p>
            <p className="m-0 text-[1.0625rem]">{about.school}</p>
            <p className="m-0 text-[1.0625rem] tabular-nums">{about.years}</p>
          </div>
          <a
            id="contact"
            href={`mailto:${about.email}`}
            className="pane glass glass--cobalt lit link-pane pane-pad scroll-mt-4"
            style={grainOffset(14) as Style}
          >
            <span className="label">Write to me</span>
            <span className="about-email">{about.email}</span>
          </a>
          <a
            href={about.cv}
            className="pane glass glass--amber lit link-pane pane-pad"
            style={grainOffset(15) as Style}
            {...(cvReady ? { download: true } : {})}
          >
            <span className="display text-[1.75rem]">Download CV</span>
            <span className="text-[0.875rem]">{cvReady ? "PDF" : "Placeholder link until the file arrives"}</span>
          </a>
        </div>

        <nav className="bay about-links" aria-label="Elsewhere">
          {about.links.map((l, i) => (
            <a key={l.label} href={l.href} className="pane glass lit link-pane pane-pad min-h-[5.5rem]" style={grainOffset(16 + i) as Style}>
              <span className="inline-flex items-center gap-2 text-[1.125rem]">
                {l.label} <Arrow dir="right" />
              </span>
            </a>
          ))}
          <Link href="/glazed" className="pane glass lit link-pane back-pane pane-pad min-h-[5.5rem]" style={grainOffset(19) as Style}>
            <Arrow dir="left" />
            <span>All works</span>
          </Link>
          <div className="pane glass glass--oxblood filler" style={grainOffset(20) as Style} aria-hidden="true" />
        </nav>
      </main>
      <FootBay>Placeholder details: bio, school, email and links stand in until Giannia sends the real ones.</FootBay>
    </div>
  )
}
