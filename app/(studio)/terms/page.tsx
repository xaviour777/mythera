import type { Metadata } from 'next';
import { LegalPage } from '../../../components/studio/LegalPage';

export const metadata: Metadata = { title: 'Terms' };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms."
      sections={[
        {
          heading: 'Using this site',
          body: <p>This site introduces MYTHRA Studios and its worlds. Please use it lawfully and don&apos;t interfere with its operation.</p>,
        },
        {
          heading: 'Content',
          body: (
            <p>
              Films, artwork, characters, text and other material on this site are protected by copyright and other rights of their
              respective owners. Please don&apos;t reproduce or redistribute them without permission.
            </p>
          ),
        },
        {
          heading: 'No offer',
          body: (
            <p>
              Nothing on this site is an offer of investment, a licence, or a commitment to any partnership. Any agreement with MYTHRA
              Studios is made only in a separate written contract.
            </p>
          ),
        },
      ]}
    />
  );
}
