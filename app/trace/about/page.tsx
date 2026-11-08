import type { Metadata } from "next"
import { about } from "@/lib/works"
import { Facts, LinkTab, Page } from "../_components/shell"

export const metadata: Metadata = {
  title: "About",
  description: `${about.name}, ${about.role.toLowerCase()}: bio, CV and contact.`,
}

// Links still pointing at "#" are placeholders; leave them out until real
const isReal = (href: string) => href !== "#" && href !== ""

export default function AboutPage() {
  const links = about.links.filter((l) => isReal(l.href))
  const rows = [
    {
      label: "Email",
      value: (
        <a href={`mailto:${about.email}`} className="underline">
          {about.email}
        </a>
      ),
    },
    { label: "School", value: about.school },
    ...(isReal(about.cv)
      ? [
          {
            label: "CV",
            value: (
              <a href={about.cv} download className="underline">
                Download (PDF)
              </a>
            ),
          },
        ]
      : []),
    ...links.map((l) => ({
      label: l.label,
      value: (
        <a href={l.href} className="underline" rel="me noopener" target="_blank">
          {l.href.replace(/^https?:\/\//, "")}
        </a>
      ),
    })),
  ]

  return (
    <Page aside={<LinkTab href="/trace">All works</LinkTab>} foot="Placeholder details">
      <div className="grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <section aria-labelledby="about-title">
          <h1 id="about-title" className="text-[clamp(2rem,3.4vw,3rem)] leading-none font-medium tracking-[-0.025em]">
            About
          </h1>
          <div className="mt-6 max-w-[60ch] space-y-5 text-[1.1875rem] leading-[1.55] text-pretty">
            {about.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
        <section aria-label="Contact" id="contact" className="lg:pt-3">
          <Facts rows={rows} />
        </section>
      </div>
    </Page>
  )
}
