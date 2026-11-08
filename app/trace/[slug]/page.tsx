import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getWork, imageOf, kindLabel, neighbours, works } from "@/lib/works"
import { imageSize } from "../_components/image-size"
import { Facts, LinkTab, Page } from "../_components/shell"

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

export default async function WorkPage({ params }: Props) {
  const w = getWork((await params).slug)
  if (!w) notFound()

  const { prev, next } = neighbours(w.slug)
  const img = imageOf(w)
  const size = imageSize(img)

  const facts = [
    { label: "Kind", value: kindLabel(w.kind) },
    { label: "Year", value: w.year },
    { label: "Context", value: w.context },
    ...(w.location ? [{ label: "Location", value: w.location }] : []),
    { label: "Medium", value: w.medium },
    ...(w.collaborators ? [{ label: "Collaborators", value: w.collaborators }] : []),
  ]

  return (
    <Page aside={<LinkTab href="/trace">All works</LinkTab>} foot="Placeholder work">
      <article className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <figure className="lg:sticky lg:top-8 lg:self-start">
          <div className="border border-rule bg-card p-3 sm:p-4">
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
        </figure>

        <div className="min-w-0">
          <h1 className="text-[clamp(2rem,3.4vw,3rem)] leading-[1.05] font-medium tracking-[-0.025em] text-balance">
            {w.title}
          </h1>
          <p className="mt-5 max-w-[56ch] text-[1.1875rem] leading-[1.5] text-pretty">{w.summary}</p>

          <div className="mt-8 max-w-xl">
            <Facts rows={facts} />
          </div>

          <div className="mt-12 space-y-8">
            {w.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-medium">{s.heading}</h2>
                <p className="mt-1.5 max-w-[62ch] text-[1.0625rem] leading-[1.6] text-pretty">{s.body}</p>
              </section>
            ))}
            {w.note ? (
              <section>
                <h2 className="font-medium">Note</h2>
                <p className="mt-1.5 max-w-[62ch] text-[1.0625rem] leading-[1.6] italic">{w.note}</p>
              </section>
            ) : null}
          </div>
        </div>
      </article>

      <nav aria-label="More works" className="mt-20 grid gap-6 border-t border-rule pt-6 sm:grid-cols-2">
        <Link href={`/trace/${prev.slug}`} className="group no-underline">
          <span className="block text-sm text-ink-soft">Previous</span>
          <span className="mt-1 block text-[1.25rem] font-medium group-hover:underline">{prev.title}</span>
        </Link>
        <Link href={`/trace/${next.slug}`} className="group no-underline sm:text-right">
          <span className="block text-sm text-ink-soft">Next</span>
          <span className="mt-1 block text-[1.25rem] font-medium group-hover:underline">{next.title}</span>
        </Link>
      </nav>
    </Page>
  )
}
