import type { Metadata } from "next"
import { Host_Grotesk } from "next/font/google"
import "./trace.css"

// One family throughout, as an architecture magazine would set it
const host = Host_Grotesk({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-host",
  display: "swap",
})

export const metadata: Metadata = {
  title: { default: "Giannia", template: "%s · Giannia" },
  description: "Drawings, models and writing by Giannia, architecture student.",
}

export default function TraceLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={host.variable}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  )
}
