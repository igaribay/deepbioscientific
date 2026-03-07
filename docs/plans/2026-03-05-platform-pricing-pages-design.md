# Platform & Pricing Pages Design

## /platform — Helixir AI Platform

Product-focused overview replacing the current external demo link in nav.

### Sections

01 HERO
- Headline: Helixir AI — Your AI Co-Scientist, On Demand
- Sub: The self-service platform for researchers and biotech teams to design, predict, and optimize therapeutics. Start free in minutes.
- CTAs: Start Free Trial and Demo — both link to /contact for now

02 WHAT IT DOES
- 3-column icon grid: mRNA Design (Live), Toxicity Prediction (Coming Soon), Clinical Protocol (Coming Soon)

03 PRICING TIERS
- Free | Pro ($1,000/mo) | Enterprise (Custom) — link to /pricing

04 BOTTOM CTA
- For pharma & biotech programs — routes to /pricing#partnerships or /contact

Nav: Replace external Platform link with internal /platform route.

## /pricing — Plans & Partnerships

Hero: Two Ways to Work With DeepBio Scientific

Left column - Helixir AI Platform (Self-Service):
- Free: Students & Academics, 3 months, Core workflows
- Pro: Researchers & Startups, $1,000/mo, Full access
- Enterprise: Biotech Teams, Custom, Volume + SLA + API

Right column - Pharma & Biotech Partnerships:
- Design Program: Custom, AI-driven molecule design
- Platform License: Custom, Unlimited queries + dedicated support
- Milestone / Royalty: % of deal, IND filing bonuses

No dollar amounts on partnerships side.

## Implementation
- PlatformPage.vue and PricingPage.vue in src/views/
- usePageSeo(), GSAP animations, CSS variable theming
- Add routes, update nav, add to SSR prerender
