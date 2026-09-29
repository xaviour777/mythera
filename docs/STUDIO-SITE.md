# mythrafilm.com — MYTHRA Studios site

The studio homepage (`/`) and its pages are built in `app/(studio)` with their own
shell (nav, footer, motion toggle, partner dialog). The original site still lives
under `/un1`, `/join` and `/admin` with its original chrome (`components/LegacyChrome.tsx`).

## Updating proof, links and copy — no code changes

Everything factual lives in **`content/mythra.json`**:

| What | Where |
| --- | --- |
| Verified total views | `metrics.totalViews` — set `value` (number) or `display` (e.g. `"412,000,000"`), then `verified: true` |
| Languages / countries | `metrics.languages`, `metrics.countries` |
| Festival line under the proof | `festivals[]` — set `name`, `verified: true`; `showOnHero: false` removes it |
| Film URL | `worlds[0].film.watchUrl` (and optional `embedUrl`; YouTube links are auto-embedded privacy-enhanced) |
| Hero / world image | `worlds[0].media.keyArt` — currently interim key art; replace with an approved film still |
| Creator | `creators[]` (add `portrait` path when available) |
| Emails | `contact.partners.email`, `contact.press.email` |
| Social links | `social[].url` |
| Legal entity | `company.legalEntity` (+ `verified: true`) |
| Rights statement | `rights.chainOfTitle.statement` — only renders when `approved: true` after legal review |
| Partner categories | `partnerCategories[]` |
| Partner deck | `partnerDeck.status`: `"in-preparation"` or `"ready"` |
| Press coverage | `press[]` (`outlet`, `headline`, `url`, `date`) |

**Nothing unverified is shown in production.** Empty or unverified values render as
amber `[[PLACEHOLDER]]` tokens on local dev and Vercel preview deployments so the
layout can be reviewed, and are omitted entirely on the production deployment.

`lib/content/index.ts` is the only reader of that file; to move to a headless CMS,
keep its function signatures and replace the JSON import.

## Forms

The partner form, partner-deck request and `/enter` sign-up all post to
`/api/inquiry` (`lib/studio/inquiries.ts`). Configure delivery with environment
variables (see `.env.example`): `INQUIRY_WEBHOOK_URL`, `INQUIRY_NOTIFY_EMAIL` +
`RESEND_API_KEY` + `EMAIL_FROM`. The deck link is `PARTNER_DECK_URL` (server-only)
and is emailed automatically once `partnerDeck.status` is `"ready"`.
**Without any of these set, submissions are only written to the server log.**

Deep links: `/#partner-with-mythra` and `/#partner-deck` open the forms.

## Motion

- Only two scroll-driven scenes (GSAP ScrollTrigger, short pins, scrubbed to native
  scroll): `components/studio/home/WorldEntry.tsx` and `MethodBeats.tsx`.
- Everything else is a once-only fade (`data-reveal`), visible without JavaScript.
- Motion: Full / Reduced toggle in the footer; defaults to the OS
  `prefers-reduced-motion` setting. Reduced renders both scenes as static layouts.

## /enter

A teaser, deliberately honest: a temple, one egg that responds to cursor/touch
proximity and reacts when touched, optional synthesized ambient sound (off by
default), and email capture. `components/enter/Egg.tsx` is the swap point for a
future React Three Fiber scene — load three.js only on `/enter`, never on the
corporate pages.
