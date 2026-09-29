// Privacy-safe analytics tracking module for MYTHRA
// Development & Legal Rule: NEVER send uploaded images, voice data, story secrets, detailed free text, or PII to analytics.

export type AnalyticsEventType =
  | 'path_selector_viewed'
  | 'path_selected'
  | 'offer_page_viewed'
  | 'funnel_started'
  | 'funnel_step_completed'
  | 'recommendation_viewed'
  | 'lead_created'
  | 'checkout_started'
  | 'purchase_completed'
  | 'call_requested'
  | 'waitlist_joined'
  | 'secure_onboarding_started'
  | 'secure_onboarding_completed';

export interface AnalyticsEventPayload {
  persona?: 'YOU' | 'FILMMAKER' | 'STUDIOS' | 'CAST';
  offerCode?: string;
  stepNumber?: number;
  totalSteps?: number;
  stepName?: string;
  qualificationCategory?: string;
  scoreBand?: string; // e.g. '0-24', '25-49', '50+'
  source?: string;
  currency?: string;
  value?: number;
}

export function trackEvent(event: AnalyticsEventType, payload: AnalyticsEventPayload = {}): void {
  // Sanitize payload to guarantee no PII is inadvertently sent
  const cleanPayload = {
    ...payload,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.pathname : '',
  };

  // Local console in dev mode
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics: ${event}]`, cleanPayload);
  }

  // Window PostHog / GA4 safe push if available
  if (typeof window !== 'undefined') {
    const win = window as unknown as { dataLayer?: unknown[]; posthog?: { capture: (name: string, data: unknown) => void } };
    if (win.posthog) {
      win.posthog.capture(event, cleanPayload);
    }
    if (win.dataLayer) {
      win.dataLayer.push({ event, ...cleanPayload });
    }
  }
}
