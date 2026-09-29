// Central configuration file for proof claims and truth controls
// Development and Production rule: Do not show a metric in production until verified: true
// and an admin evidence URL or stored evidence record exists.

export interface ProofMetricItem {
  key: string;
  label: string;
  value: string;
  category: 'official_owned' | 'licensed_partner' | 'observed_ecosystem' | 'production_benchmark';
  verified: boolean;
  evidenceUrl?: string;
  evidenceRef?: string;
  methodologyNote?: string;
  lastAudited?: string;
}

export interface MythraProofConfig {
  runtime: ProofMetricItem;
  productionTime: ProofMetricItem;
  experimentalCost: ProofMetricItem;
  firstEpisodeViews: ProofMetricItem;
  officialYouTubeViews: ProofMetricItem;
  officialFacebookViews: ProofMetricItem;
  translatedYouTubeViews: ProofMetricItem;
  ecosystemTranslatedViews: ProofMetricItem;
}

export const mythraProof: MythraProofConfig = {
  runtime: {
    key: 'runtime',
    label: 'Experimental Short Film Runtime',
    value: '27–28 min',
    category: 'production_benchmark',
    verified: true, // Verified by master cut timestamp
    evidenceUrl: 'https://mythra.com/un1/genesis#runtime-audit',
    evidenceRef: 'AUD-GEN-001',
    methodologyNote: 'Exact master cut length including full title sequence and narrative credits.',
    lastAudited: '2026-08-15',
  },
  productionTime: {
    key: 'productionTime',
    label: 'Core Production Sprint',
    value: '<72 hours',
    category: 'production_benchmark',
    verified: true, // Verified by project log timeline
    evidenceUrl: 'https://mythra.com/un1/genesis#timeline-audit',
    evidenceRef: 'AUD-GEN-002',
    methodologyNote: 'From final screenplay lock to first complete 1080p picture lock using one director.',
    lastAudited: '2026-08-15',
  },
  experimentalCost: {
    key: 'experimentalCost',
    label: 'First Film Tool & Compute Cost',
    value: '<$2,000',
    category: 'production_benchmark',
    verified: true, // Verified by receipts ledger
    evidenceUrl: 'https://mythra.com/un1/genesis#cost-ledger',
    evidenceRef: 'AUD-GEN-003',
    methodologyNote: 'Direct software subscription, image/video API compute, and audio licensing costs. Excludes creator labor.',
    lastAudited: '2026-08-15',
  },
  firstEpisodeViews: {
    key: 'firstEpisodeViews',
    label: 'Episode 01 Premiere (First 7 Days)',
    value: '50M+',
    category: 'official_owned',
    verified: true,
    evidenceUrl: 'https://youtube.com/@mythrastudios',
    evidenceRef: 'AUD-EP1-7D-50M',
    methodologyNote: '50M+ verified views on Episode 1 within 7 days of official release.',
    lastAudited: '2026-09-22',
  },
  officialYouTubeViews: {
    key: 'officialYouTubeViews',
    label: 'Facebook Distribution Reach',
    value: '400M+',
    category: 'official_owned',
    verified: true,
    evidenceUrl: 'https://facebook.com/mythrastudios',
    evidenceRef: 'FB-DIST-400M',
    methodologyNote: '400M+ views reported across international and translated Facebook distribution channels.',
    lastAudited: '2026-09-26',
  },
  officialFacebookViews: {
    key: 'officialFacebookViews',
    label: 'Official Facebook & Instagram',
    value: '4M FB + 5M IG',
    category: 'official_owned',
    verified: true,
    evidenceUrl: 'https://facebook.com/mythrastudios',
    evidenceRef: 'META-ANALYTICS-2026',
    methodologyNote: '4M verified views on Official Facebook Page · 5M audience reach on Official Instagram.',
    lastAudited: '2026-09-26',
  },
  translatedYouTubeViews: {
    key: 'translatedYouTubeViews',
    label: 'Licensed Translated Channels',
    value: '5M',
    category: 'licensed_partner',
    verified: true,
    evidenceUrl: 'https://mythra.com/partners/metrics',
    evidenceRef: 'PARTNER-AGG-009',
    methodologyNote: 'Aggregate views across authorized multi-language channel partners with attribution agreements.',
    lastAudited: '2026-08-20',
  },
  ecosystemTranslatedViews: {
    key: 'ecosystemTranslatedViews',
    label: 'Observed Translated Ecosystem Reach',
    value: '1B+',
    category: 'observed_ecosystem',
    verified: false, // Honest gating: labeled as observed third-party reach
    evidenceRef: 'ECO-OBS-SAMPLE-2026',
    methodologyNote: '1B+ reported views across Instagram, TikTok, and YouTube localization translations.',
    lastAudited: '2026-09-26',
  },
};

/**
 * Filter and return only verified metrics for public display.
 * If requireVerified is true, unverified items are stripped.
 */
export function getPublicProofMetrics(requireVerified = true): ProofMetricItem[] {
  const allMetrics = Object.values(mythraProof);
  if (!requireVerified) return allMetrics;
  return allMetrics.filter((m) => m.verified);
}
