import Link from "next/link";

// Working index for comparing the three directions. Not part of any design;
// once one direction is chosen, its folder becomes the site root.
const directions = [
  {
    href: "/trace",
    name: "The Trace Roll",
    folder: "app/trace",
    line: "A sketchbook of yellow trace on a light table. Filtered-out works sink under another sheet.",
    comp: "/directions/trace.jpg",
  },
  {
    href: "/cut-paper",
    name: "Cut-Paper Wit",
    folder: "app/cut-paper",
    line: "Works as cut-paper stickers on a white sheet, crayon rings around the one you point at.",
    comp: "/directions/cut-paper.jpg",
  },
  {
    href: "/glazed",
    name: "Glazed Partition",
    folder: "app/glazed",
    line: "A steel-framed glass wall. Each work is a pane; hover backlights it.",
    comp: "/directions/glazed.jpg",
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm text-[var(--muted)]">Giannia&rsquo;s portfolio &middot; work in progress</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Three directions</h1>
      <p className="mt-3 max-w-xl text-[var(--muted)]">
        Same placeholder works, three different notebooks. Open each one, click a sticker, try the
        filters.
      </p>
      <ul className="mt-12 grid gap-8 md:grid-cols-3">
        {directions.map((d) => (
          <li key={d.href}>
            <Link href={d.href} className="group block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.comp}
                alt={`${d.name}: approved mock`}
                className="aspect-[16/9] w-full rounded-md object-cover shadow-sm ring-1 ring-black/10 transition group-hover:shadow-lg"
              />
              <h2 className="mt-4 text-lg font-medium group-hover:underline">{d.name}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{d.line}</p>
              <p className="mt-2 font-mono text-xs text-[var(--muted)]">{d.folder}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
