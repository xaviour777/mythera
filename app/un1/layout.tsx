import LegacyChrome from '../../components/LegacyChrome';

export default function LegacyLayout({ children }: { children: React.ReactNode }) {
  return <LegacyChrome>{children}</LegacyChrome>;
}
