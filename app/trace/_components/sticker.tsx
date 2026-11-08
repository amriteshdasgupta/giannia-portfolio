"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, type Transition } from "framer-motion"
import type { CSSProperties } from "react"
import { stickerOf, type Work } from "@/lib/works"
import type { Size } from "./image-size"
import { scatter } from "./scatter"

/** Settles in about half a second, no overshoot. */
export const SETTLE: Transition = { type: "spring", bounce: 0, duration: 0.5 }

export function Sticker({
  work: w,
  size,
  big = false,
  setAside = false,
  eager = false,
}: {
  work: Work
  size: Size
  big?: boolean
  /** Left out by the filter: not focusable, no caption year */
  setAside?: boolean
  eager?: boolean
}) {
  const s = scatter(w.slug)
  const aspect = size.width / size.height
  // Portrait sheets get narrower so every sticker covers roughly the same area
  const width = big ? 96 : Math.round((70 + s.grow * 18) * Math.min(1, aspect) ** 0.9)

  const style = {
    "--rot-lg": `${s.rot.toFixed(2)}deg`,
    "--rot-sm": `${s.rotSmall.toFixed(2)}deg`,
    "--dx": `${s.dx.toFixed(1)}%`,
    "--dy": `${s.dy}px`,
  } as CSSProperties

  return (
    <motion.li
      layoutId={`sticker-${w.slug}`}
      layout
      transition={SETTLE}
      className={`cell ${big && !setAside ? "is-big" : ""}`}
    >
      <Link href={`/trace/${w.slug}`} className="sticker" style={style} tabIndex={setAside ? -1 : undefined}>
        <span className="sticker-art">
          <Image
            src={stickerOf(w)}
            alt=""
            width={size.width}
            height={size.height}
            sizes={
              big
                ? "(min-width: 1024px) 34vw, (min-width: 560px) 60vw, 90vw"
                : setAside
                  ? "(min-width: 1024px) 12vw, 30vw"
                  : "(min-width: 1024px) 16vw, (min-width: 560px) 28vw, 45vw"
            }
            loading={eager ? "eager" : "lazy"}
            fetchPriority={big && !setAside ? "high" : undefined}
            className="sticker-img"
            style={{ width: `${width}%` }}
            draggable={false}
          />
        </span>
        <span className="sticker-caption">
          <span className="sticker-title">{w.title}</span>
          <span className="sticker-year">{w.year}</span>
        </span>
      </Link>
    </motion.li>
  )
}
