import type { Metadata } from "next"
import Link from "next/link"
import { about } from "@/lib/works"
import { Arrow, FootBay, HeaderBay } from "../_components/bays"
import { grainOffset } from "../_components/elevation-map"

export const metadata: Metadata = {
  title: "About",
  description: about.bio[0],
}

const isReal = (href: string) => href !== "#"

/** One label / value pair in its own pane. Links only when there is somewhere real to go. */
function Field({
  label,
  value,
  href,
  glass,
  id,
  large = false,
}: {
  label: string
  value: string
  href?: string
  glass?: "cobalt" | "amber"
  id?: string
  large?: boolean
}) {
  const live = href !== undefined && isReal(href)
  const className = `pane glass pane-pad kv-pane${glass ? ` glass--${glass}` : ""}${live ? " lit" : ""}`
  const body = (
    <dl className="kv">
      <dt>{label}</dt>
      <dd className={large ? "kv-value-lg" : undefined}>{href !== undefined && !live ? "Placeholder" : value}</dd>
    </dl>
  )
  return live ? (
    <a id={id} href={href} className={className} style={grainOffset(`about:${label}`)}>
      {body}
    </a>
  ) : (
    <div id={id} className={className} style={grainOffset(`about:${label}`)}>
      {body}
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="wall wall--inner">
      <HeaderBay />
      <main className="inner">
        <div className="bay about-top">
          <div className="pane glass pane-pad" style={grainOffset("about:11")}>
            <h1 className="display title-xl relative z-[1]">About</h1>
          </div>
          <div className="pane glass pane-pad flex flex-col gap-4" style={grainOffset("about:12")}>
            {about.bio.map((para) => (
              <p key={para} className="prose relative z-[1]">
                {para}
              </p>
            ))}
          </div>
        </div>

        <div className="bay about-mid">
          <Field
            id="contact"
            label="Email"
            value={about.email}
            href={`mailto:${about.email}`}
            glass="cobalt"
            large
          />
          <Field label="School" value={about.school} />
          <Field label="Years" value={about.years} />
        </div>

        <nav className="bay about-links" aria-label="CV and links">
          <Field label="CV" value="Download" href={about.cv} glass="amber" />
          {about.links.map((l) => (
            <Field
              key={l.label}
              label={l.label}
              value={l.href.replace(/^https?:\/\/(www\.)?/, "")}
              href={l.href}
            />
          ))}
          <Link href="/glazed" className="pane glass lit link-pane back-pane pane-pad" style={grainOffset("about:20")}>
            <Arrow dir="left" />
            <span>All works</span>
          </Link>
          <div className="pane glass filler" style={grainOffset("about:gap")} aria-hidden="true" />
        </nav>
      </main>
      <FootBay>Placeholder details</FootBay>
    </div>
  )
}
