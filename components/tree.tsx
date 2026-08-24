"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from "react";
import Link from "next/link";
import { Check, Lock, ArrowRight } from "@phosphor-icons/react";

import { TREE } from "@/lib/data";
import type { TreeBranch } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "eipath.tree";

/* Scattered layout, on purpose: growth is not a straight line.
   Percent x + px y inside a fixed-height canvas on md+, plain column on mobile. */
const POSITIONS: { x: string; y: number }[] = [
  { x: "2%", y: 60 },
  { x: "25%", y: 610 },
  { x: "56%", y: 110 },
  { x: "77%", y: 520 },
  { x: "6%", y: 880 },
  { x: "58%", y: 850 },
];
const ROOT_POSITION = { x: "36%", y: 340 };
const CANVAS_HEIGHT = 1340;
const MD_BREAKPOINT = 768;

interface Point {
  x: number;
  y: number;
}

function moduleKey(branchId: string, module: string): string {
  return `${branchId}|${module}`;
}

function isBranchDone(branch: TreeBranch, doneMap: Record<string, boolean>): boolean {
  return branch.modules.every((m) => doneMap[moduleKey(branch.id, m)]);
}

function branchHasProgress(branch: TreeBranch, doneMap: Record<string, boolean>): boolean {
  return branch.modules.some((m) => doneMap[moduleKey(branch.id, m)]);
}

function isUnlocked(index: number, doneMap: Record<string, boolean>): boolean {
  return (
    index === 0 || isBranchDone(TREE[index - 1], doneMap) || branchHasProgress(TREE[index], doneMap)
  );
}

/* The first unlocked branch that still has modules to tick. -1 when everything is done. */
function activeIndex(doneMap: Record<string, boolean>): number {
  return TREE.findIndex((b, i) => isUnlocked(i, doneMap) && !isBranchDone(b, doneMap));
}

function wirePath(from: Point, to: Point): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return `M${from.x.toFixed(1)},${from.y.toFixed(1)} Q${(mx - dy * 0.18).toFixed(1)},${(my + dx * 0.18).toFixed(1)} ${to.x.toFixed(1)},${to.y.toFixed(1)}`;
}

export function Tree(): ReactElement {
  const [doneMap, setDoneMap] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [wires, setWires] = useState<{ root: Point; nodes: Record<string, Point> } | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    let map: Record<string, boolean> = {};
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) map = JSON.parse(raw) as Record<string, boolean>;
    } catch {
      // ignore unreadable storage
    }
    setDoneMap(map);
    const active = activeIndex(map);
    if (active >= 0) setOpenId(TREE[active].id);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(doneMap));
    } catch {
      // ignore write failures (private mode, quota)
    }
  }, [doneMap, loaded]);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const root = nodeRefs.current.root;
    if (!wrap || !root || window.innerWidth < MD_BREAKPOINT) {
      setWires(null);
      return;
    }
    const box = wrap.getBoundingClientRect();
    const center = (el: HTMLElement): Point => {
      const r = el.getBoundingClientRect();
      return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
    };
    const nodes: Record<string, Point> = {};
    for (const branch of TREE) {
      const el = nodeRefs.current[branch.id];
      if (el) nodes[branch.id] = center(el);
    }
    setWires({ root: center(root), nodes });
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // doneMap changes node heights (the unlock hint line), so wires need re-measuring.
  }, [measure, doneMap]);

  function toggleModule(branchId: string, module: string): void {
    const key = moduleKey(branchId, module);
    setDoneMap((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const totalModules = TREE.reduce((sum, b) => sum + b.modules.length, 0);
  const doneModules = TREE.reduce(
    (sum, b) => sum + b.modules.filter((m) => doneMap[moduleKey(b.id, m)]).length,
    0
  );
  const percentage = totalModules > 0 ? Math.round((doneModules / totalModules) * 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <p className="font-mono text-xs text-muted-foreground">
            {doneModules} / {totalModules} modules
          </p>
          <ul className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-azure" aria-hidden />
              in progress
            </li>
            <li className="flex items-center gap-1.5">
              <Check size={11} weight="bold" className="text-primary" aria-hidden />
              done
            </li>
            <li className="flex items-center gap-1.5">
              <Lock size={11} aria-hidden />
              locked
            </li>
          </ul>
        </div>
        <Progress value={percentage} />
      </div>

      <div className="tree-surface overflow-hidden rounded-2xl p-4 ring-1 ring-border sm:p-6">
      <div
        ref={wrapRef}
        className="tree-canvas relative flex flex-col items-center gap-8 md:block"
        style={{ "--tree-h": `${CANVAS_HEIGHT}px` } as CSSProperties}
      >
        <svg className="pointer-events-none absolute inset-0 hidden size-full overflow-visible md:block" aria-hidden>
          {wires &&
            TREE.map((branch, index) => {
              const to = wires.nodes[branch.id];
              if (!to) return null;
              const unlocked = isUnlocked(index, doneMap);
              const done = isBranchDone(branch, doneMap);
              const stroke = done ? "var(--primary)" : unlocked ? "var(--azure)" : "var(--border)";
              return (
                <path
                  key={branch.id}
                  d={wirePath(wires.root, to)}
                  className="tree-wire"
                  stroke={stroke}
                  opacity={unlocked ? 0.75 : 0.9}
                />
              );
            })}
        </svg>

        <div
          ref={(el) => {
            nodeRefs.current.root = el;
          }}
          className="tree-branch rounded-2xl border border-azure/50 bg-background px-5 py-5 text-center shadow-[0_0_0_4px_rgba(46,91,255,0.08)] md:z-10"
          style={{ "--x": ROOT_POSITION.x, "--y": `${ROOT_POSITION.y}px`, "--w": "250px" } as CSSProperties}
        >
          <span className="block text-base font-semibold tracking-tight">Emotional Intelligence</span>
          <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            PMT · the path
          </span>
        </div>

        {TREE.map((branch, index) => {
          const unlocked = isUnlocked(index, doneMap);
          const done = isBranchDone(branch, doneMap);
          const open = openId === branch.id;
          const isNext = loaded && index === activeIndex(doneMap);
          const branchDone = branch.modules.filter((m) => doneMap[moduleKey(branch.id, m)]).length;

          return (
            <div
              key={branch.id}
              className={cn("tree-branch flex flex-col items-center gap-3", open ? "md:z-20" : "md:z-10")}
              style={{ "--x": POSITIONS[index].x, "--y": `${POSITIONS[index].y}px` } as CSSProperties}
            >
              <button
                ref={(el) => {
                  nodeRefs.current[branch.id] = el;
                }}
                type="button"
                disabled={!unlocked}
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : branch.id)}
                className={cn(
                  "relative w-full rounded-xl border bg-background px-4 py-3.5 text-center transition-all duration-200",
                  !unlocked && "cursor-not-allowed opacity-60",
                  unlocked && "hover:-translate-y-0.5 hover:border-azure hover:shadow-md",
                  open && "border-azure shadow-[0_0_0_3px_rgba(46,91,255,0.12)]",
                  done && "border-primary"
                )}
              >
                {isNext && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-azure px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white">
                    next up
                  </span>
                )}
                {done && (
                  <Check size={12} weight="bold" className="absolute right-2.5 top-2.5 text-primary" />
                )}
                {!unlocked && (
                  <Lock size={12} className="absolute right-2.5 top-2.5 text-muted-foreground" />
                )}
                <span className="block text-sm font-medium">{branch.title}</span>
                <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  {branch.subtitle} · {branchDone}/{branch.modules.length}
                </span>
                {!unlocked && (
                  <span className="mt-1.5 block text-[10px] leading-snug text-muted-foreground">
                    Finish “{TREE[index - 1].title}” to unlock
                  </span>
                )}
              </button>

              {open && (
                <div className="flex w-full flex-col gap-2">
                  <p className="tree-kid text-xs leading-relaxed text-muted-foreground">
                    {branch.description}
                  </p>
                  {branch.modules.map((module, j) => {
                    const moduleDone = !!doneMap[moduleKey(branch.id, module)];
                    return (
                      <button
                        key={module}
                        type="button"
                        onClick={() => toggleModule(branch.id, module)}
                        className={cn(
                          "tree-kid flex w-full items-start gap-2.5 rounded-lg border bg-background px-3 py-2.5 text-left text-xs transition-colors duration-150",
                          moduleDone
                            ? "border-azure/60"
                            : "border-dashed border-border hover:border-azure/60"
                        )}
                        style={{ animationDelay: `${j * 60}ms` }}
                      >
                        <span
                          className={cn(
                            "mt-px flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-150",
                            moduleDone ? "border-azure bg-azure text-white" : "border-border"
                          )}
                        >
                          {moduleDone && <Check size={9} weight="bold" />}
                        </span>
                        <span className={cn(moduleDone && "text-muted-foreground line-through")}>
                          {module}
                        </span>
                      </button>
                    );
                  })}
                  {branch.href && (
                    <Link
                      href={branch.href}
                      className="tree-kid inline-flex w-fit items-center gap-1 px-1 text-xs font-medium underline-offset-4 hover:underline"
                      style={{ animationDelay: `${branch.modules.length * 60}ms` }}
                    >
                      Open the page
                      <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
