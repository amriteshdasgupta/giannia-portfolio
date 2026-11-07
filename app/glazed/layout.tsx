import type { Metadata } from "next"
import { Archivo } from "next/font/google"
import { about } from "@/lib/works"
import "./glazed.css"

// Archivo with its width axis: condensed for the name and titles, normal for captions.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: about.name,
    template: `%s — ${about.name}`,
  },
  description: `${about.name}, ${about.role.toLowerCase()}`,
}

export default function GlazedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>{children}</body>
    </html>
  )
}
