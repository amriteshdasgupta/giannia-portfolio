import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getWork, imageOf, kindLabel, neighbours, stickerOf, works } from "@/lib/works"
import { Masthead } from "../_components/masthead"
import { CrayonArrow, PaperArrow, Underline, ink } from "../_components/marks"
import { SheetFooter } from "../_components/sheet-footer"
import { kindColour, kindText, placement } from "../_components/sheet"
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

export default async function WorkPage({ params }: Props) {
  const work = getWork((await params).slug)
  if (!work) notFound()

  const dims = stickerDims([work])[work.slug]!
  const sheet = imageDims(work)
  const { prev, next } = neighbours(work.slug)
  const tilt = placement(work.slug).r * 0.5

  const facts: [string, string][] = [
    ["Context", work.context],
    ["Year", String(work.year)],
    ...(work.location ? [["Location", work.location] as [string, string]] : []),
    ["Medium", work.medium],
    ...(work.collaborators ? [["Collaborators", work.collaborators] as [string, string]] : []),
  ]

  return (
    <>
      <Masthead />

      <main className="mt-6 sm:mt-12">
        <Link
          href="/cut-paper"
          className="group inline-flex min-h-11 items-center gap-2 text-[1rem] font-semibold text-ink underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-poppy"
        >
          <CrayonArrow className="h-5 w-8 transition-transform duration-300 ease-out group-hover:-translate-x-1" />
          all works
        </Link>

        <article className="mt-8">
          <div className="grid items-center gap-x-12 gap-y-12 lg:grid-cols-12">
            <div className="flex justify-center lg:col-span-7">
              <figure
                className="cp-deckle [--hero-h:50vh] lg:[--hero-h:min(560px,70vh)]"
                style={{ rotate: `${tilt}deg`, width: `min(100%, calc(var(--hero-h) * ${(dims.w / dims.h).toFixed(3)}))` }}
              >
                <Image src={stickerOf(work)} alt={work.title} width={dims.w} height={dims.h} sizes="(min-width: 1024px) 50vw, 92vw" loading="eager" />
              </figure>
            </div>

            <header className="lg:col-span-5">
              <p className="m-0 inline-block -rotate-2">
                <span className="relative inline-block px-4 pt-0.5 pb-1.5 font-marker text-[1.5rem] leading-none" style={{ color: kindText[work.kind] }}>
                  <span aria-hidden="true" className="cp-torn absolute inset-0" style={{ background: kindColour[work.kind] }} />
                  <span className="relative">{kindLabel(work.kind)}</span>
                </span>
              </p>
              <h1 className="mt-4 font-marker text-[3rem] leading-[0.95] tracking-[-0.01em] text-balance text-ink sm:text-[4rem]">{work.title}</h1>
              <p className="mt-4 max-w-[38ch] text-[1.1875rem] leading-[1.55] text-ink">{work.summary}</p>

              <dl className="mt-7 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 border-t border-rule pt-5 text-[0.9375rem]">
                {facts.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="font-semibold text-ink-soft">{k}</dt>
                    <dd className="m-0 text-ink tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-7 inline-block -rotate-1 font-marker text-[1.5rem] leading-tight text-cobalt">“{work.note}”</p>
            </header>
          </div>

          <div className="mt-20 grid gap-x-16 gap-y-16 lg:mt-28 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {work.sections.map((s) => (
                <section key={s.heading} className="mb-12 last:mb-0">
                  <h2 className="relative inline-block pb-1.5 font-marker text-[2.25rem] leading-none text-ink">
                    {s.heading}
                    <Underline className="absolute -bottom-1 -left-2 h-3 w-[calc(100%+1.5rem)]" color={kindColour[work.kind] === ink.ochre ? ink.cobalt : kindColour[work.kind]} />
                  </h2>
                  <p className="mt-4 max-w-[65ch] text-[1.0625rem] leading-[1.7] text-ink">{s.body}</p>
                </section>
              ))}
            </div>

            <figure className="m-0 self-start lg:sticky lg:top-10 lg:col-span-5">
              <div className="relative rotate-1 bg-white p-3 shadow-[0_1px_2px_rgb(74_50_24/0.14),0_14px_28px_-12px_rgb(74_50_24/0.3)]">
                <Image src={imageOf(work)} alt={`${work.title}, full sheet`} width={sheet.w} height={sheet.h} sizes="(min-width: 1024px) 36vw, 92vw" className="block h-auto w-full" />
                <span aria-hidden="true" className="cp-torn absolute -top-3 left-6 h-7 w-24 -rotate-6 bg-[#ecdcb8]/85" />
                <span aria-hidden="true" className="cp-torn absolute -top-3 right-6 h-7 w-24 rotate-[5deg] bg-[#ecdcb8]/85" />
              </div>
              <figcaption className="mt-4 text-[0.875rem] text-ink-soft">
                The full sheet · {work.medium}
              </figcaption>
            </figure>
          </div>
        </article>

        <nav aria-label="More works" className="mt-24 grid gap-8 sm:mt-32 sm:grid-cols-2">
          <Link href={`/cut-paper/${prev.slug}`} rel="prev" className="group flex min-h-11 items-center gap-4">
            <PaperArrow dir="left" color={ink.poppy} className="h-10 w-20 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-x-1.5" />
            <span>
              <span className="block font-marker text-[1.4rem] leading-none text-ink-soft">previous</span>
              <span className="mt-1 block text-[1.0625rem] font-semibold text-ink underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-poppy">
                {prev.title}
              </span>
            </span>
          </Link>
          <Link href={`/cut-paper/${next.slug}`} rel="next" className="group flex min-h-11 items-center justify-end gap-4 text-right">
            <span>
              <span className="block font-marker text-[1.4rem] leading-none text-ink-soft">next</span>
              <span className="mt-1 block text-[1.0625rem] font-semibold text-ink underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-poppy">
                {next.title}
              </span>
            </span>
            <PaperArrow color={ink.leaf} className="h-10 w-20 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
          </Link>
        </nav>
      </main>

      <SheetFooter />
    </>
  )
}
