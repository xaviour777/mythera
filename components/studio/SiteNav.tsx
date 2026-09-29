'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useInquiry } from './Inquiry';

export interface NavLink {
  label: string;
  href: string;
}

export function SiteNav({ links, watchHref }: { links: NavLink[]; watchHref: string }) {
  const { open } = useInquiry();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - last;
        setScrolled(y > 40);
        // Step aside while reading downward past the hero; return on any upward scroll.
        if (y < window.innerHeight * 0.9 || delta < -6) setHidden(false);
        else if (delta > 6) setHidden(true);
        if (Math.abs(delta) > 6) last = y;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-[var(--bone)] focus:px-4 focus:py-3 focus:text-[var(--ink)]"
      >
        Skip to content
      </a>
      <header
        className={`gutter fixed inset-x-0 top-0 z-50 flex h-[64px] items-center justify-between transition-[background-color,transform,border-color] duration-700 ease-[cubic-bezier(0.22,0.61,0.16,1)] sm:h-[72px] ${
          scrolled && !menuOpen ? 'border-b border-[var(--hair)] bg-[rgba(5,5,5,0.86)] backdrop-blur-md' : 'border-b border-transparent'
        } ${hidden && !menuOpen ? '-translate-y-full' : ''}`}
      >
        <Link href="/" className="flex min-h-[44px] items-center gap-3" aria-label="MYTHRA Studios — home">
          <span className="display text-[1.6rem] tracking-[0.14em] leading-none">Mythra</span>
          <span className="eyebrow hidden !tracking-[0.36em] md:inline">Studios</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="eyebrow !text-[var(--bone-2)] transition-colors hover:!text-[var(--bone)]">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-line hidden !min-h-[42px] !px-5 md:inline-flex" onClick={() => open('partner')}>
            Partner with Mythra
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span
                className={`absolute left-0 right-0 top-0 h-px bg-[var(--bone)] transition-transform duration-500 ${menuOpen ? 'translate-y-[6px] rotate-45' : ''}`}
              />
              <span
                className={`absolute bottom-0 left-0 right-0 h-px bg-[var(--bone)] transition-transform duration-500 ${menuOpen ? '-translate-y-[5px] -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`gutter fixed inset-0 z-40 flex flex-col justify-between bg-[var(--ink)] pb-10 pt-28 transition-opacity duration-500 lg:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="display border-b border-[var(--hair)] py-4 text-[2.4rem] leading-none"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3">
          <a href={watchHref} className="btn btn-solid w-full" onClick={() => setMenuOpen(false)}>
            <span className="play" aria-hidden="true" /> Watch The Mother&apos;s Monster
          </a>
          <button
            type="button"
            className="btn btn-line w-full"
            onClick={() => {
              setMenuOpen(false);
              open('partner');
            }}
          >
            Partner with Mythra
          </button>
        </div>
      </div>
    </>
  );
}
