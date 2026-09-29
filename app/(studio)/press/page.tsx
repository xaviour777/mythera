import type { Metadata } from 'next';
import { content, email } from '../../../lib/content';
import { PageIntro } from '../../../components/studio/PageIntro';
import { SlotText } from '../../../components/studio/SlotText';

export const metadata: Metadata = { title: 'Press' };

export default function PressPage() {
  const press = email('press');
  return (
    <>
      <PageIntro eyebrow="Press" title="Press & media.">
        <p className="body-lg">
          For interviews, screening requests and press materials about MYTHRA Studios and World 001: The Mother&apos;s Monster.
        </p>
        {press && (
          <p className="mt-6 text-[1.1rem]">
            {press.kind === 'value' ? (
              <a href={`mailto:${press.text}`} className="underline underline-offset-4">
                {press.text}
              </a>
            ) : (
              <SlotText slot={press} />
            )}
          </p>
        )}
      </PageIntro>

      {content.press.length > 0 && (
        <section className="gutter pb-32">
          <ul className="border-t border-[var(--hair)]">
            {content.press.map((item) => (
              <li key={item.url} className="border-b border-[var(--hair)]">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-2 py-7 sm:flex-row sm:items-baseline sm:gap-10">
                  <span className="eyebrow w-40 shrink-0">{item.outlet}</span>
                  <span className="serif text-[1.6rem] leading-tight">{item.headline}</span>
                  <span className="eyebrow sm:ml-auto">{item.date}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
