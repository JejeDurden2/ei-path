"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { PaperPlaneRight } from "@phosphor-icons/react";

import { darken, tint } from "@/components/archetype-card";
import { ANSWERS, ARCHETYPES, CUES, FLAT, REACTIONS, SITUATIONS } from "@/lib/data";
import type { ArchetypeName } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatMessage =
  | { role: "system"; text: string }
  | { role: "agent"; text: string }
  | { role: "user"; text: string };

type Phase = "setup" | "chat" | "debrief";

const START_SCORE = 50;
const MAX_TURNS = 3;

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

function gaugeTone(score: number): string {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 45) return "bg-amber-500";
  return "bg-rose-500";
}

export function Rehearsal(): ReactElement {
  const [archetypeName, setArchetypeName] = useState<ArchetypeName | null>(null);
  const [situationName, setSituationName] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("setup");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(START_SCORE);
  const [turns, setTurns] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [usedGoodCues, setUsedGoodCues] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const archetype = ARCHETYPES.find((a) => a.name === archetypeName) ?? null;
  const situation = SITUATIONS.find((s) => s.name === situationName) ?? null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  function start(): void {
    if (!archetype || !situation) return;
    setMessages([
      { role: "system", text: `${situation.name} · in character as ${archetype.name}` },
      { role: "agent", text: situation.opening[archetype.name] },
    ]);
    setScore(START_SCORE);
    setTurns(0);
    setUsedGoodCues(new Set());
    setShowHint(false);
    setPhase("chat");
  }

  function restart(): void {
    setPhase("setup");
    setArchetypeName(null);
    setSituationName(null);
    setMessages([]);
    setInput("");
    setScore(START_SCORE);
    setTurns(0);
    setUsedGoodCues(new Set());
    setShowHint(false);
    setIsTyping(false);
  }

  function send(): void {
    const text = input.trim();
    if (!text || !archetype || !situation || isTyping || turns >= MAX_TURNS) return;

    const cues = CUES[archetype.name];
    const lower = text.toLowerCase();
    let delta = 0;
    const hitNow: string[] = [];

    for (const keyword of cues.good) {
      if (lower.includes(keyword.toLowerCase())) {
        delta += 11;
        hitNow.push(keyword);
      }
    }
    for (const keyword of cues.bad) {
      if (lower.includes(keyword.toLowerCase())) {
        delta -= 11;
      }
    }
    if (text.length < 25) delta -= 6;
    if (text.length > 420) delta -= 5;
    if (archetype.name === "Promoter" && text.length < 160) delta += 5;
    if (archetype.name === "Thinker" && /\d/.test(text)) delta += 6;
    if (archetype.name === "Imaginer" && text.length > 200) delta -= 4;
    if (archetype.name === "Harmonizer" && /\?/.test(text)) delta += 5;

    const nextScore = clamp(score + delta, 0, 100);

    let pool: string[];
    if (delta >= 8) pool = REACTIONS[situation.name][archetype.name].up;
    else if (delta <= -8) pool = REACTIONS[situation.name][archetype.name].down;
    else if (text.endsWith("?")) pool = ANSWERS[archetype.name];
    else pool = FLAT[archetype.name];

    const reply = pickRandom(pool);
    const nextTurns = turns + 1;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setScore(nextScore);
    setTurns(nextTurns);
    if (hitNow.length > 0) {
      setUsedGoodCues((prev) => new Set([...prev, ...hitNow]));
    }
    setIsTyping(true);

    window.setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "agent", text: reply }]);
      if (nextTurns >= MAX_TURNS) setPhase("debrief");
    }, 700);
  }

  const remainingGoodCues = archetype
    ? CUES[archetype.name].good.filter((cue) => !usedGoodCues.has(cue)).slice(0, 4)
    : [];

  return (
    <div className="flex flex-col gap-6">
      {phase === "setup" && (
        <Card>
          <CardContent className="flex flex-col gap-6">
            <div>
              <p className="mb-2.5 text-xs font-medium text-muted-foreground">
                Who are you facing
              </p>
              <div className="flex flex-wrap gap-2">
                {ARCHETYPES.map((a) => (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => setArchetypeName(a.name)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm transition-[background-color,box-shadow] duration-150",
                      archetypeName !== a.name && "hover:bg-muted"
                    )}
                    style={
                      archetypeName === a.name
                        ? {
                            background: tint(a.color, 88),
                            color: darken(a.color, 45),
                            boxShadow: `inset 0 0 0 1.5px ${darken(a.color, 15)}`,
                          }
                        : { boxShadow: `inset 0 0 0 1px ${tint(a.color, 30)}` }
                    }
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2.5 text-xs font-medium text-muted-foreground">
                What you have to say
              </p>
              <div className="flex flex-wrap gap-2">
                {SITUATIONS.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setSituationName(s.name)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors duration-150",
                      situationName === s.name
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={start} disabled={!archetype || !situation} className="self-start">
              Start
            </Button>
          </CardContent>
        </Card>
      )}

      {(phase === "chat" || phase === "debrief") && archetype && situation && (
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium" style={{ color: darken(archetype.color, 25) }}>
                {archetype.name}
              </span>
              <span className="text-muted-foreground">· {situation.name}</span>
              <div className="ml-auto h-1 w-16 overflow-hidden rounded-full bg-muted sm:w-24">
                <div
                  className={cn("h-full rounded-full transition-[width] duration-(--duration-fast) ease-(--ease-smooth-out)", gaugeTone(score))}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
            <div ref={scrollRef} className="flex max-h-[420px] flex-col gap-3 overflow-y-auto py-1">
              {messages.map((message, i) => (
                <ChatBubble key={i} message={message} />
              ))}
              {isTyping && (
                <div className="flex w-fit items-center gap-1 self-start rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                  <span className="motion-safe:animate-pulse">...</span>
                </div>
              )}
            </div>
            {phase === "chat" && showHint && (
              <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                {`A ${archetype.name} is ${archetype.driver.toLowerCase()}.`}
                {remainingGoodCues.length > 0 ? ` Try bringing in: ${remainingGoodCues.join(", ")}.` : ""}
              </p>
            )}
            {phase === "chat" && (
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  placeholder="Say what you'd actually say"
                  disabled={isTyping}
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
            )}
            {phase === "chat" && (
              <button
                type="button"
                onClick={() => setShowHint((v) => !v)}
                className="self-start text-xs text-muted-foreground underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline"
              >
                What does this person need?
              </button>
            )}
          </CardContent>
        </Card>
      )}

      {phase === "debrief" && archetype && situation && (
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-semibold tracking-tight">
                {score}
                <span className="text-base font-normal text-muted-foreground">/100</span>
              </p>
              <p className="text-sm font-medium">{verdictFor(score)}</p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition-[width] duration-(--duration-fast) ease-(--ease-smooth-out)", gaugeTone(score))}
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <p>{situation.advice[archetype.name].move}</p>
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">Try this opening</p>
                <p className="text-muted-foreground italic">
                  &quot;{situation.advice[archetype.name].example}&quot;
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">Remember</p>
                <p>{archetype.howToSupport}</p>
              </div>
            </div>
            {showHint && (
              <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                {remainingGoodCues.length > 0
                  ? `Try: ${remainingGoodCues.join(", ")}`
                  : "You used the cues that matter most."}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setShowHint((v) => !v)}>
                What does this person need?
              </Button>
              <Button variant="ghost" onClick={restart}>
                Restart
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }): ReactElement {
  if (message.role === "system") {
    return (
      <p className="self-center text-center font-mono text-xs text-muted-foreground">
        {message.text}
      </p>
    );
  }
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
        isUser ? "self-end bg-foreground text-background" : "self-start bg-muted text-foreground"
      )}
    >
      {message.text}
    </div>
  );
}
