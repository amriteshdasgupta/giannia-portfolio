import type { Metadata } from "next"
import { Architects_Daughter, Geist_Mono, Hanken_Grotesk } from "next/font/google"
import "./trace.css"

const hand = Architects_Daughter({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hand-face",
  display: "swap",
})
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap" })
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans-face", display: "swap" })

export const metadata: Metadata = {
  title: { default: "Giannia — works & words", template: "%s · Giannia" },
  description: "Drawings, models and writing by Giannia, architecture student.",
}

export default function TraceLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hand.variable} ${mono.variable} ${sans.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  )
}
