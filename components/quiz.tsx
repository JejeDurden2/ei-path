"use client";

import { useState } from "react";
import { ArrowCounterClockwise, ArrowDown } from "@phosphor-icons/react";

import { darken } from "@/components/archetype-card";
import { ARCHETYPES, QUIZ } from "@/lib/data";
import type { Archetype, ArchetypeName, ManualKey, QuizOption } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress, ProgressLabel } from "@/components/ui/progress";

export type ManualPrefill = Partial<Record<ManualKey, string>>;

type PickKey = "fb" | "reco" | "blind";
type Picks = Partial<Record<PickKey, string>>;

interface QuizProps {
  onSend: (values: ManualPrefill) => void;
}

const zeroScore = (): Record<ArchetypeName, number> =>
  ARCHETYPES.reduce<Record<ArchetypeName, number>>(
    (acc, archetype) => {
      acc[archetype.name] = 0;
      return acc;
    },
    {} as Record<ArchetypeName, number>,
  );

// Both straight and curly quotes, the source copy mixes them.
const LEADING_QUOTE = /^\s*["“][^"”]*["”]\s*/;
const TRAILING_QUOTE = /\s*["“][^"”]*["”]\s*$/;

const eyebrow =
  "font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground";

export function Quiz({ onSend }: QuizProps): React.JSX.Element {
  const [step, setStep] = useState<number>(0);
  const [score, setScore] = useState<Record<ArchetypeName, number>>(zeroScore);
  const [picks, setPicks] = useState<Picks>({});
  const [sent, setSent] = useState<boolean>(false);

  const finished = step >= QUIZ.length;

  function choose(option: QuizOption): void {
    const field = QUIZ[step].manualField;
    if (field) {
      setPicks((prev) => ({ ...prev, [field]: option.label }));
    } else if (option.archetype) {
      const name = option.archetype;
      setScore((prev) => ({ ...prev, [name]: prev[name] + 1 }));
    }
    setStep((prev) => prev + 1);
  }

  function retake(): void {
    setStep(0);
    setScore(zeroScore());
    setPicks({});
    setSent(false);
  }

  return (
    <Card className="[--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(7)]">
      <CardContent>
        <Progress
          value={finished ? 100 : (step / QUIZ.length) * 100}
          className="gap-2"
        >
          <ProgressLabel className={eyebrow}>
            {finished ? "Your result" : `Question ${step + 1} of ${QUIZ.length}`}
          </ProgressLabel>
        </Progress>
      </CardContent>

      <CardContent>
        {finished ? (
          <Result picks={picks} score={score} sent={sent} onRetake={retake} onSend={(values) => { onSend(values); setSent(true); }} />
        ) : (
          <div className="space-y-5">
            <h3 className="text-lg font-medium tracking-tight text-foreground sm:text-xl">
              {QUIZ[step].question}
            </h3>
            <div className="flex flex-col gap-2">
              {QUIZ[step].options.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => choose(option)}
                  className="rounded-lg border border-border bg-background px-4 py-3 text-left text-sm leading-relaxed text-foreground transition-[background-color,border-color] duration-(--duration-quick) ease-(--ease-out) hover:border-foreground/40 hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ResultProps {
  score: Record<ArchetypeName, number>;
  picks: Picks;
  sent: boolean;
  onSend: (values: ManualPrefill) => void;
  onRetake: () => void;
}

function Result({ score, picks, sent, onSend, onRetake }: ResultProps): React.JSX.Element {
  const best: Archetype = ARCHETYPES.reduce((top, current) =>
    score[current.name] > score[top.name] ? current : top,
  );
  const rest = ARCHETYPES.filter((archetype) => archetype !== best);
  const second: Archetype = rest.reduce((top, current) =>
    score[current.name] > score[top.name] ? current : top,
  );

  function send(): void {
    onSend({
      base: best.name,
      best: `${best.driver}. ${best.strengths}.`,
      triggers: best.stressTriggers,
      under: best.underStress.replace(LEADING_QUOTE, ""),
      need: best.howToSupport.replace(TRAILING_QUOTE, ""),
      fb: picks.fb,
      reco: picks.reco,
      blind: picks.blind,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-lg tracking-tight text-foreground sm:text-xl">
          You lean{" "}
          <b className="font-semibold" style={{ color: darken(best.color, 30) }}>
            {best.name}
          </b>
        </span>
        <span className={eyebrow}>runner-up: {second.name}</span>
      </div>

      <p
        className="border-l-2 pl-4 font-mono text-sm leading-relaxed text-muted-foreground"
        style={{ borderColor: best.color }}
      >
        &ldquo;{best.quote}&rdquo;
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <ResultCell label="Your likely drivers">
          {best.driver}. {best.strengths}.
        </ResultCell>
        <ResultCell label="Your likely triggers">{best.stressTriggers}</ResultCell>
        <ResultCell label="Under stress you may">{best.underStress}</ResultCell>
        <ResultCell label="What you need from others">{best.howToSupport}</ResultCell>
      </div>

      <div className="border-t border-border pt-5">
        <span className={`${eyebrow} block pb-2`}>Straight into your manual</span>
        <dl className="space-y-1.5 text-sm leading-relaxed text-foreground">
          <PickRow label="Feedback" value={picks.fb} />
          <PickRow label="Recognition" value={picks.reco} />
          <PickRow label="Blind spot" value={picks.blind} />
        </dl>
      </div>

      <p className="text-sm text-muted-foreground italic">
        A base is a hypothesis, not a verdict. Keep what rings true, edit the rest
        into your manual.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button size="lg" onClick={send}>
          <ArrowDown size={16} />
          {sent ? "Sent, scroll down" : "Send this to my user manual"}
        </Button>
        <Button size="lg" variant="ghost" onClick={onRetake}>
          <ArrowCounterClockwise size={16} />
          Retake
        </Button>
      </div>
    </div>
  );
}

function ResultCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div>
      <span className={`${eyebrow} block pb-1.5`}>{label}</span>
      <p className="text-sm leading-relaxed text-foreground">{children}</p>
    </div>
  );
}

function PickRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}): React.JSX.Element {
  return (
    <div className="flex flex-wrap gap-x-2">
      <dt className="font-semibold">{label}:</dt>
      <dd className="text-muted-foreground">{value ?? "..."}</dd>
    </div>
  );
}
