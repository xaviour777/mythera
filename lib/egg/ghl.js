// GoHighLevel (LeadConnector) API v2 — contacts only.
// GHL is the CRM: every Keeper and applicant becomes a contact with tags and custom fields.
// WhatsApp is NOT sent through GHL (its WhatsApp add-on bills per message); we use Meta Cloud API directly.
import { env } from './util.js';

const BASE = 'https://services.leadconnectorhq.com';
const token = () => env('GHL_TOKEN') || env('GHL_API_KEY');
export const ghlConfigured = () => Boolean(token() && env('GHL_LOCATION_ID'));

function headers() {
  return {
    authorization: `Bearer ${token()}`,
    version: env('GHL_API_VERSION', '2021-07-28'),
    'content-type': 'application/json',
    accept: 'application/json'
  };
}

// customFields: { contact_field_key: value }  e.g. { dragon_name: 'Noor' }
// Create these custom fields in GHL first (Settings → Custom Fields); the key is shown there.
function mapCustomFields(obj = {}) {
  const v3 = env('GHL_API_VERSION', '2021-07-28') === 'v3';
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([key, value]) => (v3 ? { key, fieldValue: String(value) } : { key, field_value: String(value) }));
}

// Create or update a contact (matched on email/phone by GHL's duplicate settings), then add tags.
// Never throws: a CRM outage must not break the egg for the visitor.
export async function syncContact({ firstName, lastName, email, phone, source, tags = [], customFields = {} }) {
  if (!ghlConfigured()) return { skipped: true };
  if (!email && !phone) return { skipped: true, reason: 'no email or phone' };
  try {
    const body = { locationId: env('GHL_LOCATION_ID'), source: source || 'mythrafilm.com/egg' };
    if (firstName) body.firstName = firstName;
    if (lastName) body.lastName = lastName;
    if (email) body.email = email;
    if (phone) body.phone = phone;
    const cf = mapCustomFields(customFields);
    if (cf.length) body.customFields = cf;
    const r = await fetch(`${BASE}/contacts/upsert`, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) { console.error('[ghl] upsert', r.status, JSON.stringify(data).slice(0, 400)); return { ok: false, status: r.status }; }
    const id = data?.contact?.id;
    // Upsert's `tags` field replaces existing tags, so tags are added separately.
    if (id && tags.length) {
      const t = await fetch(`${BASE}/contacts/${id}/tags`, { method: 'POST', headers: headers(), body: JSON.stringify({ tags }) });
      if (!t.ok) console.error('[ghl] tags', t.status, (await t.text()).slice(0, 300));
    }
    return { ok: true, id, isNew: Boolean(data?.new) };
  } catch (e) {
    console.error('[ghl] error', e.message);
    return { ok: false, error: e.message };
  }
}

export async function addTags(contactId, tags) {
  if (!ghlConfigured() || !contactId || !tags.length) return;
  try {
    const r = await fetch(`${BASE}/contacts/${contactId}/tags`, { method: 'POST', headers: headers(), body: JSON.stringify({ tags }) });
    if (!r.ok) console.error('[ghl] tags', r.status);
  } catch (e) { console.error('[ghl] tags error', e.message); }
}
