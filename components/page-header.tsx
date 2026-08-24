interface PageHeaderProps {
  title: string;
  lede: string;
}

/** Print-style title block: a heavy ink rule above the serif title, a hairline
    closing the section below, the same alignment on every page. */
export function PageHeader({
  title,
  lede,
}: PageHeaderProps): React.ReactElement {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-5xl px-5 pt-8 pb-7 sm:px-8 sm:pt-10 sm:pb-8">
        <div className="border-t-[3px] border-foreground pt-5">
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-muted-foreground">{lede}</p>
        </div>
      </div>
    </section>
  );
}
