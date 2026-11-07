import type { Metadata } from "next"
import { about } from "@/lib/works"
import { Masthead } from "../_components/masthead"
import { LeaderLine, PencilArrow } from "../_components/pencil"
import { LinkTab, TitleBlock, TitleStamp, TraceShell } from "../_components/shell"

export const metadata: Metadata = {
  title: "About",
  description: `${about.name}, ${about.role.toLowerCase()}: bio, CV and contact.`,
}

// Links still pointing at "#" are placeholders; show them as text until real
const isReal = (href: string) => href !== "#" && href !== ""

export default function AboutPage() {
  const links = about.links
  return (
    <TraceShell
      header={<Masthead current="about" />}
      aside={
        <LinkTab href="/trace">
          <span className="inline-flex items-center gap-1.5">
            <PencilArrow />
            all works
          </span>
        </LinkTab>
      }
      footer={<TitleStamp>About · placeholder details</TitleStamp>}
    >
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section aria-labelledby="about-title">
          <h1 id="about-title" className="font-hand text-[clamp(2.5rem,4.5vw,3.75rem)] leading-none">
            About
          </h1>
          <div className="mt-8 max-w-[62ch] space-y-5 text-[1.1875rem] leading-[1.6] text-pretty">
            {about.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="relative mt-10 ml-12 max-w-[22rem] font-hand text-[1.0625rem] leading-tight text-pencil-blue">
            <LeaderLine className="absolute top-1 right-[calc(100%+0.25rem)] h-14 w-8 -scale-y-100 overflow-visible" />
            placeholder details until Giannia sends the real ones
          </p>
        </section>

        <section aria-labelledby="contact-title" id="contact" className="lg:pt-4">
          <h2 id="contact-title" className="font-hand text-[1.75rem] lg:text-[2rem]">
            Contact
          </h2>
          <a
            href={`mailto:${about.email}`}
            className="mt-3 inline-block font-hand text-[1.5rem] decoration-pencil-red decoration-[1.5px] underline underline-offset-[0.25em] hover:decoration-2 lg:text-[1.875rem]"
          >
            {about.email}
          </a>

          <TitleBlock
            className="mt-8"
            rows={[
              { label: "Name", value: [about.name, about.surname].filter(Boolean).join(" ") },
              { label: "Years", value: about.years },
              { label: "Role", value: about.role },
              { label: "School", value: about.school, wide: true },
              {
                label: "CV",
                wide: true,
                value: isReal(about.cv) ? (
                  <a href={about.cv} download className="underline">
                    Download CV (PDF)
                  </a>
                ) : (
                  "CV to come"
                ),
              },
              {
                label: "Elsewhere",
                wide: true,
                value: (
                  <ul className="flex flex-wrap gap-x-5 gap-y-1">
                    {links.map((l) => (
                      <li key={l.label}>
                        {isReal(l.href) ? (
                          <a href={l.href} className="underline" rel="me noopener" target="_blank">
                            {l.label}
                          </a>
                        ) : (
                          <span>
                            {l.label} <span className="text-graphite-soft">(link to come)</span>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ),
              },
            ]}
          />
        </section>
      </div>
    </TraceShell>
  )
}
