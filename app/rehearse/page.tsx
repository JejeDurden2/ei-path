import type { ReactElement } from "react";

import { PageHeader } from "@/components/page-header";
import { Rehearsal } from "@/components/rehearsal";

export default function RehearsePage(): ReactElement {
  return (
    <div>
      <PageHeader
        title="Rehearsal room"
        lede="Pick who you are facing and what you have to say. The agent stays in character, reacts to your words, and debriefs you at the end. Failing here costs nothing."
        container="max-w-3xl px-4"
      />
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-12">
        <Rehearsal />
      </div>
    </div>
  );
}
