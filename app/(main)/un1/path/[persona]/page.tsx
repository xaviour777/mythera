import { redirect, notFound } from 'next/navigation';

export default async function PathPersonaRedirectPage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona } = await params;
  const p = persona.toLowerCase();

  if (p === 'you' || p === 'creator' || p === 'individual') {
    redirect('/un1/you');
  } else if (p === 'filmmaker' || p === 'learn') {
    redirect('/un1/filmmaker');
  } else if (p === 'studios' || p === 'brand' || p === 'media' || p === 'partner') {
    redirect('/un1/studios');
  }

  redirect('/un1');
}
