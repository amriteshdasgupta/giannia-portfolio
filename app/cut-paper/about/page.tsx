import type { Metadata } from "next"
import { about } from "@/lib/works"
import { Masthead } from "../_components/masthead"
import { SheetFooter } from "../_components/sheet-footer"

export const metadata: Metadata = {
  title: "About",
  description: `${about.name}, ${about.role.toLowerCase()}.`,
}

const link = "font-semibold text-ink underline decoration-poppy/45 decoration-2 underline-offset-4 hover:decoration-poppy"

export default function AboutPage() {
  return (
    <>
      <Masthead current="about" />

      <main className="mt-14 max-w-[44rem] sm:mt-20">
        <h1 className="m-0 font-marker text-[3.25rem] leading-none text-ink sm:text-[4rem]">About</h1>

        <div className="mt-6 flex flex-col gap-5 text-[1.1875rem] leading-[1.6] text-ink">
          {about.bio.map((p) => (
            <p key={p} className="m-0 max-w-[62ch]">
              {p}
            </p>
          ))}
        </div>

        <dl className="mt-12 mb-0 grid grid-cols-[7rem_1fr] gap-x-6 gap-y-3 border-t border-rule pt-6 text-[1rem]">
          <dt className="text-ink-soft">School</dt>
          <dd className="m-0 font-medium">{about.school}</dd>
          <dt className="text-ink-soft">Years</dt>
          <dd className="m-0 font-medium tabular-nums">{about.years}</dd>
        </dl>

        <section id="contact" aria-labelledby="contact-heading" className="mt-14 scroll-mt-10">
          <h2 id="contact-heading" className="m-0 font-marker text-[2.25rem] leading-none text-ink">
            Contact
          </h2>
          <dl className="mt-5 mb-0 grid grid-cols-[7rem_1fr] gap-x-6 gap-y-3 border-t border-rule pt-6 text-[1rem]">
            <dt className="text-ink-soft">Email</dt>
            <dd className="m-0">
              <a href={`mailto:${about.email}`} className={link}>
                {about.email}
              </a>
            </dd>
            <dt className="text-ink-soft">CV</dt>
            <dd className="m-0">
              <a href={about.cv} download={about.cv !== "#" || undefined} className={link}>
                Download PDF
              </a>
            </dd>
            <dt className="text-ink-soft">Links</dt>
            <dd className="m-0 flex flex-wrap gap-x-6 gap-y-2">
              {about.links.map((l) => (
                <a key={l.label} href={l.href} className={link}>
                  {l.label}
                </a>
              ))}
            </dd>
          </dl>
        </section>
      </main>

      <SheetFooter />
    </>
  )
}
