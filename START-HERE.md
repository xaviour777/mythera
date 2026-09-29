# MYTHRA — Complete Project Export

This is the latest project source, including the collaboration navigation fixes.

## Included
- Cinematic homepage, Genesis case study, and interactive Method page
- Five branching collaboration funnels and personalized recommendation pages
- Lead scoring, CRM tags, local test dashboard, and saved draft recovery
- Full CSS, UI components, original fantasy artwork, and favicon
- Dependency lockfile and build configuration

## Run locally
Install Node.js 22.13 or newer and pnpm 11.25.0, then open a terminal in this folder:

    pnpm install --frozen-lockfile
    pnpm dev

Open the local URL printed in the terminal. To build:

    pnpm build

The default scripts (`dev`, `build`, `start`) use plain Next.js, which is what
Vercel runs. The original Cloudflare Workers / Vinext pipeline is still
available as `dev:cf`, `build:cf`, `start:cf` and `deploy:cf`.

This project uses Vinext, React, TypeScript, Tailwind, shadcn/ui, and Framer Motion.
It targets Cloudflare Workers / ChatGPT Sites. It is not a plain HTML export or
an unmodified Next.js/Vercel project. Deployment to another provider requires
configuring a compatible build/runtime.

## Important files
- components/mythra.tsx: pages, interactions, and discovery UI
- lib/mythra.ts: questions, metrics, recommendations, scoring, and CRM tags
- lib/discovery-storage.ts: draft validation and recovery
- app/globals.css: complete visual styling and responsive layouts
- public/mythra-world.png: original homepage artwork
- app/: page routes

## Current prototype limits
Lead capture and final interest actions save in the visitor's browser only.
No CRM delivery, email sending, scheduling, or backend database is connected.
The supplied audience metrics are marked unverified. Add analytics evidence
and the official film URL before a public commercial launch.

## GitHub
Create a repository in your preferred GitHub account, then upload this folder's
contents, including hidden configuration files. The GitHub account may use a
different email from ChatGPT. No Git history, credentials, installed dependencies,
local test leads, or temporary build caches are included.

.openai/hosting.json retains the original Sites project identity for continuity.
It is not a secret and does not grant access to the Site.
