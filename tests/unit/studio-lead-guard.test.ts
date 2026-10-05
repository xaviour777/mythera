import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { inquirySchema } from '../../lib/studio/inquiry-schema';
import { screenLead, emailDomainAccepts } from '../../lib/studio/lead-guard';

const base = { requestId: '2b305ff2-5065-4674-af4c-ab552368fce0', consent: true, category: 'Audience experience' };
const partner = { ...base, kind: 'partner', category: 'Studios & producers', name: 'Amira Khan', email: 'amira@studio.co', company: 'Northlight', role: 'Producer', country: 'Pakistan', phone: '+92 300 1234567', message: 'Co-producing a feature set in the MYTHRA world.' };
const lead = (o: Record<string, unknown>) => ({ kind: 'partner', name: 'Amira Khan', email: 'amira@studio.co', company: 'Northlight', role: 'Producer', country: 'Pakistan', message: '', ...o });

describe('Studio enquiry required fields', () => {
  it('rejects an audience signup with only an email', () => {
    assert.equal(inquirySchema.safeParse({ ...base, kind: 'audience', email: 'dohoanh686@gmail.com' }).success, false);
  });
  it('accepts an audience signup with name and email', () => {
    assert.equal(inquirySchema.safeParse({ ...base, kind: 'audience', name: 'Do Hoanh', email: 'dohoanh686@gmail.com' }).success, true);
  });
  it('requires phone and a brief for partner leads', () => {
    assert.equal(inquirySchema.safeParse(partner).success, true);
    assert.equal(inquirySchema.safeParse({ ...partner, phone: '' }).success, false);
    assert.equal(inquirySchema.safeParse({ ...partner, message: 'hi' }).success, false);
  });
  it('keeps phone and brief optional for press', () => {
    assert.equal(inquirySchema.safeParse({ ...partner, kind: 'press', phone: '', message: '' }).success, true);
  });
});

describe('Studio lead screening', () => {
  it('passes a real-looking lead', () => assert.equal(screenLead(lead({ elapsedMs: 40000 })), null));
  it('silently drops forms filled faster than a person can type', () => assert.deepEqual(screenLead(lead({ elapsedMs: 300 })), { bot: true }));
  it('rejects throwaway and test emails', () => {
    assert.ok(screenLead(lead({ email: 'x@mailinator.com' })));
    assert.ok(screenLead(lead({ email: 'test123@gmail.com' })));
    assert.equal(screenLead(lead({ email: 'hello@northlight.com' })), null);
  });
  it('rejects junk names and fields', () => {
    assert.ok(screenLead(lead({ name: 'test' })));
    assert.ok(screenLead(lead({ name: '12' })));
    assert.ok(screenLead(lead({ country: 'asdf' })));
    assert.deepEqual(screenLead(lead({ company: 'https://spam.example' })), { bot: true });
    assert.equal(screenLead(lead({ company: 'Booking.com' })), null);
  });
  it('rejects an email domain that does not exist', async () => {
    assert.equal(await emailDomainAccepts('a@this-domain-does-not-exist-mythra-9f3k.com'), false);
  });
});
