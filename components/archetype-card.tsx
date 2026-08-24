"use client";

import { useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { Archetype } from "@/lib/types";

/** Same hue, dark enough to read as text on white. */
export function darken(color: string, amount = 40): string {
  return `color-mix(in oklch, ${color}, black ${amount}%)`;
}

export function tint(color: string, amount = 93): string {
  return `color-mix(in oklch, ${color}, white ${amount}%)`;
}

interface ArchetypeExplorerProps {
  archetypes: Archetype[];
}

export function ArchetypeExplorer({ archetypes }: ArchetypeExplorerProps): React.ReactElement {
  const [index, setIndex] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selected = archetypes[index];
  const panelId = `${baseId}-panel`;
  const tabId = (i: number): string => `${baseId}-tab-${i}`;

  const select = (i: number): void => {
    setIndex(i);
    tabRefs.current[i]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent): void => {
    const last = archetypes.length - 1;
    if (event.key === "ArrowRight") select(index === last ? 0 : index + 1);
    else if (event.key === "ArrowLeft") select(index === 0 ? last : index - 1);
    else if (event.key === "Home") select(0);
    else if (event.key === "End") select(last);
    else return;
    event.preventDefault();
  };

  const steps: Array<[string, string]> = [
    ["What sets them off", selected.stressTriggers],
    ["What it looks like", selected.underStress],
    ["Your move", selected.howToSupport],
  ];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Archetypes"
        onKeyDown={onKeyDown}
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
      >
        {archetypes.map((archetype, i) => {
          const active = i === index;
          return (
            <button
              key={archetype.name}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={tabId(i)}
              aria-selected={active}
              aria-controls={panelId}
              tabIndex={active ? 0 : -1}
              onClick={() => setIndex(i)}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-2.5 text-left outline-none transition-[background-color,box-shadow] duration-(--duration-quick) focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
                !active && "hover:bg-muted"
              )}
              style={
                active
                  ? {
                      background: tint(archetype.color, 90),
                      boxShadow: `inset 0 0 0 1.5px ${darken(archetype.color, 15)}`,
                    }
                  : { boxShadow: `inset 0 0 0 1px ${tint(archetype.color, 30)}` }
              }
            >
              <span className="block text-sm font-medium">{archetype.name}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {archetype.driver.replace(/^Driven by /, "")}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId(index)}
        tabIndex={0}
        className="mt-4 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        style={{
          background: tint(selected.color),
          boxShadow: `inset 0 0 0 1px ${tint(selected.color, 55)}`,
        }}
      >
        <div
          key={selected.name}
          className="animate-in p-5 duration-(--duration-fast) fade-in slide-in-from-bottom-1 ease-(--ease-smooth-out) motion-reduce:animate-none sm:p-7"
        >
          <p
            className="font-mono text-base leading-relaxed text-balance sm:text-lg"
            style={{ color: darken(selected.color) }}
          >
            {"“"}
            {selected.quote}
            {"”"}
          </p>
          <p className="mt-2 text-sm">
            <span className="font-semibold">{selected.name}</span>
            <span className="text-muted-foreground"> · {selected.driver.toLowerCase()}</span>
          </p>

          <div className="mt-6 grid gap-6 border-t pt-6 md:grid-cols-[2fr_3fr] md:gap-10"
            style={{ borderColor: tint(selected.color, 60) }}
          >
            <div className="space-y-5">
              <h3
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: darken(selected.color, 25) }}
              >
                At their best
              </h3>
              <div>
                <h4 className="text-xs font-medium text-muted-foreground">Strengths</h4>
                <p className="mt-1 text-sm leading-relaxed">{selected.strengths}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-muted-foreground">Where they shine</h4>
                <p className="mt-1 text-sm leading-relaxed">{selected.whereTheyShine}</p>
              </div>
            </div>

            <div>
              <h3
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: darken(selected.color, 25) }}
              >
                Under pressure
              </h3>
              <ol className="mt-5">
                {steps.map(([label, value], i) => (
                  <li key={label} className="relative pb-5 pl-8 last:pb-0">
                    {i < steps.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute top-6 bottom-0 left-[11px] w-px"
                        style={{ background: tint(selected.color, 45) }}
                      />
                    )}
                    <span
                      aria-hidden
                      className="absolute top-0 left-0 flex size-[23px] items-center justify-center rounded-full bg-background font-mono text-[11px]"
                      style={{
                        color: darken(selected.color, 25),
                        boxShadow: `inset 0 0 0 1px ${tint(selected.color, 30)}`,
                      }}
                    >
                      {i + 1}
                    </span>
                    <h4 className="pt-0.5 text-xs font-medium text-muted-foreground">{label}</h4>
                    <p className="mt-1 text-sm leading-relaxed">{value}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
