import './studio.css';
import { content, watchHref, worldHref } from '../../lib/content';
import { MotionProvider } from '../../components/studio/MotionProvider';
import { InquiryProvider } from '../../components/studio/Inquiry';
import { RevealObserver } from '../../components/studio/Reveal';
import { SiteNav } from '../../components/studio/SiteNav';
import { SiteFooter } from '../../components/studio/SiteFooter';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { label: 'World 001', href: worldHref() },
    { label: 'Studio', href: '/#studio' },
    { label: 'Partners', href: '/#partners' },
    { label: 'Creators', href: '/#creators' },
  ];

  return (
    // Providers sit inside .studio-root so the inquiry <dialog> inherits the studio tokens.
    <div className="studio-root">
      <MotionProvider>
        <InquiryProvider categories={content.partnerCategories} deckStatus={content.partnerDeck.status}>
          <div className="grain" aria-hidden="true" />
          <SiteNav links={links} watchHref={watchHref()} />
          <main id="main">{children}</main>
          <SiteFooter />
          <RevealObserver />
        </InquiryProvider>
      </MotionProvider>
    </div>
  );
}
