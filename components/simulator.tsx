"use client";

import { useState } from "react";

import { ARCHETYPES, SITUATIONS } from "@/lib/data";
import { darken } from "@/components/archetype-card";
import { cn } from "@/lib/utils";
import type { ArchetypeName } from "@/lib/types";

interface ChipProps {
  label: string;
  selected: boolean;
  color?: string;
  onSelect: () => void;
}

function Chip({ label, selected, color, onSelect }: ChipProps): React.ReactElement {
  const accent = color ? darken(color, 25) : "var(--foreground)";
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors duration-150 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
        selected ? "border-current bg-muted" : "border-border text-muted-foreground hover:text-foreground"
      )}
      style={selected ? { color: accent } : undefined}
    >
      {color ? (
        <span
          aria-hidden
          className="size-1.5 rounded-full"
          style={{ background: color }}
        />
      ) : null}
      <span className={cn(selected && "text-foreground")}>{label}</span>
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
          className="rounded-xl bg-card p-5"
          style={{ boxShadow: `inset 0 0 0 1px ${darken(archetype.color, 15)}` }}
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
