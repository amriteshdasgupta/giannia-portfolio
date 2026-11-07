import type { Metadata } from "next"
import { about } from "@/lib/works"
import { Masthead } from "../_components/masthead"
import { Underline, ink } from "../_components/marks"
import { SheetFooter } from "../_components/sheet-footer"

export const metadata: Metadata = {
  title: "About",
  description: `About ${about.name}, ${about.role.toLowerCase()}.`,
}

/** A small cut-paper collage: a cobalt arch, a green ground, a red sun. */
function Collage({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 320 300" className={`overflow-visible ${className ?? ""}`}>
      <g className="cp-torn">
        <path fill={ink.poppy} d="M246 38 C 270 36, 290 56, 289 80 C 288 104, 268 121, 245 120 C 221 119, 204 99, 206 76 C 208 54, 224 39, 246 38 Z" />
        <path fill={ink.leaf} d="M8 232 L 312 226 L 314 292 L 6 296 Z" />
        <path
          fill={ink.cobalt}
          fillRule="evenodd"
          d="M58 234 L 60 132 C 62 84, 96 58, 136 57 C 178 57, 210 86, 212 133 L 214 233 Z M 106 234 L 107 160 C 108 142, 120 132, 135 132 C 151 132, 163 143, 164 160 L 166 234 Z"
        />
        <path fill={ink.ochre} d="M226 233 L 228 172 L 268 170 L 270 232 Z" />
      </g>
    </svg>
  )
}

function Line({ href, children, download }: { href: string; children: React.ReactNode; download?: boolean }) {
  return (
    <a
      href={href}
      download={download || undefined}
      className="font-semibold text-ink underline decoration-poppy/40 decoration-2 underline-offset-4 transition-colors hover:decoration-poppy"
    >
      {children}
    </a>
  )
}

export default function AboutPage() {
  return (
    <>
      <Masthead current="about" />

      <main className="mt-14 grid gap-x-16 gap-y-14 sm:mt-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="relative inline-block pb-2 font-marker text-[3.5rem] leading-none text-ink sm:text-[4.5rem]">
            About
            <Underline className="absolute -bottom-1 -left-3 h-4 w-[calc(100%+2.5rem)]" />
          </h1>

          <div className="mt-8 max-w-[62ch] space-y-5 text-[1.1875rem] leading-[1.65] text-ink">
            {about.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <dl className="mt-10 grid max-w-[40rem] grid-cols-[max-content_1fr] gap-x-6 gap-y-2 border-t border-rule pt-5 text-[0.9375rem]">
            <dt className="font-semibold text-ink-soft">Studying</dt>
            <dd className="m-0">{about.role}</dd>
            <dt className="font-semibold text-ink-soft">School</dt>
            <dd className="m-0">{about.school}</dd>
            <dt className="font-semibold text-ink-soft">Years</dt>
            <dd className="m-0 tabular-nums">{about.years}</dd>
          </dl>

          <section id="contact" aria-labelledby="contact-heading" className="mt-16 scroll-mt-10">
            <h2 id="contact-heading" className="font-marker text-[2.5rem] leading-none text-ink">
              Contact
            </h2>
            <p className="mt-5">
              <a
                href={`mailto:${about.email}`}
                className="group relative inline-block pb-2 font-marker text-[2rem] leading-none text-cobalt sm:text-[2.5rem]"
              >
                {about.email}
                <Underline color={ink.poppy} className="absolute -bottom-1 -left-2 h-3.5 w-[calc(100%+1rem)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
              </a>
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 p-0 text-[1.0625rem]">
              <li className="list-none">
                <Line href={about.cv} download={about.cv !== "#"}>
                  Download CV (PDF)
                </Line>
              </li>
              {about.links.map((l) => (
                <li key={l.label} className="list-none">
                  <Line href={l.href}>{l.label}</Line>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="hidden justify-center lg:col-span-5 lg:flex lg:pt-10">
          <Collage className="h-auto w-full max-w-[22rem] -rotate-2" />
        </div>
      </main>

      <SheetFooter />
    </>
  )
}
