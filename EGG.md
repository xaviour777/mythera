# Dragon Egg — mythrafilm.com/egg

Touch the egg three times, hatch a baby dragon that breathes fire, name it, get a Keeper card, share it everywhere, and keep the dragon on WhatsApp. Filmmakers continue to the Drama Method Writers' Room on the same page.

## Where it lives in this repo

```
public/egg/index.html, egg.js     the page (plain HTML + JS, no React, ~25 KB gzipped)
public/egg/*.webp|jpg             dragon cut-out, share image, WhatsApp card image
next.config.ts                    rewrite /egg → /egg/index.html
app/egg/k/[id]/route.js           /egg/k/K-XXXXXX share page with rich previews
app/api/egg/keeper/route.js       POST hatch → profile + GHL · GET public profile
app/api/egg/wa-webhook/route.js   WhatsApp Cloud API webhook
app/api/egg/apply/route.js        cohort application → GHL
app/api/egg/track/route.js        share/opt-in events → counters + GHL tags
app/api/egg/config/route.js       public settings for the page
lib/egg/                          Redis (Upstash REST), GHL, WhatsApp helpers — no new npm packages
tests/egg/egg-api.test.mjs        end-to-end tests, GHL and Meta mocked: node --test tests/egg/*.test.mjs
```

## Go live

1. Merge this branch. Vercel deploys it with the rest of the site.
2. Vercel → Storage → add **Upstash Redis** to the project (free tier). It sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`. Without it, profiles only live in memory and are lost between requests.
3. Add the egg variables from `.env.example` in Vercel → Settings → Environment Variables. The egg reuses `GHL_API_KEY` and `GHL_LOCATION_ID`. Redeploy.
4. Meta webhook URL: `https://mythrafilm.com/api/egg/wa-webhook`.

## User profiles

Every hatch creates `keeper:K-XXXXXX` in Redis: dragon name, Keeper name, element, email, WhatsApp, consent, UTM source, who referred them, how many friends they brought, share counts, WhatsApp opt-in, and the GHL contact id. Lookups by phone and email are indexed. GHL holds the same person as a contact for your workflows.

## GoHighLevel

Create a Private Integration token (scope: contacts write) and these **contact custom fields** (Settings → Custom Fields). Use exactly these keys:

`dragon_name`, `keeper_number`, `keeper_card_url`, `dragon_element`, `referred_by`, `cohort_tier`, `cohort_niche`, `cohort_channel_link`, `cohort_goal`

Tags the site adds: `mythra-keeper`, `egg-hatched`, `element-*`, `referred`, `shared-card`, `wa-optin`, `wa-optout`, `wa-lead`, `wa-needs-human`, `viewed-cohort`, `asked-cohort`, `cohort-applicant`, `tier-room-297`, `tier-studio-997`, `cohort-1`.

Build GHL workflows on these tags for **email** follow-up. Do not send WhatsApp from GHL: its WhatsApp add-on bills per message and would bypass the guards below.

If GHL changes its API version, set `GHL_API_VERSION` (`v3` switches custom fields to the `fieldValue` format).

## WhatsApp: how the cost stays at zero

Meta's rules from **1 October 2026**:

- Messages people send you are always free.
- Your replies inside the 24-hour window are free for the **first 1,000 per number per month**, then billed at the recipient country's utility rate.
- People who arrive from a **Click-to-WhatsApp ad** or a **Facebook Page button** open a **72-hour free window**. Replies there are free and don't use the 1,000.
- Template messages (anything sent outside a window) are always billed. **This code never sends templates.**

What the code does:

- People start every chat themselves. "Keep my dragon on WhatsApp" opens `wa.me` with `🐉 HATCH K-XXXXXX`, the visitor taps Send, and that inbound message opens the window.
- **One reply per message.** At most `WA_DAILY_PER_USER` replies per person per day.
- **Monthly cap.** Auto-replies stop at `WA_MONTHLY_CAP` (default 950). After that the contact is tagged `wa-needs-human` in GHL. Replies sent from the API after the cap would be billed.
- **Ad leads.** Messages from ads are detected (`referral` field), and their replies don't count toward the cap.
- **Retries.** Meta retries are de-duplicated, so a retry never causes a second reply.
- **Web first.** Most of the experience (card, sharing, cohort) happens on the website, so WhatsApp only carries short messages with links back.

Keywords people can send: `EPISODE`, `COHORT`, `STOP`, `START`.

### Meta setup

1. developers.facebook.com → Create App → Business → add **WhatsApp**.
2. Add and verify your business phone number. Copy the **Phone number ID**.
3. Business Settings → System Users → create one, give it the app with `whatsapp_business_messaging` and `whatsapp_business_management`, and generate a **permanent token** → `WA_TOKEN`.
4. App → WhatsApp → Configuration → Webhook:
   - Callback URL: `https://mythrafilm.com/api/egg/wa-webhook`
   - Verify token: your `WA_VERIFY_TOKEN`
   - Subscribe to **messages**.
5. App Settings → Basic → **App secret** → `WA_APP_SECRET`.

## Tracking

Set `META_PIXEL_ID` to fire:

- `PageView`
- `EggHatched` (custom)
- `Lead` (Keeper card made)
- `Contact` (WhatsApp opt-in click)
- `ViewContent` (cohort)
- `SubmitApplication`

UTM parameters on the egg link are saved to the profile and sent to GHL as the source.
