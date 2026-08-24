"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/", label: "Start here" },
  { href: "/tree", label: "Skill tree" },
  { href: "/self", label: "Know yourself" },
  { href: "/others", label: "Know others" },
  { href: "/rehearse", label: "Rehearse" },
  { href: "/how", label: "How it works" },
];

export function SiteNav(): React.ReactElement {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-5 py-3 sm:px-8">
        <Link
          href="/"
          className="shrink-0 font-heading text-lg font-semibold text-foreground italic"
        >
          The EI Path
        </Link>

        <nav
          aria-label="Main"
          className="-mx-5 flex-1 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex items-center gap-5 whitespace-nowrap">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-block py-1 text-xs tracking-[0.12em] uppercase underline-offset-[6px] transition-colors duration-(--duration-quick) ease-(--ease-out)",
                      active
                        ? "text-foreground underline decoration-azure decoration-2"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
