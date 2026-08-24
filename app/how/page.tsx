import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import type { FormatItem } from "@/lib/types";
import { FORMATS, ORIGINS, STEPS } from "@/lib/data";

function Disclosure({ item }: { item: FormatItem }): React.ReactElement {
  // The source keeps a bracketed placeholder in one detail. Render it quiet.
  const isPlaceholder = item.detail.startsWith("[");

  return (
    <details className="disclosure h-full rounded-xl p-5 ring-1 ring-foreground/10 transition-shadow duration-(--duration-fast) ease-(--ease-smooth-out) hover:shadow-sm">
      <summary className="flex items-start justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
        <span>
          <span className="block text-base font-medium">{item.title}</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            {item.summary}
          </span>
        </span>
        <CaretDown
          size={16}
          aria-hidden
          className="chev mt-1 shrink-0 text-muted-foreground"
        />
      </summary>
      <p
        className={
          isPlaceholder
            ? "pt-4 font-mono text-xs text-muted-foreground"
            : "pt-4 text-sm text-muted-foreground"
        }
      >
        {item.detail}
      </p>
    </details>
  );
}

export default function HowPage(): React.ReactElement {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
        How it works
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Four moves: two about you, two about the others. Stop and pick it up
        whenever you want, the tree keeps your progress.
      </p>

      <ol className="mt-10 divide-y divide-border border-y border-border">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="grid gap-2 py-6 sm:grid-cols-[7rem_1fr] sm:gap-8"
          >
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase sm:pt-1">
              Step {i + 1}
            </span>
            <div>
              <h2 className="text-base font-medium">{step.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="mt-14 text-xl font-medium tracking-tight">The formats</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FORMATS.map((format) => (
          <li key={format.title}>
            <Disclosure item={format} />
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-xl font-medium tracking-tight">
        Where this comes from
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {ORIGINS.map((origin) => (
          <li key={origin.title}>
            <Disclosure item={origin} />
          </li>
        ))}
      </ul>
    </div>
  );
}
