import { content } from '../../lib/content';
import { PageIntro } from './PageIntro';

export function LegalPage({ title, sections }: { title: string; sections: { heading: string; body: React.ReactNode }[] }) {
  return (
    <>
      <PageIntro eyebrow={`Last updated ${content.legal.lastUpdated}`} title={title}>
        {content.legal.reviewPending && (
          <p className="body-sm">This is a plain-language summary. A full version will be published following legal review.</p>
        )}
      </PageIntro>
      <div className="gutter pb-32">
        <div className="max-w-[44rem] space-y-12 border-t border-[var(--hair)] pt-12">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="eyebrow eyebrow-strong mb-4">{s.heading}</h2>
              <div className="body-lg space-y-4">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
