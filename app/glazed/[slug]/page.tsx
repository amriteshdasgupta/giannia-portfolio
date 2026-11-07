import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getWork, imageOf, kindLabel, kinds, neighbours, stickerOf, works, type Kind } from "@/lib/works"
import { Arrow, FootBay, HeaderBay } from "../_components/bays"
import { grainOffset, type Glass } from "../_components/elevation-map"

type Style = React.CSSProperties
type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const work = getWork((await params).slug)
  if (!work) return {}
  return { title: work.title, description: work.summary }
}

const kindGlass: Record<Kind, Exclude<Glass, "clear">> = {
  studio: "cobalt",
  model: "amber",
  sketch: "oxblood",
  writing: "oxblood",
  competition: "cobalt",
}

export default async function WorkPage({ params }: Props) {
  const work = getWork((await params).slug)
  if (!work) notFound()
  const { prev, next } = neighbours(work.slug)
  const kindPlural = kinds.find((k) => k.value === work.kind)!.label

  const facts: [string, string | undefined][] = [
    ["Kind", kindLabel(work.kind)],
    ["Year", String(work.year)],
    ["Context", work.context],
    ["Location", work.location],
    ["Medium", work.medium],
    ["Collaborators", work.collaborators],
  ]

  return (
    <div className="wall wall--inner">
      <HeaderBay />
      <main className="inner">
        <div className="bay detail-top">
          <figure className="pane glass detail-image m-0" style={grainOffset(11) as Style}>
            <div className="detail-image__frame">
              <Image src={imageOf(work)} alt={work.title} fill preload sizes="(max-width: 1099px) 92vw, 52vw" />
            </div>
          </figure>

          <div className="detail-side">
            <Link href="/glazed" className="pane glass lit link-pane back-pane pane-pad" style={grainOffset(12) as Style}>
              <Arrow dir="left" />
              <span>All works</span>
            </Link>

            <div className="pane glass pane-pad title-pane" style={grainOffset(13) as Style}>
              <h1 className="display title-xl relative z-[1]">{work.title}</h1>
            </div>

            <div className="pane glass pane-pad" style={grainOffset(14) as Style}>
              <dl className="kv">
                {facts
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="pane glass pane-pad prose m-0" style={grainOffset(15) as Style}>
              {work.summary}
            </p>

            <figure className="pane glass pane-pad sticker-pane grow m-0" style={grainOffset(16) as Style}>
              <div className="sticker-pane__img">
                <Image src={stickerOf(work)} alt="" fill sizes="(max-width: 1099px) 60vw, 22vw" />
              </div>
              <figcaption className="note">&ldquo;{work.note}&rdquo;</figcaption>
            </figure>

            <Link
              href={`/glazed?kind=${work.kind}`}
              className={`pane glass glass--${kindGlass[work.kind]} lit link-pane pane-pad kind-pane`}
              style={grainOffset(17) as Style}
            >
              <span className="display">
                {kindPlural} <Arrow dir="right" />
              </span>
            </Link>
          </div>
        </div>

        <div className="bay sections">
          {work.sections.map((s, i) => (
            <section key={s.heading} className="pane glass pane-pad" style={grainOffset(18 + i) as Style}>
              <h2 className="display">{s.heading}</h2>
              <p className="prose">{s.body}</p>
            </section>
          ))}
        </div>

        <nav className="bay detail-nav" aria-label="Previous and next work">
          <Link href={`/glazed/${prev.slug}`} className="pane glass lit link-pane pane-pad" style={grainOffset(24) as Style}>
            <span className="detail-nav__dir">
              <Arrow dir="left" /> Previous
            </span>
            <span className="display detail-nav__title">{prev.title}</span>
          </Link>
          <div className="pane glass glass--amber filler" style={grainOffset(25) as Style} aria-hidden="true" />
          <Link
            href={`/glazed/${next.slug}`}
            className="pane glass lit link-pane pane-pad detail-nav__next"
            style={grainOffset(26) as Style}
          >
            <span className="detail-nav__dir">
              Next <Arrow dir="right" />
            </span>
            <span className="display detail-nav__title">{next.title}</span>
          </Link>
        </nav>
      </main>
      <FootBay />
    </div>
  )
}
