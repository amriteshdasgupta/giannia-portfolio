import Image from "next/image"
import Link from "next/link"
import { stickerOf, type Work } from "@/lib/works"
import { Ring } from "./ring"
import type { Dims } from "./sticker-size"
import { placement } from "./sheet"

type Props = {
  work: Work
  dims: Dims
  /** responsive width hint for next/image */
  sizes: string
  eager?: boolean
  /** shown on the featured sticker in the full sheet */
  flag?: boolean
  /** set-aside ghosts drop their label */
  bare?: boolean
}

/**
 * One die-cut sticker on its torn backing, with a typeset label.
 * Hover / keyboard focus nudges it and scrawls the red ring round it.
 */
export function Sticker({ work, dims, sizes, eager, flag, bare }: Props) {
  const p = placement(work.slug)
  return (
    <Link
      href={`/cut-paper/${work.slug}`}
      className="cp-sticker"
      style={
        {
          "--ar": (dims.w / dims.h).toFixed(3),
          "--r": p.r,
          "--r2": p.r2,
          "--dx": `${p.dx}px`,
          "--dy": `${p.dy}px`,
        } as React.CSSProperties
      }
    >
      <div className="cp-tilt">
        <figure className="cp-deckle">
          <Image
            src={stickerOf(work)}
            alt={work.title}
            width={dims.w}
            height={dims.h}
            sizes={sizes}
            loading={eager ? "eager" : "lazy"}
            draggable={false}
          />
          {bare ? null : (
          <figcaption className="cp-label text-[0.8125rem] leading-snug text-ink sm:text-[0.9rem]">
            <span className="whitespace-nowrap" aria-hidden="true">
              {work.title}
              <span className="px-1.5 text-ink-soft">·</span>
            </span>{" "}
            <span className="whitespace-nowrap">
              {work.context}
              <span className="px-1.5 text-ink-soft" aria-hidden="true">·</span>
              <span className="tabular-nums">{work.year}</span>
            </span>
          </figcaption>
          )}
        </figure>

        {flag ? (
          <span className="absolute -top-3 -left-2 -rotate-6 px-3 pt-0.5 pb-1.5 font-marker text-[1.3rem] leading-none text-white sm:-left-4 sm:text-[1.5rem]">
            <span aria-hidden="true" className="cp-torn absolute inset-0 bg-poppy" />
            <span className="relative">featured</span>
          </span>
        ) : null}
        {flag ? (
          <p className="absolute top-full right-0 m-0 mt-3 hidden max-w-[20rem] rotate-[-3deg] text-right font-marker text-[1.3rem] leading-tight text-cobalt md:block">
            “{work.note}”
          </p>
        ) : null}
      </div>
      <Ring />
    </Link>
  )
}
