import { kinds, stickerOf, works, type Kind } from "@/lib/works"
import { imageSize } from "./_components/image-size"
import type { Filter } from "./_components/scatter"
import { TraceHome } from "./_components/trace-home"

export default async function TracePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const kind: Filter = kinds.some((k) => k.value === sp.kind) ? (sp.kind as Kind) : "all"
  const view = sp.view === "index" ? "index" : "sheet"
  const sizes = Object.fromEntries(works.map((w) => [w.slug, imageSize(stickerOf(w))]))

  return <TraceHome key={`${kind}:${view}`} initialKind={kind} initialView={view} sizes={sizes} />
}
