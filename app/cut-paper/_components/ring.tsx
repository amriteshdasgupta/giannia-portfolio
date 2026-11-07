"use client"

import { useEffect, useRef, useState } from "react"
import { ink } from "./marks"

// The loop and its sparks, drawn on a 200 × 140 sketch and stretched to the
// sticker's real box, so the stroke stays one width and the dash draws fully.
const loop: [number, number][][] = [
  [[156, 16]],
  [[104, 2], [26, 12], [10, 60]],
  [[-2, 104], [58, 134], [112, 131]],
  [[170, 128], [199, 96], [192, 60]],
  [[186, 26], [142, 8], [90, 10]],
  [[68, 11], [50, 16], [36, 24]],
]
const echo: [number, number][][] = [
  [[150, 18]],
  [[100, 6], [30, 16], [14, 60]],
  [[4, 100], [60, 128], [110, 127]],
]
const sparks: [number, number, number, number][] = [
  [171, 18, 180, 4],
  [180, 26, 194, 14],
  [186, 36, 199, 32],
]

function toPath(segs: [number, number][][], sx: number, sy: number) {
  const p = (x: number, y: number) => `${(x * sx).toFixed(1)} ${(y * sy).toFixed(1)}`
  const [[start]] = segs as [[[number, number]]]
  return [`M${p(...start)}`, ...segs.slice(1).map((c) => `C ${c.map(([x, y]) => p(x, y)).join(", ")}`)].join(" ")
}

/** Red crayon ring + three sparks, scrawled round a sticker on hover / focus. */
export function Ring() {
  const ref = useRef<SVGSVGElement>(null)
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry!.contentRect
      setBox((b) => (b && Math.abs(b.w - width) < 1 && Math.abs(b.h - height) < 1 ? b : { w: width, h: height }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const sx = box ? box.w / 200 : 1
  const sy = box ? box.h / 140 : 1

  return (
    <svg ref={ref} aria-hidden="true" focusable="false" viewBox={box ? `0 0 ${box.w} ${box.h}` : "0 0 200 140"} className="cp-ring cp-crayon">
      {box ? (
        <g stroke={ink.poppy} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path pathLength={1} strokeWidth="3.6" d={toPath(loop, sx, sy)} />
          <path pathLength={1} strokeWidth="1.8" opacity="0.55" d={toPath(echo, sx, sy)} />
          {sparks.map(([x1, y1, x2, y2], i) => (
            <path
              key={i}
              pathLength={1}
              className="cp-spark"
              strokeWidth="3.6"
              d={`M${(x1 * sx).toFixed(1)} ${(y1 * sy).toFixed(1)} L ${(x2 * sx).toFixed(1)} ${(y2 * sy).toFixed(1)}`}
              style={{ "--i": i } as React.CSSProperties}
            />
          ))}
        </g>
      ) : null}
    </svg>
  )
}
