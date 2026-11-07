import type { Metadata } from "next"
import { about } from "@/lib/works"
import { Masthead } from "../_components/masthead"
import { PencilArrow } from "../_components/pencil"
import { LinkTab, TitleBlock, TitleStamp, TraceShell } from "../_components/shell"

export const metadata: Metadata = {
  title: "About",
  description: `${about.name}, ${about.role.toLowerCase()}: bio, CV and contact.`,
}

// Links still pointing at "#" are placeholders; list them without a dead link
const isReal = (href: string) => href !== "#" && href !== ""

export default function AboutPage() {
  return (
    <TraceShell
      header={<Masthead current="about" />}
      aside={
        <LinkTab href="/trace">
          <span className="inline-flex items-center gap-2">
            <PencilArrow />
            All works
          </span>
        </LinkTab>
      }
      footer={<TitleStamp cells={["Giannia — portfolio", "About", "Placeholder details"]} />}
    >
      <div className="grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <section aria-labelledby="about-title">
          <h1 id="about-title" className="font-tech text-[clamp(2.25rem,4vw,3.25rem)] leading-none">
            About
          </h1>
          <div className="mt-8 max-w-[62ch] space-y-5 text-[1.1875rem] leading-[1.6] text-pretty">
            {about.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="contact-title" id="contact" className="lg:pt-2">
          <h2 id="contact-title" className="caps text-[0.8125rem] text-graphite-soft">
            Contact
          </h2>
          <a
            href={`mailto:${about.email}`}
            className="mt-2 inline-block font-tech text-[1.5rem] underline decoration-pencil-red decoration-[1.5px] hover:decoration-2 lg:text-[1.875rem]"
          >
            {about.email}
          </a>

          <TitleBlock
            className="mt-8"
            rows={[
              { label: "School", value: about.school, wide: true },
              {
                label: "CV",
                value: isReal(about.cv) ? (
                  <a href={about.cv} download className="underline">
                    Download (PDF)
                  </a>
                ) : (
                  "To come"
                ),
              },
              {
                label: "Links",
                value: (
                  <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {about.links.map((l) => (
                      <li key={l.label}>
                        {isReal(l.href) ? (
                          <a href={l.href} className="underline" rel="me noopener" target="_blank">
                            {l.label}
                          </a>
                        ) : (
                          l.label
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
