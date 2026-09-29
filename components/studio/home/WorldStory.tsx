import Image from 'next/image';
import Link from 'next/link';
import { isExternal, watchHref, worldHref, type Creator, type World } from '../../../lib/content';

const carried = ['People watched it.', 'Shared it.', 'Translated it.', 'Remixed it.'];

export function WorldStory({ world }: { world: World }) {
  const watch = watchHref(world);
  return (
    <section aria-label={`${world.title} — the story`} className="gutter relative bg-[var(--ink)] pb-28 pt-20 sm:pb-40 sm:pt-28">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="serif-lede !text-[clamp(1.9rem,3.6vw,3.25rem)] !leading-[1.08]">
            {world.logline.map((line, i) => (
              <span key={line} data-reveal style={{ '--reveal-delay': `${i * 160}ms` } as React.CSSProperties} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>

        <div className="space-y-8 lg:col-span-5 lg:pt-3" data-reveal>
          <p className="body-lg !text-[var(--bone)]">
            It began as an AI-native film.
            <br />
            Then the audience took it further.
          </p>
          <div>
            <ul className="serif text-[clamp(1.6rem,2.4vw,2.1rem)] leading-[1.15] text-[var(--bone)]">
              {carried.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
          <p className="body-lg">
            Carried it across platforms, languages and communities.
            <br />
            The film stopped belonging to a single screen.
          </p>
        </div>
      </div>

      <div className="mt-28 sm:mt-40">
        <h3 className="display display-lg" data-reveal>
          <span className="block text-[var(--bone-3)]">That&apos;s when</span>
          <span className="block">a story starts</span>
          <span className="block">becoming a world.</span>
        </h3>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8" data-reveal>
          <a
            href={watch}
            className="btn btn-solid w-full sm:w-auto"
            {...(isExternal(watch) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <span className="play" aria-hidden="true" /> Watch the film
          </a>
          <Link href={worldHref(world)} className="link-line self-start sm:self-auto">
            Explore World {world.number} <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Filmmaker credit — presented like an end-card, not a staff profile. */
export function CreatorCredit({ creator }: { creator: Creator }) {
  return (
    <section aria-label="Creator credit" className="gutter border-y border-[var(--hair)] bg-[var(--ink)] py-24 sm:py-36">
      <div className={`mx-auto flex max-w-6xl flex-col items-center gap-12 text-center ${creator.portrait ? 'md:flex-row md:text-left' : ''}`}>
        {creator.portrait && (
          <div className="relative aspect-[4/5] w-[min(320px,70vw)] shrink-0 overflow-hidden">
            <Image src={creator.portrait} alt={`Portrait of ${creator.name}`} fill sizes="320px" className="object-cover grayscale" />
          </div>
        )}
        <div data-reveal>
          <p className="eyebrow mb-7">Created by</p>
          <p className="display text-[clamp(2.75rem,7vw,6.5rem)] !leading-[0.9] tracking-[0.04em]">{creator.name}</p>
          <p className="serif mt-7 text-[clamp(1.2rem,1.8vw,1.5rem)] italic text-[var(--bone-2)]">{creator.credit}</p>
        </div>
      </div>
    </section>
  );
}
