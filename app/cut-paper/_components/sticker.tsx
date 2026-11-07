import Image from "next/image"
import Link from "next/link"
import { stickerOf, type Work } from "@/lib/works"
import { Mark, markUrl } from "./marks"
import { placement } from "./sheet"
import type { Dims } from "./sticker-size"

type Props = {
  work: Work
  dims: Dims
  /** responsive width hint for next/image */
  sizes: string
  eager?: boolean
  /** set-aside stickers drop their label */
  bare?: boolean
}

/**
 * One die-cut sticker lying on the sheet, with its typeset label.
 * Hover / keyboard focus nudges it and draws the red crayon ring round it.
 */
export function Sticker({ work, dims, sizes, eager, bare }: Props) {
  const p = placement(work.slug)
  return (
    <Link
      href={`/cut-paper/${work.slug}`}
      className="cp-sticker"
      style={
        {
          "--r": p.r,
          "--r2": p.r2,
          "--dx": `${p.dx}px`,
          "--dy": `${p.dy}px`,
        } as React.CSSProperties
      }
    >
      <div className="cp-tilt">
        <Image
          src={stickerOf(work)}
          alt={work.title}
          width={dims.w}
          height={dims.h}
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          draggable={false}
          className="cp-cutout"
        />
        {bare ? null : (
          <p
            className="cp-label m-0 text-[0.8125rem] leading-snug font-medium text-ink sm:text-[0.875rem]"
            style={{ "--chip": markUrl("chip") } as React.CSSProperties}
          >
            <span aria-hidden="true">{work.title}</span>
            <span aria-hidden="true" className="px-1.5 text-ink-soft">
              ·
            </span>
            <span className="tabular-nums">{work.year}</span>
          </p>
        )}
      </div>
      <Mark name="ring" className="cp-ring" />
      <Mark name="sparks" className="cp-ring-sparks" />
    </Link>
  )
}
