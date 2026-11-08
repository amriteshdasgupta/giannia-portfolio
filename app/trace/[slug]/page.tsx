import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ViewTransition } from "react"
import { about, getWork, imageOf, kindLabel, neighbours, stickerOf, works } from "@/lib/works"
import { KindLinks } from "../_components/filter-tabs"
import { imageSize } from "../_components/image-size"
import { Page, Spec, pad } from "../_components/shell"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const w = getWork((await params).slug)
  if (!w) return {}
  return { title: w.title, description: w.summary }
}

export default async function ItemPage({ params }: Props) {
  const w = getWork((await params).slug)
  if (!w) notFound()

  const { prev, next } = neighbours(w.slug)
  const shot = stickerOf(w)
  const shotSize = imageSize(shot)
  const drawing = imageOf(w)
  const drawingSize = imageSize(drawing)
  const enquire = `mailto:${about.email}?subject=${encodeURIComponent(`Nº ${pad(w.no)}: ${w.title}`)}`

  const spec = [
    { label: "Kind", value: kindLabel(w.kind) },
    { label: "Year", value: w.year },
    { label: "Context", value: w.context },
    ...(w.location ? [{ label: "Location", value: w.location }] : []),
    { label: "Medium", value: w.medium },
    ...(w.collaborators ? [{ label: "Collaborators", value: w.collaborators }] : []),
  ]

  return (
    <Page
      strip={[
        <Link key="name" href="/trace">
          {about.name}
        </Link>,
        <Link key="back" href="/trace">
          Catalogue of works
        </Link>,
        <span key="no">Nº {pad(w.no)}</span>,
        <span key="kind">{kindLabel(w.kind)}</span>,
      ]}
      side={<KindLinks current={w.kind} />}
      foot="Placeholder work"
    >
      <article className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] xl:grid-cols-2">
        <div>
          <div className="grid aspect-square place-items-center p-[11%]">
            <ViewTransition name={`art-${w.slug}`} share="morph">
              <Image
                src={shot}
                alt={w.title}
                width={shotSize.width}
                height={shotSize.height}
                sizes="(min-width: 1024px) 45vw, 92vw"
                loading="eager"
                fetchPriority="high"
                className="h-full w-full -rotate-[1.5deg] object-contain drop-shadow-[0_18px_22px_rgb(20_20_19/0.14)]"
              />
            </ViewTransition>
          </div>
          <figure className="px-5 pb-8 sm:px-8 lg:px-10">
            <figcaption className="flex justify-between text-xs text-ink-soft">
              <span>Drawing</span>
              <span>{w.medium}</span>
            </figcaption>
            <div className="mt-3 bg-white p-3 shadow-[0_1px_2px_rgb(20_20_19/0.08),0_12px_28px_-14px_rgb(20_20_19/0.25)] sm:p-4">
              <Image
                src={drawing}
                alt={`${w.title}: drawing`}
                width={drawingSize.width}
                height={drawingSize.height}
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="h-auto w-full"
              />
            </div>
          </figure>
        </div>

        <div className="min-w-0 px-5 py-8 sm:px-8 lg:sticky lg:top-0 lg:self-start lg:px-10 lg:py-10">
          <p className="text-sm text-ink-soft">
            Nº {pad(w.no)} · {kindLabel(w.kind)}
          </p>
          <h1 className="mt-3 text-[clamp(2rem,3.2vw,2.875rem)] leading-[1.05] font-medium tracking-[-0.025em] text-balance">
            {w.title}
          </h1>
          <p className="mt-4 max-w-[52ch] text-[1.125rem] leading-[1.5] text-pretty">{w.summary}</p>

          <a href={enquire} className="button mt-8">
            Enquire about this work
          </a>

          <Spec rows={spec} className="mt-10" />

          <h2 className="mt-12 text-sm text-ink-soft">Description</h2>
          <Spec
            className="mt-3"
            rows={[
              ...w.sections.map((s) => ({ label: s.heading, value: s.body })),
              ...(w.note ? [{ label: "Note", value: <span className="italic">{w.note}</span> }] : []),
            ]}
          />

          <h2 className="mt-12 text-sm text-ink-soft">Downloads</h2>
          <ul className="spec mt-3">
            <li className="!block">
              <a href={drawing} download className="flex justify-between gap-4 underline-offset-4 hover:underline">
                <span>Drawing</span>
                <span className="text-ink-soft">JPG</span>
              </a>
            </li>
          </ul>
        </div>
      </article>

      <nav aria-label="More works" className="grid border-t border-rule sm:grid-cols-2">
        <Link href={`/trace/${prev.slug}`} className="group block px-5 py-5 no-underline sm:border-r sm:border-rule lg:px-6">
          <span className="block text-sm text-ink-soft">Previous · Nº {pad(prev.no)}</span>
          <span className="mt-1 block text-[1.125rem] font-medium group-hover:underline">{prev.title}</span>
        </Link>
        <Link
          href={`/trace/${next.slug}`}
          className="group block border-t border-rule px-5 py-5 no-underline sm:border-t-0 sm:text-right lg:px-6"
        >
          <span className="block text-sm text-ink-soft">Next · Nº {pad(next.no)}</span>
          <span className="mt-1 block text-[1.125rem] font-medium group-hover:underline">{next.title}</span>
        </Link>
      </nav>
    </Page>
  )
}
