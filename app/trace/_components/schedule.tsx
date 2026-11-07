import Link from "next/link"
import { kindLabel, type Work } from "@/lib/works"

const pad = (n: number) => String(n).padStart(2, "0")

/** Drafting schedule: every work on one ruled table, for reading fast. */
export function Schedule({ rows }: { rows: Work[] }) {
  return (
    <section aria-label="Index of works">
      <div className="overflow-x-auto">
        <table className="schedule w-full min-w-[18rem] border-collapse font-tech text-[0.9375rem]">
          <thead className="caps text-[0.6875rem] text-graphite-soft">
            <tr>
              <th scope="col" className="w-[3.25rem]">
                No.
              </th>
              <th scope="col">Title</th>
              <th scope="col" className="hidden sm:table-cell">
                Kind
              </th>
              <th scope="col" className="w-[4rem]">
                Year
              </th>
              <th scope="col" className="hidden md:table-cell">
                Context
              </th>
              <th scope="col" className="hidden lg:table-cell">
                Medium
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((w) => (
              <tr key={w.slug}>
                <td className="text-graphite-soft">{pad(w.no)}</td>
                <th scope="row">
                  <Link href={`/trace/${w.slug}`} className="row-title text-[1.125rem] leading-snug no-underline">
                    {w.title}
                  </Link>
                  <span className="caps mt-1 block text-[0.6875rem] text-graphite-soft sm:hidden">
                    {kindLabel(w.kind)}
                  </span>
                </th>
                <td className="hidden sm:table-cell">{kindLabel(w.kind)}</td>
                <td>{w.year}</td>
                <td className="hidden md:table-cell">{w.context}</td>
                <td className="hidden lg:table-cell">{w.medium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
