<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import gsap from 'gsap'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo({
  title: 'Plans & Partnerships — DeepBio Scientific Pricing',
  description: 'Two ways to work with DeepBio Scientific — self-service Helixir AI platform for researchers, and custom partnerships for pharma & biotech programs.',
  path: '/pricing',
})

const selfServiceTiers = [
  {
    name: 'Free',
    audience: 'Students & Academics',
    price: 'Free',
    period: '3 months',
    details: 'Core workflows, limited runs',
    highlight: false,
  },
  {
    name: 'Pro',
    audience: 'Researchers & Startups',
    price: '$1,000',
    period: '/mo',
    details: 'Full access, priority support',
    highlight: true,
  },
  {
    name: 'Enterprise',
    audience: 'Biotech Teams',
    price: 'Custom',
    period: '',
    details: 'Volume pricing + SLA + API',
    highlight: false,
  },
]

const partnershipTiers = [
  {
    name: 'Design Program',
    audience: 'Pharma / Biotech',
    price: 'Custom',
    details: 'AI-driven molecule design per program',
    highlight: false,
  },
  {
    name: 'Platform License',
    audience: 'Enterprise Pharma',
    price: 'Custom',
    details: 'Unlimited queries + dedicated support',
    highlight: true,
  },
  {
    name: '+ Milestone / Royalty',
    audience: 'Strategic partners',
    price: '% of deal',
    details: 'IND filing \u00b7 phase bonuses \u00b7 royalty',
    highlight: false,
  },
]

const route = useRoute()

onMounted(async () => {
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

  // Handle #partnerships hash scroll
  await nextTick()
  if (route.hash === '#partnerships') {
    const el = document.getElementById('partnerships')
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 600)
    }
  }
})
</script>

<template>
  <div class="min-h-screen pt-24 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
    </div>

    <!-- ===== HERO ===== -->
    <section class="relative z-10 px-6 py-16 lg:py-24">
      <div class="mx-auto max-w-4xl text-center">
        <h1 class="pricing-hero-title mb-6 text-4xl font-bold text-[rgb(var(--text-heading))] md:text-5xl lg:text-6xl leading-tight">
          Two Ways to Work With
          <span class="block mt-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-purple-400 bg-clip-text text-transparent">DeepBio Scientific</span>
        </h1>
        <p class="pricing-hero-sub mx-auto max-w-2xl text-lg text-[rgb(var(--text-body))] leading-relaxed md:text-xl">
          Self-service AI for researchers, or custom partnerships for pharma programs.
        </p>
      </div>
    </section>

    <!-- ===== TWO-COLUMN PRICING ===== -->
    <section class="relative z-10 px-6 pb-20">
      <div class="mx-auto max-w-6xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <!-- LEFT: Self-Service Platform -->
          <div class="pricing-column">
            <div class="rounded-2xl border border-cyan-500/30 bg-[rgb(var(--bg-card))/0.6] overflow-hidden">
              <!-- Column Header -->
              <div class="bg-gradient-to-r from-cyan-600/90 to-teal-500/90 px-8 py-5">
                <div class="flex items-center gap-3">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                  <div>
                    <h2 class="text-xl font-bold text-white">Helixir AI Platform</h2>
                    <p class="text-cyan-100 text-sm">Self-Service</p>
                  </div>
                </div>
              </div>

              <!-- Tier Cards -->
              <div class="p-6 space-y-4">
                <div
                  v-for="tier in selfServiceTiers"
                  :key="tier.name"
                  class="rounded-xl border p-5 transition-all duration-300 hover:shadow-md"
                  :class="[
                    tier.highlight
                      ? 'border-cyan-500/40 bg-cyan-500/5'
                      : 'border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card))/0.4]'
                  ]"
                >
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-lg font-bold" :class="tier.highlight ? 'text-cyan-400' : 'text-[rgb(var(--text-heading))]'">{{ tier.name }}</h3>
                      <p class="text-sm text-[rgb(var(--text-muted))]">{{ tier.audience }}</p>
                      <p class="text-xs text-[rgb(var(--text-muted))] mt-1 italic">{{ tier.details }}</p>
                    </div>
                    <div class="text-right shrink-0 ml-4">
                      <span class="text-2xl font-bold" :class="tier.highlight ? 'text-cyan-400' : 'text-[rgb(var(--text-heading))]'">{{ tier.price }}</span>
                      <span v-if="tier.period" class="block text-xs text-[rgb(var(--text-muted))]">{{ tier.period }}</span>
                    </div>
                  </div>
                </div>

                <!-- CTA -->
                <RouterLink
                  to="/contact"
                  class="mt-4 flex items-center justify-center gap-2 w-full rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 py-3 font-semibold text-white transition-all duration-200 hover:from-cyan-600 hover:to-teal-600 active:scale-[0.98] shadow-lg shadow-cyan-500/20"
                >
                  Start Free Trial
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- RIGHT: Pharma & Biotech Partnerships -->
          <div id="partnerships" class="pricing-column">
            <div class="rounded-2xl border border-purple-500/30 bg-[rgb(var(--bg-card))/0.6] overflow-hidden">
              <!-- Column Header -->
              <div class="bg-gradient-to-r from-purple-600/90 to-violet-500/90 px-8 py-5">
                <div class="flex items-center gap-3">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  <div>
                    <h2 class="text-xl font-bold text-white">Pharma & Biotech Partnerships</h2>
                    <p class="text-purple-100 text-sm">Custom Engagements</p>
                  </div>
                </div>
              </div>

              <!-- Tier Cards -->
              <div class="p-6 space-y-4">
                <div
                  v-for="tier in partnershipTiers"
                  :key="tier.name"
                  class="rounded-xl border p-5 transition-all duration-300 hover:shadow-md"
                  :class="[
                    tier.highlight
                      ? 'border-purple-500/40 bg-purple-500/5'
                      : 'border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card))/0.4]'
                  ]"
                >
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="text-lg font-bold" :class="tier.highlight ? 'text-purple-400' : 'text-[rgb(var(--text-heading))]'">{{ tier.name }}</h3>
                      <p class="text-sm text-[rgb(var(--text-muted))]">{{ tier.audience }}</p>
                      <p class="text-xs text-[rgb(var(--text-muted))] mt-1 italic">{{ tier.details }}</p>
                    </div>
                    <div class="text-right shrink-0 ml-4">
                      <span class="text-2xl font-bold" :class="tier.highlight ? 'text-purple-400' : 'text-[rgb(var(--text-heading))]'">{{ tier.price }}</span>
                    </div>
                  </div>
                </div>

                <!-- CTA -->
                <RouterLink
                  to="/contact"
                  class="mt-4 flex items-center justify-center gap-2 w-full rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 py-3 font-semibold text-white transition-all duration-200 hover:from-purple-600 hover:to-violet-600 active:scale-[0.98] shadow-lg shadow-purple-500/20"
                >
                  Schedule Partnership Call
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </RouterLink>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ===== FAQ / BOTTOM NOTE ===== -->
    <section class="relative z-10 px-6 pb-24">
      <div class="mx-auto max-w-3xl">
        <div class="rounded-xl bg-[rgb(var(--bg-card-muted))/0.5] border border-[rgb(var(--border-muted))/0.5] p-8 text-center">
          <h3 class="text-lg font-bold text-[rgb(var(--text-heading))] mb-2">Not sure which path is right?</h3>
          <p class="text-sm text-[rgb(var(--text-body))] mb-5">
            Our team can help you determine the best way to work together based on your goals, team size, and timeline.
          </p>
          <RouterLink
            to="/contact"
            class="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Talk to our team
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
