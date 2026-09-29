import Link from 'next/link';
import { content, email, legalEntity, socialLinks, worldHref } from '../../lib/content';
import { MotionToggle } from './MotionProvider';
import { SlotText } from './SlotText';

export function SiteFooter() {
  const { company } = content;
  const partners = email('partners');
  const press = email('press');
  const entity = legalEntity();
  const socials = socialLinks();

  const nav = [
    { label: 'Worlds', href: worldHref() },
    { label: 'Studio', href: '/about' },
    { label: 'Partners', href: '/#partners' },
    { label: 'Creators', href: '/#creators' },
    { label: 'Press', href: '/press' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer id="contact" className="gutter border-t border-[var(--hair)] bg-[var(--ink)] pb-10 pt-20 sm:pt-28">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="display text-[2rem] tracking-[0.12em] leading-none">{company.name}</p>
          <p className="body-sm mt-4">{company.descriptor}</p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3">
          <ul className="grid grid-cols-2 gap-x-6 lg:grid-cols-1">
            {nav.map((n) => (
              <li key={n.label}>
                <Link href={n.href} className="flex min-h-[40px] items-center text-[15px] text-[var(--bone-2)] transition-colors hover:text-[var(--bone)]">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-7 lg:col-span-4">
          {partners && (
            <div>
              <p className="eyebrow mb-2">Partnerships</p>
              {partners.kind === 'value' ? (
                <a href={`mailto:${partners.text}`} className="text-[15px] underline-offset-4 hover:underline">
                  {partners.text}
                </a>
              ) : (
                <SlotText slot={partners} />
              )}
            </div>
          )}
          {press && (
            <div>
              <p className="eyebrow mb-2">Press</p>
              {press.kind === 'value' ? (
                <a href={`mailto:${press.text}`} className="text-[15px] underline-offset-4 hover:underline">
                  {press.text}
                </a>
              ) : (
                <SlotText slot={press} />
              )}
            </div>
          )}
          {socials.length > 0 && (
            <ul className="flex flex-wrap gap-x-6 gap-y-1" aria-label="Social">
              {socials.map((s) =>
                s.url ? (
                  <li key={s.platform}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex min-h-[40px] items-center text-[15px] text-[var(--bone-2)] hover:text-[var(--bone)]">
                      {s.label}
                    </a>
                  </li>
                ) : (
                  <li key={s.platform} className="flex min-h-[40px] items-center text-[15px] text-[var(--bone-4)]" title="Add URL in content/mythra.json">
                    {s.label}
                    <span className="placeholder-token ml-1">[[URL]]</span>
                  </li>
                ),
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-20 flex flex-col gap-6 border-t border-[var(--hair)] pt-8 text-[12.5px] text-[var(--bone-3)] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <SlotText slot={entity} />
          <span>© {company.copyrightYear} {company.name}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/privacy" className="flex min-h-[40px] items-center hover:text-[var(--bone)]">Privacy</Link>
          <Link href="/terms" className="flex min-h-[40px] items-center hover:text-[var(--bone)]">Terms</Link>
          <Link href="/cookies" className="flex min-h-[40px] items-center hover:text-[var(--bone)]">Cookies</Link>
          <MotionToggle />
        </div>
      </div>
    </footer>
  );
}
