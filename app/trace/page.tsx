import { kinds, stickerOf, works, type Kind } from "@/lib/works"
import { Catalogue } from "./_components/catalogue"
import { imageSize } from "./_components/image-size"
import type { Filter } from "./_components/scatter"

export default async function TracePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const kind: Filter = kinds.some((k) => k.value === sp.kind) ? (sp.kind as Kind) : "all"
  const sizes = Object.fromEntries(works.map((w) => [w.slug, imageSize(stickerOf(w))]))

  return <Catalogue key={kind} initialKind={kind} sizes={sizes} />
}
