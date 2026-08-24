import type { ReactElement } from "react";

import { Tree } from "@/components/tree";

export default function TreePage(): ReactElement {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your capability tree</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Click a node, tick its modules, unlock the next branch. Growth is not a straight line,
        only the foundations come first.
      </p>
      <div className="mt-10">
        <Tree />
      </div>
    </main>
  );
}
