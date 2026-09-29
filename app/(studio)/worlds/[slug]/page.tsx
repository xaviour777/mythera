import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { content, getCreator, getWorld, proof, showPlaceholders } from '../../../../lib/content';
import { CreatorCredit } from '../../../../components/studio/home/WorldStory';
import { InquiryButton } from '../../../../components/studio/Inquiry';
import { SlotText } from '../../../../components/studio/SlotText';

export function generateStaticParams() {
  return content.worlds.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const world = getWorld((await params).slug);
  if (!world) return {};
  return {
    title: `World ${world.number}: ${world.title}`,
    description: world.logline.join(' '),
    openGraph: { images: [{ url: world.media.ogImage, width: 1200, height: 630 }] },
  };
}

function toEmbed(url: string) {
  // Accept a plain YouTube watch/short link and use the privacy-enhanced player.
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0` : url;
}

export default async function WorldPage({ params }: { params: Promise<{ slug: string }> }) {
  const world = getWorld((await params).slug);
  if (!world) notFound();
  const creator = getCreator(world.creatorId);
  const p = proof();
  const embed = world.film.embedUrl ? toEmbed(world.film.embedUrl) : world.film.watchUrl ? toEmbed(world.film.watchUrl) : null;
  const canEmbed = !!embed && /youtube(-nocookie)?\.com\/embed|player\.vimeo\.com/.test(embed);

  return (
    <>
      <section className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <Image
            src={world.media.keyArt}
            alt=""
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={world.media.blurDataURL}
            className="object-cover"
            style={{ objectPosition: world.media.focalPoint }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,#050505_0%,rgba(5,5,5,0.6)_45%,rgba(5,5,5,0.3)_100%)]" />
        </div>
        <div className="gutter pb-16 pt-40 sm:pb-24">
          <p className="eyebrow eyebrow-strong mb-6">{world.kicker}</p>
          <h1 className="display display-xl max-w-[12ch]">{world.title}</h1>
          <p className="serif-lede mt-10 max-w-[28rem]">
            {world.logline.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </p>
        </div>
      </section>

      <section id="watch" aria-labelledby="watch-title" className="gutter scroll-mt-24 bg-[var(--ink)] py-20 sm:py-32">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="watch-title" className="display display-md">
            Watch the film
          </h2>
          {world.film.runtime && <p className="eyebrow">{world.film.runtime}</p>}
        </div>

        {canEmbed ? (
          <div className="relative aspect-video w-full overflow-hidden bg-black">
            <iframe
              src={embed!}
              title={`${world.title} — official film`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        ) : world.film.watchUrl ? (
          <a href={world.film.watchUrl} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
            <span className="play" aria-hidden="true" /> Watch {world.film.platformLabel ? `on ${world.film.platformLabel}` : 'now'}
          </a>
        ) : showPlaceholders() ? (
          <div className="flex aspect-video w-full items-center justify-center border border-dashed border-[var(--hair-2)]">
            <span className="placeholder-token">[[{world.film.placeholder}]]</span>
          </div>
        ) : (
          <p className="body-lg">The official film link is being updated. Please check back shortly.</p>
        )}

        {(p.views || p.festival) && (
          <div className="mt-12 flex flex-col gap-2 border-t border-[var(--hair)] pt-6 sm:flex-row sm:items-baseline sm:gap-6">
            {p.views && (
              <>
                <p className="display text-[2.25rem] leading-none">
                  <SlotText slot={p.views} />
                </p>
                <p className="eyebrow eyebrow-strong">Verified views across {p.platforms.join(' · ')}</p>
              </>
            )}
            {p.festival && (
              <p className="eyebrow sm:ml-auto">
                <SlotText slot={p.festival} />
              </p>
            )}
          </div>
        )}
      </section>

      <section className="gutter bg-[var(--ink)] pb-28 sm:pb-40">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <p className="serif-lede lg:col-span-7">
            It began as an AI-native film. Then the audience took it further — watched it, shared it, translated it,
            remixed it, and carried it across platforms, languages and communities.
          </p>
          <p className="body-lg lg:col-span-4 lg:col-start-9 lg:pt-3">
            The film stopped belonging to a single screen. That&apos;s when a story starts becoming a world.
          </p>
        </div>
      </section>

      {creator && <CreatorCredit creator={creator} />}

      <section className="gutter bg-[var(--ink-2)] py-24 sm:py-32">
        <h2 className="display display-md max-w-[16ch]">Partner on World {world.number}.</h2>
        <p className="body-lg mt-6 max-w-[34rem]">
          Distribution, localization, co-production, brands and future licensing conversations start here.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <InquiryButton kind="partner" className="btn btn-solid w-full sm:w-auto">
            Partner with Mythra
          </InquiryButton>
          <InquiryButton kind="deck" className="btn btn-line w-full sm:w-auto">
            Request partner deck
          </InquiryButton>
        </div>
      </section>
    </>
  );
}
