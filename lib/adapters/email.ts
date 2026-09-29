// Email Dispatcher for Lead Alerts and Customer Auto-replies
// Works on Cloudflare Worker runtime (MailChannels / Resend / HTTP fetch)

export interface LeadEmailData {
  customerName: string;
  customerEmail: string;
  phone?: string;
  country?: string;
  persona: string;
  recommendedOffer: string;
  offerPriceDisplay?: string;
  leadScore: number;
  qualification: string;
  answersJson?: string;
  message?: string;
  payoutUrl?: string;
}

export async function dispatchLeadEmails(lead: LeadEmailData): Promise<{
  customerNotified: boolean;
  adminNotified: boolean;
  errors: string[];
}> {
  const errors: string[] = [];
  let customerNotified = false;
  let adminNotified = false;

  const adminEmail = process.env.NOTIFY_EMAIL || process.env.GHL_NOTIFY_EMAIL || 'info@zetomate.com';
  const payoutLink = lead.payoutUrl || process.env.PAYOUT_URL || process.env.STRIPE_PAYOUT_URL || 'https://mythralab.com/un1/pricing';
  const firstName = lead.customerName.trim().split(/\s+/)[0] || 'there';

  // 1. HTML Content for Customer Instant Auto-Reply (24h reply notice)
  const customerSubject = `MYTHRA Studio · Action Required: Please confirm your project inquiry within 24 hours`;
  const customerHtml = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:620px;margin:0 auto;background:#050505;color:#f3f3eb;border-radius:16px;overflow:hidden;border:1px solid #222;">
      <div style="background:#000000;padding:28px 24px;text-align:center;border-bottom:1px solid #1a1a1a;">
        <h1 style="color:#d8ff44;font-size:24px;letter-spacing:2px;margin:0;font-weight:900;">M Y T H R A</h1>
        <p style="color:#a3a89e;font-size:12px;letter-spacing:1px;text-transform:uppercase;margin:6px 0 0 0;">AI-Native Independent Cinema Studio</p>
      </div>
      <div style="padding:32px 28px;">
        <h2 style="font-size:20px;font-weight:800;color:#ffffff;margin-top:0;">Thank you for your inquiry, ${firstName}.</h2>
        <p style="color:#cccccc;font-size:14px;line-height:1.6;">
          We have received your submission for <strong style="color:#d8ff44;">${lead.recommendedOffer}</strong> (${lead.offerPriceDisplay || 'Selected Tier'}).
        </p>

        <div style="background:#111410;border:1px solid #d8ff44;border-radius:12px;padding:20px;margin:24px 0;">
          <h3 style="color:#d8ff44;font-size:13px;letter-spacing:1px;text-transform:uppercase;margin:0 0 8px 0;font-weight:bold;">
            ⚠️ ACTION REQUIRED · PLEASE REPLY WITHIN 24 HOURS
          </h3>
          <p style="color:#e0e0e0;font-size:13px;line-height:1.6;margin:0;">
            To confirm your project brief and reserve your production queue position, <strong>please reply directly to this email within 24 hours</strong> with:
          </p>
          <ul style="color:#b5b5b5;font-size:13px;line-height:1.6;margin:10px 0 0 0;padding-left:20px;">
            <li>Any specific deadlines or target premiere date</li>
            <li>Reference links, photos, or materials you want included</li>
            <li>Preferred communication channel (Email or WhatsApp)</li>
          </ul>
        </div>

        <p style="color:#cccccc;font-size:14px;line-height:1.6;">
          If you are ready to secure your production slot immediately, you can complete your reservation deposit here:
        </p>
        <div style="text-align:center;margin:28px 0;">
          <a href="${payoutLink}" style="display:inline-block;background:#d8ff44;color:#000000;text-decoration:none;padding:14px 32px;border-radius:9999px;font-weight:900;font-size:13px;letter-spacing:1px;text-transform:uppercase;">
            Proceed to Secure Reservation &rarr;
          </a>
        </div>

        <p style="color:#777777;font-size:12px;line-height:1.5;margin-top:32px;border-top:1px solid #1f1f1f;pt:20px;">
          MYTHRA Studio · mythralab.com<br/>
          Confidential production communication. If you did not make this request, please disregard.
        </p>
      </div>
    </div>
  `;

  // 2. HTML Content for Admin Lead Alert
  const adminSubject = `🔥 NEW MYTHRA LEAD: ${lead.customerName} · ${lead.recommendedOffer}`;
  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
      <div style="background:#000000;color:#d8ff44;padding:20px;text-align:center;">
        <h2 style="margin:0;font-size:22px;letter-spacing:1px;">MYTHRA · NEW LEAD RECEIVED</h2>
        <p style="margin:6px 0 0 0;color:#ffffff;font-size:13px;">Target Pipeline: mythra</p>
      </div>
      <div style="padding:24px;color:#1a1a1a;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr><td style="padding:6px 0;width:140px;font-weight:bold;color:#555;">Name:</td><td><strong>${lead.customerName}</strong></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Email:</td><td><a href="mailto:${lead.customerEmail}">${lead.customerEmail}</a></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Phone / WhatsApp:</td><td>${lead.phone || 'N/A'}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Country:</td><td>${lead.country || 'N/A'}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Persona Door:</td><td>MYTHRA ${lead.persona}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Recommended:</td><td><strong>${lead.recommendedOffer} (${lead.offerPriceDisplay || 'Standard'})</strong></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Score:</td><td>${lead.leadScore} (${lead.qualification})</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Message / Notes:</td><td>${lead.message || 'None provided'}</td></tr>
        </table>
        ${lead.answersJson ? `<div style="background:#f8f9fa;padding:12px;border-radius:6px;font-size:12px;color:#333;font-family:monospace;white-space:pre-wrap;">${lead.answersJson}</div>` : ''}
      </div>
    </div>
  `;

  // Helper to send via MailChannels or Resend
  async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    // Attempt 1: Resend (if RESEND_API_KEY is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'MYTHRA Studio <concierge@mythralab.com>',
            to: [to],
            subject,
            html,
          }),
        });
        if (res.ok) return true;
        const err = await res.text();
        errors.push(`Resend error: ${err}`);
      } catch (e: any) {
        errors.push(`Resend fetch error: ${e.message}`);
      }
    }

    // Attempt 2: MailChannels API (native to Cloudflare Workers)
    try {
      const mcRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: {
            email: 'concierge@mythralab.com',
            name: 'MYTHRA Studio',
          },
          subject,
          content: [{ type: 'text/html', value: html }],
        }),
      });
      if (mcRes.ok || mcRes.status === 202) return true;
      const mcErr = await mcRes.text();
      errors.push(`MailChannels error: ${mcRes.status} ${mcErr}`);
    } catch (e: any) {
      errors.push(`MailChannels fetch error: ${e.message}`);
    }

    return false;
  }

  // Dispatch Customer Instant Auto-Reply
  customerNotified = await sendEmail(lead.customerEmail, customerSubject, customerHtml);

  // Dispatch Admin Notification (split if multiple emails e.g. info@gmail.com, info@zetomate.com)
  const adminRecipients = adminEmail.split(',').map((e) => e.trim()).filter(Boolean);
  for (const adminTo of adminRecipients) {
    const success = await sendEmail(adminTo, adminSubject, adminHtml);
    if (success) adminNotified = true;
  }

  return { customerNotified, adminNotified, errors };
}
