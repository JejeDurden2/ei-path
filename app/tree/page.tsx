import type { ReactElement } from "react";

import { PageHeader } from "@/components/page-header";
import { Tree } from "@/components/tree";

export default function TreePage(): ReactElement {
  return (
    <div>
      <PageHeader
        title="Your capability tree"
        lede="Click a node, tick its modules, unlock the next branch. The layout is deliberately messy: growth is not a straight line, only the foundations come first."
        container="max-w-5xl px-4"
      />
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-12">
        <p className="font-mono text-xs tracking-wide text-muted-foreground">
          ↳ click a node to expand · click a module to validate it · locked branches open when their
          parent is complete
        </p>
        <div className="mt-10">
          <Tree />
        </div>
      </div>
    </div>
  );
}
