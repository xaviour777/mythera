// Delivery for studio-site inquiries (partner form, partner-deck requests and
// /enter sign-ups). Everything is configured by environment variables so the
// public site never carries a CRM key or the deck URL.
//
//   INQUIRY_WEBHOOK_URL   POST every inquiry as JSON (Zapier, Make, GHL, Slack…)
//   RESEND_API_KEY        enables email via Resend
//   INQUIRY_NOTIFY_EMAIL  internal address that receives each inquiry
//   EMAIL_FROM            sender, e.g. "MYTHRA Studios <partners@mythrafilm.com>"
//   PARTNER_DECK_URL      server-only deck link, emailed when partnerDeck.status = "ready"
import { content } from '../content';

export type InquiryType = 'partner' | 'deck' | 'enter';

export interface Inquiry {
  type: InquiryType;
  email: string;
  name?: string;
  company?: string;
  role?: string;
  country?: string;
  interest?: string;
  message?: string;
  page?: string;
  receivedAt: string;
}

export interface DeliveryResult {
  delivered: boolean;
  deckSent: boolean;
  channels: string[];
}

function interestLabel(id?: string) {
  if (!id) return undefined;
  return content.partnerCategories.find((c) => c.id === id)?.title ?? id;
}

async function sendEmail(to: string, subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || `${content.company.name} <no-reply@${content.company.domain}>`,
      to: [to],
      subject,
      text,
    }),
  });
  if (!res.ok) console.warn('[inquiry] email failed', res.status, await res.text().catch(() => ''));
  return res.ok;
}

export async function deliverInquiry(inq: Inquiry): Promise<DeliveryResult> {
  const channels: string[] = [];
  const summary = [
    `Type: ${inq.type}`,
    inq.name && `Name: ${inq.name}`,
    inq.company && `Company: ${inq.company}`,
    inq.role && `Role: ${inq.role}`,
    `Email: ${inq.email}`,
    inq.country && `Country: ${inq.country}`,
    inq.interest && `Interest: ${interestLabel(inq.interest)}`,
    inq.message && `\n${inq.message}`,
    `\nPage: ${inq.page ?? '/'} · ${inq.receivedAt}`,
  ]
    .filter(Boolean)
    .join('\n');

  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: content.company.domain, ...inq, interestLabel: interestLabel(inq.interest) }),
      });
      if (res.ok) channels.push('webhook');
      else console.warn('[inquiry] webhook failed', res.status);
    } catch (err) {
      console.warn('[inquiry] webhook error', err);
    }
  }

  const notify = process.env.INQUIRY_NOTIFY_EMAIL;
  if (notify) {
    const subject =
      inq.type === 'deck'
        ? `Partner deck request — ${inq.company ?? inq.email}`
        : inq.type === 'partner'
          ? `Partner inquiry — ${interestLabel(inq.interest) ?? 'General'} — ${inq.company ?? inq.email}`
          : `ENTER MYTHRA sign-up — ${inq.email}`;
    if (await sendEmail(notify, subject, summary)) channels.push('notify-email');
  }

  // Automatic deck delivery — only once the deck is marked ready and its URL is set server-side.
  let deckSent = false;
  const deckUrl = process.env.PARTNER_DECK_URL;
  if (inq.type === 'deck' && content.partnerDeck.status === 'ready' && deckUrl) {
    deckSent = await sendEmail(
      inq.email,
      'The MYTHRA Studios partner deck',
      `Hello ${inq.name ?? ''},\n\nThank you for your interest in MYTHRA Studios.\n\nThe partner deck: ${deckUrl}\n\nPlease don't forward this link. Reply to this email to start a conversation.\n\n— ${content.company.name}\n${content.company.siteUrl}`,
    );
  }

  if (channels.length === 0) {
    // No delivery configured: keep a server-log record so nothing is silently dropped in development.
    console.info('[inquiry] received (no delivery channel configured)\n' + summary);
  }

  return { delivered: channels.length > 0, deckSent, channels };
}
