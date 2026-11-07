import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getWork, imageOf, kindLabel, neighbours, works } from "@/lib/works"
import { imageSize } from "../_components/image-size"
import { Masthead } from "../_components/masthead"
import { LeaderLine, PencilArrow } from "../_components/pencil"
import { LinkTab, TitleBlock, TitleStamp, TraceShell } from "../_components/shell"

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

const pad = (n: number) => String(n).padStart(2, "0")

export default async function WorkPage({ params }: Props) {
  const w = getWork((await params).slug)
  if (!w) notFound()

  const { prev, next } = neighbours(w.slug)
  const img = imageOf(w)
  const size = imageSize(img)

  const rows = [
    { label: "No.", value: pad(w.no) },
    { label: "Kind", value: kindLabel(w.kind) },
    { label: "Year", value: w.year },
    { label: "Context", value: w.context, wide: true },
    ...(w.location ? [{ label: "Location", value: w.location, wide: true }] : []),
    { label: "Medium", value: w.medium, wide: true },
    ...(w.collaborators ? [{ label: "Collaborators", value: w.collaborators, wide: true }] : []),
  ]

  return (
    <TraceShell
      header={<Masthead current="detail" />}
      aside={
        <LinkTab href="/trace">
          <span className="inline-flex items-center gap-1.5">
            <PencilArrow />
            all works
          </span>
        </LinkTab>
      }
      footer={
        <TitleStamp>
          Sheet {pad(w.no)} of {pad(works.length)} · placeholder work
        </TitleStamp>
      }
    >
      <article className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">
        <header className="min-w-0 lg:col-start-2 lg:row-start-1">
          <h1 className="font-hand text-[clamp(2.25rem,4.2vw,3.5rem)] leading-[1.05] tracking-[-0.01em] text-balance">
            {w.title}
          </h1>
          <p className="mt-5 max-w-[60ch] text-[1.1875rem] leading-[1.55] text-graphite text-pretty">{w.summary}</p>
        </header>

        <figure className="lg:sticky lg:top-10 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start">
          <div className="relative mx-auto max-w-[min(44rem,78vh)] pt-16 lg:pt-20">
            <p className="absolute top-0 right-2 max-w-[15rem] font-hand text-[1.0625rem] leading-tight text-pencil-blue lg:right-6 lg:text-[1.1875rem]">
              <LeaderLine className="absolute top-2 right-[calc(100%+0.25rem)] h-[6rem] w-12 overflow-visible" />
              {w.note}
            </p>
            <div className="relative -rotate-[0.6deg] bg-white p-2.5 shadow-[0_1px_2px_rgb(70_62_20/0.18),0_10px_24px_-12px_rgb(70_62_20/0.3)] sm:p-3">
              <span aria-hidden className="tape -top-3 -left-3 -rotate-[32deg] sm:-left-5" />
              <span aria-hidden className="tape -top-3 -right-3 rotate-[28deg] sm:-right-5" />
              <Image
                src={img}
                alt={w.title}
                width={size.width}
                height={size.height}
                sizes="(min-width: 1024px) 46vw, 92vw"
                loading="eager"
                fetchPriority="high"
                className="h-auto w-full"
              />
            </div>
          </div>
          <figcaption className="mx-auto mt-4 max-w-[min(44rem,78vh)] font-mono text-[0.8125rem] text-graphite-soft">
            Fig. {pad(w.no)} · {w.medium}
          </figcaption>
        </figure>

        <div className="min-w-0 lg:col-start-2 lg:row-start-2">
          <TitleBlock rows={rows} className="max-w-xl" />

          <ol className="mt-14 space-y-10">
            {w.sections.map((s, i) => (
              <li key={s.heading} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4">
                <span
                  aria-hidden
                  className="mt-1 grid size-8 place-items-center rounded-full border-[1.5px] border-graphite font-mono text-[0.75rem] [font-variant-numeric:tabular-nums]"
                >
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-hand text-[1.5rem] leading-tight lg:text-[1.75rem]">{s.heading}</h2>
                  <p className="mt-2 max-w-[62ch] text-[1.0625rem] leading-[1.65] text-graphite text-pretty">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </article>

      <nav
        aria-label="More works"
        className="mt-20 grid gap-6 border-t border-graphite/35 pt-8 sm:grid-cols-[1fr_auto_1fr] sm:items-end"
      >
        <Link href={`/trace/${prev.slug}`} className="group no-underline">
          <span className="flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.06em] text-graphite-soft">
            <PencilArrow /> Previous
          </span>
          <span className="mt-1 block font-hand text-[1.375rem] decoration-pencil-red decoration-[1.5px] group-hover:underline">
            {prev.title}
          </span>
        </Link>
        <Link
          href="/trace"
          className="font-hand text-[1.25rem] decoration-1 underline underline-offset-[0.22em] sm:text-center"
        >
          all works
        </Link>
        <Link href={`/trace/${next.slug}`} className="group no-underline sm:text-right">
          <span className="flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.06em] text-graphite-soft sm:justify-end">
            Next <PencilArrow dir="right" />
          </span>
          <span className="mt-1 block font-hand text-[1.375rem] decoration-pencil-red decoration-[1.5px] group-hover:underline">
            {next.title}
          </span>
        </Link>
      </nav>
    </TraceShell>
  )
}
