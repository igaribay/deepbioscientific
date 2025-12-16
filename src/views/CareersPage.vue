<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'

const openPositions = [
  {
    title: 'Senior Machine Learning Engineer',
    department: 'AI Platform',
    location: 'San Francisco / Remote',
    type: 'Full-time',
  },
  {
    title: 'Computational Biologist',
    department: 'Research',
    location: 'Boston / Remote',
    type: 'Full-time',
  },
  {
    title: 'Protein Design Scientist',
    department: 'Therapeutics',
    location: 'San Francisco',
    type: 'Full-time',
  },
  {
    title: 'Full Stack Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'mRNA Platform Lead',
    department: 'Research',
    location: 'Boston',
    type: 'Full-time',
  },
]

const benefits = [
  { title: 'Competitive Equity', description: 'Meaningful ownership in our mission', icon: 'chart' },
  { title: 'Health & Wellness', description: 'Comprehensive medical, dental, vision', icon: 'heart' },
  { title: 'Flexible Work', description: 'Remote-first with optional office space', icon: 'home' },
  { title: 'Learning Budget', description: '$5,000/year for conferences & courses', icon: 'book' },
  { title: 'Unlimited PTO', description: 'Take the time you need to recharge', icon: 'sun' },
  { title: 'Parental Leave', description: '16 weeks fully paid for all parents', icon: 'users' },
]

onMounted(() => {
  const cards = document.querySelectorAll('.career-card')
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
        <span class="mb-4 inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-sm font-medium text-green-300">
          Careers
        </span>
        <h1 class="mb-6 text-5xl font-bold text-white md:text-6xl">
          Join Our <span class="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Mission</span>
        </h1>
        <p class="max-w-3xl text-xl text-slate-400">
          Help us design the next generation of therapeutic molecules. We're building a team of exceptional scientists, engineers, and operators.
        </p>
      </div>
    </section>

    <!-- Values -->
    <section class="px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-12 text-3xl font-bold text-white">Why Sequentia</h2>
        <div class="grid gap-6 md:grid-cols-3">
          <div class="career-card rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <div class="mb-4 text-4xl">🧬</div>
            <h3 class="mb-3 text-xl font-bold text-white">Impact at Scale</h3>
            <p class="text-slate-400">Design therapeutics that could help millions of patients with unmet medical needs.</p>
          </div>
          <div class="career-card rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <div class="mb-4 text-4xl">🚀</div>
            <h3 class="mb-3 text-xl font-bold text-white">Cutting-Edge Tech</h3>
            <p class="text-slate-400">Work with the latest in AI, protein language models, and computational biology.</p>
          </div>
          <div class="career-card rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <div class="mb-4 text-4xl">🤝</div>
            <h3 class="mb-3 text-xl font-bold text-white">World-Class Team</h3>
            <p class="text-slate-400">Collaborate with experts from top research institutions and tech companies.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="bg-gradient-to-b from-[#020617] via-slate-900/30 to-[#020617] px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-12 text-3xl font-bold text-white">Benefits & Perks</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="benefit in benefits" 
            :key="benefit.title"
            class="career-card flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6"
          >
            <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 ring-1 ring-cyan-500/30">
              <svg class="h-6 w-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-white">{{ benefit.title }}</h3>
              <p class="text-sm text-slate-400">{{ benefit.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Open Positions -->
    <section class="px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-12 text-3xl font-bold text-white">Open Positions</h2>
        <div class="space-y-4">
          <div 
            v-for="position in openPositions" 
            :key="position.title"
            class="career-card group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
          >
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 class="text-lg font-bold text-white group-hover:text-cyan-400">{{ position.title }}</h3>
                <div class="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                  <span>{{ position.department }}</span>
                  <span>•</span>
                  <span>{{ position.location }}</span>
                  <span>•</span>
                  <span>{{ position.type }}</span>
                </div>
              </div>
              <button class="rounded-full bg-slate-800 px-6 py-2 text-sm font-medium text-white transition-all group-hover:bg-cyan-500">
                Apply
              </button>
            </div>
          </div>
        </div>

        <div class="mt-12 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
          <h3 class="mb-4 text-xl font-bold text-white">Don't see a role that fits?</h3>
          <p class="mb-6 text-slate-400">We're always looking for exceptional talent. Send us your resume and tell us how you'd contribute.</p>
          <a href="mailto:careers@sequentia.bio" class="text-cyan-400 hover:text-cyan-300">careers@sequentia.bio</a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.career-card {
  opacity: 1;
}
</style>

