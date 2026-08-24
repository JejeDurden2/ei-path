"use client";

import { useRef, useState } from "react";

import { Manual } from "@/components/manual";
import { PageHeader } from "@/components/page-header";
import { Quiz, type ManualPrefill } from "@/components/quiz";

export default function SelfPage(): React.JSX.Element {
  const manualRef = useRef<HTMLElement>(null);
  const [prefill, setPrefill] = useState<ManualPrefill | null>(null);

  function handleSend(values: ManualPrefill): void {
    // A fresh object each time, so a retake sends its result through again.
    setPrefill({ ...values });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    manualRef.current?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <div>
      <PageHeader
        title="Know yourself"
        lede="You cannot read a room you are not part of. Start with your own emotions."
      />
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-12">
        <section>
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Start with the quiz
          </h2>
          <p className="max-w-2xl pt-3 pb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Nine questions. Nobody wakes up knowing their own triggers, so answer on
            instinct rather than on the version of yourself you would like to be.
          </p>
          <Quiz onSend={handleSend} />
        </section>

        <section ref={manualRef} className="scroll-mt-8 pt-12">
          <h2 className="text-xl font-medium tracking-tight text-foreground">
            Your user manual, built live
          </h2>
          <p className="max-w-2xl pt-3 pb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Fill it in, watch it write itself. It saves here, print or download it to
            share.
          </p>
          <Manual prefill={prefill} />
        </section>
      </div>
    </div>
  );
}
