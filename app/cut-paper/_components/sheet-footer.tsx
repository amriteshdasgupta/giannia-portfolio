import { Mark } from "./marks"

/** Cobalt crayon rule across the sheet, and the honest small print. */
export function SheetFooter() {
  return (
    <footer className="mt-24 sm:mt-32">
      <Mark name="underline" className="h-2.5 w-full" />
      <p className="mt-3 mb-0 text-right text-[0.875rem] text-ink-soft">placeholder works</p>
    </footer>
  )
}
