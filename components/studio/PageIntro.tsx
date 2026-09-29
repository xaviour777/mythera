/** Quiet header for secondary pages. */
export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="gutter pb-16 pt-36 sm:pb-24 sm:pt-48">
      <p className="eyebrow eyebrow-strong mb-8">{eyebrow}</p>
      <h1 className="display display-lg max-w-[18ch]">{title}</h1>
      {children && <div className="mt-10 max-w-[38rem]">{children}</div>}
    </header>
  );
}
