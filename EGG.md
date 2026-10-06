# Dragon Egg — mythrafilm.com/egg

A free experience that pulls people into MYTHRA and hands filmmakers to the paid cohort.

1. **The hall.** Touch the egg three times.
2. **The hatch.** It hatches a baby dragon that breathes fire, with ambient music.
3. **Two doors open:**
   - **Share your dragon.** Name it (kept in the visitor's browser only) and get a 1080×1350 card image. Share to WhatsApp, Facebook, X or Telegram, copy the link, or use the phone share sheet for Instagram and TikTok stories. No sign-up.
   - **Build with MYTHRA.** Shows the Drama Method Writers' Room. The seat buttons go straight to **Whop checkout**:
     - Room $297
     - Studio $997 with 1:1 with Zahid

     A short question form sends unsure buyers to GHL.

No WhatsApp API, no email sending and no database are required.

## Files

```
public/egg/index.html, egg.js   the page (plain HTML + JS, ~25 KB gzipped)
public/egg/dragon.webp, og.jpg  dragon cut-out and link-preview image
next.config.ts                  rewrite /egg → /egg/index.html
app/api/egg/config/route.js     Whop links + Meta Pixel id for the page
app/api/egg/apply/route.js      question form → GHL contact
lib/egg/                        small helpers (GHL upsert, rate limit)
tests/egg/                      node --test tests/egg/*.test.mjs
```

## Go live

1. **Whop:** create two products/checkouts (Room $297, Studio $997) and copy each checkout link.
2. **Vercel environment variables:**
   - `WHOP_ROOM_URL` and `WHOP_STUDIO_URL`: the two links.
   - `GHL_API_KEY` and `GHL_LOCATION_ID`: already used by the site. Use a **new** key; the old one was exposed in the repo.
   - `META_PIXEL_ID`: optional.
3. **Redeploy.** Until the Whop links are set, the seat buttons scroll to the question form instead.

UTM parameters on the egg link are passed on to the Whop checkout.

## GHL

The question form creates a contact with these tags:

- `cohort-lead`
- `tier-room-297` or `tier-studio-997`
- `cohort-1`

It also fills these custom fields, if they exist:

- `cohort_tier`
- `cohort_niche`
- `cohort_channel_link`
- `cohort_goal`

Buyers live in Whop. Add them to the cohort WhatsApp group and calls from there.

## Meta Pixel events

- `PageView`
- `EggHatched`
- `ShareSheetOpened`
- `Share`
- `ViewContent` (cohort)
- `InitiateCheckout`
- `SubmitApplication`
