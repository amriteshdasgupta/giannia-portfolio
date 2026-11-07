import type { Metadata } from "next";
import "./index.css";

export const metadata: Metadata = {
  title: "Giannia — three directions",
  description: "Three design directions for Giannia's portfolio, side by side.",
};

export default function IndexLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
