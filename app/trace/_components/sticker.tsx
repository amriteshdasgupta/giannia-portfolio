"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, type Transition } from "framer-motion"
import { useRef, useState, type CSSProperties, type SyntheticEvent } from "react"
import { stickerOf, type Work } from "@/lib/works"
import type { Size } from "./image-size"
import { LeaderLine, PencilEllipse } from "./pencil"
import { scatter } from "./scatter"

/** Springy but calm: settles in about half a second. */
export const SINK: Transition = { type: "spring", bounce: 0.14, duration: 0.55 }

export function Sticker({
  work: w,
  size,
  big = false,
  sunk = false,
  looped = false,
  pointed = false,
  onPoint,
  eager = false,
}: {
  work: Work
  size: Size
  big?: boolean
  sunk?: boolean
  /** Red pencil loop around the title */
  looped?: boolean
  /** Pointed at: lift and draw the annotation */
  pointed?: boolean
  onPoint?: (slug: string | null) => void
  eager?: boolean
}) {
  const [flip, setFlip] = useState(false)
  const annot = useRef<HTMLSpanElement>(null)
  const s = scatter(w.slug)
  const aspect = size.width / size.height
  // Portrait sheets get narrower so every sticker covers roughly the same area
  const width = big ? 92 : Math.round((70 + s.grow * 18) * Math.min(1, aspect) ** 0.9)

  const style = {
    "--rot-lg": `${s.rot.toFixed(2)}deg`,
    "--rot-sm": `${s.rotSmall.toFixed(2)}deg`,
    "--dx": `${s.dx.toFixed(1)}%`,
    "--dy": `${s.dy}px`,
  } as CSSProperties

  const enter = (e: SyntheticEvent<HTMLElement>) => {
    // Annotate towards whichever side has room on the sheet
    const r = e.currentTarget.getBoundingClientRect()
    const annotWidth = annot.current?.offsetWidth ?? 0
    setFlip(r.left + r.width * 0.42 + annotWidth > window.innerWidth - 40)
    onPoint?.(w.slug)
  }
  const leave = () => onPoint?.(null)

  return (
    <motion.li
      layoutId={`trace-${w.slug}`}
      layout
      transition={SINK}
      className={`trace-cell ${big && !sunk ? "is-big" : ""}`}
    >
      <div className="sticker" style={style}>
        <Link
          href={`/trace/${w.slug}`}
          className="sticker-link"
          tabIndex={sunk ? -1 : undefined}
          onPointerEnter={enter}
          onPointerLeave={leave}
          onFocus={enter}
          onBlur={leave}
        >
          <Image
            src={stickerOf(w)}
            alt={w.title}
            width={size.width}
            height={size.height}
            sizes={
              big
                ? "(min-width: 1024px) 40vw, (min-width: 768px) 60vw, 90vw"
                : sunk
                  ? "(min-width: 1024px) 12vw, 30vw"
                  : "(min-width: 1024px) 18vw, (min-width: 768px) 28vw, 45vw"
            }
            loading={eager ? "eager" : "lazy"}
            fetchPriority={big && !sunk ? "high" : undefined}
            className="sticker-img"
            style={{ width: `${width}%` }}
            draggable={false}
          />
          <span className="sticker-label" aria-hidden>
            <span className="relative">
              {w.title}
              <PencilEllipse on={looped} big={big && !sunk} />
            </span>
            <span className="sticker-year">{w.year}</span>
          </span>
          <span className="sr-only">
            , {w.context}, {w.year}
          </span>
        </Link>
        {sunk ? null : (
          <span ref={annot} aria-hidden className="sticker-annot" data-on={pointed} data-flip={flip}>
            <LeaderLine draw />
            {w.context} · {w.year}
          </span>
        )}
      </div>
    </motion.li>
  )
}
