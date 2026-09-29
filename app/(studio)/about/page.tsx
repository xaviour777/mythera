import type { Metadata } from 'next';
import Link from 'next/link';
import { content, creator001, world001, worldHref } from '../../../lib/content';
import { PageIntro } from '../../../components/studio/PageIntro';
import { InquiryButton } from '../../../components/studio/Inquiry';

export const metadata: Metadata = {
  title: 'About',
  description: content.company.description,
};

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="About MYTHRA Studios" title="Story is where MYTHRA starts.">
        <p className="body-lg !text-[var(--bone)]">{content.company.description}</p>
      </PageIntro>

      <section className="gutter border-t border-[var(--hair)] py-24 sm:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <p className="eyebrow eyebrow-strong lg:col-span-4">What we do</p>
          <div className="space-y-6 lg:col-span-7">
            <p className="serif-lede">We create original stories and put them in front of real audiences. Then we watch what travels.</p>
            <p className="body-lg">
              Which moments get shared. Which characters people remember. Which worlds they return to. The strongest signals tell
              us where to build deeper — story first, audience signal second, expansion after that.
            </p>
          </div>
        </div>
      </section>

      <section className="gutter border-t border-[var(--hair)] py-24 sm:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <p className="eyebrow eyebrow-strong lg:col-span-4">Human-led · AI-native</p>
          <div className="space-y-6 lg:col-span-7">
            <p className="body-lg">
              AI changes how quickly a small creative team can build, produce, localize and release ambitious entertainment. It is
              infrastructure. The worlds, the characters and the decisions are human-led.
            </p>
            <p className="display display-sm">Technology isn&apos;t the product. The story is.</p>
          </div>
        </div>
      </section>

      <section className="gutter border-t border-[var(--hair)] py-24 sm:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <p className="eyebrow eyebrow-strong lg:col-span-4">The first world</p>
          <div className="lg:col-span-7">
            <p className="display display-md">World {world001.number}: {world001.title}</p>
            <p className="body-lg mt-6">Created by {creator001.name}.</p>
            <Link href={worldHref()} className="link-line mt-8">
              Explore World {world001.number} <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="gutter border-t border-[var(--hair)] bg-[var(--ink-2)] py-24 sm:py-32">
        <p className="display display-md max-w-[18ch]">Film can be where a world begins. It doesn&apos;t have to be where it ends.</p>
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
