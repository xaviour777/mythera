import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { content, world001 } from '../lib/content';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const text = Inter({
  subsets: ['latin'],
  variable: '--font-text',
  display: 'swap',
});

const { company } = content;

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: {
    default: `${company.name} — We make stories people carry forward`,
    template: `%s — ${company.name}`,
  },
  description: company.description,
  openGraph: {
    title: `${company.name} — We make stories people carry forward`,
    description: company.description,
    url: company.siteUrl,
    siteName: company.name,
    type: 'website',
    images: [{ url: world001.media.ogImage, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${text.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
