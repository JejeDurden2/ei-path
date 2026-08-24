"use client";

import { useState } from "react";

import { ARCHETYPES, SITUATIONS } from "@/lib/data";
import { darken, tint } from "@/components/archetype-card";
import { cn } from "@/lib/utils";
import type { ArchetypeName } from "@/lib/types";

interface ChipProps {
  label: string;
  selected: boolean;
  color?: string;
  onSelect: () => void;
}

function Chip({ label, selected, color, onSelect }: ChipProps): React.ReactElement {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "cursor-pointer rounded-full px-3 py-1.5 text-sm transition-[background-color,box-shadow,color] duration-150 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
        !selected && "hover:bg-muted",
        !color &&
          (selected
            ? "bg-foreground text-background"
            : "text-muted-foreground ring-1 ring-border ring-inset hover:text-foreground")
      )}
      style={
        color
          ? selected
            ? {
                background: tint(color, 88),
                color: darken(color, 45),
                boxShadow: `inset 0 0 0 1.5px ${darken(color, 15)}`,
              }
            : { boxShadow: `inset 0 0 0 1px ${tint(color, 30)}` }
          : undefined
      }
    >
      {label}
    </button>
  );
}

export function Simulator(): React.ReactElement {
  const [name, setName] = useState<ArchetypeName | null>(null);
  const [situation, setSituation] = useState<string | null>(null);

  const archetype = ARCHETYPES.find((a) => a.name === name) ?? null;
  const picked = SITUATIONS.find((s) => s.name === situation) ?? null;
  const advice = archetype && picked ? picked.advice[archetype.name] : null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Who is in front of you</p>
        <div className="flex flex-wrap gap-2">
          {ARCHETYPES.map((a) => (
            <Chip
              key={a.name}
              label={a.name}
              color={a.color}
              selected={a.name === name}
              onSelect={() => setName(a.name)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">What is happening</p>
        <div className="flex flex-wrap gap-2">
          {SITUATIONS.map((s) => (
            <Chip
              key={s.name}
              label={s.name}
              selected={s.name === situation}
              onSelect={() => setSituation(s.name)}
            />
          ))}
        </div>
      </div>

      {archetype && picked && advice ? (
        <div
          className="rounded-xl p-5"
          style={{
            background: tint(archetype.color),
            boxShadow: `inset 0 0 0 1px ${tint(archetype.color, 55)}`,
          }}
        >
          <p className="font-mono text-xs" style={{ color: darken(archetype.color) }}>
            {picked.name} · {archetype.name}
          </p>
          <p className="mt-3 text-sm leading-relaxed">{advice.move}</p>
          <p className="mt-4 text-xs font-medium text-muted-foreground">Concrete example</p>
          <p className="mt-1 border-l-2 pl-3 text-sm leading-relaxed text-muted-foreground" style={{ borderColor: archetype.color }}>
            {"“"}
            {advice.example}
            {"”"}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Pick a person and a situation to get the move.
        </p>
      )}
    </div>
  );
}
