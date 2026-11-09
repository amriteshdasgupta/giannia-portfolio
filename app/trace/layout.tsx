import type { Metadata } from "next"
import { Courier_Prime } from "next/font/google"
import "./trace.css"

// Typewriter throughout, as if the catalogue were typed up on a machine.
// Courier Prime: a Courier redrawn for screenplays, legible at small sizes.
const typewriter = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-type",
  display: "swap",
})

export const metadata: Metadata = {
  title: { default: "Giannia", template: "%s · Giannia" },
  description: "Drawings, models and writing by Giannia, architecture student.",
}

export default function TraceLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={typewriter.variable}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  )
}
