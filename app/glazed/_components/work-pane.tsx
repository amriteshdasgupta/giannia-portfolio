import Image from "next/image"
import Link from "next/link"
import { stickerOf, type Work } from "@/lib/works"
import { grainOffset, tiltOf } from "./elevation-map"

export const pad = (n: number) => String(n).padStart(2, "0")

/** One work: a pane of clear glass, title and year on the top inset, its sticker applied below. */
export function WorkPane({ work }: { work: Work }) {
  const featured = Boolean(work.featured)
  return (
    <Link href={`/glazed/${work.slug}`} className="pane glass lit work" style={grainOffset(`work:${work.slug}`)}>
      <p className="work__caption">
        <span className="work__title">{work.title}</span>
        <span className="sr-only">, </span>
        <span className="work__year">{work.year}</span>
      </p>
      <div className="work__sticker" style={tiltOf(work.no)}>
        <Image
          src={stickerOf(work)}
          alt=""
          fill
          preload={featured}
          sizes={
            featured
              ? "(max-width: 1099px) 92vw, 36vw"
              : "(max-width: 699px) 92vw, (max-width: 1099px) 46vw, 26vw"
          }
        />
      </div>
      <span className="frost" aria-hidden="true" />
    </Link>
  )
}
