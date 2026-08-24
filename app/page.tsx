import type { Icon } from "@phosphor-icons/react/lib";
import {
  ChatsCircle,
  Fingerprint,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { RULES } from "@/lib/data";

interface Gate {
  num: string;
  title: string;
  sub: string;
  href: string;
  icon: Icon;
}

const GATES: readonly Gate[] = [
  {
    num: "01",
    title: "Know yourself",
    sub: "Quiz, then your user manual",
    href: "/self",
    icon: Fingerprint,
  },
  {
    num: "02",
    title: "Know others",
    sub: "Six archetypes, one move each",
    href: "/others",
    icon: UsersThree,
  },
  {
    num: "03",
    title: "Rehearsal room",
    sub: "Practise the hard conversation",
    href: "/rehearse",
    icon: ChatsCircle,
  },
];

export default function HomePage(): React.ReactElement {
  return (
    <div>
      {/* Print-style masthead: a heavy ink rule over serif display type,
          the CTAs living with the pitch instead of a screen below it. */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-5 pt-10 pb-12 sm:px-8 sm:pt-12 sm:pb-16">
          <div className="border-t-[3px] border-foreground pt-6">
            <h1 className="text-4xl font-medium tracking-tight sm:text-6xl">
              The EI Path
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Emotional intelligence for PMT. Know yourself, read the room,
              practise it.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/tree" className={buttonVariants({ size: "lg" })}>
                Open the skill tree
              </Link>
              <Link
                href="/how"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
        <ul className="grid gap-4 sm:grid-cols-3">
          {GATES.map((gate) => (
            <li key={gate.num}>
              <Link
                href={gate.href}
                className="group flex h-full flex-col gap-3 bg-card p-5 ring-1 ring-border transition-[box-shadow,translate] duration-(--duration-fast) ease-(--ease-smooth-out) hover:-translate-y-0.5 hover:shadow-sm hover:ring-azure/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-azure">
                    {gate.num}
                  </span>
                  <gate.icon
                    size={18}
                    weight="duotone"
                    aria-hidden
                    className="text-azure transition-colors duration-(--duration-fast) ease-(--ease-out) group-hover:text-primary"
                  />
                </div>
                <span className="text-base font-medium">{gate.title}</span>
                <span className="text-sm text-muted-foreground">
                  {gate.sub}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {RULES.map((rule) => (
            <Badge key={rule} variant="secondary" className="font-normal">
              {rule}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
