import type { Metadata } from "next";
import Link from "next/link";

import { ArchetypeCard } from "@/components/archetype-card";
import { Simulator } from "@/components/simulator";
import { buttonVariants } from "@/components/ui/button";
import { ARCHETYPES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Know others",
  description:
    "Six archetypes and one move each, plus a simulator to read the room before a hard conversation.",
};

export default function OthersPage(): React.ReactElement {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Know others</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Not to classify people. To stop assuming they are difficult, and start asking what
          they need to engage.
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ARCHETYPES.map((archetype) => (
          <ArchetypeCard key={archetype.name} archetype={archetype} />
        ))}
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">Read the room</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Pick who you are talking to and what you are walking into. You get the move and one
          line you could actually say.
        </p>
        <div className="mt-8">
          <Simulator />
        </div>
        <div className="mt-8">
          <Link href="/rehearse" className={buttonVariants({ size: "lg" })}>
            Rehearse this with the agent
          </Link>
        </div>
      </section>
    </main>
  );
}
