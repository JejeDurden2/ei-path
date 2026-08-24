import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/page-header";
import type { FormatItem } from "@/lib/types";
import { FORMATS, ORIGINS, STEPS } from "@/lib/data";

function Disclosure({ item }: { item: FormatItem }): React.ReactElement {
  // The source keeps a bracketed placeholder in one detail. Render it quiet.
  const isPlaceholder = item.detail.startsWith("[");

  return (
    <details className="disclosure h-full rounded-xl bg-card p-5 ring-1 ring-border transition-shadow duration-(--duration-fast) ease-(--ease-smooth-out) hover:shadow-sm">
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
            ? "pt-4 text-xs text-muted-foreground"
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
    <div>
      <PageHeader
        title="How it works"
        lede="Four moves: two about you, two about the others. The tree keeps your progress."
      />
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
        <ol className="divide-y divide-border border-y border-border">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="grid gap-2 py-6 sm:grid-cols-[7rem_1fr] sm:gap-8"
            >
              <span className="text-xs tracking-widest text-azure uppercase sm:pt-1">
                Step {i + 1}
              </span>
              <div>
                <h2 className="text-base font-medium">{step.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="mt-14 text-xl font-medium">
          The formats
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FORMATS.map((format) => (
            <li key={format.title}>
              <Disclosure item={format} />
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-xl font-medium">
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
    </div>
  );
}
