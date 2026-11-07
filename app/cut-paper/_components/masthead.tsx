import Link from "next/link"
import { about } from "@/lib/works"
import { ArchMark, CrayonBox, Underline } from "./marks"

function NavLink({ href, children, current }: { href: string; children: React.ReactNode; current?: boolean }) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className="group relative inline-flex min-h-11 items-center px-3.5 pb-1 font-marker text-[1.35rem] leading-none text-cobalt sm:px-5 sm:text-[1.7rem]"
    >
      <CrayonBox className="absolute inset-0 h-full w-full transition-transform duration-300 ease-out group-hover:-rotate-2" />
      <span className="relative">{children}</span>
    </Link>
  )
}

/**
 * The name, "works & words", About / Contact and the corner flourish.
 * On the home page the name is the h1; elsewhere it links home.
 */
export function Masthead({ home = false, current }: { home?: boolean; current?: "about" }) {
  const Name = home ? "h1" : "p"
  const name = (
    <span className="flex items-end gap-1.5 sm:gap-3">
      <ArchMark className={`mb-2 h-12 w-10 shrink-0 ${home ? "sm:mb-3 sm:h-20 sm:w-16" : "sm:h-16 sm:w-13"}`} />
      <span className={`font-marker text-[3.6rem] leading-[0.82] tracking-[-0.01em] text-ink ${home ? "sm:text-[5.6rem]" : "sm:text-[4.4rem]"}`}>
        {about.name}
      </span>
    </span>
  )

  return (
    <header className="relative">
      <div className="relative flex flex-wrap items-start justify-between gap-x-6 gap-y-4 pr-[84px] sm:pr-[170px] lg:pr-[250px]">
        <div>
          <Name className="m-0">
            {home ? (
              name
            ) : (
              <Link href="/cut-paper" className="inline-block rounded-sm">
                {name}
                <span className="sr-only">: all works</span>
              </Link>
            )}
          </Name>
          <p className="relative mt-1 ml-12 inline-block pb-2 font-marker text-[1.45rem] leading-none text-ink sm:ml-20 sm:text-[2rem]">
            works &amp; words
            <Underline className="absolute -bottom-1 -left-3 h-4 w-[calc(100%+3.5rem)]" />
          </p>
        </div>

        <nav aria-label="Site" className="mt-1 flex gap-3 sm:mt-6 sm:gap-5">
          <NavLink href="/cut-paper/about" current={current === "about"}>
            About
          </NavLink>
          <NavLink href="/cut-paper/about#contact">Contact</NavLink>
        </nav>
      </div>
    </header>
  )
}
