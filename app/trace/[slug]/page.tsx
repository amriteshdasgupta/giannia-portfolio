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

  const facts = [
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
          <span className="inline-flex items-center gap-2">
            <PencilArrow />
            All works
          </span>
        </LinkTab>
      }
      footer={<TitleStamp cells={["Giannia — portfolio", `No. ${pad(w.no)}`, "Placeholder work"]} />}
    >
      <article className="grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">
        <h1 className="font-tech text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.05] text-balance lg:col-start-2 lg:row-start-1">
          {w.title}
        </h1>

        <figure className="lg:sticky lg:top-10 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start">
          <div className="relative mx-auto max-w-[min(42rem,74vh)] pt-16">
            <p className="absolute top-0 right-2 z-10 font-pen text-[1.625rem] leading-none text-pencil-blue lg:right-8 lg:text-[1.75rem]">
              <LeaderLine className="absolute top-3 right-[calc(100%+0.25rem)] h-[5.25rem] w-11 overflow-visible" />
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
        </figure>

        <div className="min-w-0 lg:col-start-2 lg:row-start-2">
          <TitleBlock rows={facts} className="max-w-xl" />
          <p className="mt-10 max-w-[60ch] text-[1.1875rem] leading-[1.55] text-pretty">{w.summary}</p>

          <div className="mt-12 space-y-9">
            {w.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="caps text-[0.8125rem] text-graphite-soft">{s.heading}</h2>
                <p className="mt-2 max-w-[62ch] text-[1.0625rem] leading-[1.65] text-pretty">{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </article>

      <nav
        aria-label="More works"
        className="mt-20 grid gap-6 border-t border-graphite/35 pt-8 sm:grid-cols-[1fr_auto_1fr] sm:items-end"
      >
        <Link href={`/trace/${prev.slug}`} className="group no-underline">
          <span className="caps flex items-center gap-2 text-[0.6875rem] text-graphite-soft">
            <PencilArrow /> Previous
          </span>
          <span className="mt-1.5 block font-tech text-[1.25rem] decoration-pencil-red decoration-[1.5px] group-hover:underline">
            {prev.title}
          </span>
        </Link>
        <Link href="/trace" className="caps text-[0.8125rem] underline decoration-graphite/50 hover:decoration-pencil-red sm:text-center">
          All works
        </Link>
        <Link href={`/trace/${next.slug}`} className="group no-underline sm:text-right">
          <span className="caps flex items-center gap-2 text-[0.6875rem] text-graphite-soft sm:justify-end">
            Next <PencilArrow dir="right" />
          </span>
          <span className="mt-1.5 block font-tech text-[1.25rem] decoration-pencil-red decoration-[1.5px] group-hover:underline">
            {next.title}
          </span>
        </Link>
      </nav>
    </TraceShell>
  )
}
