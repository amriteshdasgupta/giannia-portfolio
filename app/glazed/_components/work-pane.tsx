import Image from "next/image"
import Link from "next/link"
import { stickerOf, type Work } from "@/lib/works"

export const pad = (n: number) => String(n).padStart(2, "0")

/** One work: a pane of clear glass with its caption etched at the top and its sticker applied below. */
export function WorkPane({ work, style }: { work: Work; style?: React.CSSProperties }) {
  const featured = Boolean(work.featured)
  return (
    <Link
      href={`/glazed/${work.slug}`}
      className={`pane glass lit work${featured ? " work--featured" : ""}`}
      style={style}
    >
      <p className="work__caption">
        <span className="work__title">
          {pad(work.no)} {work.title}
        </span>
        <span className="work__sep" aria-hidden="true">·</span>
        <span className="sr-only">, </span>
        {work.context}
        <span className="work__sep" aria-hidden="true">·</span>
        <span className="sr-only">, </span>
        {work.year}
      </p>
      <div className="work__sticker">
        <Image
          src={stickerOf(work)}
          alt={work.title}
          fill
          preload={featured}
          sizes={
            featured
              ? "(max-width: 1099px) 92vw, 36vw"
              : "(max-width: 699px) 92vw, (max-width: 1099px) 46vw, 26vw"
          }
        />
      </div>
      {featured && <p className="work__summary">{work.summary}</p>}
      <span className="frost" aria-hidden="true" />
    </Link>
  )
}
