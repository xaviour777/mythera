// MYTHRA i18n — Core Internationalization Engine
// Supports locale detection from cookies, browser, and IP geolocation

export type Locale = 'en' | 'es' | 'fr' | 'ar' | 'hi' | 'zh';

export interface LocaleConfig {
  code: Locale;
  name: string;        // English name
  nativeName: string;  // Name in native script
  dir: 'ltr' | 'rtl';
  flag: string;        // Emoji flag
}

export const SUPPORTED_LOCALES: LocaleConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr', flag: '🇨🇳' },
];

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE_NAME = 'MYTHRA_LOCALE';
export const LOCALE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

export type TranslationDict = Record<string, string>;

// Get locale config by code
export function getLocaleConfig(code: Locale): LocaleConfig {
  return SUPPORTED_LOCALES.find((l) => l.code === code) || SUPPORTED_LOCALES[0];
}

// Check if a string is a valid supported locale
export function isValidLocale(code: string): code is Locale {
  return SUPPORTED_LOCALES.some((l) => l.code === code);
}

// Read locale from cookie
export function getLocaleFromCookie(): Locale | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE_NAME}=([^;]*)`));
  if (match && isValidLocale(match[1])) {
    return match[1] as Locale;
  }
  return null;
}

// Save locale to cookie
export function setLocaleCookie(locale: Locale): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale};path=/;max-age=${LOCALE_COOKIE_MAX_AGE};SameSite=Lax`;
}

// Detect locale from browser navigator.language
export function getLocaleFromBrowser(): Locale | null {
  if (typeof navigator === 'undefined') return null;
  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || '';
  const langCode = browserLang.split('-')[0].toLowerCase();
  if (isValidLocale(langCode)) {
    return langCode;
  }
  return null;
}

// Map country codes to locales for IP-based detection
const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  US: 'en', GB: 'en', AU: 'en', CA: 'en', NZ: 'en', IE: 'en',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es',
  FR: 'fr', BE: 'fr', CH: 'fr', MC: 'fr',
  SA: 'ar', AE: 'ar', EG: 'ar', IQ: 'ar', JO: 'ar', KW: 'ar', LB: 'ar', OM: 'ar', QA: 'ar', BH: 'ar',
  IN: 'hi',
  CN: 'zh', TW: 'zh', HK: 'zh', SG: 'zh',
};

// Detect locale from IP via free geolocation API
export async function getLocaleFromIP(): Promise<Locale | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const data = (await res.json()) as { country_code?: string };
    const country = data?.country_code?.toUpperCase();
    if (country && COUNTRY_TO_LOCALE[country]) {
      return COUNTRY_TO_LOCALE[country];
    }
    return null;
  } catch {
    return null;
  }
}

// Detect best locale: cookie → browser → IP → default
export async function detectLocale(): Promise<Locale> {
  // 1. Cookie (user's explicit choice)
  const fromCookie = getLocaleFromCookie();
  if (fromCookie) return fromCookie;

  // 2. Browser language
  const fromBrowser = getLocaleFromBrowser();
  if (fromBrowser) return fromBrowser;

  // 3. IP geolocation (async, with timeout)
  const fromIP = await getLocaleFromIP();
  if (fromIP) return fromIP;

  // 4. Fallback
  return DEFAULT_LOCALE;
}
