<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const scrolled = ref(false)
const dnaCanvas = ref<HTMLCanvasElement | null>(null)

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 10
  })
}

onMounted(() => {
  // Hero text stagger animation
  gsap.from('.hero-word', {
    duration: 0.8,
    opacity: 0,
    y: 20,
    stagger: 0.1,
    ease: 'back.out',
  })

  // Hero buttons
  gsap.from('.hero-btn', {
    duration: 0.8,
    opacity: 0,
    y: 20,
    stagger: 0.2,
    delay: 0.3,
    ease: 'back.out',
  })

  // Section reveals with scroll trigger
  const sections = document.querySelectorAll('.reveal-section')
  sections.forEach((section) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: false,
        markers: false,
      },
      duration: 0.8,
      opacity: 0,
      y: 40,
      ease: 'power2.out',
    })
  })

  // Card stagger on scroll
  const cards = document.querySelectorAll('.card-reveal')
  cards.forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
      delay: index * 0.1,
      ease: 'power2.out',
    })
  })

  // DNA strand animation
  if (dnaCanvas.value) {
    drawDNAStrand()
    gsap.to('.dna-strand', {
      scrollTrigger: {
        trigger: '.dna-section',
        start: 'top center',
        scrub: 1,
      },
      rotation: 360,
      duration: 10,
      ease: 'none',
    })
  }

  // Floating animation for elements
  gsap.to('.float', {
    duration: 4,
    y: -10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })

  // Parallax effect for hero background
  gsap.to('.hero-bg', {
    scrollTrigger: {
      trigger: '.hero-section',
      scrub: 1,
    },
    y: 100,
    ease: 'none',
  })

  // Number counter animation
  const counters = document.querySelectorAll('.counter')
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-target') || '0')
    gsap.from(counter, {
      scrollTrigger: {
        trigger: counter,
        start: 'top 80%',
      },
      duration: 2,
      textContent: 0,
      snap: { textContent: 1 },
      ease: 'power2.out',
    })
  })
})

function drawDNAStrand() {
  const canvas = dnaCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(canvas.width, canvas.height) / 4

  ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)'
  ctx.lineWidth = 2

  // Draw double helix
  for (let i = 0; i < 2; i++) {
    ctx.beginPath()
    for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
      const x = centerX + Math.cos(angle + i * Math.PI) * radius
      const y = centerY + Math.sin(angle) * 40
      if (angle === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()
  }

  // Draw connecting lines
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)'
  ctx.lineWidth = 1
  for (let angle = 0; angle < Math.PI * 4; angle += 0.3) {
    const x1 = centerX + Math.cos(angle) * radius
    const y1 = centerY + Math.sin(angle) * 40
    const x2 = centerX + Math.cos(angle + Math.PI) * radius
    const y2 = centerY + Math.sin(angle) * 40

    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
}
</script>

<template>
  <div class="min-h-screen bg-white overflow-hidden">
    <!-- Navigation -->
    <nav
      class="fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-sm"
      :class="scrolled ? 'bg-white/95 shadow-lg' : 'bg-white/50'"
    >
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shadow-lg">
            <span class="text-white font-bold text-lg">Σ</span>
          </div>
          <span class="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Sequentia</span>
        </div>
        <button class="btn-primary shadow-lg">Partner With Us</button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section pt-32 pb-24 px-6 bg-gradient-to-b from-primary-50 via-white to-white relative overflow-hidden">
      <div class="hero-bg absolute inset-0 opacity-30 pointer-events-none" style="background-image: radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)"></div>
      
      <div class="max-w-5xl mx-auto relative z-10">
        <!-- Hero text with word-by-word animation -->
        <h1 class="text-6xl md:text-7xl font-bold text-dark-900 mb-8 leading-tight text-center">
          <span class="hero-word block">Design</span>
          <span class="hero-word block">Transformative</span>
          <span class="hero-word block">
            <span class="gradient-text">Therapeutics</span>
          </span>
        </h1>
        
        <p class="text-xl md:text-2xl text-dark-600 mb-12 max-w-3xl mx-auto text-center leading-relaxed">
          Partner with Sequentia to discover and develop breakthrough therapeutic proteins and peptides. From natural language design through clinical validation.
        </p>
        
        <div class="flex gap-4 justify-center flex-wrap mb-16">
          <button class="hero-btn btn-primary text-lg shadow-xl hover:shadow-2xl">Start a Partnership</button>
          <button class="hero-btn btn-secondary text-lg">Learn Our Technology</button>
        </div>

        <!-- DNA Strand Hero Element -->
        <div class="relative mx-auto max-w-2xl h-64 rounded-2xl overflow-hidden border border-primary-200 bg-gradient-to-br from-primary-50 to-transparent">
          <canvas 
            ref="dnaCanvas" 
            class="dna-strand w-full h-full"
            style="background: linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)"
          ></canvas>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 px-6 bg-gradient-to-r from-dark-900 to-dark-800 text-white reveal-section">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div class="float">
          <div class="counter text-5xl font-bold mb-2" data-target="500">500</div>
          <p class="text-dark-300">Protein Designs Generated</p>
        </div>
        <div class="float" style="animation-delay: 0.5s">
          <div class="counter text-5xl font-bold mb-2" data-target="15">15</div>
          <p class="text-dark-300">Therapeutic Partnerships</p>
        </div>
        <div class="float" style="animation-delay: 1s">
          <div class="counter text-5xl font-bold mb-2" data-target="3">3</div>
          <p class="text-dark-300">Clinical Stage Programs</p>
        </div>
      </div>
    </section>

    <!-- Four Layers Section -->
    <section class="py-24 px-6 reveal-section">
      <div class="max-w-6xl mx-auto">
        <h2 class="section-title text-center mb-4">Integrated Platform</h2>
        <p class="section-subtitle text-center mb-16 max-w-2xl mx-auto">Four layers working together to accelerate therapeutic discovery and development</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Layer 1 -->
          <div class="card-reveal feature-card group hover:shadow-2xl">
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-dark-900 mb-3">Natural Language Spec</h3>
            <p class="text-dark-600 text-sm">Describe your therapeutic target in plain English. Our system converts it to precise design parameters.</p>
          </div>

          <!-- Layer 2 -->
          <div class="card-reveal feature-card group hover:shadow-2xl">
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0m3.135-8.135l-.707.707M17 19.364l-.707-.707" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-dark-900 mb-3">Agentic Optimization</h3>
            <p class="text-dark-600 text-sm">Coordinated AI agents evaluate, critique, and iteratively improve candidates across all dimensions.</p>
          </div>

          <!-- Layer 3 -->
          <div class="card-reveal feature-card group hover:shadow-2xl">
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-dark-900 mb-3">Evolutionary Search</h3>
            <p class="text-dark-600 text-sm">Population-based evolutionary engine generates diverse candidates with multi-objective optimization.</p>
          </div>

          <!-- Layer 4 -->
          <div class="card-reveal feature-card group hover:shadow-2xl">
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-dark-900 mb-3">Manufacturing & Delivery</h3>
            <p class="text-dark-600 text-sm">Co-design mRNA constructs, optimize manufacturability, and select delivery strategies.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Sequentia Section -->
    <section class="py-24 px-6 bg-dark-900 text-white reveal-section">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold mb-16 text-center">Why Partner with Sequentia</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div class="card-reveal group">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-primary-500 transition">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-2">Fast Iteration Cycles</h3>
                <p class="text-dark-300">Design, simulate, and validate therapeutic candidates in weeks instead of months.</p>
              </div>
            </div>
          </div>

          <div class="card-reveal group">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-accent-500 transition">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-2">Multi-Objective Optimization</h3>
                <p class="text-dark-300">Simultaneously optimize potency, safety, manufacturability, and clinical viability.</p>
              </div>
            </div>
          </div>

          <div class="card-reveal group">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-primary-500 transition">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-2">Full IP Transparency</h3>
                <p class="text-dark-300">Clear IP ownership and clear licensing terms. Your molecules, your data, your path forward.</p>
              </div>
            </div>
          </div>

          <div class="card-reveal group">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-accent-500 transition">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-2">Regulatory Expertise</h3>
                <p class="text-dark-300">Integrated design for regulatory compliance. Pre-clinical validation and documentation ready.</p>
              </div>
            </div>
          </div>

          <div class="card-reveal group">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-primary-500 transition">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-2">Manufacturing Partnership</h3>
                <p class="text-dark-300">Integrated suppliers for GMP mRNA and protein manufacturing. Scale from discovery to clinic.</p>
              </div>
            </div>
          </div>

          <div class="card-reveal group">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-accent-500 transition">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-2">Human in the Loop</h3>
                <p class="text-dark-300">Expert scientists review every design step. Your team always has insight and control.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Partnership Models Section -->
    <section class="py-24 px-6 reveal-section">
      <div class="max-w-6xl mx-auto">
        <h2 class="section-title text-center mb-4">Partnership Pathways</h2>
        <p class="section-subtitle text-center mb-16 max-w-2xl mx-auto">Flexible engagement models tailored to your development stage and strategy</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Co-Development -->
          <div class="card-reveal bg-white rounded-xl border border-dark-200 p-8 hover:shadow-2xl transition-shadow hover:border-primary-300">
            <div class="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-dark-900 mb-3">Co-Development</h3>
            <p class="text-dark-600 mb-6">Joint discovery programs where we design therapeutics for your target. Revenue sharing, IP co-ownership.</p>
            <ul class="space-y-2 text-sm text-dark-600">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                Shared data & insights
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                Dedicated team
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                Upfront + milestone fees
              </li>
            </ul>
          </div>

          <!-- Technology License -->
          <div class="card-reveal bg-white rounded-xl border border-dark-200 p-8 hover:shadow-2xl transition-shadow ring-2 ring-primary-600 relative">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span class="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Popular</span>
            </div>
            <div class="w-14 h-14 rounded-lg bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-accent-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-dark-900 mb-3">Technology License</h3>
            <p class="text-dark-600 mb-6">License Sequentia's platform for your own discovery programs. Full platform access, expert support.</p>
            <ul class="space-y-2 text-sm text-dark-600">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent-600"></span>
                Exclusive field license
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent-600"></span>
                Dedicated support team
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent-600"></span>
                Annual + royalties
              </li>
            </ul>
          </div>

          <!-- Service Contract -->
          <div class="card-reveal bg-white rounded-xl border border-dark-200 p-8 hover:shadow-2xl transition-shadow hover:border-primary-300">
            <div class="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-dark-900 mb-3">Design Service</h3>
            <p class="text-dark-600 mb-6">Project-based therapeutic design. We design, you validate. Pay per design project or milestone-based.</p>
            <ul class="space-y-2 text-sm text-dark-600">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                Custom specifications
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                Flexible scope
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                No upfront commitment
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Use Cases Section -->
    <section class="py-24 px-6 bg-dark-50 reveal-section">
      <div class="max-w-6xl mx-auto">
        <h2 class="section-title text-center mb-4">Therapeutic Focus Areas</h2>
        <p class="section-subtitle text-center mb-16 max-w-2xl mx-auto">Proven success across multiple therapeutic modalities</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Peptide Therapeutics -->
          <div class="card-reveal bg-white rounded-xl border border-dark-200 p-8 hover:shadow-xl transition-shadow">
            <div class="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-dark-900 mb-2">Peptide Therapeutics</h3>
            <p class="text-dark-600 mb-6">Fast iteration on potency and stability. Well-characterized assays enable rapid validation.</p>
            <ul class="space-y-2 text-sm text-dark-600">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                GLP-1R, GCGR agonists
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                Cytokine mimetics
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                Fusion proteins
              </li>
            </ul>
          </div>

          <!-- Protein Binders -->
          <div class="card-reveal bg-white rounded-xl border border-dark-200 p-8 hover:shadow-xl transition-shadow">
            <div class="w-14 h-14 rounded-lg bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-accent-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-dark-900 mb-2">Protein Binders</h3>
            <p class="text-dark-600 mb-6">Structure-informed design for binding specificity. Explore diverse scaffold families.</p>
            <ul class="space-y-2 text-sm text-dark-600">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent-600"></span>
                Monoclonal antibody replacements
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent-600"></span>
                Bispecific proteins
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent-600"></span>
                Tissue-targeting scaffolds
              </li>
            </ul>
          </div>

          <!-- mRNA Programs -->
          <div class="card-reveal bg-white rounded-xl border border-dark-200 p-8 hover:shadow-xl transition-shadow">
            <div class="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-dark-900 mb-2">mRNA Therapeutics</h3>
            <p class="text-dark-600 mb-6">Optimize protein expression, stability, and immunogenicity. Delivery-aware design.</p>
            <ul class="space-y-2 text-sm text-dark-600">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                Personalized neoantigen vaccines
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                Protein replacement
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                Viral vector alternatives
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- System Architecture Section -->
    <section class="py-24 px-6 reveal-section">
      <div class="max-w-6xl mx-auto">
        <h2 class="section-title text-center mb-4">Platform Architecture</h2>
        <p class="section-subtitle text-center mb-16 max-w-2xl mx-auto">Modular, auditable components with industry-standard validation</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="card-reveal bg-white rounded-xl border border-dark-200 p-8 hover:shadow-lg transition-shadow">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span class="font-bold text-primary-700">A</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-dark-900 mb-2">Specification Compiler</h3>
                <p class="text-dark-600 text-sm">Natural language to design objectives. Creates experiment graph with required assays.</p>
              </div>
            </div>
          </div>

          <div class="card-reveal bg-white rounded-xl border border-dark-200 p-8 hover:shadow-lg transition-shadow">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
                <span class="font-bold text-accent-700">B</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-dark-900 mb-2">Population Initialization</h3>
                <p class="text-dark-600 text-sm">Diverse starting point from scaffolds, templates, and literature. Seeded for rapid convergence.</p>
              </div>
            </div>
          </div>

          <div class="card-reveal bg-white rounded-xl border border-dark-200 p-8 hover:shadow-lg transition-shadow">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span class="font-bold text-primary-700">C</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-dark-900 mb-2">Evolutionary Optimizer</h3>
                <p class="text-dark-600 text-sm">Crossover, mutation, and selection. Pareto-ranked candidates and diversity tracking.</p>
              </div>
            </div>
          </div>

          <div class="card-reveal bg-white rounded-xl border border-dark-200 p-8 hover:shadow-lg transition-shadow">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
                <span class="font-bold text-accent-700">D</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-dark-900 mb-2">Scoring Suite</h3>
                <p class="text-dark-600 text-sm">Structure, binding, developability, toxicity, immunogenicity, expression, manufacturability.</p>
              </div>
            </div>
          </div>

          <div class="card-reveal bg-white rounded-xl border border-dark-200 p-8 hover:shadow-lg transition-shadow">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span class="font-bold text-primary-700">E</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-dark-900 mb-2">mRNA Designer</h3>
                <p class="text-dark-600 text-sm">Codon optimization, UTR design, motif control, stability prediction and expression tuning.</p>
              </div>
            </div>
          </div>

          <div class="card-reveal bg-white rounded-xl border border-dark-200 p-8 hover:shadow-lg transition-shadow">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
                <span class="font-bold text-accent-700">F</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-dark-900 mb-2">Delivery Advisor</h3>
                <p class="text-dark-600 text-sm">Formulation selection, route optimization, payload constraints, tissue targeting.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-32 px-6 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 text-white reveal-section">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          <span class="hero-word block">Ready to Accelerate</span>
          <span class="hero-word block">Your Therapeutic Program?</span>
        </h2>
        <p class="text-xl text-primary-100 mb-12 max-w-2xl mx-auto">
          Connect with our team to explore partnership opportunities. From early discovery to clinical stage.
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <button class="bg-white text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-primary-50 transition-colors shadow-lg">
            Schedule Partnership Call
          </button>
          <button class="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
            Download Case Studies
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark-900 text-dark-400 py-16 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                <span class="text-white font-bold">Σ</span>
              </div>
              <span class="font-bold text-white">Sequentia</span>
            </div>
            <p class="text-sm text-dark-400">Designing the next generation of therapeutic molecules.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Platform</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition">Technology</a></li>
              <li><a href="#" class="hover:text-white transition">Partnerships</a></li>
              <li><a href="#" class="hover:text-white transition">Case Studies</a></li>
              <li><a href="#" class="hover:text-white transition">Documentation</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Company</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition">About</a></li>
              <li><a href="#" class="hover:text-white transition">Team</a></li>
              <li><a href="#" class="hover:text-white transition">Blog</a></li>
              <li><a href="#" class="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Legal</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition">Privacy</a></li>
              <li><a href="#" class="hover:text-white transition">Terms</a></li>
              <li><a href="#" class="hover:text-white transition">IP Policy</a></li>
              <li><a href="#" class="hover:text-white transition">Security</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-dark-800 pt-8">
          <p class="text-center text-sm text-dark-500">© 2025 Sequentia. Advancing therapeutic design through computational evolution.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* DNA Section Styles */
.dna-section {
  perspective: 1000px;
}

.dna-strand {
  transform-style: preserve-3d;
}

/* Stagger animations for hero words */
.hero-word:nth-child(1) {
  animation-delay: 0s;
}

.hero-word:nth-child(2) {
  animation-delay: 0.1s;
}

.hero-word:nth-child(3) {
  animation-delay: 0.2s;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}
</style>
