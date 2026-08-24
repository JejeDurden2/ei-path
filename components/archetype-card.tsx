"use client";

import { useId, useState } from "react";
import { CaretDown } from "@phosphor-icons/react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Archetype } from "@/lib/types";

/** Same hue, dark enough to read as text on white. */
export function darken(color: string, amount = 40): string {
  return `color-mix(in oklch, ${color}, black ${amount}%)`;
}

interface ArchetypeCardProps {
  archetype: Archetype;
}

const EASE = "var(--ease-smooth-out, cubic-bezier(0.22, 1, 0.36, 1))";

export function ArchetypeCard({ archetype }: ArchetypeCardProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const rows: Array<[string, string]> = [
    ["Strengths", archetype.strengths],
    ["Stress triggers", archetype.stressTriggers],
    ["Under stress", archetype.underStress],
    ["How to support", archetype.howToSupport],
    ["Where they shine", archetype.whereTheyShine],
  ];

  return (
    <Card
      className="gap-0 transition-shadow duration-200 motion-reduce:transition-none"
      style={
        open
          ? { boxShadow: `inset 0 0 0 1px ${darken(archetype.color, 15)}` }
          : undefined
      }
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="cursor-pointer px-(--card-spacing) text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="flex items-center gap-2 text-base font-medium">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full"
              style={{ background: archetype.color }}
            />
            {archetype.name}
          </h3>
          <CaretDown
            size={16}
            aria-hidden
            className={cn(
              "mt-1 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none",
              open && "rotate-180"
            )}
            style={{ transitionTimingFunction: EASE }}
          />
        </div>

        <p
          className="mt-3 font-mono text-xs leading-relaxed"
          style={{ color: darken(archetype.color) }}
        >
          {"“"}
          {archetype.quote}
          {"”"}
        </p>

        <p className="mt-3 text-sm font-semibold">{archetype.driver}</p>
      </button>

      <div
        id={panelId}
        className="grid transition-[grid-template-rows] duration-250 motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", transitionTimingFunction: EASE }}
      >
        <div className="overflow-hidden">
          <dl className="space-y-3 px-(--card-spacing) pt-4">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                <dd className="mt-0.5 text-sm leading-relaxed">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Card>
  );
}
