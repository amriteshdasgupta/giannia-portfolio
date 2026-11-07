import type { Metadata } from "next"
import { Archivo } from "next/font/google"
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
    default: "Giannia — works & words",
    template: "%s — Giannia",
  },
  description: "Drawings, models and writing by Giannia, architecture student.",
}

export default function GlazedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>{children}</body>
    </html>
  )
}
