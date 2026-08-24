"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { ArrowCounterClockwise, PaperPlaneRight } from "@phosphor-icons/react";

import { darken, tint } from "@/components/archetype-card";
import { ANSWERS, ARCHETYPES, CUES, FLAT, REACTIONS, SITUATIONS } from "@/lib/data";
import type { ArchetypeName } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const START_SCORE = 50;
const MAX_TURNS = 3;
const LOG_KEY = "eipath.rehearsals";
const LOG_LIMIT = 5;

const label = "text-[10px] uppercase tracking-[0.18em] text-muted-foreground";

type Phase = "setup" | "scene" | "debrief";

type BeatVerdict = "landed" | "flat" | "missed";

type Beat =
  | { role: "you"; text: string; goodHits: string[]; badHits: string[]; verdict: BeatVerdict }
  | { role: "them"; text: string };

interface LogEntry {
  archetype: ArchetypeName;
  situation: string;
  score: number;
  date: string;
}

function pickRandom(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)] ?? "";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function verdictFor(score: number): string {
  if (score >= 70) return "That landed.";
  if (score >= 45) return "Half landed.";
  return "That missed.";
}

/** Score one line against the archetype's cues. Same heuristics as before,
    but the hits come back so the debrief can mark them in the transcript. */
function scoreLine(
  text: string,
  archetype: ArchetypeName
): { delta: number; goodHits: string[]; badHits: string[] } {
  const cues = CUES[archetype];
  const lower = text.toLowerCase();
  let delta = 0;
  const goodHits: string[] = [];
  const badHits: string[] = [];

  for (const cue of cues.good) {
    if (lower.includes(cue.toLowerCase())) {
      delta += 11;
      goodHits.push(cue);
    }
  }
  for (const cue of cues.bad) {
    if (lower.includes(cue.toLowerCase())) {
      delta -= 11;
      badHits.push(cue);
    }
  }
  if (text.length < 25) delta -= 6;
  if (text.length > 420) delta -= 5;
  if (archetype === "Promoter" && text.length < 160) delta += 5;
  if (archetype === "Thinker" && /\d/.test(text)) delta += 6;
  if (archetype === "Imaginer" && text.length > 200) delta -= 4;
  if (archetype === "Harmonizer" && /\?/.test(text)) delta += 5;

  return { delta, goodHits, badHits };
}

function beatVerdict(delta: number): BeatVerdict {
  if (delta >= 8) return "landed";
  if (delta <= -8) return "missed";
  return "flat";
}

const VERDICT_TONE: Record<BeatVerdict, string> = {
  landed: "text-azure",
  flat: "text-muted-foreground",
  missed: "text-destructive",
};

function readLog(): LogEntry[] {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LogEntry[]) : [];
  } catch {
    return [];
  }
}

/* Editor's marks for the debrief: the first occurrence of each cue,
   overlaps keeping whichever starts first. */
interface Mark {
  start: number;
  end: number;
  kind: "good" | "bad";
}

function findMarks(text: string, good: string[], bad: string[]): Mark[] {
  const lower = text.toLowerCase();
  const all: Mark[] = [];
  const push = (cues: string[], kind: Mark["kind"]): void => {
    for (const cue of cues) {
      const start = lower.indexOf(cue.toLowerCase());
      if (start >= 0) all.push({ start, end: start + cue.length, kind });
    }
  };
  push(good, "good");
  push(bad, "bad");
  all.sort((a, b) => a.start - b.start);

  const marks: Mark[] = [];
  let cursor = 0;
  for (const mark of all) {
    if (mark.start < cursor) continue;
    marks.push(mark);
    cursor = mark.end;
  }
  return marks;
}

function MarkedText({
  text,
  good,
  bad,
}: {
  text: string;
  good: string[];
  bad: string[];
}): ReactElement {
  const marks = findMarks(text, good, bad);
  if (marks.length === 0) return <>{text}</>;

  const parts: ReactElement[] = [];
  let cursor = 0;
  marks.forEach((mark, i) => {
    if (mark.start > cursor) {
      parts.push(<span key={`t${i}`}>{text.slice(cursor, mark.start)}</span>);
    }
    parts.push(
      <span
        key={`m${i}`}
        className={
          mark.kind === "good"
            ? "underline decoration-azure decoration-2 underline-offset-2"
            : "underline decoration-destructive decoration-wavy underline-offset-2"
        }
      >
        {text.slice(mark.start, mark.end)}
      </span>
    );
    cursor = mark.end;
  });
  if (cursor < text.length) parts.push(<span key="tail">{text.slice(cursor)}</span>);
  return <>{parts}</>;
}

export function Rehearsal(): ReactElement {
  const [archetypeName, setArchetypeName] = useState<ArchetypeName | null>(null);
  const [situationName, setSituationName] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("setup");
  const [beats, setBeats] = useState<Beat[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(START_SCORE);
  const [turns, setTurns] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [usedGoodCues, setUsedGoodCues] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const archetype = ARCHETYPES.find((a) => a.name === archetypeName) ?? null;
  const situation = SITUATIONS.find((s) => s.name === situationName) ?? null;

  useEffect(() => {
    setLog(readLog());
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [beats, isTyping]);

  function start(): void {
    if (!archetype || !situation) return;
    setBeats([{ role: "them", text: situation.opening[archetype.name] }]);
    setScore(START_SCORE);
    setTurns(0);
    setUsedGoodCues(new Set());
    setShowHint(false);
    setPhase("scene");
  }

  function restart(): void {
    setPhase("setup");
    setArchetypeName(null);
    setSituationName(null);
    setBeats([]);
    setInput("");
    setScore(START_SCORE);
    setTurns(0);
    setUsedGoodCues(new Set());
    setShowHint(false);
    setIsTyping(false);
  }

  function saveRun(finalScore: number): void {
    if (!archetype || !situation) return;
    const entry: LogEntry = {
      archetype: archetype.name,
      situation: situation.name,
      score: finalScore,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    };
    const next = [entry, ...log].slice(0, LOG_LIMIT);
    setLog(next);
    try {
      localStorage.setItem(LOG_KEY, JSON.stringify(next));
    } catch {
      // Private browsing or a full quota, the log just stays in memory.
    }
  }

  function send(): void {
    const text = input.trim();
    if (!text || !archetype || !situation || isTyping || turns >= MAX_TURNS) return;

    const { delta, goodHits, badHits } = scoreLine(text, archetype.name);
    const nextScore = clamp(score + delta, 0, 100);

    let pool: string[];
    if (delta >= 8) pool = REACTIONS[situation.name][archetype.name].up;
    else if (delta <= -8) pool = REACTIONS[situation.name][archetype.name].down;
    else if (text.endsWith("?")) pool = ANSWERS[archetype.name];
    else pool = FLAT[archetype.name];

    const reply = pickRandom(pool);
    const nextTurns = turns + 1;

    setBeats((prev) => [
      ...prev,
      { role: "you", text, goodHits, badHits, verdict: beatVerdict(delta) },
    ]);
    setInput("");
    setScore(nextScore);
    setTurns(nextTurns);
    if (goodHits.length > 0) {
      setUsedGoodCues((prev) => new Set([...prev, ...goodHits]));
    }
    setIsTyping(true);

    window.setTimeout(() => {
      setIsTyping(false);
      setBeats((prev) => [...prev, { role: "them", text: reply }]);
      if (nextTurns >= MAX_TURNS) {
        setPhase("debrief");
        saveRun(nextScore);
      }
    }, 700);
  }

  const remainingGoodCues = archetype
    ? CUES[archetype.name].good.filter((cue) => !usedGoodCues.has(cue)).slice(0, 5)
    : [];
  const advice = archetype && situation ? situation.advice[archetype.name] : null;

  return (
    <div className="flex flex-col gap-8">
      {phase === "setup" && (
        <section className="flex flex-col gap-8">
          <div>
            <p className={cn(label, "pb-3")}>Who you are facing</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ARCHETYPES.map((a) => {
                const active = a.name === archetypeName;
                return (
                  <button
                    key={a.name}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setArchetypeName(a.name)}
                    className={cn(
                      "cursor-pointer px-4 py-3 text-left outline-none transition-[background-color,box-shadow] duration-(--duration-quick) focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
                      !active && "hover:bg-muted"
                    )}
                    style={
                      active
                        ? {
                            background: tint(a.color, 90),
                            boxShadow: `inset 0 0 0 1.5px ${darken(a.color, 15)}`,
                          }
                        : { boxShadow: `inset 0 0 0 1px ${tint(a.color, 30)}` }
                    }
                  >
                    <span className="block text-sm font-medium">{a.name}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {a.driver.replace(/^Driven by /, "")}
                    </span>
                  </button>
                );
              })}
            </div>
            {archetype && (
              <p
                className="pt-4 font-heading text-lg italic"
                style={{ color: darken(archetype.color) }}
              >
                {"“"}
                {archetype.quote}
                {"”"}
              </p>
            )}
          </div>

          <div>
            <p className={cn(label, "pb-3")}>The scene</p>
            <div className="flex flex-wrap gap-2">
              {SITUATIONS.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  aria-pressed={s.name === situationName}
                  onClick={() => setSituationName(s.name)}
                  className={cn(
                    "cursor-pointer border px-3 py-1.5 text-sm transition-colors duration-150",
                    s.name === situationName
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:bg-muted"
                  )}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            onClick={start}
            disabled={!archetype || !situation}
            className="self-start"
          >
            Start the rehearsal
          </Button>

          {log.length > 0 && (
            <div className="border-t border-border pt-5">
              <p className={cn(label, "pb-2")}>Previous rehearsals</p>
              <ul className="divide-y divide-border">
                {log.map((entry, i) => (
                  <li
                    key={`${entry.date}-${i}`}
                    className="flex items-baseline justify-between gap-4 py-2 text-sm"
                  >
                    <span>
                      {entry.situation} · opposite the {entry.archetype}
                    </span>
                    <span className="flex items-baseline gap-3">
                      <span className="text-xs text-muted-foreground">{entry.date}</span>
                      <span className="font-heading text-base">{entry.score}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {phase !== "setup" && archetype && situation && (
        <section className="border border-border bg-card">
          <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-5 py-3">
            <p className={label}>
              {situation.name} · opposite the {archetype.name}
            </p>
            <p className={label}>
              {phase === "scene" ? `Beat ${Math.min(turns + 1, MAX_TURNS)} of ${MAX_TURNS}` : "Debrief"}
            </p>
          </header>
          <div
            role="meter"
            aria-label="Receptiveness"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-0.5 bg-muted"
          >
            <div
              className="h-full bg-azure transition-[width] duration-(--duration-fast) ease-(--ease-smooth-out)"
              style={{ width: `${score}%` }}
            />
          </div>

          <div
            ref={scrollRef}
            className="flex max-h-[420px] flex-col gap-5 overflow-y-auto px-5 py-5"
          >
            {beats.map((beat, i) =>
              beat.role === "them" ? (
                <div key={i} className="grid gap-x-4 gap-y-0.5 sm:grid-cols-[6rem_1fr]">
                  <span
                    className={cn(label, "sm:pt-1")}
                    style={{ color: darken(archetype.color, 25) }}
                  >
                    {archetype.name}
                  </span>
                  <p className="font-heading text-base leading-relaxed">{beat.text}</p>
                </div>
              ) : (
                <div key={i} className="grid gap-x-4 gap-y-0.5 sm:grid-cols-[6rem_1fr]">
                  <span className={cn(label, "sm:pt-1")}>You</span>
                  <div>
                    <p className="font-heading text-base leading-relaxed">
                      {phase === "debrief" ? (
                        <MarkedText text={beat.text} good={beat.goodHits} bad={beat.badHits} />
                      ) : (
                        beat.text
                      )}
                    </p>
                    <p
                      className={cn(
                        "pt-0.5 text-[10px] tracking-[0.18em] uppercase",
                        VERDICT_TONE[beat.verdict]
                      )}
                    >
                      {beat.verdict}
                    </p>
                  </div>
                </div>
              )
            )}
            {isTyping && (
              <p className="font-heading text-sm text-muted-foreground italic sm:pl-[7rem]">
                (pauses)
              </p>
            )}
          </div>

          {phase === "scene" && (
            <div className="border-t border-border px-5 py-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  placeholder="Say what you'd actually say"
                  disabled={isTyping}
                  className="bg-background"
                />
                <Button
                  size="icon"
                  onClick={send}
                  disabled={isTyping || input.trim() === ""}
                  aria-label="Send"
                >
                  <PaperPlaneRight size={16} />
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setShowHint((v) => !v)}
                className="mt-3 text-xs text-muted-foreground underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline"
              >
                What does this person need?
              </button>
              {showHint && (
                <p className="mt-2 font-heading text-sm text-muted-foreground italic">
                  {`A ${archetype.name} is ${archetype.driver.toLowerCase()}.`}
                  {remainingGoodCues.length > 0
                    ? ` Try bringing in: ${remainingGoodCues.join(", ")}.`
                    : ""}
                </p>
              )}
            </div>
          )}
        </section>
      )}

      {phase === "debrief" && archetype && situation && advice && (
        <section className="flex flex-col gap-6">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="font-heading text-6xl font-medium">
              {score}
              <span className="text-xl text-muted-foreground">/100</span>
            </p>
            <p className="font-heading text-xl italic">{verdictFor(score)}</p>
          </div>

          <p className="text-sm text-muted-foreground">
            In the transcript above,{" "}
            <span className="underline decoration-azure decoration-2 underline-offset-2">
              underlined
            </span>{" "}
            phrases landed with the {archetype.name},{" "}
            <span className="underline decoration-destructive decoration-wavy underline-offset-2">
              wavy
            </span>{" "}
            ones set them off.
          </p>

          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <div>
              <span className={label}>The move</span>
              <p className="pt-1.5 text-sm leading-relaxed">{advice.move}</p>
            </div>
            <div>
              <span className={label}>Try this opening</span>
              <p className="pt-1.5 font-heading text-base leading-relaxed text-muted-foreground italic">
                {"“"}
                {advice.example}
                {"”"}
              </p>
            </div>
            <div>
              <span className={label}>Remember</span>
              <p className="pt-1.5 text-sm leading-relaxed">{archetype.howToSupport}</p>
            </div>
            <div>
              <span className={label}>Language that works with a {archetype.name}</span>
              <p className="pt-1.5 text-sm leading-relaxed">
                {remainingGoodCues.length > 0
                  ? remainingGoodCues.join(", ")
                  : "You used the cues that matter most."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="lg" onClick={start}>
              <ArrowCounterClockwise size={16} />
              Rehearse again
            </Button>
            <Button size="lg" variant="ghost" onClick={restart}>
              Change the scene
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
