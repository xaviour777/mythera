// Typed access to content/mythra.json — the single source of truth for the
// studio site. Components never read raw values; they receive resolved
// "slots" so unverified or missing data can't leak into production.
//
// To move to a headless CMS later, keep these function signatures and swap
// the JSON import for a fetch.
import data from '../../content/mythra.json';

export type Slot = { kind: 'value'; text: string } | { kind: 'placeholder'; token: string };

interface Metric {
  value: number | string | null;
  display?: string | null;
  verified: boolean;
  placeholder: string;
  label: string;
  source: string | null;
  asOf: string | null;
}

export interface Creator {
  id: string;
  name: string;
  credit: string;
  role: string;
  portrait: string | null;
  bio: string | null;
}

export interface World {
  id: string;
  slug: string;
  number: string;
  title: string;
  status: string;
  kicker: string;
  logline: string[];
  creatorId: string;
  film: {
    watchUrl: string | null;
    embedUrl: string | null;
    placeholder: string;
    platformLabel: string | null;
    runtime: string | null;
  };
  media: {
    keyArt: string;
    keyArtAlt: string;
    keyArtIsOfficialStill: boolean;
    keyArtNote: string;
    ogImage: string;
    blurDataURL: string;
    focalPoint: string;
  };
}

export interface PartnerCategory {
  id: string;
  title: string;
  detail: string;
}

export interface PressItem {
  outlet: string;
  headline: string;
  url: string;
  date: string;
}

export interface SiteContent {
  company: {
    name: string;
    shortName: string;
    domain: string;
    siteUrl: string;
    descriptor: string;
    description: string;
    tagline: string;
    legalEntity: {
      name: string | null;
      companyNumber: string | null;
      jurisdiction: string | null;
      verified: boolean;
      placeholder: string;
    };
    copyrightYear: number;
  };
  contact: Record<'partners' | 'press', { email: string | null; placeholder: string }>;
  social: { platform: string; label: string; url: string | null }[];
  metrics: {
    totalViews: Metric & { platforms: string[] };
    languages: Metric;
    countries: Metric;
  };
  festivals: {
    id: string;
    status: string;
    name: string | null;
    placeholder: string;
    country: string;
    year: number;
    worldId: string;
    verified: boolean;
    showOnHero: boolean;
  }[];
  press: PressItem[];
  creators: Creator[];
  worlds: World[];
  rights: {
    label: string;
    headline: string[];
    body: string;
    creatorLine: { text: string; show: boolean };
    chainOfTitle: { statement: string | null; approved: boolean; approvedBy: string | null; approvedAt: string | null };
  };
  partnerCategories: PartnerCategory[];
  partnerDeck: { status: 'in-preparation' | 'ready' };
  enter: { mode: 'teaser' | 'immersive'; path: string; hint: string };
  legal: { lastUpdated: string; reviewPending: boolean };
}

export const content = data as unknown as SiteContent;

/**
 * Placeholder tokens are visible on local dev and Vercel preview deployments
 * so layouts can be reviewed; production silently omits anything unset.
 */
export function showPlaceholders(): boolean {
  if (process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === '1') return true;
  if (process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === '0') return false;
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV !== 'production';
  return process.env.NODE_ENV !== 'production';
}

function slot(value: string | null | undefined, placeholder: string, verified = true): Slot | null {
  if (value && verified) return { kind: 'value', text: value };
  return showPlaceholders() ? { kind: 'placeholder', token: `[[${placeholder}]]` } : null;
}

export function getWorld(slug: string): World | undefined {
  return content.worlds.find((w) => w.slug === slug);
}

export function getCreator(id: string): Creator | undefined {
  return content.creators.find((c) => c.id === id);
}

export const world001 = content.worlds[0];
export const creator001 = getCreator(world001.creatorId)!;

export function worldHref(world: World = world001) {
  return `/worlds/${world.slug}`;
}

/** Primary "watch" destination: the official film if set, else the world page's watch section. */
export function watchHref(world: World = world001) {
  return world.film.watchUrl ?? `${worldHref(world)}#watch`;
}

export function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export function formatViews(): Slot | null {
  const m = content.metrics.totalViews;
  const text = m.display ?? (m.value != null ? Number(m.value).toLocaleString('en-US') : null);
  return slot(text, m.placeholder, m.verified);
}

export function proof() {
  const { languages, countries, totalViews } = content.metrics;
  const lang = slot(languages.value != null ? String(languages.value) : null, languages.placeholder, languages.verified);
  const ctry = slot(countries.value != null ? String(countries.value) : null, countries.placeholder, countries.verified);
  return {
    views: formatViews(),
    viewsLabel: totalViews.label,
    platforms: totalViews.platforms,
    languages: lang,
    countries: ctry,
    festival: heroFestival(),
  };
}

export function heroFestival(): Slot | null {
  const f = content.festivals.find((x) => x.showOnHero);
  if (!f) return null;
  if (f.name && f.verified) {
    return { kind: 'value', text: [f.status, f.name, f.country, f.year].filter(Boolean).join(' · ') };
  }
  if (!showPlaceholders()) return null;
  return { kind: 'placeholder', token: [f.status, `[[${f.placeholder}]]`, f.country, f.year].join(' · ') };
}

export function email(kind: 'partners' | 'press'): Slot | null {
  const c = content.contact[kind];
  return slot(c.email, c.placeholder);
}

export function socialLinks() {
  return content.social.filter((s) => s.url || showPlaceholders());
}

export function legalEntity(): Slot | null {
  const e = content.company.legalEntity;
  const text = e.name ? [e.name, e.companyNumber && `Company no. ${e.companyNumber}`, e.jurisdiction].filter(Boolean).join(' · ') : null;
  return slot(text, e.placeholder, e.verified);
}

export function chainOfTitle(): string | null {
  const c = content.rights.chainOfTitle;
  return c.approved && c.statement ? c.statement : null;
}
