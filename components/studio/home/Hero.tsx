import Image from 'next/image';
import { isExternal, proof, watchHref, world001 } from '../../../lib/content';
import { InquiryButton } from '../Inquiry';
import { SlotText } from '../SlotText';

/**
 * First screen: the cinematic frame and the proof arrive together.
 * No intro, no delayed text — the only motion is a slow camera push on the image.
 */
export function Hero() {
  const p = proof();
  const watch = watchHref();
  const media = world001.media;
  const secondary = [
    p.languages && { slot: p.languages, label: 'Languages' },
    p.countries && { slot: p.countries, label: 'Countries' },
  ].filter(Boolean) as { slot: NonNullable<typeof p.languages>; label: string }[];

  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Frame */}
      <div className="absolute inset-0 -z-10 bg-[var(--ink)]" aria-hidden="true">
        <div className="light-in absolute inset-0">
          <div className="hero-push absolute inset-0">
            <Image
              src={media.keyArt}
              alt=""
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              placeholder="blur"
              blurDataURL={media.blurDataURL}
              className="object-cover object-[78%_40%] md:object-[center_40%]"
            />
          </div>
        </div>
        {/* Darkness does the typographic work: left for desktop, bottom for mobile. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.55)_0%,rgba(5,5,5,0.25)_22%,rgba(5,5,5,0.55)_52%,rgba(5,5,5,0.94)_78%,#050505_100%)] md:bg-[linear-gradient(90deg,rgba(5,5,5,0.92)_0%,rgba(5,5,5,0.72)_34%,rgba(5,5,5,0.18)_62%,rgba(5,5,5,0.1)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(0deg,#050505_0%,rgba(5,5,5,0.8)_40%,transparent_100%)]" />
        <div className="vignette absolute inset-0" />
      </div>

      <div className="gutter flex flex-1 flex-col justify-end pb-5 pt-[84px] sm:pb-7 md:justify-center md:pt-[96px]">
        <div className="max-w-[62rem]">
          <p className="eyebrow eyebrow-strong mb-4 md:mb-6"><span className="hidden sm:inline">MYTHRA Studios · </span>World 001: The Mother&apos;s Monster</p>
          <h1 id="hero-title" className="display display-xl">
            We make stories
            <br />
            people carry forward.
          </h1>
          <div className="mt-5 max-w-[34rem] space-y-2 md:mt-7 md:space-y-3">
            <p className="body-lg !text-[var(--bone)]">
              MYTHRA is an AI-native story and IP studio creating original entertainment for a global audience.
            </p>
            <p className="body-lg">
              Our stories start on screen.
              <br className="hidden sm:block" /> What happens next is decided in the real world.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 md:mt-8">
            <a
              href={watch}
              className="btn btn-solid w-full sm:w-auto"
              {...(isExternal(watch) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className="play" aria-hidden="true" />
              Watch The Mother&apos;s Monster
            </a>
            <InquiryButton kind="partner" className="btn btn-line w-full sm:w-auto">
              Partner with Mythra
            </InquiryButton>
            <InquiryButton kind="deck" className="link-line muted self-start sm:ml-3 sm:self-auto">
              Request partner deck <span className="arrow" aria-hidden="true">→</span>
            </InquiryButton>
          </div>
        </div>
      </div>

      {/* Proof — editorial, not a dashboard. */}
      {(p.views || p.festival || secondary.length > 0) && (
        <div className="gutter pb-5 sm:pb-8">
          <div className="flex flex-col gap-2.5 border-t border-[var(--hair-2)] pt-4 md:flex-row md:items-end md:justify-between md:gap-10 md:pt-5">
            {p.views && (
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-6">
                <p className="display text-[clamp(2.1rem,min(4vw,7vh),3.75rem)] leading-none tracking-[0.01em]">
                  <SlotText slot={p.views} />
                </p>
                <p className="eyebrow eyebrow-strong max-w-[26rem] !tracking-[0.26em]">
                  Verified views across {p.platforms.join(' · ')}
                </p>
              </div>
            )}
            <div className="flex flex-col gap-1.5 md:items-end md:text-right">
              {secondary.length > 0 && (
                <p className="eyebrow eyebrow-strong">
                  {secondary.map((s, i) => (
                    <span key={s.label}>
                      {i > 0 && ' · '}
                      <SlotText slot={s.slot} /> {s.label}
                    </span>
                  ))}
                </p>
              )}
              {/* Festival: secondary credibility. Driven by content/mythra.json → festivals[].showOnHero. */}
              {p.festival && (
                <p className="eyebrow lg:whitespace-nowrap">
                  <SlotText slot={p.festival} />
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
