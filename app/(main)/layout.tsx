import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import GlobalNav from '@/components/GlobalNav';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';
import LanguageProvider from '@/components/LanguageProvider';

export const metadata: Metadata = {
  title: 'MYTHRA — AI-Native Film & Drama Studio',
  description:
    'Stories anyone can enter. Studios anyone can build. Films brands can own. Original AI-native cinema, personalized films, and filmmaker education.',
  metadataBase: new URL('https://mythralab.com'),
  openGraph: {
    title: 'MYTHRA — AI-Native Film & Drama Studio',
    description: 'Original films, personalized cinema and the production system behind a one-person studio.',
    url: 'https://mythralab.com',
    siteName: 'MYTHRA Studio',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col justify-between bg-background text-foreground antialiased">
        <ThemeProvider>
          <LanguageProvider>
            {/* Subtle Film Grain Texture Overlay */}
            <div className="film-grain" />

            {/* Global Navigation Bar */}
            <GlobalNav />

            {/* Page Content */}
            <main className="flex-1">
              {/* Pages read useSearchParams(); Next.js needs a Suspense boundary to prerender them */}
              <Suspense>{children}</Suspense>
            </main>

            {/* Cinematic Master Footer */}
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
