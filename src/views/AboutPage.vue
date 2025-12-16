<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'

const team = [
  { name: 'Dr. Sarah Chen', role: 'CEO & Co-Founder', bio: 'Former ML lead at DeepMind, PhD in Computational Biology from MIT' },
  { name: 'Dr. Michael Park', role: 'CSO & Co-Founder', bio: 'Former Principal Scientist at Moderna, PhD in Biochemistry from Stanford' },
  { name: 'Dr. Emily Williams', role: 'VP of Research', bio: 'Former Associate Professor at Harvard Medical School' },
  { name: 'James Liu', role: 'VP of Engineering', bio: 'Former Senior Staff Engineer at Google Brain' },
]

const milestones = [
  { year: '2023', event: 'Founded by scientists from MIT, Stanford, and industry leaders' },
  { year: '2024', event: 'Raised $50M Series A led by top biotech investors' },
  { year: '2024', event: 'First partnership with major pharmaceutical company' },
  { year: '2025', event: 'Platform validated with 3 programs entering preclinical' },
]

onMounted(() => {
  const cards = document.querySelectorAll('.about-card')
  if (cards.length > 0) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out', delay: 0.2 }
    )
  }
})
</script>

<template>
  <div class="min-h-screen pt-24">
    <!-- Hero -->
    <section class="px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <span class="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-300">
          About Us
        </span>
        <h1 class="mb-6 text-5xl font-bold text-white md:text-6xl">
          Our <span class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Mission</span>
        </h1>
        <p class="max-w-3xl text-xl text-slate-400">
          We believe every patient deserves access to precisely designed therapeutics. We're building the AI platform to make that possible.
        </p>
      </div>
    </section>

    <!-- Vision -->
    <section class="px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <div class="grid gap-12 md:grid-cols-2">
          <div class="about-card">
            <h2 class="mb-6 text-3xl font-bold text-white">The Challenge</h2>
            <p class="mb-4 text-lg text-slate-400">
              Traditional therapeutic design is slow, expensive, and limited by human intuition. It takes years and billions of dollars to bring a single drug to market.
            </p>
            <p class="text-lg text-slate-400">
              Most potential therapeutics never make it past early development due to unforeseen issues with efficacy, safety, or manufacturing.
            </p>
          </div>
          <div class="about-card">
            <h2 class="mb-6 text-3xl font-bold text-white">Our Approach</h2>
            <p class="mb-4 text-lg text-slate-400">
              We combine evolutionary algorithms, protein language models, and multi-agent AI systems to explore therapeutic sequence space at unprecedented scale.
            </p>
            <p class="text-lg text-slate-400">
              Our platform optimizes for multiple objectives simultaneously—potency, safety, stability, and manufacturability—to deliver better candidates faster.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="bg-gradient-to-b from-[#020617] via-slate-900/30 to-[#020617] px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-12 text-3xl font-bold text-white">Leadership Team</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div 
            v-for="member in team" 
            :key="member.name"
            class="about-card rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center"
          >
            <div class="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20"></div>
            <h3 class="text-lg font-bold text-white">{{ member.name }}</h3>
            <p class="mb-3 text-sm text-cyan-400">{{ member.role }}</p>
            <p class="text-sm text-slate-400">{{ member.bio }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="px-6 py-20">
      <div class="mx-auto max-w-4xl">
        <h2 class="mb-12 text-center text-3xl font-bold text-white">Our Journey</h2>
        <div class="space-y-8">
          <div 
            v-for="(milestone, index) in milestones" 
            :key="index"
            class="about-card flex gap-6"
          >
            <div class="flex flex-col items-center">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 text-sm font-bold text-white">
                {{ milestone.year }}
              </div>
              <div v-if="index < milestones.length - 1" class="mt-2 h-full w-0.5 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
            </div>
            <div class="flex-1 pt-2">
              <p class="text-lg text-slate-300">{{ milestone.event }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Investors -->
    <section class="bg-gradient-to-b from-[#020617] via-slate-900/30 to-[#020617] px-6 py-20">
      <div class="mx-auto max-w-6xl text-center">
        <h2 class="mb-6 text-3xl font-bold text-white">Backed by Leading Investors</h2>
        <p class="mb-12 text-lg text-slate-400">We're supported by top-tier biotech and technology investors who share our vision.</p>
        <div class="flex flex-wrap justify-center gap-8">
          <div class="about-card flex h-20 w-40 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 text-slate-500">
            Investor 1
          </div>
          <div class="about-card flex h-20 w-40 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 text-slate-500">
            Investor 2
          </div>
          <div class="about-card flex h-20 w-40 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 text-slate-500">
            Investor 3
          </div>
          <div class="about-card flex h-20 w-40 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 text-slate-500">
            Investor 4
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-card {
  opacity: 1;
}
</style>

