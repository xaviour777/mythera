import type { Metadata } from 'next';
import './enter.css';
import { EnterExperience } from '../../components/enter/EnterExperience';

export const metadata: Metadata = {
  title: 'Enter MYTHRA',
  description: 'Find the egg.',
  robots: { index: true, follow: true },
};

// content/mythra.json → enter.mode is "teaser" for now. When the immersive
// temple ships, render it here (e.g. a dynamically imported React Three
// Fiber scene) so three.js never loads on the corporate site.
export default function EnterPage() {
  return <EnterExperience />;
}
