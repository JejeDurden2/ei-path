import type { ReactElement } from "react";

import { PageHeader } from "@/components/page-header";
import { Tree } from "@/components/tree";

export default function TreePage(): ReactElement {
  return (
    <div>
      <PageHeader
        title="Your capability tree"
        lede="Click a node, tick its modules, unlock the next branch. The layout is deliberately messy: growth is not a straight line, only the foundations come first."
      />
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
        <p className="font-mono text-xs tracking-wide text-muted-foreground">
          ↳ your next branch is already open, marked “next up” · tick its modules as you complete
          them · finishing a branch unlocks the following one
        </p>
        <div className="mt-10">
          <Tree />
        </div>
      </div>
    </div>
  );
}
