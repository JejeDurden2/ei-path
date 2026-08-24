interface PageHeaderProps {
  title: string;
  lede: string;
}

/** Full-bleed navy band, the same treatment and alignment as the homepage
    hero, whatever width the page content uses below it. */
export function PageHeader({
  title,
  lede,
}: PageHeaderProps): React.ReactElement {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8 sm:py-8">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-lg text-primary-foreground/85">
          {lede}
        </p>
      </div>
    </section>
  );
}
