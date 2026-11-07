import { CrayonRule } from "./marks"

/** Cobalt crayon rule across the sheet, and the honest small print. */
export function SheetFooter() {
  return (
    <footer className="mt-24 sm:mt-32">
      <CrayonRule />
      <p className="mt-3 text-right text-[0.875rem] text-ink-soft italic">placeholder works</p>
    </footer>
  )
}
