# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DeepBio Scientific company website — an AI-powered drug discovery platform. Built as a Vue 3 SPA with SSR prerendering for SEO, deployed to GitHub Pages at `deepbioscientific.com`.

## Commands

```bash
npm run dev          # Dev server with hot reload
npm run build        # Full production build (client + SSR + prerender)
npm run preview      # Preview production build locally
npm run test:unit    # Run unit tests (Vitest, jsdom)
npm run type-check   # TypeScript validation (vue-tsc)
npm run lint         # ESLint with auto-fix
npm run format       # Prettier formatting (src/ only)
```

## Tech Stack

- **Vue 3.5** with Composition API (`<script setup>` + TypeScript)
- **Vite 7** build tool
- **TailwindCSS 3** with dark mode (`class` strategy, toggled via `useTheme` composable)
- **Vue Router 4** with history mode
- **GSAP** for animations (mRNA helix canvas, floating molecules)
- **3DMol** for molecular visualization
- **@unhead/vue** for per-page SEO meta tags

## Architecture

### Build Pipeline (SSR Prerendering)

The `npm run build` command runs three stages:
1. **Client build** — Vite bundles into `dist/`
2. **SSR build** — Separate Vite build into `dist-ssr/`
3. **Prerender** — `scripts/prerender.js` renders each route to static HTML with injected meta tags, then `dist-ssr/` is deleted

This produces fully static HTML files (one per route) that hydrate into a Vue SPA on load. The prerender script reads `src/composables/usePageSeo.ts` data to inject route-specific `<title>` and `<meta>` tags into each HTML file.

### Key Composables

- **`usePageSeo(config)`** — Sets page-specific meta/OG/Twitter tags via `@unhead/vue`. Used in every page component.
- **`useTheme()`** — Dark/light mode state with localStorage persistence. Returns reactive `isDark` and `canvasColors` for the canvas visualization.

### App.vue (~1,765 lines)

The root component contains the full site layout: navigation, mobile menu, footer, **and** the interactive mRNA helix canvas visualization with GSAP-driven floating molecules. This is intentionally a single large component.

### Routing

Routes defined in `src/router/routes.ts`. Active pages: `/`, `/technology`, `/research`, `/case-studies`, `/about`, `/contact`. Blog and Careers routes exist but are commented out. Catch-all redirects to `/`.

GA4 page views are tracked via a router `afterEach` hook in `src/router/index.ts`.

### Deployment & Branching

- **`main`** — production branch, auto-deploys to `deepbioscientific.com` via GitHub Actions (`.github/workflows/deploy.yml`)
- **`dev`** — staging/integration branch, auto-deploys preview to Netlify (configured via `netlify.toml`)
- **Feature branches** — branch off `dev`, PR back into `dev`, preview via Netlify deploy previews

Workflow: `feature/xyz` → PR to `dev` (preview on Netlify) → PR to `main` (deploys to production).

The `VITE_GA_MEASUREMENT_ID` env var is set from GitHub repository variables in the production workflow.

## Code Style

- No semicolons, single quotes, 100-char print width (Prettier config in `.prettierrc.json`)
- 2-space indentation
- Path alias: `@/` maps to `src/`
- TailwindCSS utility classes for all styling; custom theme colors (primary/cyan, accent/purple) defined in `tailwind.config.js`
