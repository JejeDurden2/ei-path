interface PageHeaderProps {
  title: string;
  lede: string;
}

/** Editorial title block: serif display over an italic serif lede, generous
    air, a hairline closing the section. Same alignment on every page. */
export function PageHeader({
  title,
  lede,
}: PageHeaderProps): React.ReactElement {
  return (
    <section className="border-b border-border bg-secondary">
      <div className="mx-auto max-w-5xl px-5 pt-12 pb-10 sm:px-8 sm:pt-16 sm:pb-12">
        <h1 className="text-4xl font-medium sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl font-heading text-lg text-muted-foreground italic sm:text-xl">
          {lede}
        </p>
      </div>
    </section>
  );
}
