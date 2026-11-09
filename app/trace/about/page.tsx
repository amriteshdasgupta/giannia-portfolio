import type { Metadata } from "next"
import Link from "next/link"
import { about } from "@/lib/works"
import { KindLinks } from "../_components/filter-tabs"
import { Page, Spec } from "../_components/shell"

export const metadata: Metadata = {
  title: "About",
  description: `${about.name}, ${about.role.toLowerCase()}: bio, CV and contact.`,
}

// Links still pointing at "#" are placeholders; leave them out until real
const isReal = (href: string) => href !== "#" && href !== ""

export default function AboutPage() {
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
    { label: "Years", value: about.years },
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
    ...about.links
      .filter((l) => isReal(l.href))
      .map((l) => ({
        label: l.label,
        value: (
          <a href={l.href} className="underline" rel="me noopener" target="_blank">
            {l.href.replace(/^https?:\/\//, "")}
          </a>
        ),
      })),
  ]

  return (
    <Page
      strip={[
        <Link key="name" href="/trace">
          {about.name}
        </Link>,
        <Link key="back" href="/trace">
          Catalogue of works
        </Link>,
        <span key="role">{about.role}</span>,
        <span key="a">About</span>,
      ]}
      side={<KindLinks />}
      foot="Placeholder details"
    >
      <div className="grid gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16 lg:px-10 lg:py-10">
        <section aria-labelledby="about-title">
          <h1 id="about-title" className="text-[clamp(2rem,3.2vw,2.875rem)] leading-none font-bold">
            About
          </h1>
          <div className="mt-6 max-w-[58ch] space-y-5 text-[1.125rem] leading-[1.55] text-pretty">
            {about.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
        <section aria-label="Contact" id="contact" className="lg:pt-2">
          <Spec rows={rows} />
        </section>
      </div>
    </Page>
  )
}
