import { Suspense } from 'react';
import GlobalNav from './GlobalNav';
import Footer from './Footer';
import ThemeProvider from './ThemeProvider';
import LanguageProvider from './LanguageProvider';

// Chrome for the original MYTHRA site (/un1, /join, /admin). The new
// mythrafilm.com studio site at / uses its own shell in app/(studio).
export default function LegacyChrome({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen flex flex-col justify-between bg-background text-foreground">
          <div className="film-grain" />
          <GlobalNav />
          <main className="flex-1">
            {/* Pages read useSearchParams(); Next.js needs a Suspense boundary to prerender them */}
            <Suspense>{children}</Suspense>
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
