import Link from "next/link"
import { kindLabel, works, type Work } from "@/lib/works"

const pad = (n: number) => String(n).padStart(2, "0")

/** Drafting schedule: every work on one ruled table, for reading fast. */
export function Schedule({ rows, onShowSheet }: { rows: Work[]; onShowSheet: () => void }) {
  return (
    <section aria-labelledby="schedule-title">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id="schedule-title" className="font-hand text-[1.75rem] lg:text-[2.25rem]">
          Schedule of works
        </h2>
        <p className="font-hand text-[1.0625rem] text-pencil-blue">
          {rows.length} of {works.length} listed ·{" "}
          <button
            type="button"
            onClick={onShowSheet}
            className="cursor-pointer underline decoration-1 underline-offset-[0.22em] hover:decoration-2"
          >
            back to the stickers
          </button>
        </p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="schedule w-full min-w-[19rem] border-collapse font-mono text-[0.875rem] [font-variant-numeric:tabular-nums]">
          <caption className="sr-only">All works, numbered, with kind, year, context and medium</caption>
          <thead className="text-[0.6875rem] uppercase tracking-[0.06em] text-graphite-soft">
            <tr>
              <th scope="col" className="w-[3.5rem]">
                No.
              </th>
              <th scope="col">Title</th>
              <th scope="col" className="hidden sm:table-cell">
                Kind
              </th>
              <th scope="col">Year</th>
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
                <td>{pad(w.no)}</td>
                <th scope="row" className="font-normal">
                  <Link
                    href={`/trace/${w.slug}`}
                    className="font-hand text-[1.1875rem] leading-snug decoration-pencil-red decoration-[1.5px] hover:underline lg:text-[1.3rem]"
                  >
                    {w.title}
                  </Link>
                  {w.featured ? (
                    <span className="ml-2 font-hand text-[0.9375rem] text-pencil-blue">featured</span>
                  ) : null}
                  <span className="mt-0.5 block text-[0.75rem] text-graphite-soft sm:hidden">{kindLabel(w.kind)}</span>
                </th>
                <td className="hidden sm:table-cell">{kindLabel(w.kind)}</td>
                <td>{w.year}</td>
                <td className="hidden md:table-cell">{w.context}</td>
                <td className="hidden lg:table-cell">{w.medium}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="mt-6 font-hand text-[1.125rem] text-pencil-blue">Nothing filed under this tab yet.</p>
        ) : null}
      </div>
    </section>
  )
}
