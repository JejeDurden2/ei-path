"use client";

import { useEffect, useState, type ReactElement } from "react";
import Link from "next/link";
import { Check, Lock, ArrowRight } from "@phosphor-icons/react";

import { TREE } from "@/lib/data";
import type { TreeBranch } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "eipath.tree";

function moduleKey(branchId: string, module: string): string {
  return `${branchId}|${module}`;
}

function isBranchDone(branch: TreeBranch, doneMap: Record<string, boolean>): boolean {
  return branch.modules.every((m) => doneMap[moduleKey(branch.id, m)]);
}

function branchHasProgress(branch: TreeBranch, doneMap: Record<string, boolean>): boolean {
  return branch.modules.some((m) => doneMap[moduleKey(branch.id, m)]);
}

export function Tree(): ReactElement {
  const [doneMap, setDoneMap] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setDoneMap(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      // ignore unreadable storage
    }
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
        <p className="font-mono text-xs text-muted-foreground">
          {doneModules} / {totalModules} modules
        </p>
        <Progress value={percentage} />
      </div>

      <ol className="flex flex-col">
        {TREE.map((branch, index) => {
          const unlocked =
            index === 0 ||
            isBranchDone(TREE[index - 1], doneMap) ||
            branchHasProgress(branch, doneMap);
          const done = isBranchDone(branch, doneMap);
          const isLast = index === TREE.length - 1;

          return (
            <li key={branch.id} className={cn("relative flex gap-4", !isLast && "pb-8")}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs transition-colors duration-200",
                    done && "border-foreground bg-foreground text-background",
                    !done && unlocked && "border-foreground/40 text-foreground",
                    !unlocked && "border-border text-muted-foreground"
                  )}
                >
                  {done ? (
                    <Check size={13} weight="bold" />
                  ) : unlocked ? (
                    index + 1
                  ) : (
                    <Lock size={12} />
                  )}
                </div>
                {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
              </div>

              <div className="flex-1 pb-1">
                <Card className={cn("transition-opacity duration-200", !unlocked && "opacity-55")}>
                  <CardContent className="flex flex-col gap-3">
                    <div>
                      <h2 className="font-medium">{branch.title}</h2>
                      <p className="text-sm text-muted-foreground">{branch.subtitle}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{branch.description}</p>

                    <ul className="flex flex-col">
                      {branch.modules.map((module) => {
                        const moduleDone = !!doneMap[moduleKey(branch.id, module)];
                        return (
                          <li key={module}>
                            <button
                              type="button"
                              disabled={!unlocked}
                              onClick={() => toggleModule(branch.id, module)}
                              className={cn(
                                "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-150",
                                unlocked ? "hover:bg-muted" : "cursor-not-allowed"
                              )}
                            >
                              <span
                                className={cn(
                                  "flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-150",
                                  moduleDone
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border"
                                )}
                              >
                                {moduleDone && <Check size={11} weight="bold" />}
                              </span>
                              <span
                                className={cn(
                                  !unlocked && "text-muted-foreground",
                                  moduleDone && "text-muted-foreground line-through"
                                )}
                              >
                                {module}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    {branch.href && unlocked && (
                      <Link
                        href={branch.href}
                        className="inline-flex w-fit items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
                      >
                        Open the page
                        <ArrowRight size={13} />
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
