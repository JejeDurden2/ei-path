import type { ReactElement } from "react";

import { PageHeader } from "@/components/page-header";
import { Rehearsal } from "@/components/rehearsal";

export default function RehearsePage(): ReactElement {
  return (
    <div>
      <PageHeader
        title="Rehearsal room"
        lede="Pick who you are facing and what you have to say. Failing here costs nothing."
      />
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-12">
        <Rehearsal />
      </div>
    </div>
  );
}
