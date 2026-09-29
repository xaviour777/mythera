import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { deliverInquiry } from '../../../lib/studio/inquiries';

const text = (max = 200) => z.string().trim().max(max).optional();

const schema = z
  .object({
    type: z.enum(['partner', 'deck', 'enter']),
    email: z.string().trim().email('Please enter a valid email address.').max(200),
    name: text(),
    company: text(),
    role: text(),
    country: text(),
    interest: text(),
    message: text(3000),
    page: text(),
    website: z.string().optional(), // honeypot
  })
  .superRefine((v, ctx) => {
    if (v.type === 'enter') return;
    for (const key of ['name', 'company', 'role', 'country', 'interest'] as const) {
      if (!v[key]) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: 'Please complete every field.' });
    }
  });

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request.' }, { status: 400 });
  }

  const { website, ...data } = parsed.data;
  // Bots fill the hidden field; accept quietly and drop.
  if (website) return NextResponse.json({ ok: true });

  const result = await deliverInquiry({ ...data, receivedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true, deckSent: result.deckSent });
}
