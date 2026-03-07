<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo({
  title: 'Helixir AI Platform — Self-Service Drug Discovery',
  description: 'Helixir AI — Your AI Co-Scientist, On Demand. The self-service platform for researchers and biotech teams to design, predict, and optimize therapeutics.',
  path: '/platform',
})

const capabilities = [
  {
    title: 'mRNA Design',
    description: 'Design optimized mRNA sequences with AI-guided codon optimization, stability prediction, and immunogenicity scoring.',
    status: 'live',
    color: 'cyan',
  },
  {
    title: 'Toxicity Prediction',
    description: 'Predict off-target effects and toxicity profiles before synthesis — reducing costly late-stage failures.',
    status: 'coming-soon',
    color: 'teal',
  },
  {
    title: 'Clinical Protocol',
    description: 'Generate trial protocols, eligibility criteria, and enrollment simulations grounded in real-world evidence.',
    status: 'coming-soon',
    color: 'emerald',
  },
]

const tiers = [
  {
    name: 'Free',
    audience: 'Students & Academics',
    price: 'Free',
    period: '3 months',
    highlight: false,
  },
  {
    name: 'Pro',
    audience: 'Researchers & Startups',
    price: '$1,000',
    period: '/mo',
    highlight: true,
  },
  {
    name: 'Enterprise',
    audience: 'Biotech Teams',
    price: 'Custom',
    period: '',
    highlight: false,
  },
]

onMounted(() => {
  gsap.fromTo('.platform-hero-badge',
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
  )
  gsap.fromTo('.platform-hero-title',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.15 }
  )
  gsap.fromTo('.platform-hero-sub',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.35 }
  )
  gsap.fromTo('.platform-hero-cta',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 }
  )

  gsap.fromTo('.capability-card',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.15, delay: 0.3 }
  )

  gsap.fromTo('.tier-card',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12, delay: 0.2 }
  )
})
</script>

<template>
  <div class="min-h-screen pt-24 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-1/3 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-2/3 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 2s"></div>
      <div class="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
    </div>

    <!-- ===== 01 HERO ===== -->
    <section class="relative z-10 px-6 py-16 lg:py-24">
      <div class="mx-auto max-w-4xl text-center">
        <div class="platform-hero-badge mb-6 inline-flex items-center gap-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 backdrop-blur-sm">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
          </span>
          <span class="text-sm font-medium text-cyan-400">Now Available</span>
        </div>

        <h1 class="platform-hero-title mb-6 text-4xl font-bold text-[rgb(var(--text-heading))] md:text-5xl lg:text-6xl leading-tight">
          Helixir AI —
          <span class="block mt-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Your AI Co-Scientist, On Demand</span>
        </h1>

        <p class="platform-hero-sub mx-auto max-w-2xl text-lg text-[rgb(var(--text-body))] leading-relaxed md:text-xl mb-10">
          The self-service platform for researchers and biotech teams to
          <span class="text-[rgb(var(--text-heading))] font-medium">design, predict, and optimize</span>
          therapeutics. Start free in minutes.
        </p>

        <div class="platform-hero-cta flex flex-wrap justify-center gap-4">
          <RouterLink
            to="/contact"
            class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-7 py-3.5 font-semibold text-white transition-all duration-200 hover:from-cyan-600 hover:to-teal-600 active:scale-95 shadow-lg shadow-cyan-500/25"
          >
            Start Free Trial
          </RouterLink>
          <RouterLink
            to="/contact"
            class="inline-flex items-center gap-2 rounded-lg border border-[rgb(var(--border-subtle))] px-7 py-3.5 font-semibold text-[rgb(var(--text-heading))] transition-all duration-200 hover:border-cyan-500/50 hover:bg-cyan-500/5 active:scale-95"
          >
            Demo
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ===== 02 WHAT IT DOES ===== -->
    <section class="capabilities-section relative z-10 px-6 py-20 border-t border-[rgb(var(--border-subtle))/0.5]">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-14">
          <span class="mb-4 inline-block rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-400">
            Core Capabilities
          </span>
          <h2 class="text-3xl font-bold text-[rgb(var(--text-heading))] md:text-4xl">
            What Helixir <span class="text-teal-400">Does</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- mRNA Design -->
          <div class="capability-card group rounded-2xl border border-cyan-500/20 bg-[rgb(var(--bg-card))/0.8] p-8 relative overflow-hidden transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-cyan-400"></div>

            <div class="flex items-center justify-between mb-5">
              <div class="h-12 w-12 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Live
              </span>
            </div>

            <h3 class="text-xl font-bold text-[rgb(var(--text-heading))] mb-3">{{ capabilities[0].title }}</h3>
            <p class="text-sm text-[rgb(var(--text-body))] leading-relaxed">{{ capabilities[0].description }}</p>
          </div>

          <!-- Toxicity Prediction -->
          <div class="capability-card group rounded-2xl border border-teal-500/20 bg-[rgb(var(--bg-card))/0.8] p-8 relative overflow-hidden transition-all duration-300 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/5">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-teal-400"></div>

            <div class="flex items-center justify-between mb-5">
              <div class="h-12 w-12 rounded-xl bg-teal-500/15 flex items-center justify-center">
                <svg class="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400">
                <span class="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Coming Soon
              </span>
            </div>

            <h3 class="text-xl font-bold text-[rgb(var(--text-heading))] mb-3">{{ capabilities[1].title }}</h3>
            <p class="text-sm text-[rgb(var(--text-body))] leading-relaxed">{{ capabilities[1].description }}</p>
          </div>

          <!-- Clinical Protocol -->
          <div class="capability-card group rounded-2xl border border-emerald-500/20 bg-[rgb(var(--bg-card))/0.8] p-8 relative overflow-hidden transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400"></div>

            <div class="flex items-center justify-between mb-5">
              <div class="h-12 w-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              </div>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400">
                <span class="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                Coming Soon
              </span>
            </div>

            <h3 class="text-xl font-bold text-[rgb(var(--text-heading))] mb-3">{{ capabilities[2].title }}</h3>
            <p class="text-sm text-[rgb(var(--text-body))] leading-relaxed">{{ capabilities[2].description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 03 PRICING TIERS ===== -->
    <section class="tiers-section relative z-10 px-6 py-20 bg-gradient-to-b from-transparent via-[rgb(var(--bg-card))/0.3] to-transparent">
      <div class="mx-auto max-w-5xl">
        <div class="text-center mb-12">
          <span class="mb-4 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
            Simple Pricing
          </span>
          <h2 class="text-3xl font-bold text-[rgb(var(--text-heading))] md:text-4xl mb-3">
            Start Building <span class="text-emerald-400">Today</span>
          </h2>
          <p class="text-[rgb(var(--text-body))]">Choose the plan that fits your research.</p>
        </div>

        <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-5"> -->
          <!-- <div
            v-for="tier in tiers"
            :key="tier.name"
            class="tier-card rounded-2xl border p-7 relative transition-all duration-300 hover:shadow-lg"
            :class="[
              tier.highlight
                ? 'border-cyan-500/50 bg-[rgb(var(--bg-card))] shadow-md shadow-cyan-500/10'
                : 'border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card))/0.6]'
            ]"
          >
            <div
              v-if="tier.highlight"
              class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-1 text-xs font-bold text-white"
            >
              Most Popular
            </div>

            <h3 class="text-xl font-bold text-[rgb(var(--text-heading))] mb-1">{{ tier.name }}</h3>
            <p class="text-sm text-[rgb(var(--text-muted))] mb-5">{{ tier.audience }}</p>

            <div class="mb-6">
              <span class="text-3xl font-bold" :class="tier.highlight ? 'text-cyan-400' : 'text-[rgb(var(--text-heading))]'">{{ tier.price }}</span>
              <span v-if="tier.period" class="text-sm text-[rgb(var(--text-muted))]"> {{ tier.period }}</span>
            </div>

            <RouterLink
              to="/contact"
              class="block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-all duration-200 active:scale-95"
              :class="[
                tier.highlight
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/20 hover:from-cyan-600 hover:to-teal-600'
                  : 'border border-[rgb(var(--border-subtle))] text-[rgb(var(--text-heading))] hover:border-cyan-500/50 hover:bg-cyan-500/5'
              ]"
            >
              {{ tier.price === 'Custom' ? 'Contact Us' : 'Get Started' }}
            </RouterLink>
          </div>
        </div> -->

        <div class="text-center mt-8">
          <RouterLink
            to="/pricing"
            class="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View full pricing details
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ===== 04 BOTTOM CTA ===== -->
    <section class="relative z-10 px-6 py-20">
      <div class="mx-auto max-w-4xl">
        <div class="rounded-2xl bg-gradient-to-r from-teal-600/90 to-emerald-500/90 p-10 lg:p-14 text-center relative overflow-hidden">
          <!-- Decorative dots -->
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.05)_1px,transparent_1px),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

          <div class="relative z-10">
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
              For Pharma & Biotech Programs
            </h2>
            <p class="text-teal-100 mb-8 max-w-xl mx-auto">
              Custom molecule design, dedicated support, and milestone-based partnerships for enterprise drug discovery programs.
            </p>
            <RouterLink
              to="/pricing#partnerships"
              class="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 font-semibold text-teal-700 transition-all duration-200 hover:bg-teal-50 active:scale-95 shadow-lg"
            >
              Explore Partnerships
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
