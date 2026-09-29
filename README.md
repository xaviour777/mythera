# MYTHRA — AI-Native Film & Drama Studio

> **mythrafilm.com studio site:** see [`docs/STUDIO-SITE.md`](docs/STUDIO-SITE.md). Proof, links and copy are edited in `content/mythra.json`. The sections below describe the original site, now under `/un1`.

> **"Stories anyone can enter. Studios anyone can build. Films brands can own."**

MYTHRA is an AI-native film and drama studio. AI is the production medium; storytelling, IP, audience psychology, localization, and distribution are the business.

---

## 🏛️ Brand & Route Architecture

All public routes, interactive conversion funnels, and protected studio operations live in a unified Next.js App Router architecture:

| Route | Purpose & Description |
| :--- | :--- |
| `/` | **Master Brand Router** — Hero, verified proof teaser, 3 commercial doors, the story engine model, and final CTA. |
| `/you` | **MYTHRA YOU** — Personalized cinema landing page, 6 emotional use cases, filterable gallery, 4-tier pricing ladder, likeness trust panel, and FAQ. |
| `/you/start` | **Interactive YOU Funnel** — Step-by-step questionnaire, format selection, likeness pre-check, tailored recommendation, and checkout trigger. |
| `/you/onboarding` | **Secure Post-Order Onboarding** — Multi-step likeness & voice consent contracts, encrypted uploaders for reference photos/audio, story facts, pronunciation, and deletion controls. |
| `/filmmaker` | **MYTHRA FILMMAKER** — Education and one-person studio building landing page, 6-stage transformation pipeline, curriculum ladder (Blueprint, Starter, Cohort, Accelerator), and FAQ. |
| `/filmmaker/start` | **Filmmaker Diagnostic Quiz** — Ambition, experience level, biggest bottleneck, 90-day milestone, and tailored program routing. |
| `/studios` | **MYTHRA STUDIOS** — B2B production, branded drama, and IP adaptation. 5 intent pathways, starting at $7,500+, capabilities, and engagement models. |
| `/studios/start` | **B2B Branching Funnel** — Dynamic branching by intent (Brand, IP, Audience, Production, Finance) with automated lead scoring and tailored next steps. |
| `/genesis` | **Genesis Case Study** — Scroll narrative of the audited 28-minute first-film experiment produced in <72 hours for <$2,000 compute. |
| `/method` | **The Drama Method** — Interactive 12-step story architecture exploration from audience psychology to global distribution. |
| `/stories` | **Stories & Originals Portfolio** — Filterable gallery across Fantasy, Sci-fi, Founder, Romance, Wedding, and Drama with explicit permission labels. |
| `/legal/likeness-consent` | **Likeness & Voice Consent Terms** — Formal biometric policy, non-training guarantees, minor protection, and revocation mechanisms. |
| `/legal/privacy` | **Biometric Privacy Policy** — GDPR/CCPA compliant retention and deletion windows. |
| `/legal/terms` | **Terms of Service** — Creative stylization notices, revision policies, and commercial licensing tiers. |
| `/admin/*` | **Studio Operations Suite** — Dashboard, Leads & Scoring, Orders, Active Productions, Proof Verification Manager, Offers Editor, CRM Sync Logs, and Funnel Simulator. |

---

## 🎯 Offer Architecture & Pricing Catalog

Centralized in [`lib/offers.ts`](file:///d:/mythera/lib/offers.ts) and editable via `/admin/offers`:

### 1. MYTHRA YOU (Personalized Cinema)
* **MYTHRA MOMENT ($79)**: 20–30s template-led scene, 1 authorized star, 1080p master, 1 revision, 3–5 business days. No cloned voice.
* **MYTHRA TRAILER ($299 · Recommended Hero)**: 60–90s bespoke movie trailer, custom premise, 1 lead star (face + optional voice clone), 5–8 story beats, score & sound mix, 1080p + 9:16 vertical cut, 2 revisions, 7–10 business days.
* **MYTHRA STORY (From $1,500)**: 3–5 min bespoke short film, story interview, custom screenplay/storyboard, 1–2 stars, 50% deposit after feasibility review, 2–4 weeks.
* **MYTHRA LEGACY (From $5,000)**: 8–15 min premium life/founder/wedding heirloom documentary, dedicated Creative Director research call, milestone billing.

### 2. MYTHRA FILMMAKER (Education & Studio Pipeline)
* **THE ONE-PERSON STUDIO BLUEPRINT (Free)**: 45–60 min intensive workshop breakdown of the 12-Step Drama Method.
* **MYTHRA STARTER ($149)**: Self-paced 8-module fundamentals, templates, prompt bibles, 1-year access.
* **MYTHRA FILMMAKER COHORT ($749 Founding / $997 Standard · Recommended Hero)**: 6-week live production sprint with weekly reviews; finish and publish 1 portfolio film or trailer.
* **MYTHRA STUDIO ACCELERATOR (From $2,500)**: Application-only 8–12 week mentorship for working creators, agencies, and boutique teams.

### 3. MYTHRA STUDIOS (B2B Production & IP)
* *Public Anchor Rule:* "Studio engagements begin at $7,500. Original IP and long-form productions are scoped individually."
* **STORY CONCEPT SPRINT ($2,500)**: Strategic story opportunity mapping, core premise, and visual treatment. (100% credited toward productions over $15K contracted within 30 days).
* **SOCIAL DRAMA PILOT (From $7,500)**: 45–90s premium branded story pilot or proof-of-concept.
* **BRANDED SHORT FILM (From $15,000)**: 3–5 min original standalone cinema film with brand alignment.
* **EPISODIC STORY SYSTEM (From $30,000)**: Series format bible, pilot + 2 episodes, reusable digital asset system.
* **LONG-FORM / ORIGINAL IP / CO-PRODUCTION (From $50,000)**: Custom milestone finance, global localization, and distribution agreements.

---

## 🛡️ Truth & Proof Controls Enforcement

Centralized in [`lib/proof.ts`](file:///d:/mythera/lib/proof.ts):

* **Enforcement Rule:** Unverified claims are strictly hidden from production public display unless `verified: true` and an audited evidence reference code is attached.
* **Attribution Separation:** Official owned channel performance (50M verified views in 7 days on Episode 1 alone, 4M Facebook) is strictly isolated from licensed partner views (5M) and observed third-party fan reposts (300M+). Third-party reach is explicitly labeled with methodology notes.

---

## 🧠 Lead Scoring & GoHighLevel (GHL) CRM Integration

Centralized in [`lib/lead-scoring.ts`](file:///d:/mythera/lib/lead-scoring.ts) and [`lib/ghl-mapping.ts`](file:///d:/mythera/lib/ghl-mapping.ts):

### Scoring Matrix:
* `+30 pts`: Studio Budget $30K+
* `+20 pts`: Studio Budget $15K–$30K
* `+20 pts`: Ready within 60 days
* `+20 pts`: Distribution audience 10M+
* `+20 pts`: Strategic distribution or co-production fit
* `+15 pts`: Script, brief, or rights already prepared
* `+15 pts`: Executive decision-maker role
* `+15 pts`: Verified corporate domain email & company
* `+10 pts`: Detailed project message (>60 characters)

### Qualification Categories:
* **0–24 pts (`nurture`)**: Automated nurture track, educational blueprints, and content updates.
* **25–49 pts (`qualified`)**: Standard queue review and discovery call dispatch.
* **50+ pts (`priority`)**: Immediate executive creative director routing and priority proposal queue.

### Active GHL Tags:
`MYTHRA_YOU`, `MYTHRA_YOU_TRAILER`, `MYTHRA_YOU_BESPOKE`, `MYTHRA_FILMMAKER`, `MYTHRA_FILMMAKER_BEGINNER`, `MYTHRA_FILMMAKER_COHORT`, `MYTHRA_FILMMAKER_ACCELERATOR`, `MYTHRA_STUDIOS`, `MYTHRA_STUDIOS_BRAND`, `MYTHRA_STUDIOS_IP`, `MYTHRA_STUDIOS_MEDIA`, `MYTHRA_STUDIOS_FINANCE`, `MYTHRA_PRIORITY`, `MYTHRA_QUALIFIED`, `MYTHRA_NURTURE`.

---

## 🔒 Security & Biometric Likeness Protections

1. **Explicit Multi-Step Consent**: Separate signatures for likeness generation and voice cloning.
2. **Private Storage Architecture**: Raw biometric reference files are stored exclusively in private encrypted buckets with short-lived signed URLs (15-minute expiry). Raw files are never exposed in public buckets, URLs, logs, or analytics.
3. **Zero Model Training by Default**: Public AI model training on customer uploads is strictly disabled by default.
4. **Automated Purging**: Customers choose automated purging after 30 days or immediate post-delivery deletion.

---

## 🚀 Development & Build Commands

```bash
# Type check all TypeScript files
npx tsc --noEmit

# Run Next.js / Vinext build
node scripts/run-framework.mjs build

# Start local dev server
node scripts/run-framework.mjs dev
```

---

## 🧪 Admin Simulator & Debugger

Navigate to `/admin/funnel-test` to:
* Test lead scoring algorithms across custom answer payloads.
* Inspect generated GHL tags, qualification categories, and recommended tiers.
* Preview outbound CRM JSON payloads.
* Trigger live mock or real API dispatches.
