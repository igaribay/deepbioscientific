<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'

const team = [
  { 
    name: 'Dr. Ivan Garibay', 
    role: 'Co-Founder & Founding CEO', 
    bio: 'Director, Complex Adaptive Systems Laboratory at UCF. Pioneer in evolutionary computation and multi-agent systems.', 
    image: '/team/ivan-garibay.jpg',
    color: 'cyan' 
  },
  { 
    name: 'Dr. Edwin Nassiff', 
    role: 'Co-Founder & Founding COO', 
    bio: 'Former CTO of Enterprise Information Systems at Lockheed Martin Corporation. Former CIO in the US Government.', 
    image: '/team/edwin-nassiff.jpg',
    color: 'teal' 
  },
  { 
    name: 'Dr. Sanjay Padhi', 
    role: 'Co-Founder & Founding CTO', 
    bio: 'Former Head of AWS Research. CTO of Tag.bio. 20+ years AI and cloud. 2025 Breakthrough Prize in Physics (CERN Collaboration).', 
    image: '/team/sanjay-pahdi.jpg',
    color: 'emerald' 
  },
  { 
    name: 'Dr. Ozlem Garibay', 
    role: 'Co-Founder & Founding CSO', 
    bio: 'Former CIO, UCF Research. Director of the Molecular ML Laboratory, UCF', 
    image: '/team/ozlem-garibay.jpg',
    color: 'blue' 
  },
  { 
    name: 'Mark Pitman', 
    role: 'Head of Commercialization', 
    bio: '20+ years of experience building and scaling biotech companies', 
    image: '/team/mark-pitman.jpg',
    color: 'purple' 
  },
]

const milestones = [
  { year: '2026', event: 'Founded by scientists and industry leaders', color: 'cyan' },
  // { year: '2024', event: 'Raised $50M Series A led by top biotech investors', color: 'teal' },
  // { year: '2024', event: 'First partnership with major pharmaceutical company', color: 'emerald' },
  // { year: '2025', event: 'Platform validated with 3 programs entering preclinical', color: 'blue' },
]

const values = [
  { title: 'Scientific Rigor', description: 'We pursue the truth with intellectual honesty and reproducible methods.', color: 'cyan' },
  { title: 'Patient First', description: 'Every decision is guided by our mission to help patients in need.', color: 'teal' },
  { title: 'Bold Innovation', description: 'We tackle the hardest problems with creativity and determination.', color: 'emerald' },
]

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

  const cards = document.querySelectorAll('.about-card')
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
  
  // Timeline animation
  const timelineItems = document.querySelectorAll('.timeline-item')
  gsap.fromTo(timelineItems,
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, stagger: 0.2, duration: 0.8, ease: 'power3.out', delay: 0.5 }
  )
})
</script>

<template>
  <div class="min-h-screen pt-24 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <!-- Gradient orbs -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
      
      <!-- Grid pattern -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      
      <!-- Floating particles -->
      <div v-for="i in 15" :key="i" 
        class="floating-particle absolute w-1 h-1 rounded-full"
        :class="[
          i % 3 === 0 ? 'bg-purple-400' : i % 3 === 1 ? 'bg-cyan-400' : 'bg-blue-400'
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
        <div class="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-2 backdrop-blur-sm">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
          </span>
          <span class="text-sm font-medium text-purple-300">About Us</span>
        </div>
        
        <h1 class="hero-title mb-6 text-5xl font-bold text-white md:text-7xl">
          Our <span class="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">Mission</span>
        </h1>
        <p class="hero-title max-w-3xl text-xl text-slate-400 leading-relaxed">
          We're building towards a <span class="text-cyan-400 font-semibold">disease-free world</span>. 
          Every patient deserves access to <span class="text-purple-400">precisely designed therapeutics</span>, and 
          we're creating the AI platform to make that possible.
        </p>
      </div>
    </section>

    <!-- Vision -->
    <section class="relative z-10 px-6 py-16">
      <div class="mx-auto max-w-6xl">
        <div class="grid gap-8 md:grid-cols-2">
          <div class="about-card group relative rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50 p-8 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10">
            <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            <div class="relative">
              <div class="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 ring-1 ring-cyan-500/30">
                <svg class="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <h2 class="mb-4 text-2xl font-bold text-white">The Challenge</h2>
              <p class="mb-4 text-slate-400 leading-relaxed">
                Traditional therapeutic design is slow, expensive, and limited by human intuition. It takes years and billions of dollars to bring a single drug to market.
              </p>
              <p class="text-slate-400 leading-relaxed">
                Most potential therapeutics never make it past early development due to unforeseen issues with efficacy, safety, or manufacturing.
              </p>
            </div>
          </div>
          
          <div class="about-card group relative rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50 p-8 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            <div class="relative">
              <div class="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-teal-500/5 ring-1 ring-teal-500/30">
                <svg class="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
              </div>
              <h2 class="mb-4 text-2xl font-bold text-white">Our Approach</h2>
              <p class="mb-4 text-slate-400 leading-relaxed">
                We combine evolutionary algorithms, protein language models, and AgentFabric™ to explore therapeutic sequence space at unprecedented scale.
              </p>
              <p class="text-slate-400 leading-relaxed">
                Our platform optimizes for multiple objectives simultaneously: potency, safety, stability, and manufacturability, to deliver better candidates faster.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="relative z-10 px-6 py-16">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-12">
          <span class="mb-4 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-sm font-medium text-blue-300">
            Our Values
          </span>
          <h2 class="text-3xl font-bold text-white md:text-4xl">What Drives Us</h2>
        </div>
        
        <div class="grid gap-6 md:grid-cols-3">
          <div 
            v-for="value in values" 
            :key="value.title"
            class="about-card group relative rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50 p-8 text-center backdrop-blur-xl transition-all duration-500 hover:border-slate-700 hover:shadow-lg hover:-translate-y-1"
          >
            <div 
              class="mx-auto mb-4 h-16 w-16 rounded-2xl flex items-center justify-center ring-1"
              :class="'bg-gradient-to-br from-' + value.color + '-500/20 to-' + value.color + '-500/5 ring-' + value.color + '-500/30'"
            >
              <svg v-if="value.color === 'cyan'" class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
              <svg v-else-if="value.color === 'teal'" class="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              <svg v-else class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 class="mb-3 text-xl font-bold text-white">{{ value.title }}</h3>
            <p class="text-slate-400">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <!-- <section class="relative z-10 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-12">
          <span class="mb-4 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-sm font-medium text-cyan-300">
            Team
          </span>
          <h2 class="text-3xl font-bold text-white md:text-4xl">Leadership Team</h2>
        </div>
        
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <div 
            v-for="member in team" 
            :key="member.name"
            class="about-card group relative rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50 p-6 text-center backdrop-blur-xl transition-all duration-500 hover:border-slate-700 hover:shadow-lg hover:-translate-y-2"
          >
            <div class="mx-auto mb-4 h-24 w-24 rounded-full overflow-hidden ring-2 ring-slate-700/50 group-hover:ring-slate-500 transition-all">
              <img 
                :src="member.image" 
                :alt="member.name"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <h3 class="text-lg font-bold text-white">{{ member.name }}</h3>
            <p class="mb-3 text-sm font-medium" :class="'text-' + member.color + '-400'">{{ member.role }}</p>
            <p class="text-sm text-slate-400">{{ member.bio }}</p>
          </div>
        </div>
      </div>
    </section> -->  

    <!-- Timeline -->
    <section class="relative z-10 px-6 py-20">
      <div class="mx-auto max-w-4xl">
        <div class="text-center mb-12">
          <span class="mb-4 inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-sm font-medium text-green-300">
            Milestones
          </span>
          <h2 class="text-3xl font-bold text-white md:text-4xl">Our Journey</h2>
        </div>
        
        <div class="space-y-6">
          <div 
            v-for="(milestone, index) in milestones" 
            :key="index"
            class="timeline-item about-card flex gap-6"
          >
            <div class="flex flex-col items-center">
              <div 
                class="flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-lg transition-transform hover:scale-110"
                :class="[
                  milestone.color === 'cyan' ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-cyan-500/30' : '',
                  milestone.color === 'teal' ? 'bg-gradient-to-br from-teal-500 to-teal-600 shadow-teal-500/30' : '',
                  milestone.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30' : '',
                  milestone.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30' : '',
                ]"
              >
                {{ milestone.year }}
              </div>
              <div v-if="index < milestones.length - 1" class="mt-2 h-full w-0.5 bg-gradient-to-b from-slate-600 to-transparent"></div>
            </div>
            <div class="flex-1 pt-3">
              <p class="text-lg text-slate-300">{{ milestone.event }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Investors -->
    <!-- <section class="relative z-10 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent px-6 py-20">
      <div class="mx-auto max-w-6xl text-center">
        <span class="mb-4 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-sm font-medium text-amber-300">
          Backed By
        </span>
        <h2 class="mb-6 text-3xl font-bold text-white">Leading Investors</h2>
        <p class="mb-12 text-lg text-slate-400 max-w-2xl mx-auto">We're supported by top-tier biotech and technology investors who share our vision.</p>
        <div class="flex flex-wrap justify-center gap-6">
          <div 
            v-for="i in 4" 
            :key="i"
            class="about-card group flex h-24 w-44 items-center justify-center rounded-2xl border border-slate-800/50 bg-slate-900/50 text-slate-500 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 hover:text-amber-400"
          >
            <span class="font-medium">Investor {{ i }}</span>
          </div>
        </div>
      </div>
    </section> -->

    <!-- CTA -->
    <section class="relative z-10 px-6 py-20">
      <div class="mx-auto max-w-4xl">
        <div class="relative rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900 p-12 text-center overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-blue-500/5"></div>
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
          
          <div class="relative">
            <h2 class="mb-6 text-3xl font-bold text-white">Partner With Us</h2>
            <p class="mb-8 text-lg text-slate-400 max-w-2xl mx-auto">
              Ready to accelerate your drug discovery pipeline with AI-powered molecular design? Let's discuss how we can help.
            </p>
            <router-link 
              to="/contact"
              class="inline-block rounded-full bg-gradient-to-r from-purple-500 to-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50"
            >
              Get in Touch
            </router-link>
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
