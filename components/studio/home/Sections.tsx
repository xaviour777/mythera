import Image from 'next/image';
import Link from 'next/link';
import {
  chainOfTitle,
  content,
  isExternal,
  watchHref,
  type PartnerCategory,
} from '../../../lib/content';
import { InquiryButton } from '../Inquiry';

/* ── Method: what happens after the four beats ─────────────────────────── */

export function MethodCopy() {
  return (
    <section aria-label="How MYTHRA works" className="gutter bg-[var(--ink)] pb-28 pt-8 sm:pb-40">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <p className="serif-lede lg:col-span-7" data-reveal>
          We create original stories and put them in front of real audiences. Then we watch what travels.
        </p>
        <div className="space-y-6 lg:col-span-5 lg:pt-3" data-reveal>
          <ul className="serif space-y-1 text-[clamp(1.35rem,1.9vw,1.7rem)] leading-[1.25] text-[var(--bone)]">
            <li>Which moments get shared.</li>
            <li>Which characters people remember.</li>
            <li>Which worlds they return to.</li>
          </ul>
          <p className="body-lg">The strongest signals tell us where to build deeper.</p>
          <p className="eyebrow eyebrow-strong pt-2 !leading-[2]">
            Story first. <span className="text-[var(--bone-4)]">/</span> Audience signal second.{' '}
            <span className="text-[var(--bone-4)]">/</span> Expansion after that.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── AI positioning: infrastructure, not the product ───────────────────── */

export function HumanLed() {
  return (
    <section aria-labelledby="human-led-title" className="gutter border-t border-[var(--hair)] bg-[var(--ink)] py-28 sm:py-40">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow eyebrow-strong" data-reveal>
            Human-led · AI-native
          </p>
        </div>
        <div className="lg:col-span-8">
          <p className="body-lg max-w-[36rem]" data-reveal>
            AI changes how quickly a small creative team can build, produce, localize and release ambitious entertainment.
          </p>
          <h2 id="human-led-title" className="display display-md mt-12" data-reveal>
            <span className="block text-[var(--bone-3)]">Technology isn&apos;t the product.</span>
            <span className="block">The story is.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}

/* ── Rights / ownership trust signal (legally conservative) ────────────── */

export function RightsBlock() {
  const { rights } = content;
  const statement = chainOfTitle();
  return (
    <section aria-labelledby="rights-title" className="gutter bg-[var(--ink)] pb-28 sm:pb-40">
      <div className="grid grid-cols-1 gap-10 border border-[var(--hair)] p-7 sm:p-12 lg:grid-cols-12 lg:p-16" data-reveal>
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-[var(--bone-3)]" aria-hidden="true" />
            {rights.label}
          </p>
          <h2 id="rights-title" className="display display-md">
            {rights.headline.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h2>
        </div>
        <div className="space-y-5 lg:col-span-6 lg:col-start-7 lg:pt-10">
          <p className="body-lg">{rights.body}</p>
          {rights.creatorLine.show && <p className="serif text-[1.35rem] italic text-[var(--bone)]">{rights.creatorLine.text}</p>}
          {/* Approved chain-of-title statement — rendered only after legal sign-off in content/mythra.json. */}
          {statement && <p className="body-sm border-t border-[var(--hair)] pt-5">{statement}</p>}
        </div>
      </div>
    </section>
  );
}

/* ── The studio ─────────────────────────────────────────────────────────── */

const EXPANSION = [
  'Distribution',
  'Localization',
  'New stories',
  'Publishing',
  'Interactive experiences',
  'Consumer products',
  'Collaborations',
  'Licensing',
];

export function StudioSection() {
  return (
    <section id="studio" aria-labelledby="studio-title" className="gutter bg-[var(--ink)] py-28 sm:py-44">
      <h2 id="studio-title" className="display display-lg" data-reveal>
        <span className="block text-[var(--bone-3)]">We&apos;re not building</span>
        <span className="block text-[var(--bone-3)]">a content factory.</span>
        <span className="mt-4 block">We&apos;re building</span>
        <span className="block">an IP studio.</span>
      </h2>

      <div className="mt-24 grid grid-cols-1 gap-12 sm:mt-36 lg:grid-cols-12">
        <div className="lg:col-span-4" data-reveal>
          <p className="serif-lede">Film can be where a world begins.</p>
          <p className="body-lg mt-4">It doesn&apos;t have to be where it ends.</p>
          <p className="eyebrow mt-10">The right MYTHRA worlds can grow through</p>
        </div>
        <ul className="lg:col-span-7 lg:col-start-6" data-reveal>
          {EXPANSION.map((item, i) => (
            <li
              key={item}
              className="flex items-baseline justify-between gap-6 border-t border-[var(--hair)] py-3.5 last:border-b sm:py-4"
            >
              <span className="serif text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.1]">{item}.</span>
              <span className="eyebrow shrink-0" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-28 sm:mt-44" data-reveal>
        <p className="display display-md">
          <span className="block">Story is where</span>
          <span className="block">MYTHRA starts.</span>
          <span className="mt-3 block text-[var(--bone-3)]">IP is what</span>
          <span className="block text-[var(--bone-3)]">we&apos;re building.</span>
        </p>
        <Link href="/about" className="link-line mt-12">
          About MYTHRA Studios <span className="arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

/* ── Partners: quieter, institutional ───────────────────────────────────── */

export function PartnersSection({ categories }: { categories: PartnerCategory[] }) {
  return (
    <section id="partners" aria-labelledby="partners-title" className="gutter border-t border-[var(--hair)] bg-[var(--ink-2)] py-28 sm:py-40">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <p className="eyebrow eyebrow-strong lg:col-span-4">Partners</p>
        <h2 id="partners-title" className="display display-md lg:col-span-8">
          <span className="block">There are many ways</span>
          <span className="block">into a MYTHRA world.</span>
        </h2>
      </div>

      <ul className="mt-16 grid grid-cols-1 border-t border-[var(--hair)] sm:mt-24 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <li key={c.id} className="border-b border-[var(--hair)] md:[&:nth-child(odd)]:border-r lg:border-r lg:[&:nth-child(3n)]:border-r-0">
            <InquiryButton
              kind="partner"
              categoryId={c.id}
              className="group flex h-full min-h-[168px] w-full flex-col justify-between gap-8 px-0 py-7 text-left transition-colors duration-700 hover:bg-[rgba(236,230,218,0.025)] md:px-8 md:py-10"
            >
              <span className="flex items-start justify-between gap-6">
                <span>
                  <span className="eyebrow mb-4 block">{String(i + 1).padStart(2, '0')}</span>
                  <span className="display block text-[clamp(1.55rem,2.1vw,2rem)] leading-[1]">{c.title}</span>
                </span>
                <span
                  className="mt-7 text-[var(--bone-3)] transition-transform duration-700 group-hover:translate-x-1 group-hover:text-[var(--bone)]"
                  aria-hidden="true"
                >
                  →
                </span>
              </span>
              <span className="body-sm block max-w-[26rem]">{c.detail}</span>
            </InquiryButton>
          </li>
        ))}
      </ul>

      <div className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <InquiryButton kind="partner" className="btn btn-solid w-full sm:w-auto">
          Partner with Mythra
        </InquiryButton>
        <InquiryButton kind="deck" className="btn btn-line w-full sm:w-auto">
          Request partner deck
        </InquiryButton>
      </div>
    </section>
  );
}

/* ── Creators / Audience: two cinematic doors ───────────────────────────── */

export function Doors({ keyArt, blurDataURL }: { keyArt: string; blurDataURL: string }) {
  return (
    <section id="creators" aria-label="Creators and audience" className="grid grid-cols-1 bg-[var(--ink)] lg:grid-cols-2">
      <Link href="/join" className="door gutter min-h-[78svh] border-t border-[var(--hair)] pb-12 pt-24 sm:pb-16 lg:min-h-[92svh] lg:border-r">
        <div className="door-media" aria-hidden="true">
          <Image
            src={keyArt}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            placeholder="blur"
            blurDataURL={blurDataURL}
            className="object-cover object-[30%_60%] opacity-40 grayscale-[35%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,#050505_8%,rgba(5,5,5,0.7)_50%,rgba(5,5,5,0.5)_100%)]" />
        </div>
        <div
          className="door-light bg-[radial-gradient(60%_50%_at_30%_40%,rgba(201,163,106,0.10),transparent_70%)]"
          aria-hidden="true"
        />
        <p className="eyebrow eyebrow-strong mb-8">Door 01 · For creators</p>
        <h2 className="display display-md max-w-[14ch]">The next great studio may look nothing like the last one.</h2>
        <p className="body-lg mt-7 max-w-[26rem]">Bring your story, your audience or your skills.</p>
        <span className="link-line mt-9">
          Join the creator network <span className="arrow" aria-hidden="true">→</span>
        </span>
      </Link>

      <Link
        href={content.enter.path}
        className="door gutter min-h-[78svh] border-t border-[var(--hair)] pb-12 pt-24 sm:pb-16 lg:min-h-[92svh]"
      >
        <div className="door-media bg-[radial-gradient(70%_60%_at_50%_36%,#0f0e0c_0%,#050505_70%)]" aria-hidden="true">
          <div className="door-egg" />
        </div>
        <div className="door-light bg-[radial-gradient(40%_35%_at_50%_36%,rgba(201,163,106,0.08),transparent_70%)]" aria-hidden="true" />
        <p className="eyebrow eyebrow-strong mb-8">Door 02 · For the audience</p>
        <h2 className="display display-md max-w-[15ch]">You don&apos;t have to be a company to enter MYTHRA.</h2>
        <p className="body-lg mt-7 max-w-[26rem]">
          Watch the stories. Follow the worlds.
          <br />
          Find what others miss. Unlock what comes next.
        </p>
        <span className="link-line mt-9">
          Enter Mythra <span className="arrow" aria-hidden="true">→</span>
        </span>
        <span className="eyebrow mt-6 !text-[10px] !tracking-[0.5em] text-[var(--bone-4)]">{content.enter.hint}</span>
      </Link>
    </section>
  );
}

/* ── Final: near-total silence ─────────────────────────────────────────── */

export function Finale() {
  const watch = watchHref();
  return (
    <section aria-labelledby="finale-title" className="gutter bg-black pb-32 pt-40 sm:pb-48 sm:pt-64">
      <h2 id="finale-title" className="display display-lg">
        <span className="block" data-reveal>Stories become worlds.</span>
        <span className="block" data-reveal>Worlds become IP.</span>
        <span className="mt-16 block text-[var(--bone-3)] sm:mt-24" data-reveal>
          And sometimes,
        </span>
        <span className="block text-[var(--bone-3)]" data-reveal>those worlds</span>
        <span className="block" data-reveal>become real.</span>
      </h2>
      <div className="mt-28 flex flex-col gap-10 sm:mt-40 lg:flex-row lg:items-end lg:justify-between" data-reveal>
        <p className="serif-lede">{content.company.tagline}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={watch}
            className="btn btn-solid w-full sm:w-auto"
            {...(isExternal(watch) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <span className="play" aria-hidden="true" /> Watch World 001
          </a>
          <InquiryButton kind="partner" className="btn btn-line w-full sm:w-auto">
            Partner with Mythra
          </InquiryButton>
        </div>
      </div>
    </section>
  );
}
