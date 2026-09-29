import type { Metadata } from 'next';
import { LegalPage } from '../../../components/studio/LegalPage';

export const metadata: Metadata = { title: 'Cookies' };

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookies."
      sections={[
        {
          heading: 'What this site stores',
          body: (
            <p>
              This site does not use advertising or cross-site tracking cookies. It keeps one preference in your browser&apos;s local
              storage — your Motion setting (Full or Reduced) — so the site remembers it on your next visit.
            </p>
          ),
        },
        {
          heading: 'Embedded films',
          body: (
            <p>
              Where a film is embedded, it plays through the platform&apos;s privacy-enhanced player. That platform may set its own
              cookies once you press play, under its own policy.
            </p>
          ),
        },
      ]}
    />
  );
}
