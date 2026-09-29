import type { Metadata } from 'next';
import { content } from '../../../lib/content';
import { LegalPage } from '../../../components/studio/LegalPage';

export const metadata: Metadata = { title: 'Privacy' };

export default function PrivacyPage() {
  const contact = content.contact.partners.email;
  return (
    <LegalPage
      title="Privacy."
      sections={[
        {
          heading: 'What we collect',
          body: (
            <p>
              Only what you choose to send us: when you use a partner, partner-deck or Enter MYTHRA form, we receive the details you
              enter (such as name, company, role, work email, country and message).
            </p>
          ),
        },
        {
          heading: 'How we use it',
          body: <p>To reply to your inquiry, send materials you requested, and — for Enter MYTHRA sign-ups — to tell you when it opens.</p>,
        },
        {
          heading: 'Sharing',
          body: <p>We do not sell your information. Service providers that deliver email or store inquiries process it on our behalf.</p>,
        },
        {
          heading: 'Your choices',
          body: (
            <p>
              You can ask us to access, correct or delete your information at any time
              {contact ? (
                <>
                  {' '}
                  by writing to <a className="underline underline-offset-4" href={`mailto:${contact}`}>{contact}</a>
                </>
              ) : (
                ' by contacting the studio'
              )}
              .
            </p>
          ),
        },
      ]}
    />
  );
}
