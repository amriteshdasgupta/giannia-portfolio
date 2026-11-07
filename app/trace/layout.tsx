import type { Metadata } from "next"
import localFont from "next/font/local"
import { Atkinson_Hyperlegible_Next, Nanum_Pen_Script } from "next/font/google"
import "./trace.css"

// ISO 3098 technical lettering, as on a CAD title block
const osifont = localFont({
  src: [
    { path: "./_fonts/osifont.ttf", weight: "400", style: "normal" },
    { path: "./_fonts/osifont-italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-tech-face",
  display: "swap",
})
// Pencil annotations only
const pen = Nanum_Pen_Script({ weight: "400", subsets: ["latin"], variable: "--font-pen-face", display: "swap" })
// Reading text
const sans = Atkinson_Hyperlegible_Next({ subsets: ["latin"], variable: "--font-sans-face", display: "swap" })

export const metadata: Metadata = {
  title: { default: "Giannia", template: "%s · Giannia" },
  description: "Drawings, models and writing by Giannia, architecture student.",
}

export default function TraceLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${osifont.variable} ${pen.variable} ${sans.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  )
}
