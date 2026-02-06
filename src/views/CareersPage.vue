<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const openPositions = [
  {
    title: 'Senior Machine Learning Engineer',
    department: 'AI Platform',
    location: 'San Francisco / Remote',
    type: 'Full-time',
    color: 'cyan',
  },
  {
    title: 'Computational Biologist',
    department: 'Research',
    location: 'Boston / Remote',
    type: 'Full-time',
    color: 'purple',
  },
  {
    title: 'Protein Design Scientist',
    department: 'Therapeutics',
    location: 'San Francisco',
    type: 'Full-time',
    color: 'pink',
  },
  {
    title: 'Full Stack Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    color: 'green',
  },
  {
    title: 'mRNA Platform Lead',
    department: 'Research',
    location: 'Boston',
    type: 'Full-time',
    color: 'amber',
  },
]

const benefits = [
  { title: 'Competitive Equity', description: 'Meaningful ownership in our mission', color: 'cyan' },
  { title: 'Health & Wellness', description: 'Comprehensive medical, dental, vision', color: 'teal' },
  { title: 'Flexible Work', description: 'Remote-first with optional office space', color: 'emerald' },
  { title: 'Learning Budget', description: '$5,000/year for conferences & courses', color: 'blue' },
  { title: 'Unlimited PTO', description: 'Take the time you need to recharge', color: 'indigo' },
  { title: 'Parental Leave', description: '16 weeks fully paid for all parents', color: 'slate' },
]

const values = [
  { title: 'Impact at Scale', description: 'Design therapeutics that could help millions of patients with unmet medical needs.', color: 'cyan' },
  { title: 'Cutting-Edge Tech', description: 'Work with the latest in AI, protein language models, and computational biology.', color: 'teal' },
  { title: 'World-Class Team', description: 'Collaborate with experts from top research institutions and tech companies.', color: 'emerald' },
]

const selectedDepartment = ref('All')

onMounted(() => {
  // Hero animations
  gsap.fromTo('.hero-title', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
  )
  
  gsap.fromTo('.hero-badge', 
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 }
  )

  const cards = document.querySelectorAll('.career-card')
  if (cards.length > 0) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out', delay: 0.3 }
    )
  }
  
  // Floating particles animation
  gsap.to('.floating-particle', {
    y: -20,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.2
  })
})
</script>

<template>
  <div class="min-h-screen pt-24 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <!-- Gradient orbs -->
      <div class="absolute top-1/4 left-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-2/3 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
      
      <!-- Grid pattern -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(74,222,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(74,222,128,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      
      <!-- Floating particles -->
      <div v-for="i in 15" :key="i" 
        class="floating-particle absolute w-1 h-1 rounded-full"
        :class="[
          i % 3 === 0 ? 'bg-green-400' : i % 3 === 1 ? 'bg-cyan-400' : 'bg-purple-400'
        ]"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0.3 + Math.random() * 0.4,
          animationDelay: `${Math.random() * 2}s`
        }"
      ></div>
    </div>

    <!-- Hero -->
    <section class="relative z-10 px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <!-- Badge -->
        <div class="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-5 py-2 backdrop-blur-sm">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          <span class="text-sm font-medium text-green-300">We're Hiring!</span>
        </div>
        
        <h1 class="hero-title mb-6 text-5xl font-bold text-[rgb(var(--text-heading))] md:text-7xl">
          Join Our <span class="bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">Mission</span>
        </h1>
        <p class="hero-title max-w-3xl text-xl text-[rgb(var(--text-body))] leading-relaxed">
          Help us design the <span class="text-green-400">next generation of therapeutic molecules</span>. 
          We're building a team of exceptional scientists, engineers, and operators.
        </p>
      </div>
    </section>

    <!-- Why Join Us -->
    <section class="relative z-10 px-6 py-16">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-12">
          <span class="mb-4 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-sm font-medium text-cyan-300">
            Why DeepBio Scientific
          </span>
          <h2 class="text-3xl font-bold text-[rgb(var(--text-heading))] md:text-4xl">Build the Future of Medicine</h2>
        </div>
        
        <div class="grid gap-6 md:grid-cols-3">
          <div 
            v-for="value in values" 
            :key="value.title"
            class="career-card group relative rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl transition-all duration-500 hover:border-[rgb(var(--border-muted))] hover:shadow-lg hover:-translate-y-1"
          >
            <div class="relative">
              <div 
                class="mb-4 h-16 w-16 rounded-2xl flex items-center justify-center ring-1"
                :class="'bg-gradient-to-br from-' + value.color + '-500/20 to-' + value.color + '-500/5 ring-' + value.color + '-500/30'"
              >
                <svg v-if="value.color === 'cyan'" class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <svg v-else-if="value.color === 'teal'" class="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                <svg v-else class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              </div>
              <h3 class="mb-3 text-xl font-bold text-[rgb(var(--text-heading))]">{{ value.title }}</h3>
              <p class="text-[rgb(var(--text-body))]">{{ value.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="relative z-10 bg-gradient-to-b from-transparent via-[rgb(var(--bg-card))/0.5] to-transparent px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-12">
          <span class="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-300">
            Benefits
          </span>
          <h2 class="text-3xl font-bold text-[rgb(var(--text-heading))] md:text-4xl">Perks & Benefits</h2>
        </div>
        
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="(benefit, index) in benefits" 
            :key="benefit.title"
            class="career-card group flex items-start gap-4 rounded-xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[rgb(var(--border-muted))]"
          >
            <div 
              class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ring-1 transition-transform group-hover:scale-110"
              :class="'bg-gradient-to-br from-' + benefit.color + '-500/20 to-' + benefit.color + '-500/5 ring-' + benefit.color + '-500/30'"
            >
              <svg :class="'w-6 h-6 text-' + benefit.color + '-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="index === 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                <path v-else-if="index === 1" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                <path v-else-if="index === 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                <path v-else-if="index === 3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                <path v-else-if="index === 4" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-[rgb(var(--text-heading))]">{{ benefit.title }}</h3>
              <p class="text-sm text-[rgb(var(--text-body))]">{{ benefit.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Open Positions -->
    <section class="relative z-10 px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <span class="mb-4 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-sm font-medium text-blue-300">
              Open Roles
            </span>
            <h2 class="text-3xl font-bold text-[rgb(var(--text-heading))]">Open Positions</h2>
          </div>
          
          <div class="flex gap-2 flex-wrap">
            <button 
              v-for="dept in ['All', 'Engineering', 'Research', 'Therapeutics']" 
              :key="dept"
              @click="selectedDepartment = dept"
              class="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
              :class="selectedDepartment === dept ? 'bg-[rgb(var(--bg-card-muted))] text-[rgb(var(--text-heading))]' : 'text-[rgb(var(--text-body))] hover:text-[rgb(var(--text-heading))] hover:bg-[rgb(var(--bg-card-muted))/0.5]'"
            >
              {{ dept }}
            </button>
          </div>
        </div>
        
        <div class="space-y-4">
          <div 
            v-for="position in openPositions" 
            :key="position.title"
            class="career-card group cursor-pointer rounded-xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-6 backdrop-blur-xl transition-all duration-300"
            :class="[
              position.color === 'cyan' ? 'hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10' : '',
              position.color === 'purple' ? 'hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10' : '',
              position.color === 'pink' ? 'hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10' : '',
              position.color === 'green' ? 'hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10' : '',
              position.color === 'amber' ? 'hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10' : '',
            ]"
          >
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 
                  class="text-lg font-bold text-[rgb(var(--text-heading))] transition-colors"
                  :class="[
                    position.color === 'cyan' ? 'group-hover:text-cyan-400' : '',
                    position.color === 'purple' ? 'group-hover:text-purple-400' : '',
                    position.color === 'pink' ? 'group-hover:text-blue-400' : '',
                    position.color === 'green' ? 'group-hover:text-green-400' : '',
                    position.color === 'amber' ? 'group-hover:text-amber-400' : '',
                  ]"
                >{{ position.title }}</h3>
                <div class="mt-2 flex flex-wrap items-center gap-3 text-sm text-[rgb(var(--text-body))]">
                  <span 
                    class="rounded-full px-2 py-0.5 text-xs font-medium ring-1"
                    :class="[
                      position.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/30' : '',
                      position.color === 'purple' ? 'bg-purple-500/10 text-purple-400 ring-purple-500/30' : '',
                      position.color === 'pink' ? 'bg-blue-500/10 text-blue-400 ring-blue-500/30' : '',
                      position.color === 'green' ? 'bg-green-500/10 text-green-400 ring-green-500/30' : '',
                      position.color === 'amber' ? 'bg-amber-500/10 text-amber-400 ring-amber-500/30' : '',
                    ]"
                  >{{ position.department }}</span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ position.location }}
                  </span>
                  <span>{{ position.type }}</span>
                </div>
              </div>
              <button 
                class="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all"
                :class="[
                  position.color === 'cyan' ? 'bg-[rgb(var(--bg-card-muted))] group-hover:bg-cyan-500 group-hover:shadow-lg group-hover:shadow-cyan-500/30' : '',
                  position.color === 'purple' ? 'bg-[rgb(var(--bg-card-muted))] group-hover:bg-purple-500 group-hover:shadow-lg group-hover:shadow-purple-500/30' : '',
                  position.color === 'pink' ? 'bg-[rgb(var(--bg-card-muted))] group-hover:bg-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/30' : '',
                  position.color === 'green' ? 'bg-[rgb(var(--bg-card-muted))] group-hover:bg-green-500 group-hover:shadow-lg group-hover:shadow-green-500/30' : '',
                  position.color === 'amber' ? 'bg-[rgb(var(--bg-card-muted))] group-hover:bg-amber-500 group-hover:shadow-lg group-hover:shadow-amber-500/30' : '',
                ]"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>

        <!-- Don't See a Role -->
        <div class="mt-12 relative rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 text-center backdrop-blur-xl overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-green-500/5 via-cyan-500/5 to-purple-500/5"></div>
          <div class="relative">
            <h3 class="mb-4 text-xl font-bold text-[rgb(var(--text-heading))]">Don't see a role that fits?</h3>
            <p class="mb-6 text-[rgb(var(--text-body))] max-w-xl mx-auto">We're always looking for exceptional talent. Send us your resume and tell us how you'd contribute.</p>
            <a 
              href="mailto:careers@deepbioscientific.com" 
              class="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              careers@deepbioscientific.com
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Life at DeepBio Scientific -->
    <section class="relative z-10 px-6 pb-20">
      <div class="mx-auto max-w-6xl">
        <div class="relative rounded-3xl border border-[rgb(var(--border-primary))] bg-gradient-to-br from-[rgb(var(--bg-card))] via-[rgb(var(--bg-card))/0.95] to-[rgb(var(--bg-card))] p-12 text-center overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-green-500/5 via-cyan-500/5 to-purple-500/5"></div>
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-green-500/20 to-transparent rounded-full blur-3xl"></div>
          
          <div class="relative">
            <h2 class="mb-6 text-3xl font-bold text-[rgb(var(--text-heading))]">Life at DeepBio Scientific</h2>
            <p class="mb-8 text-lg text-[rgb(var(--text-body))] max-w-2xl mx-auto">
              We're a team of passionate scientists and engineers working together to transform therapeutic discovery. 
              Join us and make an impact.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
              <div class="flex -space-x-3">
                <img src="/team/ivan-garibay.jpg" alt="Dr. Ivan Garibay" class="w-12 h-12 rounded-full object-cover ring-2 ring-[rgb(var(--bg-card))]" />
                <img src="/team/edwin-nassiff.jpg" alt="Dr. Edwin Nassiff" class="w-12 h-12 rounded-full object-cover ring-2 ring-[rgb(var(--bg-card))]" />
                <img src="/team/sanjay-pahdi.jpg" alt="Dr. Sanjay Pahdi" class="w-12 h-12 rounded-full object-cover ring-2 ring-[rgb(var(--bg-card))]" />
                <img src="/team/ozlem-garibay.jpg" alt="Dr. Ozlem Garibay" class="w-12 h-12 rounded-full object-cover ring-2 ring-[rgb(var(--bg-card))]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.career-card {
  opacity: 1;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>
