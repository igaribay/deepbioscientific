<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const route = useRoute()
const isHomePage = computed(() => route.path === '/')

const navLinks = [
  { name: 'Technology', path: '/technology' },
  { name: 'Research', path: '/research' },
  { name: 'Case Studies', path: '/case-studies' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
  { name: 'Careers', path: '/careers' },
]
const heroCanvas = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let time = 0
let mouseX = 0
let mouseY = 0

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 10
  })
}

// mRNA nucleotide bases for visualization
interface Nucleotide {
  x: number
  y: number
  z: number
  baseX: number
  baseY: number
  baseZ: number
  type: 'A' | 'U' | 'G' | 'C'
  color: string
  partner?: number
  phase: number
}

interface FloatingMolecule {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  size: number
  color: string
  type: 'ribosome' | 'amino' | 'codon'
  rotation: number
  rotationSpeed: number
}

const nucleotides: Nucleotide[] = []
const molecules: FloatingMolecule[] = []

// Color palette inspired by scientific visualization
const colors = {
  adenine: '#22d3ee', // Cyan
  uracil: '#f472b6', // Pink
  guanine: '#a78bfa', // Purple
  cytosine: '#4ade80', // Green
  backbone: '#38bdf8', // Blue
  ribosome: '#fbbf24', // Amber
  amino: '#f43f5e', // Rose
}

function initVisualization() {
  nucleotides.length = 0
  molecules.length = 0

  // Create mRNA double helix structure
  const helixLength = 80
  const helixRadius = 120
  const helixPitch = 6

  for (let i = 0; i < helixLength; i++) {
    const t = i / helixLength
    const angle = t * Math.PI * helixPitch
    const y = (t - 0.5) * 500

    // First strand
    const baseTypes: ('A' | 'U' | 'G' | 'C')[] = ['A', 'U', 'G', 'C']
    const type1 = baseTypes[i % 4]
    const complementMap: Record<string, 'A' | 'U' | 'G' | 'C'> = {
      A: 'U',
      U: 'A',
      G: 'C',
      C: 'G',
    }
    const type2 = complementMap[type1]

    const colorMap = {
      A: colors.adenine,
      U: colors.uracil,
      G: colors.guanine,
      C: colors.cytosine,
    }

    nucleotides.push({
      x: Math.cos(angle) * helixRadius,
      y,
      z: Math.sin(angle) * helixRadius,
      baseX: Math.cos(angle) * helixRadius,
      baseY: y,
      baseZ: Math.sin(angle) * helixRadius,
      type: type1,
      color: colorMap[type1],
      partner: nucleotides.length + 1,
      phase: t * Math.PI * 2,
    })

    // Second strand (complementary, offset by PI)
    nucleotides.push({
      x: Math.cos(angle + Math.PI) * helixRadius,
      y,
      z: Math.sin(angle + Math.PI) * helixRadius,
      baseX: Math.cos(angle + Math.PI) * helixRadius,
      baseY: y,
      baseZ: Math.sin(angle + Math.PI) * helixRadius,
      type: type2,
      color: colorMap[type2],
      partner: nucleotides.length - 1,
      phase: t * Math.PI * 2 + Math.PI,
    })
  }

  // Create floating molecules (ribosomes, amino acids, codons)
  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = 200 + Math.random() * 200
    const types: ('ribosome' | 'amino' | 'codon')[] = ['ribosome', 'amino', 'codon']
    const type = types[Math.floor(Math.random() * 3)]

    molecules.push({
      x: Math.cos(angle) * distance,
      y: (Math.random() - 0.5) * 600,
      z: Math.sin(angle) * distance,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      vz: (Math.random() - 0.5) * 0.3,
      size: type === 'ribosome' ? 15 + Math.random() * 10 : 5 + Math.random() * 8,
      color: type === 'ribosome' ? colors.ribosome : type === 'amino' ? colors.amino : '#60a5fa',
      type,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    })
  }
}

function drawHeroBackground() {
  const canvas = heroCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Handle high DPI displays
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const width = rect.width
  const height = rect.height
  const centerX = width / 2
  const centerY = height / 2

  // Clear canvas with gradient
  ctx.fillStyle = 'rgba(2, 6, 23, 0.15)'
  ctx.fillRect(0, 0, width, height)

  // Mouse influence for interactivity
  const targetMouseX = (mouseX - centerX) * 0.0003
  const targetMouseY = (mouseY - centerY) * 0.0003

  // Draw connections between base pairs first (behind nucleotides)
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)'
  ctx.lineWidth = 1

  for (let i = 0; i < nucleotides.length; i += 2) {
    const n1 = nucleotides[i]
    const n2 = nucleotides[i + 1]
    if (!n1 || !n2) continue

    // Animate position with wave motion
    const wave = Math.sin(time * 0.02 + n1.phase) * 8

    const x1 =
      n1.baseX + wave * Math.cos(n1.phase) + Math.cos(time * 0.01 + n1.phase) * targetMouseX * 500
    const y1 = n1.baseY + Math.sin(time * 0.015 + n1.phase) * 3
    const z1 = n1.baseZ + wave * Math.sin(n1.phase)

    const x2 =
      n2.baseX + wave * Math.cos(n2.phase) + Math.cos(time * 0.01 + n2.phase) * targetMouseX * 500
    const y2 = n2.baseY + Math.sin(time * 0.015 + n2.phase) * 3
    const z2 = n2.baseZ + wave * Math.sin(n2.phase)

    // Rotate based on time and mouse
    const rotY = time * 0.008 + targetMouseX * 2
    const rotX = targetMouseY

    const cos1 = Math.cos(rotY)
    const sin1 = Math.sin(rotY)
    const cos2 = Math.cos(rotX)
    const sin2 = Math.sin(rotX)

    // Apply rotation
    let rx1 = x1 * cos1 - z1 * sin1
    let rz1 = x1 * sin1 + z1 * cos1
    let ry1 = y1 * cos2 - rz1 * sin2
    rz1 = y1 * sin2 + rz1 * cos2

    let rx2 = x2 * cos1 - z2 * sin1
    let rz2 = x2 * sin1 + z2 * cos1
    let ry2 = y2 * cos2 - rz2 * sin2
    rz2 = y2 * sin2 + rz2 * cos2

    // Perspective projection with safety check
    const fov = 500
    const minZ = -fov + 50 // Prevent division by very small numbers

    // Clamp z values to prevent negative or zero denominators
    const safeZ1 = Math.max(rz1, minZ)
    const safeZ2 = Math.max(rz2, minZ)

    const scale1 = fov / (safeZ1 + fov)
    const scale2 = fov / (safeZ2 + fov)

    // Skip if either point is behind camera
    if (scale1 <= 0 || scale2 <= 0) continue

    const screenX1 = centerX + rx1 * scale1
    const screenY1 = centerY + ry1 * scale1
    const screenX2 = centerX + rx2 * scale2
    const screenY2 = centerY + ry2 * scale2

    // Draw hydrogen bond connection
    ctx.beginPath()
    ctx.moveTo(screenX1, screenY1)
    ctx.lineTo(screenX2, screenY2)
    ctx.stroke()

    // Store transformed positions for drawing nucleotides
    n1.x = rx1
    n1.y = ry1
    n1.z = rz1
    n2.x = rx2
    n2.y = ry2
    n2.z = rz2
  }

  // Sort nucleotides by z for proper depth ordering
  const sortedNucleotides = [...nucleotides].sort((a, b) => a.z - b.z)

  // Draw nucleotides
  for (const n of sortedNucleotides) {
    const fov = 500
    const minZ = -fov + 50

    // Clamp z value to prevent negative scale
    const safeZ = Math.max(n.z, minZ)
    const scale = fov / (safeZ + fov)

    // Skip if behind camera or scale is invalid
    if (scale <= 0) continue

    const screenX = centerX + n.x * scale
    const screenY = centerY + n.y * scale

    // Calculate radius with safety check
    const baseRadius = 6
    const radius = Math.max(0.5, baseRadius * scale)

    // Draw glow
    const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, radius * 3)
    gradient.addColorStop(0, n.color + '80')
    gradient.addColorStop(0.5, n.color + '20')
    gradient.addColorStop(1, 'transparent')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(screenX, screenY, radius * 3, 0, Math.PI * 2)
    ctx.fill()

    // Draw nucleotide core
    ctx.fillStyle = n.color
    ctx.globalAlpha = Math.max(0.3, Math.min(1, scale * 1.5))
    ctx.beginPath()
    ctx.arc(screenX, screenY, radius, 0, Math.PI * 2)
    ctx.fill()

    // Draw letter label for larger nucleotides
    if (scale > 0.5) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.font = `${Math.max(8, 10 * scale)}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(n.type, screenX, screenY)
    }
  }

  ctx.globalAlpha = 1

  // Draw and update floating molecules
  for (const mol of molecules) {
    // Update position
    mol.x += mol.vx
    mol.y += mol.vy
    mol.z += mol.vz
    mol.rotation += mol.rotationSpeed

    // Wrap around boundaries
    if (Math.abs(mol.x) > 400) mol.vx *= -1
    if (Math.abs(mol.y) > 400) mol.vy *= -1
    if (Math.abs(mol.z) > 400) mol.vz *= -1

    // Apply rotation
    const rotY = time * 0.008 + targetMouseX * 2
    const cos = Math.cos(rotY)
    const sin = Math.sin(rotY)

    const rx = mol.x * cos - mol.z * sin
    const rz = mol.x * sin + mol.z * cos

    // Perspective with safety check
    const fov = 500
    const minZ = -fov + 50
    const safeZ = Math.max(rz, minZ)
    const scale = fov / (safeZ + fov)

    // Skip if behind camera
    if (scale <= 0) continue

    const screenX = centerX + rx * scale
    const screenY = centerY + mol.y * scale

    // Calculate size with safety check
    const size = Math.max(1, mol.size * scale)

    // Draw molecule based on type
    ctx.globalAlpha = Math.max(0.2, Math.min(0.8, scale))

    if (mol.type === 'ribosome') {
      // Draw ribosome as complex shape
      const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size * 2)
      gradient.addColorStop(0, mol.color + 'CC')
      gradient.addColorStop(0.6, mol.color + '40')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.ellipse(screenX, screenY, size * 1.5, size, mol.rotation, 0, Math.PI * 2)
      ctx.fill()
    } else if (mol.type === 'amino') {
      // Draw amino acid as hexagon
      ctx.fillStyle = mol.color + '80'
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = mol.rotation + (i * Math.PI * 2) / 6
        const px = screenX + Math.cos(angle) * size
        const py = screenY + Math.sin(angle) * size
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
    } else {
      // Draw codon as triple circles
      ctx.fillStyle = mol.color + '60'
      for (let i = 0; i < 3; i++) {
        const angle = mol.rotation + (i * Math.PI * 2) / 3
        const px = screenX + Math.cos(angle) * size * 0.5
        const py = screenY + Math.sin(angle) * size * 0.5
        ctx.beginPath()
        ctx.arc(px, py, size * 0.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  ctx.globalAlpha = 1
}

function animate() {
  time += 1
  drawHeroBackground()
  animationId = requestAnimationFrame(animate)
}

function handleMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
}

function handleResize() {
  if (heroCanvas.value) {
    drawHeroBackground()
  }
}

onMounted(() => {
  // Initialize visualization
  initVisualization()

  // Start animation
  if (heroCanvas.value) {
    animate()
  }

  // Add event listeners
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleResize)

  // Hero text stagger animation
  gsap.from('.hero-word', {
    duration: 1,
    opacity: 0,
    y: 50,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.3,
  })

  // Hero subtext
  gsap.from('.hero-subtext', {
    duration: 1,
    opacity: 0,
    y: 30,
    delay: 0.8,
    ease: 'power3.out',
  })

  // Hero buttons
  gsap.from('.hero-btn', {
    duration: 0.8,
    opacity: 0,
    y: 20,
    scale: 0.9,
    stagger: 0.15,
    delay: 1.1,
    ease: 'back.out(1.7)',
  })

  // Floating badge animation
  gsap.from('.hero-badge', {
    duration: 1,
    opacity: 0,
    scale: 0.8,
    delay: 0.2,
    ease: 'elastic.out(1, 0.5)',
  })

  // Scroll-triggered parallax for hero
  gsap.to('.hero-canvas', {
      scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
    y: 200,
    scale: 1.1,
    opacity: 0.3,
  })

  gsap.to('.hero-content', {
      scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: '50% top',
      scrub: 1,
    },
    y: -100,
      opacity: 0,
  })

  // Simple reveal animations using CSS classes
  // This is more reliable than GSAP for initial visibility
  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Small delay to let CSS transition apply after class add
        requestAnimationFrame(() => {
          entry.target.classList.add('revealed')
        })
        revealObserver.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Helper to setup and observe elements
  const setupReveal = (el: Element, delay = 0) => {
    const htmlEl = el as HTMLElement
    htmlEl.style.transitionDelay = `${delay}ms`
    el.classList.add('reveal-ready')
    
    // Check if already in viewport on page load
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setTimeout(() => {
        el.classList.add('revealed')
      }, 100 + delay)
    } else {
      revealObserver.observe(el)
    }
  }

  // Observe all reveal sections
  document.querySelectorAll('.reveal-section').forEach((section) => {
    setupReveal(section)
  })

  // Observe all card groups for staggered reveal
  document.querySelectorAll('.card-group').forEach((group) => {
    const cards = group.querySelectorAll('.card-reveal')
  cards.forEach((card, index) => {
      setupReveal(card, index * 80)
    })
  })

  // Observe standalone cards
  document.querySelectorAll('.card-reveal:not(.card-group .card-reveal)').forEach((card, index) => {
    setupReveal(card, index * 50)
  })

  // Stats counter animation - disabled while stats section is hidden
  // const stats = document.querySelectorAll('.stat-number')
  // stats.forEach((stat) => {
  //   const target = parseInt(stat.getAttribute('data-value') || '0', 10)
  //   const counter = { value: 0 }
  //   gsap.to(counter, {
  //     scrollTrigger: {
  //       trigger: stat,
  //       start: 'top 90%',
  //       toggleActions: 'play none none none',
  //     },
  //     value: target,
  //     duration: 2,
  //     ease: 'power2.out',
  //     onUpdate: function () {
  //       stat.textContent = Math.floor(counter.value).toLocaleString()
  //     },
  //   })
  // })

  // Floating elements
  gsap.to('.float', {
    duration: 3,
    y: -15,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.2,
  })

  // DNA icon rotation
  gsap.to('.dna-icon', {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: 'none',
  })

  // Pulse animation
  gsap.to('.pulse', {
    scale: 1.05,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })

  // Refresh ScrollTrigger after a short delay to catch any layout shifts
  setTimeout(() => {
    ScrollTrigger.refresh()
  }, 100)
})

onUnmounted(() => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
    }
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
})

// Watch for route changes to reinitialize home page content
watch(isHomePage, (newVal) => {
  if (newVal) {
    // Navigated back to home page - reinitialize
    nextTick(() => {
      // Restart canvas animation
      if (heroCanvas.value && animationId === null) {
        initVisualization()
        animate()
      }
      
      // Re-run reveal animations
      document.querySelectorAll('.reveal-section').forEach((section) => {
        section.classList.remove('revealed')
        section.classList.add('reveal-ready')
      })
      
      // Setup reveal observer again
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed')
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      )
      
      document.querySelectorAll('.reveal-section').forEach((section) => {
        revealObserver.observe(section)
      })
      
      // Re-run hero animations
      gsap.fromTo('.hero-word', 
        { opacity: 0, y: 50 },
        { duration: 1, opacity: 1, y: 0, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
      )
      gsap.fromTo('.hero-subtext',
        { opacity: 0, y: 30 },
        { duration: 1, opacity: 1, y: 0, delay: 0.8, ease: 'power3.out' }
      )
      gsap.fromTo('.hero-btn',
        { opacity: 0, y: 20, scale: 0.9 },
        { duration: 0.8, opacity: 1, y: 0, scale: 1, stagger: 0.15, delay: 1.1, ease: 'back.out(1.7)' }
      )
      gsap.fromTo('.hero-badge',
        { opacity: 0, scale: 0.8 },
        { duration: 1, opacity: 1, scale: 1, delay: 0.2, ease: 'elastic.out(1, 0.5)' }
      )
      
      setTimeout(() => ScrollTrigger.refresh(), 100)
    })
  } else {
    // Navigated away from home - stop canvas animation
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }
})
</script>

<template>
  <div class="min-h-screen overflow-hidden bg-[#020617]">
    <!-- Navigation -->
    <nav
      class="fixed top-0 z-50 w-full transition-all duration-500"
      :class="
        scrolled
          ? 'bg-[#020617]/90 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl'
          : 'bg-transparent'
      "
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <RouterLink to="/" class="flex items-center gap-3">
          <div
            class="dna-icon relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 shadow-lg shadow-cyan-500/30"
          >
            <span class="text-xl font-bold text-white">Σ</span>
            <div
              class="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"
            ></div>
          </div>
          <span
            class="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent"
            >Deep Bio Scientific</span
          >
        </RouterLink>

        <!-- Desktop Navigation -->
        <div class="hidden items-center gap-6 lg:flex">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="text-sm text-slate-400 transition-colors hover:text-white"
            active-class="text-white"
          >
            {{ link.name }}
          </RouterLink>
        </div>

        <!-- CTA Button -->
        <RouterLink
          to="/contact"
          class="hidden rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 hover:shadow-cyan-500/50 md:block"
        >
          Partner With Us
        </RouterLink>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden"
        >
          <svg v-if="!mobileMenuOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="mobileMenuOpen"
        class="border-t border-slate-800 bg-[#020617]/95 backdrop-blur-xl lg:hidden"
      >
        <div class="px-6 py-4">
          <div class="flex flex-col gap-4">
            <RouterLink
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="text-lg text-slate-300 transition-colors hover:text-white"
              @click="mobileMenuOpen = false"
            >
              {{ link.name }}
            </RouterLink>
            <RouterLink
              to="/contact"
              class="mt-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 text-center font-semibold text-white"
              @click="mobileMenuOpen = false"
            >
              Partner With Us
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page Content from Router (for non-home pages) -->
    <main v-if="!isHomePage" class="pt-20">
      <RouterView />
    </main>

    <!-- Home Page Content (only shown on home route) -->
    <template v-if="isHomePage">
    <!-- Hero Section -->
    <section
      class="hero-section relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-32"
    >
      <!-- Gradient Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617] z-10 pointer-events-none"
      ></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.08),transparent_60%)]"
      ></div>

      <!-- Animated Background Canvas -->
      <canvas
        ref="heroCanvas"
        class="hero-canvas absolute inset-0 h-full w-full"
        style="opacity: 0.85"
      ></canvas>

      <!-- Content Container -->
      <div class="hero-content relative z-20 mx-auto max-w-5xl text-center">
        <!-- Badge -->
        <div class="hero-badge mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 backdrop-blur-sm">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
          </span>
          <span class="text-sm font-medium text-cyan-300">AI-Powered Therapeutic Design</span>
        </div>

        <!-- Hero text -->
        <h1 class="mb-8 text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl lg:text-8xl">
          <span class="hero-word block">Design</span>
          <span class="hero-word block">
            <span class="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">mRNA</span>
            &
            <span class="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Protein</span>
          </span>
          <span class="hero-word block text-slate-300">Therapeutics</span>
        </h1>

        <p class="hero-subtext mx-auto mb-12 max-w-3xl text-lg text-slate-400 md:text-xl lg:text-2xl">
          From natural language specifications to validated therapeutic candidates.
          <span class="text-white">Evolutionary AI</span> meets
          <span class="text-cyan-400">molecular biology</span>.
        </p>

        <div class="flex flex-wrap justify-center gap-4">
          <button
            class="hero-btn group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-cyan-500/30 transition-all hover:shadow-cyan-500/50"
          >
            <span class="relative z-10">Start Discovery</span>
            <div
              class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity group-hover:opacity-100"
            ></div>
          </button>
          <button
            class="hero-btn rounded-full border-2 border-slate-700 bg-slate-900/50 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-slate-800/50"
          >
            Explore Platform
          </button>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 animate-bounce">
        <div class="flex h-10 w-6 items-start justify-center rounded-full border-2 border-slate-600 p-1">
          <div class="h-2 w-1 animate-pulse rounded-full bg-cyan-400"></div>
        </div>
      </div>
    </section>

    <!-- Stats Section - Hidden for now -->
    <!--
    <section class="relative z-20 -mt-20 px-6 reveal-section">
      <div class="mx-auto max-w-5xl">
        <div class="card-group grid grid-cols-2 gap-4 md:grid-cols-4">
          <div class="card-reveal rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-center backdrop-blur-xl">
            <div class="stat-number text-3xl font-bold text-cyan-400" data-value="1000">0</div>
            <div class="mt-1 text-sm text-slate-400">Candidates Designed</div>
          </div>
          <div class="card-reveal rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-center backdrop-blur-xl">
            <div class="stat-number text-3xl font-bold text-purple-400" data-value="47">0</div>
            <div class="mt-1 text-sm text-slate-400">Active Programs</div>
          </div>
          <div class="card-reveal rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-center backdrop-blur-xl">
            <div class="stat-number text-3xl font-bold text-pink-400" data-value="12">0</div>
            <div class="mt-1 text-sm text-slate-400">IND-Enabling</div>
          </div>
          <div class="card-reveal rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-center backdrop-blur-xl">
            <div class="stat-number text-3xl font-bold text-green-400" data-value="94">0</div>
            <div class="mt-1 text-sm text-slate-400">% Validation Rate</div>
          </div>
        </div>
      </div>
    </section>
    -->

    <!-- Platform Section -->
    <section id="platform" class="px-6 py-32 reveal-section">
      <div class="mx-auto max-w-6xl">
        <div class="mb-16 text-center">
          <span class="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-300">
            Platform
          </span>
          <h2 class="mb-4 text-4xl font-bold text-white md:text-5xl">
            Four Integrated <span class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Layers</span>
          </h2>
          <p class="mx-auto max-w-2xl text-lg text-slate-400">
            A unified platform combining language models, evolutionary optimization, and molecular simulation
          </p>
        </div>

        <div class="card-group grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <!-- Layer 1 -->
          <div class="card-reveal group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-900/50 p-8 transition-all hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10">
            <div class="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-cyan-500/10 blur-3xl transition-all group-hover:bg-cyan-500/20"></div>
            <div class="relative">
              <div class="float mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 ring-1 ring-cyan-500/30">
                <svg class="h-7 w-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
              </svg>
            </div>
              <h3 class="mb-3 text-xl font-bold text-white">Natural Language Spec</h3>
              <p class="text-sm leading-relaxed text-slate-400">
                Describe your therapeutic goal in plain English. Our compiler converts intent to precise molecular constraints.
              </p>
            </div>
          </div>

          <!-- Layer 2 -->
          <div class="card-reveal group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-900/50 p-8 transition-all hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10">
            <div class="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-purple-500/10 blur-3xl transition-all group-hover:bg-purple-500/20"></div>
            <div class="relative">
              <div class="float mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 ring-1 ring-purple-500/30">
                <svg class="h-7 w-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
              <h3 class="mb-3 text-xl font-bold text-white">Agentic Optimization</h3>
              <p class="text-sm leading-relaxed text-slate-400">
                Multi-agent system critiques, refines, and iterates on candidates across binding, stability, and manufacturability.
              </p>
            </div>
          </div>

          <!-- Layer 3 -->
          <div class="card-reveal group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-900/50 p-8 transition-all hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-500/10">
            <div class="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-pink-500/10 blur-3xl transition-all group-hover:bg-pink-500/20"></div>
            <div class="relative">
              <div class="float mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 ring-1 ring-pink-500/30">
                <svg class="h-7 w-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
              <h3 class="mb-3 text-xl font-bold text-white">Evolutionary Search</h3>
              <p class="text-sm leading-relaxed text-slate-400">
                Population-based genetic algorithms explore sequence space with Pareto-optimal selection.
              </p>
            </div>
          </div>

          <!-- Layer 4 -->
          <div class="card-reveal group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-900/50 p-8 transition-all hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10">
            <div class="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-green-500/10 blur-3xl transition-all group-hover:bg-green-500/20"></div>
            <div class="relative">
              <div class="float mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 ring-1 ring-green-500/30">
                <svg class="h-7 w-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
              <h3 class="mb-3 text-xl font-bold text-white">Delivery & mRNA</h3>
              <p class="text-sm leading-relaxed text-slate-400">
                Co-design mRNA constructs with optimized codons, UTRs, and delivery formulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Science Section - Modalities -->
    <section id="science" class="bg-gradient-to-b from-[#020617] via-slate-900/30 to-[#020617] px-6 py-32 reveal-section">
      <div class="mx-auto max-w-6xl">
        <div class="mb-16 text-center">
          <span class="mb-4 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-sm font-medium text-cyan-300">
            Therapeutic Modalities
          </span>
          <h2 class="mb-4 text-4xl font-bold text-white md:text-5xl">
            Purpose-Built for <span class="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Biologics</span>
          </h2>
          <p class="mx-auto max-w-2xl text-lg text-slate-400">
            Specialized pipelines for each therapeutic modality with validated experimental workflows
          </p>
        </div>

        <div class="card-group grid gap-8 md:grid-cols-3">
          <!-- mRNA Therapeutics -->
          <div class="card-reveal group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-1 h-full">
            <div class="absolute inset-0 bg-gradient-to-b from-cyan-500/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div class="relative h-full rounded-[1.25rem] bg-slate-900 p-8">
              <div class="mb-6 flex items-center gap-4">
                <div class="pulse flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/30">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
              </div>
              <div>
                  <h3 class="text-2xl font-bold text-white">mRNA</h3>
                  <p class="text-cyan-400">Therapeutics</p>
              </div>
              </div>
              <p class="mb-6 text-slate-400">
                Optimize expression, stability, and immunogenicity with delivery-aware design.
              </p>
              <ul class="space-y-3 text-sm">
                <li class="flex items-center gap-3 text-slate-300">
                  <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                  Codon optimization & UTR design
                </li>
                <li class="flex items-center gap-3 text-slate-300">
                  <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                  Personalized neoantigen vaccines
                </li>
                <li class="flex items-center gap-3 text-slate-300">
                  <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                  Protein replacement therapy
                </li>
              </ul>
            </div>
          </div>

          <!-- Protein Design -->
          <div class="card-reveal group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-1 h-full">
            <div class="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div class="relative h-full rounded-[1.25rem] bg-slate-900 p-8">
              <div class="mb-6 flex items-center gap-4">
                <div class="pulse flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/>
                </svg>
              </div>
              <div>
                  <h3 class="text-2xl font-bold text-white">Protein</h3>
                  <p class="text-purple-400">Binders & Scaffolds</p>
              </div>
              </div>
              <p class="mb-6 text-slate-400">
                Structure-informed design for binding specificity across diverse scaffold families.
              </p>
              <ul class="space-y-3 text-sm">
                <li class="flex items-center gap-3 text-slate-300">
                  <span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  De novo protein design
                </li>
                <li class="flex items-center gap-3 text-slate-300">
                  <span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  Bispecific & multispecific
                </li>
                <li class="flex items-center gap-3 text-slate-300">
                  <span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  Tissue-targeting scaffolds
                </li>
              </ul>
            </div>
          </div>

          <!-- Peptide Therapeutics -->
          <div class="card-reveal group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-1 h-full">
            <div class="absolute inset-0 bg-gradient-to-b from-pink-500/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div class="relative h-full rounded-[1.25rem] bg-slate-900 p-8">
              <div class="mb-6 flex items-center gap-4">
                <div class="pulse flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg shadow-pink-500/30">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                  <h3 class="text-2xl font-bold text-white">Peptide</h3>
                  <p class="text-pink-400">Therapeutics</p>
                </div>
              </div>
              <p class="mb-6 text-slate-400">
                Rapid iteration on potency and stability with well-characterized validation assays.
              </p>
              <ul class="space-y-3 text-sm">
                <li class="flex items-center gap-3 text-slate-300">
                  <span class="h-1.5 w-1.5 rounded-full bg-pink-500"></span>
                  GLP-1R, GCGR agonists
                </li>
                <li class="flex items-center gap-3 text-slate-300">
                  <span class="h-1.5 w-1.5 rounded-full bg-pink-500"></span>
                  Cytokine mimetics
                </li>
                <li class="flex items-center gap-3 text-slate-300">
                  <span class="h-1.5 w-1.5 rounded-full bg-pink-500"></span>
                  Stapled & cyclic peptides
                </li>
              </ul>
              </div>
            </div>
          </div>
      </div>
    </section>

    <!-- Why Partner Section -->
    <section class="px-6 py-32 reveal-section">
      <div class="mx-auto max-w-6xl">
        <div class="mb-16 text-center">
          <span class="mb-4 inline-block rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1 text-sm font-medium text-pink-300">
            Advantages
          </span>
          <h2 class="mb-4 text-4xl font-bold text-white md:text-5xl">
            Why <span class="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">Sequentia</span>
          </h2>
        </div>

        <div class="card-group grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div class="card-reveal group rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-cyan-500/30">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30 transition-transform group-hover:scale-110">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            <h3 class="mb-2 text-lg font-bold text-white">10x Faster Cycles</h3>
            <p class="text-sm text-slate-400">Design to validated candidates in weeks, not months. Rapid iteration at unprecedented scale.</p>
              </div>

          <div class="card-reveal group rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-purple-500/30">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/30 transition-transform group-hover:scale-110">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
            <h3 class="mb-2 text-lg font-bold text-white">Multi-Objective</h3>
            <p class="text-sm text-slate-400">Simultaneous optimization of potency, safety, manufacturability, and clinical viability.</p>
          </div>

          <div class="card-reveal group rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-pink-500/30">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 ring-1 ring-pink-500/30 transition-transform group-hover:scale-110">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
            <h3 class="mb-2 text-lg font-bold text-white">Full IP Clarity</h3>
            <p class="text-sm text-slate-400">Clear ownership terms. Your molecules, your data, your path to clinic and commercialization.</p>
              </div>

          <div class="card-reveal group rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-green-500/30">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400 ring-1 ring-green-500/30 transition-transform group-hover:scale-110">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 class="mb-2 text-lg font-bold text-white">Regulatory Ready</h3>
            <p class="text-sm text-slate-400">Integrated compliance design. Pre-clinical documentation and validation packages included.</p>
          </div>

          <div class="card-reveal group rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-amber-500/30">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30 transition-transform group-hover:scale-110">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
            <h3 class="mb-2 text-lg font-bold text-white">GMP Manufacturing</h3>
            <p class="text-sm text-slate-400">Integrated manufacturing partners for mRNA and protein. Scale seamlessly from discovery to clinic.</p>
              </div>

          <div class="card-reveal group rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-blue-500/30">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30 transition-transform group-hover:scale-110">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 class="mb-2 text-lg font-bold text-white">Human in the Loop</h3>
            <p class="text-sm text-slate-400">Expert scientists review every step. Your team maintains insight and control throughout.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Partnership Models -->
    <section id="partnerships" class="bg-gradient-to-b from-[#020617] via-slate-900/30 to-[#020617] px-6 py-32 reveal-section">
      <div class="mx-auto max-w-6xl">
        <div class="mb-16 text-center">
          <span class="mb-4 inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-sm font-medium text-green-300">
            Partnerships
          </span>
          <h2 class="mb-4 text-4xl font-bold text-white md:text-5xl">
            Flexible <span class="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Engagement</span>
          </h2>
          <p class="mx-auto max-w-2xl text-lg text-slate-400">
            Partnership models tailored to your stage and strategy
          </p>
        </div>

        <div class="card-group grid gap-8 md:grid-cols-3">
          <!-- Co-Development -->
          <div class="card-reveal rounded-3xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-cyan-500/30">
            <div class="mb-6">
              <span class="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 ring-1 ring-cyan-500/30">
                Joint Discovery
              </span>
            </div>
            <h3 class="mb-3 text-2xl font-bold text-white">Co-Development</h3>
            <p class="mb-6 text-slate-400">
              Collaborative programs with shared risk and reward. IP co-ownership with clear licensing terms.
            </p>
            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex items-center gap-2">
                <svg class="h-4 w-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Dedicated team allocation
              </li>
              <li class="flex items-center gap-2">
                <svg class="h-4 w-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Milestone-based payments
              </li>
              <li class="flex items-center gap-2">
                <svg class="h-4 w-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Revenue sharing
              </li>
            </ul>
          </div>

          <!-- Technology License -->
          <div class="card-reveal relative rounded-3xl border-2 border-purple-500/50 bg-slate-900/50 p-8 shadow-xl shadow-purple-500/10">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2">
              <span class="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                POPULAR
              </span>
            </div>
            <div class="mb-6 pt-2">
              <span class="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400 ring-1 ring-purple-500/30">
                Platform Access
              </span>
            </div>
            <h3 class="mb-3 text-2xl font-bold text-white">Technology License</h3>
            <p class="mb-6 text-slate-400">
              Full platform access for internal discovery programs with expert support and training.
            </p>
            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex items-center gap-2">
                <svg class="h-4 w-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Exclusive field license
              </li>
              <li class="flex items-center gap-2">
                <svg class="h-4 w-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Full training & onboarding
              </li>
              <li class="flex items-center gap-2">
                <svg class="h-4 w-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Annual + success royalties
              </li>
            </ul>
          </div>

          <!-- Design Service -->
          <div class="card-reveal rounded-3xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-pink-500/30">
            <div class="mb-6">
              <span class="rounded-full bg-pink-500/10 px-3 py-1 text-xs font-medium text-pink-400 ring-1 ring-pink-500/30">
                Project-Based
              </span>
            </div>
            <h3 class="mb-3 text-2xl font-bold text-white">Design Service</h3>
            <p class="mb-6 text-slate-400">
              We design, you validate. Pay per project or milestone with no long-term commitment.
            </p>
            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex items-center gap-2">
                <svg class="h-4 w-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Custom specifications
              </li>
              <li class="flex items-center gap-2">
                <svg class="h-4 w-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Flexible scope
              </li>
              <li class="flex items-center gap-2">
                <svg class="h-4 w-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                No upfront commitment
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative overflow-hidden px-6 py-32 reveal-section">
      <div class="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-pink-600/20"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.15),transparent_50%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.15),transparent_50%)]"></div>
      
      <div class="relative mx-auto max-w-4xl text-center">
        <h2 class="mb-6 text-4xl font-bold text-white md:text-6xl">
          Ready to Design the
          <span class="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Future</span>?
        </h2>
        <p class="mx-auto mb-12 max-w-2xl text-xl text-slate-300">
          Partner with us to accelerate your therapeutic program from concept to clinic.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <button class="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-bold text-slate-900 shadow-2xl transition-all hover:shadow-white/20">
            <span class="relative z-10">Schedule Partnership Call</span>
          </button>
          <button class="rounded-full border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/5">
            Download Case Studies
          </button>
        </div>
      </div>
    </section>
    </template>

    <!-- Footer -->
    <footer class="border-t border-slate-800 bg-[#020617] px-6 py-16">
      <div class="mx-auto max-w-6xl">
        <div class="mb-12 grid gap-12 md:grid-cols-4">
          <div>
            <RouterLink to="/" class="mb-4 flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 shadow-lg shadow-cyan-500/30">
                <span class="text-xl font-bold text-white">Σ</span>
              </div>
              <span class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">Sequentia</span>
            </RouterLink>
            <p class="text-sm text-slate-500">
              AI-powered therapeutic design for mRNA and protein medicines.
            </p>
          </div>
          <div>
            <h4 class="mb-4 font-bold text-white">Platform</h4>
            <ul class="space-y-2 text-sm text-slate-400">
              <li><RouterLink to="/technology" class="transition hover:text-white">Technology</RouterLink></li>
              <li><RouterLink to="/research" class="transition hover:text-white">Research</RouterLink></li>
              <li><RouterLink to="/case-studies" class="transition hover:text-white">Case Studies</RouterLink></li>
            </ul>
          </div>
          <div>
            <h4 class="mb-4 font-bold text-white">Company</h4>
            <ul class="space-y-2 text-sm text-slate-400">
              <li><RouterLink to="/about" class="transition hover:text-white">About</RouterLink></li>
              <li><RouterLink to="/blog" class="transition hover:text-white">Blog</RouterLink></li>
              <li><RouterLink to="/careers" class="transition hover:text-white">Careers</RouterLink></li>
              <li><RouterLink to="/contact" class="transition hover:text-white">Contact</RouterLink></li>
            </ul>
          </div>
          <div>
            <h4 class="mb-4 font-bold text-white">Legal</h4>
            <ul class="space-y-2 text-sm text-slate-400">
              <li><a href="#" class="transition hover:text-white">Privacy Policy</a></li>
              <li><a href="#" class="transition hover:text-white">Terms of Service</a></li>
              <li><a href="#" class="transition hover:text-white">IP Policy</a></li>
              <li><a href="#" class="transition hover:text-white">Security</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-slate-800 pt-8">
          <p class="text-center text-sm text-slate-600">
            © 2025 Sequentia. Designing the next generation of therapeutic molecules.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Reveal animations with CSS transitions */
.reveal-ready {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;
}

.reveal-ready.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Fallback for when JS doesn't load - ensure visibility */
@media (prefers-reduced-motion: reduce) {
  .reveal-ready {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
