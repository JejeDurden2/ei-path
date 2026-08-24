import type { ReactElement } from "react";

import { Rehearsal } from "@/components/rehearsal";

export default function RehearsePage(): ReactElement {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Rehearsal room</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Pick who you are facing and what you have to say. The agent stays in character, reacts to
        your words, and debriefs you at the end. Failing here costs nothing.
      </p>
      <div className="mt-10">
        <Rehearsal />
      </div>
    </main>
  );
}
