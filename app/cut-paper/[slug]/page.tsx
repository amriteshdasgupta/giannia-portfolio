import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getWork, imageOf, kindLabel, neighbours, stickerOf, works } from "@/lib/works"
import { Masthead } from "../_components/masthead"
import { SheetFooter } from "../_components/sheet-footer"
import { placement } from "../_components/sheet"
import { imageDims, stickerDims } from "../_components/sticker-size"

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

const linkLine =
  "underline decoration-transparent decoration-2 underline-offset-4 hover:decoration-poppy group-hover:decoration-poppy"

export default async function WorkPage({ params }: Props) {
  const work = getWork((await params).slug)
  if (!work) notFound()

  const dims = stickerDims([work])[work.slug]!
  const sheet = imageDims(work)
  const { prev, next } = neighbours(work.slug)
  const tilt = placement(work.slug).r * 0.5

  const all: [string, string | undefined][] = [
    ["Kind", kindLabel(work.kind)],
    ["Year", String(work.year)],
    ["Context", work.context],
    ["Location", work.location],
    ["Medium", work.medium],
    ["Collaborators", work.collaborators],
  ]
  const facts = all.filter((f): f is [string, string] => Boolean(f[1]))

  return (
    <>
      <Masthead />

      <main className="mt-8 sm:mt-12">
        <Link href="/cut-paper" className={`inline-flex min-h-11 items-center text-[0.9375rem] font-semibold text-ink ${linkLine}`}>
          All works
        </Link>

        <article className="mt-6 sm:mt-8">
          <div className="grid items-center gap-x-14 gap-y-10 lg:grid-cols-12">
            <div className="flex justify-center lg:col-span-7">
              <Image
                src={stickerOf(work)}
                alt={work.title}
                width={dims.w}
                height={dims.h}
                sizes="(min-width: 1024px) 50vw, 92vw"
                loading="eager"
                className="cp-cutout [--hero-h:50vh] lg:[--hero-h:min(560px,70vh)]"
                style={{ rotate: `${tilt}deg`, width: `min(100%, calc(var(--hero-h) * ${(dims.w / dims.h).toFixed(3)}))` }}
              />
            </div>

            <header className="lg:col-span-5">
              <h1 className="m-0 font-marker text-[2.75rem] leading-[1.02] text-balance text-ink sm:text-[3.75rem]">{work.title}</h1>
              <p className="mt-5 mb-0 max-w-[40ch] text-[1.1875rem] leading-[1.5] text-ink">{work.summary}</p>

              <dl className="mt-8 mb-0 grid grid-cols-[max-content_1fr] gap-x-8 gap-y-2.5 border-t border-rule pt-5 text-[0.9375rem]">
                {facts.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-ink-soft">{k}</dt>
                    <dd className="m-0 font-medium text-ink tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>

              {work.note ? <p className="mt-8 mb-0 font-marker text-[1.625rem] leading-snug text-cobalt">{work.note}</p> : null}
            </header>
          </div>

          <div className="mt-20 grid gap-x-16 gap-y-14 lg:mt-28 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {work.sections.map((s) => (
                <section key={s.heading} className="mb-12 last:mb-0">
                  <h2 className="m-0 font-marker text-[2rem] leading-none text-ink">{s.heading}</h2>
                  <p className="mt-3 mb-0 max-w-[65ch] text-[1.0625rem] leading-[1.7] text-ink">{s.body}</p>
                </section>
              ))}
            </div>

            <div className="self-start lg:sticky lg:top-10 lg:col-span-5">
              <Image
                src={imageOf(work)}
                alt={`${work.title}, full drawing`}
                width={sheet.w}
                height={sheet.h}
                sizes="(min-width: 1024px) 36vw, 92vw"
                className="block h-auto w-full bg-[#fbf7ef] p-3 shadow-[1px_6px_14px_-4px_rgb(74_50_24/0.28)]"
              />
            </div>
          </div>
        </article>

        <nav aria-label="More works" className="mt-24 grid gap-8 border-t border-rule pt-8 sm:mt-32 sm:grid-cols-2">
          <Link href={`/cut-paper/${prev.slug}`} rel="prev" className="group min-h-11">
            <span className="block text-[0.8125rem] text-ink-soft">Previous</span>
            <span className={`mt-1 block text-[1.125rem] font-semibold text-ink ${linkLine}`}>{prev.title}</span>
          </Link>
          <Link href={`/cut-paper/${next.slug}`} rel="next" className="group min-h-11 sm:text-right">
            <span className="block text-[0.8125rem] text-ink-soft">Next</span>
            <span className={`mt-1 block text-[1.125rem] font-semibold text-ink ${linkLine}`}>{next.title}</span>
          </Link>
        </nav>
      </main>

      <SheetFooter />
    </>
  )
}
