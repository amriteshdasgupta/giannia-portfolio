import type { Metadata, Viewport } from "next"
import { Familjen_Grotesk, Mansalva } from "next/font/google"
import { about } from "@/lib/works"
import { Mark } from "./_components/marks"
import "./cut-paper.css"

const marker = Mansalva({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mansalva",
})

const grotesk = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen",
})

export const metadata: Metadata = {
  title: {
    default: about.name,
    template: `%s · ${about.name}`,
  },
  description: `${about.name}, ${about.role.toLowerCase()}.`,
}

export const viewport: Viewport = {
  themeColor: "#f8f2e8",
}

export default function CutPaperLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${marker.variable} ${grotesk.variable}`}>
      <body className="min-h-dvh">
        <div className="relative min-h-dvh">
          <Mark name="corner" className="absolute top-0 right-0 aspect-[949/809] w-[112px] sm:w-[200px] lg:w-[260px]" />
          <div className="relative mx-auto max-w-[88rem] px-5 pt-6 pb-10 sm:px-10 sm:pt-10">{children}</div>
        </div>
      </body>
    </html>
  )
}
