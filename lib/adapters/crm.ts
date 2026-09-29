// CRM Provider Interface & Adapters (GoHighLevel + Mock)
import { GhlContactPayload, GhlOpportunityPayload } from '../ghl-mapping';

export interface CrmSyncResult {
  success: boolean;
  contactId?: string;
  opportunityId?: string;
  error?: string;
  isMock?: boolean;
  syncedAt: string;
}

export interface CrmProvider {
  syncContactAndOpportunity(
    contact: GhlContactPayload,
    opportunity?: GhlOpportunityPayload
  ): Promise<CrmSyncResult>;
}

export class MockCrmProvider implements CrmProvider {
  async syncContactAndOpportunity(
    contact: GhlContactPayload,
    opportunity?: GhlOpportunityPayload
  ): Promise<CrmSyncResult> {
    // Generates simulated idempotent IDs for testing
    const mockContactId = `ghl_cnt_${Date.now()}`;
    const mockOppId = opportunity ? `ghl_opp_${Date.now()}` : undefined;

    return {
      success: true,
      contactId: mockContactId,
      opportunityId: mockOppId,
      isMock: true,
      syncedAt: new Date().toISOString(),
    };
  }
}

const DEFAULT_GHL_API_KEY = process.env.GHL_API_KEY || 'pit-a90d2e32-948d-4726-b9a9-5a76fd8852eb';
const DEFAULT_GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || 'AeIZDAxEhTypA4Eja6j6';
const DEFAULT_GHL_PIPELINE_ID = process.env.GHL_PIPELINE_ID || 'upL94xEQbDfaAiIRlyiD';
const DEFAULT_GHL_STAGE_ID = process.env.GHL_STAGE_ID || '1565480e-e873-4bc4-89b5-c148dc986422';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || process.env.GHL_NOTIFY_EMAIL || 'info@zetomate.com';

export class GhlCrmProvider implements CrmProvider {
  private apiKey: string;
  private locationId: string;
  private pipelineId: string;
  private pipelineStageId: string;

  constructor(apiKey: string, locationId: string, pipelineId?: string, pipelineStageId?: string) {
    this.apiKey = apiKey;
    this.locationId = locationId;
    this.pipelineId = pipelineId || process.env.GHL_PIPELINE_ID || DEFAULT_GHL_PIPELINE_ID;
    this.pipelineStageId = pipelineStageId || process.env.GHL_STAGE_ID || DEFAULT_GHL_STAGE_ID;
  }

  async syncContactAndOpportunity(
    contact: GhlContactPayload,
    opportunity?: GhlOpportunityPayload
  ): Promise<CrmSyncResult> {
    try {
      // 0. If GHL Inbound Webhook is configured, fire workflow automation directly
      const webhookUrl = process.env.GHL_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'mythra_lead_submitted',
              contact: {
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                phone: contact.phone,
                company: contact.companyName,
                tags: contact.tags,
                source: contact.source,
                ...contact.customFields,
              },
              opportunity,
              notifyEmail: NOTIFY_EMAIL,
              submittedAt: new Date().toISOString(),
            }),
          });
        } catch (webhookErr) {
          console.warn('GHL Webhook trigger error:', webhookErr);
        }
      }

      // 1. Direct REST call to GoHighLevel Contacts Upsert v2 API
      const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Version: '2021-07-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId: this.locationId,
          email: contact.email,
          firstName: contact.firstName,
          lastName: contact.lastName,
          phone: contact.phone,
          companyName: contact.companyName,
          tags: contact.tags,
          source: contact.source || 'MYTHRA Website Funnel',
          customFields: Object.entries(contact.customFields).map(([key, value]) => ({
            key,
            field_value: value,
          })),
        }),
      });

      if (!contactRes.ok) {
        const errorText = await contactRes.text();
        console.warn(`GHL Contact API error: ${contactRes.status} - ${errorText}`);
        return {
          success: false,
          error: `GHL API ${contactRes.status}: ${errorText}`,
          syncedAt: new Date().toISOString(),
        };
      }

      const contactData = (await contactRes.json()) as { contact?: { id?: string } };
      const contactId = contactData.contact?.id;

      if (!contactId) {
        throw new Error('GHL responded without a valid contact ID');
      }

      // 2. Add detailed lead dossier Note in GoHighLevel for follow-up
      // (answers text is also reused in the admin notification email below)
      let parsedAnswersText = 'None provided';
      try {
        const custom = contact.customFields || {};
        let doorTitle = '';
        let recipient = '';
        let occasion = '';
        let ambition = '';
        let role = '';
        let whyMatters = '';

        try {
          if (custom.mythra_answers_json) {
            const a = typeof custom.mythra_answers_json === 'string' ? JSON.parse(custom.mythra_answers_json) : custom.mythra_answers_json;
            doorTitle = a.doorTitle || a.door || '';
            recipient = a.recipient || '';
            occasion = a.occasion || '';
            ambition = a.ambition || '';
            role = a.preferredRole || a.roleLevel || '';
            whyMatters = a.whyStoryMatters || a.message || '';

            const lines = [];
            if (doorTitle) lines.push(`• Track / Door: ${doorTitle}`);
            if (recipient) lines.push(`• Film Made For: ${recipient}`);
            if (occasion) lines.push(`• Story Occasion / Theme: ${occasion}`);
            if (ambition) lines.push(`• Cinematic Ambition: ${ambition}`);
            if (role) lines.push(`• Cast Role Level: ${role}`);
            if (a.assetsUsed) lines.push(`• Assets to Integrate: ${a.assetsUsed}`);
            if (a.motivation) lines.push(`• Motivation: ${a.motivation}`);
            if (a.budgetReadiness) lines.push(`• Budget Readiness: ${a.budgetReadiness}`);
            if (whyMatters) lines.push(`• Story Details / Premise: "${whyMatters}"`);
            if (lines.length > 0) parsedAnswersText = lines.join('\n');
          }
        } catch (e) {
          parsedAnswersText = String(custom.mythra_answers_json || 'None');
        }

        const noteContent = `🌟 NEW MYTHRA LEAD DOSSIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CONTACT:
• Name: ${contact.firstName} ${contact.lastName}
• Email: ${contact.email}
• WhatsApp/Phone: ${contact.phone || 'None'}
• Company: ${contact.companyName || 'None'}
• Country: ${custom.mythra_country || 'None'}

🎯 WHAT THIS CLIENT WANTS:
• Selected Package: ${custom.mythra_recommended_offer || 'Production Package'}
• Persona Track: MYTHRA ${custom.mythra_persona || 'YOU'}
• Lead Score: ${custom.mythra_lead_score || 0} (${custom.mythra_qualification || 'Standard'})

📋 QUESTIONNAIRE ANSWERS:
${parsedAnswersText}

📝 PROJECT NOTES / STORY PREMISE:
${whyMatters || custom.mythra_message || 'None provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submitted via MYTHRA Live Funnel`;

        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            Version: '2021-07-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: noteContent }),
        });
      } catch (noteErr) {
        console.warn('GHL Note sync warning:', noteErr);
      }

      // 2b. Create high-visibility Task in GoHighLevel for immediate follow-up alert
      try {
        const custom = contact.customFields || {};
        const offer = custom.mythra_recommended_offer || 'Production Inquiry';
        const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tasks`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            Version: '2021-07-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: `🔥 NEW MYTHRA LEAD: ${contact.firstName} ${contact.lastName} (${offer})`,
            dueDate,
            completed: false,
          }),
        });
      } catch (taskErr) {
        console.warn('GHL Task create notice:', taskErr);
      }

      // 3. Create or sync Opportunity in GoHighLevel Pipeline for active deal tracking
      let opportunityId: string | undefined;
      try {
        let targetPipelineId = this.pipelineId;
        let targetStageId = this.pipelineStageId;

        // Auto-discover 'mythra' pipeline if present in the account
        try {
          const pipeRes = await fetch(`https://services.leadconnectorhq.com/opportunities/pipelines?locationId=${this.locationId}`, {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              Version: '2021-07-28',
            },
          });
          if (pipeRes.ok) {
            const pipeData = (await pipeRes.json()) as any;
            const pipelines = pipeData.pipelines || [];
            const mythraPipe = pipelines.find((p: any) =>
              p.name && (p.name.toLowerCase().includes('mythra') || p.name.toLowerCase().includes('methrya'))
            );
            if (mythraPipe) {
              targetPipelineId = mythraPipe.id;
              if (mythraPipe.stages && mythraPipe.stages.length > 0) {
                targetStageId = mythraPipe.stages[0].id;
              }
            }
          }
        } catch (pipeErr) {
          console.warn('GHL pipeline auto-lookup notice:', pipeErr);
        }

        const oppRes = await fetch('https://services.leadconnectorhq.com/opportunities/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            Version: '2021-07-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            locationId: this.locationId,
            pipelineId: targetPipelineId,
            pipelineStageId: targetStageId,
            name: `${contact.firstName} ${contact.lastName} — ${contact.customFields?.mythra_recommended_offer || 'Production Lead'}`,
            status: 'open',
            contactId,
            monetaryValue: typeof opportunity?.monetaryValue === 'number' ? opportunity.monetaryValue : 0,
          }),
        });

        if (oppRes.ok) {
          const oppData = (await oppRes.json()) as { opportunity?: { id?: string } };
          opportunityId = oppData.opportunity?.id;
        } else {
          console.warn('GHL Opp create warning:', await oppRes.text());
        }
      } catch (oppErr) {
        console.warn('GHL Opportunity sync warning:', oppErr);
      }

      // 4. Send customer instant reply email directly via GHL conversation API
      try {
        const custom = contact.customFields || {};
        const offerName = custom.mythra_recommended_offer || 'Production Package';
        await fetch('https://services.leadconnectorhq.com/conversations/messages', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            Version: '2021-07-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'Email',
            contactId: contactId,
            emailTo: contact.email,
            subject: `Action Required: We received your MYTHRA production inquiry — Please confirm within 24 hours`,
            html: `
              <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:620px;margin:0 auto;background:#050505;color:#f3f3eb;border-radius:16px;overflow:hidden;border:1px solid #222;">
                <div style="background:#000000;padding:28px 24px;text-align:center;border-bottom:1px solid #1a1a1a;">
                  <h1 style="color:#d8ff44;font-size:24px;letter-spacing:2px;margin:0;font-weight:900;">M Y T H R A</h1>
                  <p style="color:#a3a89e;font-size:12px;letter-spacing:1px;text-transform:uppercase;margin:6px 0 0 0;">AI-Native Autonomous Independent Cinema Studio</p>
                </div>
                <div style="padding:32px 28px;">
                  <h2 style="font-size:20px;font-weight:800;color:#ffffff;margin-top:0;">Thank you for your submission, ${contact.firstName}.</h2>
                  <p style="color:#cccccc;font-size:14px;line-height:1.6;">
                    We have logged your production questionnaire for <strong style="color:#d8ff44;">${offerName}</strong>.
                  </p>

                  <div style="background:#111410;border:1px solid #d8ff44;border-radius:12px;padding:20px;margin:24px 0;">
                    <h3 style="color:#d8ff44;font-size:13px;letter-spacing:1px;text-transform:uppercase;margin:0 0 8px 0;font-weight:bold;">
                      ⚡ ACTION REQUIRED · PLEASE REPLY WITHIN 24 HOURS
                    </h3>
                    <p style="color:#e0e0e0;font-size:13px;line-height:1.6;margin:0;">
                      To verify your details and reserve your place in the upcoming production cohort, <strong>please reply directly to this email within 24 hours</strong> with:
                    </p>
                    <ul style="color:#b5b5b5;font-size:13px;line-height:1.6;margin:10px 0 0 0;padding-left:20px;">
                      <li>Your desired release timeline or premiere date</li>
                      <li>Any reference visuals, links, or script premises you want included</li>
                      <li>Best contact method (Email or WhatsApp: ${contact.phone || 'not provided'})</li>
                    </ul>
                  </div>

                  <p style="color:#cccccc;font-size:14px;line-height:1.6;">
                    Our executive producers will review your brief and follow up with your customized production roadmap.
                  </p>

                  <p style="color:#777777;font-size:12px;line-height:1.5;margin-top:32px;border-top:1px solid #1f1f1f;padding-top:20px;">
                    MYTHRA Studio · <a href="https://mythralab.com" style="color:#a3a89e;">mythralab.com</a><br/>
                    Autonomous Hollywood-Grade Cinema Pipeline · Confidential
                  </p>
                </div>
              </div>
            `,
          }),
        });
      } catch (custErr) {
        console.warn('GHL customer instant email warning:', custErr);
      }

      // 5. Send internal notification email to info@zetomate.com via GHL conversation API
      try {
        const adminContactRes = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            Version: '2021-07-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            locationId: this.locationId,
            firstName: 'MYTHRA',
            lastName: 'Notifications',
            email: NOTIFY_EMAIL,
          }),
        });
        const adminData = (await adminContactRes.json()) as any;
        const adminContactId = adminData.contact?.id;

        if (adminContactId) {
          const custom = contact.customFields || {};
          const cleanPhone = (contact.phone || '').replace(/[^0-9]/g, '');
          const waMsg = encodeURIComponent(`Hi ${contact.firstName}, this is the MYTHRA production team regarding your ${custom.mythra_recommended_offer || 'film'} inquiry. We have reviewed your story brief and are ready to send your official Whop reservation link.`);
          const waLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=${waMsg}` : '';

          await fetch('https://services.leadconnectorhq.com/conversations/messages', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              Version: '2021-07-28',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'Email',
              contactId: adminContactId,
              emailTo: NOTIFY_EMAIL,
              subject: `🔥 New MYTHRA Lead: ${contact.firstName} ${contact.lastName} (${custom.mythra_recommended_offer || 'General'})`,
              html: `
                <div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;background:#ffffff;">
                  <div style="background:#000000;color:#d8ff44;padding:24px;text-align:center;">
                    <h1 style="margin:0;font-size:22px;letter-spacing:1px;">MYTHRA · NEW LEAD RECEIVED</h1>
                    <p style="margin:6px 0 0 0;color:#ffffff;font-size:13px;">Pipeline: MYTHRA Leads · Stage: New Request</p>
                  </div>
                  <div style="padding:24px;color:#1a1a1a;">
                    <!-- Highlighted What Client Wants Box -->
                    <div style="background:#0a0a0a;color:#ffffff;border-radius:8px;padding:18px;margin-bottom:20px;border-left:4px solid #d8ff44;">
                      <span style="font-size:11px;font-family:monospace;color:#a1a1aa;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Target Selection</span>
                      <h2 style="margin:0;font-size:20px;color:#d8ff44;">${custom.mythra_recommended_offer || 'Production Package'}</h2>
                    </div>

                    <h3 style="font-size:15px;border-bottom:2px solid #f0f0f0;padding-bottom:6px;margin:16px 0 12px 0;">👤 Contact Information</h3>
                    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:14px;">
                      <tr><td style="padding:5px 0;width:140px;font-weight:bold;color:#555;">Name:</td><td><strong>${contact.firstName} ${contact.lastName}</strong></td></tr>
                      <tr><td style="padding:5px 0;font-weight:bold;color:#555;">Email:</td><td><a href="mailto:${contact.email}" style="color:#2563eb;">${contact.email}</a></td></tr>
                      <tr><td style="padding:5px 0;font-weight:bold;color:#555;">WhatsApp/Phone:</td><td><strong>${contact.phone || 'None provided'}</strong></td></tr>
                      <tr><td style="padding:5px 0;font-weight:bold;color:#555;">Country:</td><td>${custom.mythra_country || 'N/A'}</td></tr>
                    </table>

                    <h3 style="font-size:15px;border-bottom:2px solid #f0f0f0;padding-bottom:6px;margin:16px 0 12px 0;">📋 Questionnaire Breakdown (What They Want)</h3>
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;font-size:13px;line-height:1.6;white-space:pre-wrap;color:#1e293b;font-family:monospace;">${parsedAnswersText}</div>

                    ${waLink ? `
                    <div style="text-align:center;margin:24px 0 12px 0;">
                      <a href="${waLink}" style="background:#25D366;color:#ffffff;font-weight:bold;text-decoration:none;padding:14px 28px;border-radius:8px;display:inline-block;font-size:14px;">
                        💬 Open 1-Click WhatsApp Follow-Up &rarr;
                      </a>
                    </div>
                    ` : ''}

                    <div style="text-align:center;margin-top:16px;">
                      <a href="mailto:${contact.email}?subject=${encodeURIComponent(`Your MYTHRA Production Request (${custom.mythra_recommended_offer || 'Package'})`)}" style="color:#2563eb;font-size:13px;text-decoration:underline;">
                        Reply to ${contact.email} via Email
                      </a>
                    </div>
                  </div>
                </div>
              `,
            }),
          });
        }
      } catch (notifyErr) {
        console.warn('GHL notification email warning:', notifyErr);
      }

      return {
        success: true,
        contactId,
        opportunityId,
        isMock: false,
        syncedAt: new Date().toISOString(),
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown CRM error';
      console.error('GHL CRM Error:', errorMsg);
      return {
        success: false,
        error: errorMsg,
        syncedAt: new Date().toISOString(),
      };
    }
  }
}

export function getCrmProvider(): CrmProvider {
  const ghlApiKey = process.env.GHL_API_KEY || DEFAULT_GHL_API_KEY;
  const ghlLocationId = process.env.GHL_LOCATION_ID || DEFAULT_GHL_LOCATION_ID;

  if (ghlApiKey && ghlLocationId) {
    return new GhlCrmProvider(ghlApiKey, ghlLocationId);
  }
  return new MockCrmProvider();
}
