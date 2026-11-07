import { kinds, works } from "@/lib/works"
import { Catalog, type Filter, type View } from "./_components/catalog"
import { Masthead } from "./_components/masthead"
import { SheetFooter } from "./_components/sheet-footer"
import { stickerDims } from "./_components/sticker-size"

export default async function CutPaperHome({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const kind = kinds.find((k) => k.value === sp.kind)?.value
  const initialFilter: Filter = kind ?? "all"
  const initialView: View = sp.view === "list" ? "list" : "stickers"

  return (
    <>
      <Masthead home />
      <main>
        <Catalog dims={stickerDims(works)} initialFilter={initialFilter} initialView={initialView} />
      </main>
      <SheetFooter />
    </>
  )
}
