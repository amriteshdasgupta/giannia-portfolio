import { Suspense } from "react"
import { FootBay, HeaderBay } from "./_components/bays"
import { Catalog, CatalogFromParams } from "./_components/catalog"

export default function GlazedHome() {
  return (
    <div className="wall">
      <HeaderBay home />
      {/* The prerendered wall shows every pane lit; the URL's filter and view take over on load. */}
      <Suspense fallback={<Catalog filter="all" view="wall" />}>
        <CatalogFromParams />
      </Suspense>
      <FootBay />
    </div>
  )
}
