import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getWork, imageOf, kindLabel, kinds, neighbours, stickerOf, works, type Kind } from "@/lib/works"
import { Arrow, FootBay, HeaderBay } from "../_components/bays"
import { grainOffset, type Glass } from "../_components/elevation-map"
import { pad } from "../_components/work-pane"

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
    ["Context", work.context],
    ["Year", String(work.year)],
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
              <Image
                src={imageOf(work)}
                alt={`${work.title}: ${work.medium}`}
                fill
                preload
                sizes="(max-width: 1099px) 92vw, 52vw"
              />
            </div>
          </figure>

          <div className="detail-side">
            <Link href="/glazed" className="pane glass lit link-pane back-pane pane-pad" style={grainOffset(12) as Style}>
              <Arrow dir="left" />
              <span>All works</span>
            </Link>

            <div className="pane glass pane-pad" style={grainOffset(13) as Style}>
              <h1 className="display title-xl">
                <span className="text-[var(--ink-soft)]">{pad(work.no)}</span> {work.title}
              </h1>
            </div>

            <p className="pane glass pane-pad prose m-0" style={grainOffset(14) as Style}>
              {work.summary}
            </p>

            <div className="pane glass pane-pad" style={grainOffset(15) as Style}>
              <dl className="facts">
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

            <figure className="pane glass pane-pad sticker-pane grow m-0" style={grainOffset(16) as Style}>
              <div className="sticker-pane__img">
                <Image src={stickerOf(work)} alt="" fill sizes="(max-width: 1099px) 60vw, 22vw" />
              </div>
              <figcaption className="mt-3 text-[0.9375rem]">
                Written on the sticker: &ldquo;{work.note}&rdquo;
              </figcaption>
            </figure>

            <Link
              href={`/glazed?kind=${work.kind}`}
              className={`pane glass glass--${kindGlass[work.kind]} lit link-pane pane-pad`}
              style={grainOffset(17) as Style}
            >
              <span className="display text-[1.75rem]">{kindLabel(work.kind)}</span>
              <span className="inline-flex items-center gap-2 text-[0.9375rem]">
                All {kindPlural.toLowerCase()} on the wall <Arrow dir="right" />
              </span>
            </Link>
          </div>
        </div>

        <div className="bay sections">
          {work.sections.map((s, i) => (
            <section key={s.heading} className="pane glass pane-pad" style={grainOffset(18 + i) as Style}>
              <h2>{s.heading}</h2>
              <p className="prose">{s.body}</p>
            </section>
          ))}
        </div>

        <nav className="bay detail-nav" aria-label="More works">
          <Link href={`/glazed/${prev.slug}`} className="pane glass lit link-pane pane-pad" style={grainOffset(24) as Style}>
            <span className="inline-flex items-center gap-2 text-[0.875rem] text-[var(--ink-soft)]">
              <Arrow dir="left" /> Previous
            </span>
            <span className="detail-nav__title">
              {pad(prev.no)} {prev.title}
            </span>
          </Link>
          <div className="pane glass glass--amber filler" style={grainOffset(25) as Style} aria-hidden="true" />
          <Link
            href={`/glazed/${next.slug}`}
            className="pane glass lit link-pane pane-pad detail-nav__next"
            style={grainOffset(26) as Style}
          >
            <span className="inline-flex items-center gap-2 text-[0.875rem] text-[var(--ink-soft)]">
              Next <Arrow dir="right" />
            </span>
            <span className="detail-nav__title">
              {pad(next.no)} {next.title}
            </span>
          </Link>
        </nav>
      </main>
      <FootBay />
    </div>
  )
}
