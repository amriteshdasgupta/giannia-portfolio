import type { Metadata, Viewport } from "next"
import { Caveat_Brush, Karla } from "next/font/google"
import { about } from "@/lib/works"
import { PaperFilters } from "./_components/paper-filters"
import { CornerFlourish } from "./_components/marks"
import "./cut-paper.css"

const marker = Caveat_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caveat-brush",
})

const karla = Karla({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-karla",
})

export const metadata: Metadata = {
  title: {
    default: `${about.name}: works & words`,
    template: `%s · ${about.name}`,
  },
  description: `${about.role}. Drawings, models and writing.`,
}

export const viewport: Viewport = {
  themeColor: "#f8f1e5",
}

export default function CutPaperLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${marker.variable} ${karla.variable}`}>
      <body className="min-h-dvh">
        <PaperFilters />
        <div className="relative min-h-dvh">
          <CornerFlourish className="pointer-events-none absolute top-0 right-0 h-auto w-[130px] sm:w-[250px] lg:w-[340px]" />
          <div className="relative mx-auto max-w-[88rem] px-5 pt-6 pb-10 sm:px-10 sm:pt-10">{children}</div>
        </div>
      </body>
    </html>
  )
}
