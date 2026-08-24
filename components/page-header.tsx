import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  lede: string;
  /** Width and padding classes matching the page's content container. */
  container?: string;
}

/** Full-bleed navy band, the same treatment as the homepage hero. */
export function PageHeader({
  title,
  lede,
  container = "max-w-5xl px-5 sm:px-8",
}: PageHeaderProps): React.ReactElement {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className={cn("mx-auto py-10 sm:py-12", container)}>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-primary-foreground/85">
          {lede}
        </p>
      </div>
    </section>
  );
}
