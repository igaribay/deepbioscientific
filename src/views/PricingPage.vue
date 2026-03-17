<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo({
  title: 'Get Started — DeepBio Scientific',
  description: 'Two ways to work with DeepBio Scientific — start free on the Helixir AI platform for researchers, or partner with us for custom pharma programs.',
  path: '/pricing',
})

onMounted(() => {
  gsap.fromTo('.pricing-hero-title',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
  )
  gsap.fromTo('.pricing-hero-sub',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
  )
  gsap.fromTo('.pricing-column',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.2, delay: 0.3 }
  )
})
</script>

<template>
  <div class="min-h-screen pt-24 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-cyan-500/15 dark:bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/15 dark:bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
    </div>

    <!-- Hero -->
    <section class="relative z-10 px-6 py-16 lg:py-24">
      <div class="mx-auto max-w-4xl text-center">
        <h1 class="pricing-hero-title mb-6 text-4xl font-bold text-[rgb(var(--text-heading))] md:text-5xl lg:text-6xl leading-tight">
          Two Ways to
          <span class="block mt-2 bg-gradient-to-r from-cyan-600 dark:from-cyan-400 via-teal-600 dark:via-teal-400 to-purple-600 dark:to-purple-400 bg-clip-text text-transparent">Get Started</span>
        </h1>
        <p class="pricing-hero-sub mx-auto max-w-2xl text-lg text-[rgb(var(--text-body))] leading-relaxed md:text-xl">
          Self-service AI for researchers, or custom partnerships for pharma programs.
        </p>
      </div>
    </section>

    <!-- Two Options -->
    <section class="relative z-10 px-6 pb-20">
      <div class="mx-auto max-w-5xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

          <!-- Researchers -->
          <div class="pricing-column rounded-3xl border border-cyan-600/40 dark:border-cyan-500/30 bg-[rgb(var(--bg-card))/0.8] p-10 relative overflow-hidden">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500"></div>
            <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15">
              <svg class="w-7 h-7 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-[rgb(var(--text-heading))] mb-2">Researchers</h2>
            <p class="text-[rgb(var(--text-body))] mb-8">Start free on Helixir AI. Design and optimize mRNA sequences with the Equi-mRNA foundation model.</p>

            <ul class="space-y-3 text-sm mb-10">
              <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                <svg class="h-5 w-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Self-serve access
              </li>
              <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                <svg class="h-5 w-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Codon optimization & stability prediction
              </li>
              <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                <svg class="h-5 w-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                No credit card required
              </li>
            </ul>

            <RouterLink
              to="/contact"
              class="block w-full rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 py-3.5 text-center font-semibold text-white transition-all duration-200 hover:from-cyan-600 hover:to-teal-600 active:scale-[0.98] shadow-lg shadow-cyan-500/20"
            >
              Start Free on Helixir AI
            </RouterLink>
          </div>

          <!-- Pharma -->
          <div class="pricing-column rounded-3xl border border-purple-600/40 dark:border-purple-500/30 bg-[rgb(var(--bg-card))/0.8] p-10 relative overflow-hidden">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500"></div>
            <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/15">
              <svg class="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-[rgb(var(--text-heading))] mb-2">Pharma & Biotech</h2>
            <p class="text-[rgb(var(--text-body))] mb-8">Let's design your mRNA program. Custom partnerships with dedicated support and milestone-based pricing.</p>

            <ul class="space-y-3 text-sm mb-10">
              <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                <svg class="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Custom mRNA design programs
              </li>
              <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                <svg class="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Dedicated support team
              </li>
              <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                <svg class="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Per-program + milestone pricing
              </li>
            </ul>

            <RouterLink
              to="/contact"
              class="block w-full rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 py-3.5 text-center font-semibold text-white transition-all duration-200 hover:from-purple-600 hover:to-violet-600 active:scale-[0.98] shadow-lg shadow-purple-500/20"
            >
              Schedule a Call
            </RouterLink>
          </div>

        </div>
      </div>
    </section>

    <!-- Bottom Note -->
    <section class="relative z-10 px-6 pb-24">
      <div class="mx-auto max-w-3xl">
        <div class="rounded-xl bg-[rgb(var(--bg-card-muted))/0.5] border border-[rgb(var(--border-muted))/0.5] p-8 text-center">
          <h3 class="text-lg font-bold text-[rgb(var(--text-heading))] mb-2">Not sure which path is right?</h3>
          <p class="text-sm text-[rgb(var(--text-body))] mb-5">
            Our team can help you determine the best way to work together based on your goals, team size, and timeline.
          </p>
          <RouterLink
            to="/contact"
            class="inline-flex items-center gap-2 text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:text-cyan-300 transition-colors"
          >
            Talk to our team
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
