"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, type Transition } from "framer-motion"
import type { CSSProperties } from "react"
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
  hot = false,
  onHot,
  priority = false,
}: {
  work: Work
  size: Size
  big?: boolean
  sunk?: boolean
  hot?: boolean
  onHot?: (slug: string | null) => void
  priority?: boolean
}) {
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

  const enter = () => onHot?.(w.slug)
  const leave = () => onHot?.(null)

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
            loading={priority ? "eager" : "lazy"}
            fetchPriority={big && !sunk ? "high" : undefined}
            className="sticker-img"
            style={{ width: `${width}%` }}
            draggable={false}
          />
          <span className="sticker-label" aria-hidden>
            <span className="relative inline-block">
              {w.title}
              <PencilEllipse on={hot} big={big && !sunk} />
            </span>
            <span className="sticker-label-rule" />
          </span>
        </Link>
        <p className="sticker-note">
          {sunk ? (
            <>
              {w.context}, {w.year}
            </>
          ) : (
            <>
              <LeaderLine />
              <span className="note-meta">
                {w.context}, {w.year}
              </span>
              <span className="note-text">{w.note}</span>
            </>
          )}
        </p>
      </div>
    </motion.li>
  )
}
