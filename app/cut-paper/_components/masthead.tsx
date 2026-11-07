import Link from "next/link"
import { about } from "@/lib/works"
import { Mark } from "./marks"

function NavLink({ href, children, current }: { href: string; children: React.ReactNode; current?: boolean }) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className="relative inline-flex h-11 min-w-24 items-center justify-center px-4 text-[1rem] font-semibold text-cobalt hover:text-ink sm:px-5 sm:text-[1.0625rem]"
    >
      <Mark name="box" className="absolute -inset-x-2 -inset-y-1" />
      <span className="relative">{children}</span>
    </Link>
  )
}

/**
 * The name with its green cut-paper arch, and About / Contact.
 * On the home page the name is the h1; elsewhere it links home.
 */
export function Masthead({ home = false, current }: { home?: boolean; current?: "about" }) {
  const Name = home ? "h1" : "p"
  const name = (
    <span className="flex items-end gap-3 sm:gap-4">
      <Mark name="arch" className={`aspect-[759/734] shrink-0 ${home ? "mb-2 w-11 sm:mb-3 sm:w-[4.5rem]" : "mb-1.5 w-10 sm:mb-2 sm:w-14"}`} />
      <span className="relative block pb-3">
        <span className={`block font-marker leading-[0.9] text-ink ${home ? "text-[3.75rem] sm:text-[6rem]" : "text-[3.25rem] sm:text-[4.5rem]"}`}>
          {about.name}
        </span>
        <Mark name="underline" className="absolute right-[-6%] bottom-0 left-[2%] h-2.5 sm:h-3.5" />
      </span>
    </span>
  )

  return (
    <header className="relative flex flex-wrap items-start justify-between gap-x-6 gap-y-5 pr-[92px] sm:pr-[200px] lg:pr-[290px]">
      <div>
        <Name className="m-0">
          {home ? (
            name
          ) : (
            <Link href="/cut-paper" className="inline-block">
              {name}
              <span className="sr-only">, all works</span>
            </Link>
          )}
        </Name>
        <p className="mt-3 mb-0 ml-14 text-[0.9375rem] text-ink-soft sm:ml-[5.5rem]">{about.role}</p>
      </div>

      <nav aria-label="Site" className="flex gap-4 sm:mt-6 sm:gap-6">
        <NavLink href="/cut-paper/about" current={current === "about"}>
          About
        </NavLink>
        <NavLink href="/cut-paper/about#contact">Contact</NavLink>
      </nav>
    </header>
  )
}
