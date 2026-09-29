'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from './LanguageProvider';

export default function GlobalNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: t('nav.stories'), href: '/stories' },
    { name: t('nav.method'), href: '/method' },
    { name: t('nav.forYou'), href: '/you' },
    { name: t('nav.filmmaker'), href: '/filmmaker' },
    { name: t('nav.studios'), href: '/studios' },
    { name: t('nav.pricing'), href: '/pricing' },
  ];

  const handleScrollToPaths = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/un1') {
        e.preventDefault();
        const el = document.getElementById('paths');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.location.href = '/un1#paths';
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--nav-bg-scrolled)] backdrop-blur-md border-b border-[var(--border-subtle)] py-4 shadow-2xl'
          : 'bg-[var(--nav-bg)] backdrop-blur-sm py-6 border-b border-[var(--border-subtle)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="group flex items-start gap-1 text-foreground no-underline">
          <span className="font-sans text-2xl sm:text-3xl font-black tracking-[-0.05em] text-foreground group-hover:text-primary transition-colors">
            MYTHRA
          </span>
          <span className="text-[10px] font-bold text-primary mt-0.5">
            ®
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 no-underline ${
                  isActive
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons: Theme Toggle, Language, Genesis, CTA */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <a
            href="/genesis"
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 transition-colors font-semibold no-underline"
          >
            {t('nav.genesisCase')}
          </a>
          <a
            href="/un1#paths"
            onClick={handleScrollToPaths}
            className="btn-pill-primary text-xs !py-2.5 !px-5"
          >
            <span>{t('nav.chooseYourPath')}</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-foreground hover:text-primary"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 py-6 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-lg text-foreground py-2 border-b border-[var(--border-subtle)] hover:text-primary font-bold no-underline"
              >
                {link.name}
              </a>
            ))}
            <a
              href="/genesis"
              className="text-sm text-muted-foreground py-2 hover:text-foreground no-underline font-medium"
            >
              {t('nav.genesisCase')}
            </a>
            <a
              href="/admin/funnel-test"
              className="text-xs text-primary py-1 flex items-center gap-1.5 no-underline font-mono"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> {t('nav.adminSimulator')}
            </a>
          </div>

          {/* Mobile: Theme & Language Controls */}
          <div className="flex items-center gap-3 pt-2 border-t border-[var(--border-subtle)]">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          <a
            href="/un1#paths"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleScrollToPaths(e);
            }}
            className="btn-pill-primary w-full text-center text-xs justify-center mt-4"
          >
            {t('nav.chooseYourPath')} &rarr;
          </a>
        </div>
      )}
    </header>
  );
}
