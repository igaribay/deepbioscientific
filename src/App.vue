<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const scrolled = ref(false)
const heroCanvas = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let rotation = 0

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 10
  })
}

interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  color: string
  size: number
  type: 'dna' | 'protein'
}

const particles: Particle[] = []

function initParticles() {
  particles.length = 0

  // DNA strand particles (helix)
  for (let i = 0; i < 150; i++) {
    const angle = (i / 150) * Math.PI * 8
    const radius = 100
    const y = (i / 150) * 400 - 200
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    particles.push({
      x,
      y,
      z,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.1,
      vz: (Math.random() - 0.5) * 0.5,
      color: Math.random() > 0.5 ? '#0ea5e9' : '#a855f7',
      size: Math.random() * 2 + 1,
      type: 'dna',
    })
  }

  // Protein particles (scattered around)
  for (let i = 0; i < 200; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = 150 + Math.random() * 150
    const x = Math.cos(angle) * distance
    const z = Math.sin(angle) * distance
    const y = (Math.random() - 0.5) * 400

    const hue = (i / 200) * 360
    particles.push({
      x,
      y,
      z,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      vz: (Math.random() - 0.5) * 0.3,
      color: `hsl(${hue}, 100%, 50%)`,
      size: Math.random() * 1.5 + 0.5,
      type: 'protein',
    })
  }
}

function drawHeroBackground() {
  const canvas = heroCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  // Clear with subtle gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, 'rgba(15, 23, 42, 0)')
  gradient.addColorStop(1, 'rgba(15, 23, 42, 0.3)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Update and draw particles
  particles.forEach((particle) => {
    // Add some rotation
    const cos = Math.cos(rotation * 0.01)
    const sin = Math.sin(rotation * 0.01)

    // Rotate around Y axis
    const x = particle.x * cos - particle.z * sin
    const z = particle.x * sin + particle.z * cos

    // Simple perspective
    const scale = 300 / (z + 300)
    const screenX = centerX + x * scale
    const screenY = centerY + particle.y * scale

    // Draw particle
    ctx.fillStyle = particle.color
    ctx.globalAlpha = Math.max(0.1, Math.min(1, scale * 1.5))
    ctx.beginPath()
    ctx.arc(screenX, screenY, particle.size * scale, 0, Math.PI * 2)
    ctx.fill()

    // Update particle position
    particle.x += particle.vx
    particle.y += particle.vy
    particle.z += particle.vz

    // Wrap around
    if (Math.abs(particle.x) > 300) particle.x *= -0.8
    if (Math.abs(particle.y) > 300) particle.y *= -0.8
    if (Math.abs(particle.z) > 300) particle.z *= -0.8
  })

  ctx.globalAlpha = 1
}

function animateHero() {
  rotation += 0.5
  drawHeroBackground()
  animationId = requestAnimationFrame(animateHero)
}

onMounted(() => {
  // Initialize particles
  initParticles()

  // Start animation
  if (heroCanvas.value) {
    animateHero()
  }

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

  // Increase rotation speed on scroll
  window.addEventListener('scroll', () => {
    const scrollPercent =
      window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
    rotation += scrollPercent * 0.5
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

  // Floating animation for elements
  gsap.to('.float', {
    duration: 4,
    y: -10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })

  // Cleanup on unmount
  return () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
    }
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 overflow-hidden">
    <!-- Navigation -->
    <nav
      class="fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md"
      :class="scrolled ? 'bg-dark-900/95 shadow-2xl shadow-primary-600/20' : 'bg-dark-900/50'"
    >
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/50"
          >
            <span class="text-white font-bold text-lg">Σ</span>
          </div>
          <span
            class="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent"
            >Sequentia</span
          >
        </div>
        <button class="btn-primary shadow-lg shadow-primary-600/50 hover:shadow-primary-600/70">
          Partner With Us
        </button>
      </div>
    </nav>

    <!-- Hero Section with Animated Background -->
    <section
      class="hero-section relative pt-32 pb-32 px-6 min-h-screen flex items-center justify-center overflow-hidden"
    >
      <!-- Animated Background Canvas -->
      <canvas ref="heroCanvas" class="absolute inset-0 w-full h-full" style="opacity: 0.6"></canvas>

      <!-- Content Container -->
      <div class="max-w-5xl mx-auto relative z-10">
        <!-- Hero text with word-by-word animation -->
        <h1 class="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight text-center">
          <span class="hero-word block">Design</span>
          <span class="hero-word block">Transformative</span>
          <span class="hero-word block">
            <span class="gradient-text">Therapeutics</span>
          </span>
        </h1>

        <p
          class="text-xl md:text-2xl text-dark-300 mb-12 max-w-3xl mx-auto text-center leading-relaxed"
        >
          Partner with Sequentia to discover and develop breakthrough therapeutic proteins and
          peptides. From natural language design through clinical validation.
        </p>

        <div class="flex gap-4 justify-center flex-wrap">
          <button
            class="hero-btn btn-primary text-lg shadow-xl shadow-primary-600/50 hover:shadow-primary-600/70"
          >
            Start a Partnership
          </button>
          <button class="hero-btn btn-secondary text-lg">Learn Our Technology</button>
        </div>
      </div>
    </section>

    <!-- Four Layers Section -->
    <section class="py-24 px-6 reveal-section">
      <div class="max-w-6xl mx-auto">
        <h2 class="section-title text-white text-center mb-4">Integrated Platform</h2>
        <p class="section-subtitle text-dark-300 text-center mb-16 max-w-2xl mx-auto">
          Four layers working together to accelerate therapeutic discovery and development
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Layer 1 -->
          <div
            class="card-reveal feature-card group bg-dark-800/50 border-dark-700/50 backdrop-blur hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-600/20"
          >
            <div
              class="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-900/50 to-primary-700/50 border border-primary-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
              <svg
                class="w-6 h-6 text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-white mb-3">Natural Language Spec</h3>
            <p class="text-dark-400 text-sm">
              Describe your therapeutic target in plain English. Our system converts it to precise
              design parameters.
            </p>
          </div>

          <!-- Layer 2 -->
          <div
            class="card-reveal feature-card group bg-dark-800/50 border-dark-700/50 backdrop-blur hover:border-accent-500/50 hover:shadow-lg hover:shadow-accent-600/20"
          >
            <div
              class="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-900/50 to-accent-700/50 border border-accent-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
              <svg
                class="w-6 h-6 text-accent-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0m3.135-8.135l-.707.707M17 19.364l-.707-.707"
                />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-white mb-3">Agentic Optimization</h3>
            <p class="text-dark-400 text-sm">
              Coordinated AI agents evaluate, critique, and iteratively improve candidates across
              all dimensions.
            </p>
          </div>

          <!-- Layer 3 -->
          <div
            class="card-reveal feature-card group bg-dark-800/50 border-dark-700/50 backdrop-blur hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-600/20"
          >
            <div
              class="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-900/50 to-primary-700/50 border border-primary-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
              <svg
                class="w-6 h-6 text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-white mb-3">Evolutionary Search</h3>
            <p class="text-dark-400 text-sm">
              Population-based evolutionary engine generates diverse candidates with multi-objective
              optimization.
            </p>
          </div>

          <!-- Layer 4 -->
          <div
            class="card-reveal feature-card group bg-dark-800/50 border-dark-700/50 backdrop-blur hover:border-accent-500/50 hover:shadow-lg hover:shadow-accent-600/20"
          >
            <div
              class="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-900/50 to-accent-700/50 border border-accent-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
              <svg
                class="w-6 h-6 text-accent-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-white mb-3">Manufacturing & Delivery</h3>
            <p class="text-dark-400 text-sm">
              Co-design mRNA constructs, optimize manufacturability, and select delivery strategies.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Sequentia Section -->
    <section class="py-24 px-6 bg-dark-950/50 backdrop-blur reveal-section">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-white mb-16 text-center">Why Partner with Sequentia</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div class="card-reveal group">
            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform shadow-lg shadow-primary-600/50"
              >
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white mb-2">Fast Iteration Cycles</h3>
                <p class="text-dark-400">
                  Design, simulate, and validate therapeutic candidates in weeks instead of months.
                </p>
              </div>
            </div>
          </div>

          <div class="card-reveal group">
            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-br from-accent-600 to-accent-500 flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform shadow-lg shadow-accent-600/50"
              >
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white mb-2">Multi-Objective Optimization</h3>
                <p class="text-dark-400">
                  Simultaneously optimize potency, safety, manufacturability, and clinical
                  viability.
                </p>
              </div>
            </div>
          </div>

          <div class="card-reveal group">
            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform shadow-lg shadow-primary-600/50"
              >
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white mb-2">Full IP Transparency</h3>
                <p class="text-dark-400">
                  Clear IP ownership and clear licensing terms. Your molecules, your data, your path
                  forward.
                </p>
              </div>
            </div>
          </div>

          <div class="card-reveal group">
            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-br from-accent-600 to-accent-500 flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform shadow-lg shadow-accent-600/50"
              >
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white mb-2">Regulatory Expertise</h3>
                <p class="text-dark-400">
                  Integrated design for regulatory compliance. Pre-clinical validation and
                  documentation ready.
                </p>
              </div>
            </div>
          </div>

          <div class="card-reveal group">
            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform shadow-lg shadow-primary-600/50"
              >
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white mb-2">Manufacturing Partnership</h3>
                <p class="text-dark-400">
                  Integrated suppliers for GMP mRNA and protein manufacturing. Scale from discovery
                  to clinic.
                </p>
              </div>
            </div>
          </div>

          <div class="card-reveal group">
            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-br from-accent-600 to-accent-500 flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform shadow-lg shadow-accent-600/50"
              >
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white mb-2">Human in the Loop</h3>
                <p class="text-dark-400">
                  Expert scientists review every design step. Your team always has insight and
                  control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Partnership Models Section -->
    <section class="py-24 px-6 reveal-section">
      <div class="max-w-6xl mx-auto">
        <h2 class="section-title text-white text-center mb-4">Partnership Pathways</h2>
        <p class="section-subtitle text-dark-300 text-center mb-16 max-w-2xl mx-auto">
          Flexible engagement models tailored to your development stage and strategy
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Co-Development -->
          <div
            class="card-reveal bg-dark-800/50 border-dark-700/50 backdrop-blur rounded-xl border p-8 hover:shadow-xl hover:shadow-primary-600/20 transition-all hover:border-primary-500/50"
          >
            <div
              class="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-900/50 to-primary-700/50 border border-primary-500/30 flex items-center justify-center mb-6"
            >
              <svg
                class="w-7 h-7 text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Co-Development</h3>
            <p class="text-dark-400 mb-6">
              Joint discovery programs where we design therapeutics for your target. Revenue
              sharing, IP co-ownership.
            </p>
            <ul class="space-y-2 text-sm text-dark-400">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                Shared data & insights
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                Dedicated team
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                Upfront + milestone fees
              </li>
            </ul>
          </div>

          <!-- Technology License -->
          <div
            class="card-reveal bg-dark-800/50 border-dark-700/50 backdrop-blur rounded-xl border p-8 hover:shadow-xl hover:shadow-accent-600/20 transition-all ring-2 ring-accent-600/50 relative"
          >
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span
                class="bg-gradient-to-r from-accent-600 to-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg shadow-accent-600/50"
                >Popular</span
              >
            </div>
            <div
              class="w-14 h-14 rounded-lg bg-gradient-to-br from-accent-900/50 to-accent-700/50 border border-accent-500/30 flex items-center justify-center mb-6"
            >
              <svg
                class="w-7 h-7 text-accent-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Technology License</h3>
            <p class="text-dark-400 mb-6">
              License Sequentia's platform for your own discovery programs. Full platform access,
              expert support.
            </p>
            <ul class="space-y-2 text-sm text-dark-400">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
                Exclusive field license
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
                Dedicated support team
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
                Annual + royalties
              </li>
            </ul>
          </div>

          <!-- Design Service -->
          <div
            class="card-reveal bg-dark-800/50 border-dark-700/50 backdrop-blur rounded-xl border p-8 hover:shadow-xl hover:shadow-primary-600/20 transition-all hover:border-primary-500/50"
          >
            <div
              class="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-900/50 to-primary-700/50 border border-primary-500/30 flex items-center justify-center mb-6"
            >
              <svg
                class="w-7 h-7 text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Design Service</h3>
            <p class="text-dark-400 mb-6">
              Project-based therapeutic design. We design, you validate. Pay per design project or
              milestone-based.
            </p>
            <ul class="space-y-2 text-sm text-dark-400">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                Custom specifications
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                Flexible scope
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                No upfront commitment
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Use Cases Section -->
    <section class="py-24 px-6 bg-dark-950/50 backdrop-blur reveal-section">
      <div class="max-w-6xl mx-auto">
        <h2 class="section-title text-white text-center mb-4">Therapeutic Focus Areas</h2>
        <p class="section-subtitle text-dark-300 text-center mb-16 max-w-2xl mx-auto">
          Proven success across multiple therapeutic modalities
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Peptide Therapeutics -->
          <div
            class="card-reveal bg-dark-800/50 border-dark-700/50 backdrop-blur rounded-xl border p-8 hover:shadow-xl hover:shadow-primary-600/20 transition-all hover:border-primary-500/50"
          >
            <div
              class="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-900/50 to-primary-700/50 border border-primary-500/30 flex items-center justify-center mb-6"
            >
              <svg
                class="w-7 h-7 text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Peptide Therapeutics</h3>
            <p class="text-dark-400 mb-6">
              Fast iteration on potency and stability. Well-characterized assays enable rapid
              validation.
            </p>
            <ul class="space-y-2 text-sm text-dark-400">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                GLP-1R, GCGR agonists
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                Cytokine mimetics
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                Fusion proteins
              </li>
            </ul>
          </div>

          <!-- Protein Binders -->
          <div
            class="card-reveal bg-dark-800/50 border-dark-700/50 backdrop-blur rounded-xl border p-8 hover:shadow-xl hover:shadow-accent-600/20 transition-all hover:border-accent-500/50"
          >
            <div
              class="w-14 h-14 rounded-lg bg-gradient-to-br from-accent-900/50 to-accent-700/50 border border-accent-500/30 flex items-center justify-center mb-6"
            >
              <svg
                class="w-7 h-7 text-accent-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Protein Binders</h3>
            <p class="text-dark-400 mb-6">
              Structure-informed design for binding specificity. Explore diverse scaffold families.
            </p>
            <ul class="space-y-2 text-sm text-dark-400">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
                Monoclonal antibody replacements
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
                Bispecific proteins
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
                Tissue-targeting scaffolds
              </li>
            </ul>
          </div>

          <!-- mRNA Programs -->
          <div
            class="card-reveal bg-dark-800/50 border-dark-700/50 backdrop-blur rounded-xl border p-8 hover:shadow-xl hover:shadow-primary-600/20 transition-all hover:border-primary-500/50"
          >
            <div
              class="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-900/50 to-primary-700/50 border border-primary-500/30 flex items-center justify-center mb-6"
            >
              <svg
                class="w-7 h-7 text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">mRNA Therapeutics</h3>
            <p class="text-dark-400 mb-6">
              Optimize protein expression, stability, and immunogenicity. Delivery-aware design.
            </p>
            <ul class="space-y-2 text-sm text-dark-400">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                Personalized neoantigen vaccines
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                Protein replacement
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
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
        <h2 class="section-title text-white text-center mb-4">Platform Architecture</h2>
        <p class="section-subtitle text-dark-300 text-center mb-16 max-w-2xl mx-auto">
          Modular, auditable components with industry-standard validation
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            class="card-reveal bg-dark-800/50 border-dark-700/50 backdrop-blur rounded-xl border p-8 hover:shadow-lg hover:shadow-primary-600/20 transition-all"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-lg bg-primary-600/30 border border-primary-500/50 flex items-center justify-center flex-shrink-0"
              >
                <span class="font-bold text-primary-400">A</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-white mb-2">Specification Compiler</h3>
                <p class="text-dark-400 text-sm">
                  Natural language to design objectives. Creates experiment graph with required
                  assays.
                </p>
              </div>
            </div>
          </div>

          <div
            class="card-reveal bg-dark-800/50 border-dark-700/50 backdrop-blur rounded-xl border p-8 hover:shadow-lg hover:shadow-accent-600/20 transition-all"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-lg bg-accent-600/30 border border-accent-500/50 flex items-center justify-center flex-shrink-0"
              >
                <span class="font-bold text-accent-400">B</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-white mb-2">Population Initialization</h3>
                <p class="text-dark-400 text-sm">
                  Diverse starting point from scaffolds, templates, and literature. Seeded for rapid
                  convergence.
                </p>
              </div>
            </div>
          </div>

          <div
            class="card-reveal bg-dark-800/50 border-dark-700/50 backdrop-blur rounded-xl border p-8 hover:shadow-lg hover:shadow-primary-600/20 transition-all"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-lg bg-primary-600/30 border border-primary-500/50 flex items-center justify-center flex-shrink-0"
              >
                <span class="font-bold text-primary-400">C</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-white mb-2">Evolutionary Optimizer</h3>
                <p class="text-dark-400 text-sm">
                  Crossover, mutation, and selection. Pareto-ranked candidates and diversity
                  tracking.
                </p>
              </div>
            </div>
          </div>

          <div
            class="card-reveal bg-dark-800/50 border-dark-700/50 backdrop-blur rounded-xl border p-8 hover:shadow-lg hover:shadow-accent-600/20 transition-all"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-lg bg-accent-600/30 border border-accent-500/50 flex items-center justify-center flex-shrink-0"
              >
                <span class="font-bold text-accent-400">D</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-white mb-2">Scoring Suite</h3>
                <p class="text-dark-400 text-sm">
                  Structure, binding, developability, toxicity, immunogenicity, expression,
                  manufacturability.
                </p>
              </div>
            </div>
          </div>

          <div
            class="card-reveal bg-dark-800/50 border-dark-700/50 backdrop-blur rounded-xl border p-8 hover:shadow-lg hover:shadow-primary-600/20 transition-all"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-lg bg-primary-600/30 border border-primary-500/50 flex items-center justify-center flex-shrink-0"
              >
                <span class="font-bold text-primary-400">E</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-white mb-2">mRNA Designer</h3>
                <p class="text-dark-400 text-sm">
                  Codon optimization, UTR design, motif control, stability prediction and expression
                  tuning.
                </p>
              </div>
            </div>
          </div>

          <div
            class="card-reveal bg-dark-800/50 border-dark-700/50 backdrop-blur rounded-xl border p-8 hover:shadow-lg hover:shadow-accent-600/20 transition-all"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-10 h-10 rounded-lg bg-accent-600/30 border border-accent-500/50 flex items-center justify-center flex-shrink-0"
              >
                <span class="font-bold text-accent-400">F</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-white mb-2">Delivery Advisor</h3>
                <p class="text-dark-400 text-sm">
                  Formulation selection, route optimization, payload constraints, tissue targeting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      class="py-32 px-6 bg-gradient-to-r from-primary-600/80 via-accent-600/80 to-primary-700/80 backdrop-blur text-white reveal-section relative overflow-hidden"
    >
      <div
        class="absolute inset-0 opacity-20"
        style="
          background-image:
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        "
      ></div>
      <div class="max-w-4xl mx-auto text-center relative z-10">
        <h2 class="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          <span class="hero-word block">Ready to Accelerate</span>
          <span class="hero-word block">Your Therapeutic Program?</span>
        </h2>
        <p class="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
          Connect with our team to explore partnership opportunities. From early discovery to
          clinical stage.
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <button
            class="bg-white text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-primary-50 transition-colors shadow-lg hover:shadow-xl"
          >
            Schedule Partnership Call
          </button>
          <button
            class="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            Download Case Studies
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark-950 border-t border-dark-800/50 text-dark-400 py-16 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div
                class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/50"
              >
                <span class="text-white font-bold">Σ</span>
              </div>
              <span class="font-bold text-white">Sequentia</span>
            </div>
            <p class="text-sm text-dark-400">
              Designing the next generation of therapeutic molecules.
            </p>
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
        <div class="border-t border-dark-800/50 pt-8">
          <p class="text-center text-sm text-dark-500">
            © 2025 Sequentia. Advancing therapeutic design through computational evolution.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Dark theme overrides */
:root {
  --color-background: #0f172a;
  --color-text: #f1f5f9;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Feature card dark styles */
.feature-card {
  @apply rounded-xl border border-dark-700/50 bg-dark-800/50 p-8 shadow-sm backdrop-blur transition-all duration-300 hover:shadow-lg;
}

.btn-primary {
  @apply rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3 font-semibold text-white transition-all duration-200 hover:from-primary-700 hover:to-primary-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900;
}

.btn-secondary {
  @apply rounded-lg border-2 border-dark-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:border-primary-500 hover:bg-primary-500/10 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900;
}

.gradient-text {
  @apply bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent;
}

.section-title {
  @apply text-4xl font-bold;
}

.section-subtitle {
  @apply text-xl text-dark-400;
}

/* Canvas styling */
canvas {
  display: block;
}
</style>
