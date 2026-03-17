<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import deepbioLogo from '@/assets/deepbio-logo.png'
import deepbioText from '@/assets/deepbio-text.png'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useTheme } from '@/composables/useTheme'

const { init: initTheme, canvasColors } = useTheme()

const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const route = useRoute()
const isHomePage = computed(() => route.path === '/')

const navLinks = [
  { name: 'Technology', path: '/technology' },
  { name: 'Research', path: '/research' },
  { name: 'Research Highlights', path: '/case-studies' },
  { name: 'Platform', path: '/platform' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'About', path: '/about' },
]
const heroCanvas = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let time = 0
let mouseX = 0
let mouseY = 0


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

  // Create mRNA double helix structure - prominent size
  const helixLength = 70
  const helixRadius = 130
  const helixPitch = 5.5

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
  for (let i = 0; i < 25; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = 180 + Math.random() * 200
    const types: ('ribosome' | 'amino' | 'codon')[] = ['ribosome', 'amino', 'codon']
    const type = types[Math.floor(Math.random() * 3)]

    molecules.push({
      x: Math.cos(angle) * distance,
      y: (Math.random() - 0.5) * 500,
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
  // Position DNA center on the right side (65% from left on desktop, centered on mobile)
  const isMobile = width < 1024
  const centerX = isMobile ? width / 2 : width * 0.65
  const centerY = height / 2

  // Clear canvas - full clear for crisp rendering
  ctx.clearRect(0, 0, width, height)

  // Mouse influence for interactivity
  const targetMouseX = (mouseX - centerX) * 0.0003
  const targetMouseY = (mouseY - centerY) * 0.0003

  // Draw connections between base pairs first (behind nucleotides)
  ctx.strokeStyle = canvasColors.value.connectionStroke
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

    // Rotate based on time and mouse - faster rotation for more dynamic feel
    const rotY = time * 0.012 + targetMouseX * 2
    const rotX = targetMouseY

    const cos1 = Math.cos(rotY)
    const sin1 = Math.sin(rotY)
    const cos2 = Math.cos(rotX)
    const sin2 = Math.sin(rotX)

    // Apply rotation
    const rx1 = x1 * cos1 - z1 * sin1
    let rz1 = x1 * sin1 + z1 * cos1
    const ry1 = y1 * cos2 - rz1 * sin2
    rz1 = y1 * sin2 + rz1 * cos2

    const rx2 = x2 * cos1 - z2 * sin1
    let rz2 = x2 * sin1 + z2 * cos1
    const ry2 = y2 * cos2 - rz2 * sin2
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

    // Calculate radius with safety check - larger nucleotides for better visibility
    const baseRadius = 8
    const radius = Math.max(1, baseRadius * scale)

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
      ctx.fillStyle = canvasColors.value.nucleotideLabel
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

    // Apply rotation - match helix rotation speed
    const rotY = time * 0.012 + targetMouseX * 2
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
  gsap.registerPlugin(ScrollTrigger)
  initTheme()

  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 10
  })

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
  gsap.fromTo('.hero-btn',
    { opacity: 0, y: 20, scale: 0.9 },
    { duration: 0.8, opacity: 1, y: 0, scale: 1, stagger: 0.15, delay: 1.1, ease: 'back.out(1.7)' }
  )

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

      // Immediately animate all card-reveal elements that are in viewport
      document.querySelectorAll('.card-reveal').forEach((card) => {
        gsap.set(card, { opacity: 1, y: 0, scale: 1 })
      })

      // Setup card group observer for staggered reveal (for elements not yet in viewport)
      const cardObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const cards = entry.target.querySelectorAll('.card-reveal')
              gsap.fromTo(cards,
                { opacity: 0, y: 40, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out' }
              )
              cardObserver.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1 }
      )

      document.querySelectorAll('.card-group').forEach((group) => {
        // Reset cards first for animation
        const cards = group.querySelectorAll('.card-reveal')
        gsap.set(cards, { opacity: 0, y: 40, scale: 0.95 })
        cardObserver.observe(group)
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

      // Animate hero stats
      gsap.fromTo('.hero-stat',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out', delay: 0.5 }
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
  <div class="min-h-screen overflow-hidden bg-[rgb(var(--bg-base))]">
    <!-- Navigation -->
    <nav
      aria-label="Main navigation"
      class="fixed top-0 z-50 w-full transition-all duration-500"
      :class="
        scrolled
          ? 'bg-[rgb(var(--bg-base))]/90 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl'
          : 'bg-transparent'
      "
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <RouterLink to="/" class="flex items-center gap-3">
          <img
            :src="deepbioLogo"
            alt="DeepBio Scientific Logo"
            class="h-10 w-auto"
          />
          <img
            :src="deepbioText"
            alt="DeepBio Scientific"
            class="h-8 w-auto"
          />
        </RouterLink>

        <!-- Desktop Navigation -->
        <div class="hidden items-center gap-6 lg:flex">
          <template v-for="link in navLinks" :key="link.path">
            <a
              v-if="link.external"
              :href="link.path"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-[rgb(var(--text-body))] transition-colors hover:text-[rgb(var(--text-heading))]"
            >
              {{ link.name }}
            </a>
            <RouterLink
              v-else
              :to="link.path"
              class="text-sm text-[rgb(var(--text-body))] transition-colors hover:text-[rgb(var(--text-heading))]"
              active-class="text-[rgb(var(--text-heading))]"
            >
              {{ link.name }}
            </RouterLink>
          </template>
        </div>

        <!-- CTA Button + Theme Toggle -->
        <div class="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <RouterLink
            to="/contact"
            class="rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 hover:shadow-cyan-500/50"
          >
            Partner With Us
          </RouterLink>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="flex h-10 w-10 items-center justify-center rounded-lg text-[rgb(var(--text-heading))] lg:hidden"
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
        class="border-t border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-base))]/95 backdrop-blur-xl lg:hidden"
      >
        <div class="px-6 py-4">
          <div class="flex flex-col gap-4">
            <template v-for="link in navLinks" :key="link.path">
              <a
                v-if="link.external"
                :href="link.path"
                target="_blank"
                rel="noopener noreferrer"
                class="text-lg text-[rgb(var(--text-primary))] transition-colors hover:text-[rgb(var(--text-heading))]"
                @click="mobileMenuOpen = false"
              >
                {{ link.name }}
              </a>
              <RouterLink
                v-else
                :to="link.path"
                class="text-lg text-[rgb(var(--text-primary))] transition-colors hover:text-[rgb(var(--text-heading))]"
                @click="mobileMenuOpen = false"
              >
                {{ link.name }}
              </RouterLink>
            </template>
            <div class="mt-4 flex items-center gap-3">
              <ThemeToggle />
              <RouterLink
                to="/contact"
                class="flex-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 text-center font-semibold text-white"
                @click="mobileMenuOpen = false"
              >
                Partner With Us
              </RouterLink>
            </div>
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

    <!-- Global Fancy Background for Homepage -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <!-- Gradient orbs -->
      <div class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-blue-500/8 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
      <div class="absolute bottom-1/3 left-1/3 w-[350px] h-[350px] bg-green-500/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1.5s"></div>

      <!-- Grid pattern -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

      <!-- Floating particles -->
      <div
        v-for="i in 25"
        :key="'particle-' + i"
        class="floating-particle absolute rounded-full"
        :class="[
          i % 4 === 0 ? 'bg-cyan-400 w-1.5 h-1.5' :
          i % 4 === 1 ? 'bg-purple-400 w-1 h-1' :
          i % 4 === 2 ? 'bg-blue-400 w-1.5 h-1.5' :
          'bg-green-400 w-1 h-1'
        ]"
        :style="{
          left: `${(i * 17) % 100}%`,
          top: `${(i * 23) % 100}%`,
          opacity: 0.2 + (i % 5) * 0.1,
        }"
      ></div>
    </div>

    <!-- Hero Section -->
    <section
      class="hero-section relative min-h-screen overflow-hidden"
    >
      <!-- Full Background Glow Effects -->
      <div class="absolute inset-0 pointer-events-none">
        <!-- Main glow centered on right side where DNA is -->
        <div class="absolute top-1/2 right-[15%] -translate-y-1/2 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] rounded-full bg-gradient-to-br from-cyan-500/25 via-purple-500/15 to-blue-500/20 blur-[120px]"></div>
        <!-- Secondary glow extending to the left -->
        <div class="absolute top-1/2 left-[20%] -translate-y-1/2 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-gradient-to-r from-purple-500/10 via-cyan-500/8 to-transparent blur-[100px]"></div>
        <!-- Top accent glow -->
        <div class="absolute top-0 right-[30%] w-[300px] h-[300px] rounded-full bg-cyan-400/10 blur-[80px]"></div>
      </div>

      <!-- Gradient Overlays -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-[rgb(var(--bg-base))] via-transparent to-[rgb(var(--bg-base))] z-[5] pointer-events-none"
      ></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(34,211,238,0.08),transparent_60%)]"
      ></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(168,85,247,0.05),transparent_50%)]"
      ></div>

      <!-- DNA Canvas - Full width, positioned to the right -->
      <canvas
        ref="heroCanvas"
        class="hero-canvas absolute inset-0 w-full h-full z-[1]"
      ></canvas>

      <!-- Content Layer -->
      <div class="relative z-20 mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row lg:items-center px-6 pt-24 lg:pt-0">

        <!-- Left Column - Hero Content -->
        <div class="hero-content relative flex-1 flex flex-col justify-center py-12 lg:py-0 text-center lg:text-left lg:pr-8">
          <!-- Badge -->
          <div class="hero-badge mb-6 lg:mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-600/40 dark:border-cyan-500/30 bg-cyan-500/15 dark:bg-cyan-500/10 px-4 py-2 backdrop-blur-sm self-center lg:self-start">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 dark:bg-cyan-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-cyan-600 dark:bg-cyan-500"></span>
            </span>
            <span class="text-sm font-medium text-cyan-700 dark:text-cyan-300">mRNA Therapeutics AI Platform</span>
          </div>

          <!-- Hero text -->
          <h1 class="mb-6 lg:mb-8 text-4xl font-bold leading-tight tracking-tight text-[rgb(var(--text-heading))] md:text-5xl lg:text-6xl xl:text-7xl">
            <span class="hero-word block">AI Co-Scientist for</span>
            <span class="hero-word block">
              <span class="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 dark:from-cyan-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">mRNA Therapeutics</span>
            </span>
          </h1>

          <p class="hero-subtext mb-8 lg:mb-10 max-w-xl text-base text-[rgb(var(--text-body))] md:text-lg lg:text-xl mx-auto lg:mx-0">
            The first equivariant foundation model for mRNA design (<span class="text-emerald-600 dark:text-emerald-400 font-medium">NeurIPS 2025</span>), powering an AI co-scientist platform for the
            <span class="text-cyan-600 dark:text-cyan-400 font-semibold">$50B+ mRNA therapeutics market</span>.
          </p>

          <div class="flex flex-wrap justify-center lg:justify-start gap-4">
            <RouterLink
              to="/platform"
              class="hero-btn group relative inline-block overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-3 lg:px-8 lg:py-4 text-base lg:text-lg font-semibold text-white shadow-2xl shadow-cyan-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-105"
              style="opacity: 1; visibility: visible;"
            >
              <span class="relative z-10">Try Helixir AI</span>
              <div
                class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 transition-opacity group-hover:opacity-100"
              ></div>
            </RouterLink>
            <RouterLink
              to="/contact"
              class="hero-btn rounded-full border-2 border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-card))/0.5] px-6 py-3 lg:px-8 lg:py-4 text-base lg:text-lg font-semibold text-[rgb(var(--text-heading))] backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-[rgb(var(--bg-card-muted))/0.5] hover:scale-105"
              style="opacity: 1; visibility: visible;"
            >
              Partner With Us
            </RouterLink>
          </div>

          <!-- Key Stats Row -->
          <div class="mt-10 lg:mt-12 grid grid-cols-3 gap-4 lg:gap-8">
            <div class="hero-stat text-center lg:text-left">
              <div class="text-2xl lg:text-3xl font-bold text-cyan-600 dark:text-cyan-400">~10%</div>
              <div class="text-xs lg:text-sm text-[rgb(var(--text-muted))]">Better expression prediction accuracy</div>
            </div>
            <div class="hero-stat text-center">
              <div class="text-2xl lg:text-3xl font-bold text-emerald-600 dark:text-emerald-400">~4x</div>
              <div class="text-xs lg:text-sm text-[rgb(var(--text-muted))]">Frechet BioDistance improvement</div>
            </div>
            <div class="hero-stat text-center lg:text-right">
              <div class="text-2xl lg:text-3xl font-bold text-teal-600 dark:text-teal-400">NeurIPS '25</div>
              <div class="text-xs lg:text-sm text-[rgb(var(--text-muted))]">Peer-reviewed publication</div>
            </div>
          </div>
        </div>

        <!-- Right Column - Space for DNA (canvas renders here visually) -->
        <div class="hidden lg:block flex-1 pointer-events-none"></div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 animate-bounce">
        <div class="flex h-10 w-6 items-start justify-center rounded-full border-2 border-[rgb(var(--border-subtle))] p-1">
          <div class="h-2 w-1 animate-pulse rounded-full bg-cyan-400"></div>
        </div>
      </div>
    </section>

    <!-- Logo Ticker Section -->
    <section class="logo-ticker-section relative z-10 overflow-hidden border-y border-[rgb(var(--border-primary))/0.3] bg-[rgb(var(--bg-base))/0.9] py-10 backdrop-blur-sm">
      <div class="mb-6 text-center">
        <span class="text-xs font-semibold uppercase tracking-[0.25em] text-[rgb(var(--text-muted))]">Supported By</span>
      </div>

      <div class="logo-ticker-wrapper">
        <!-- Fade edges -->
        <div class="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[rgb(var(--bg-base))] to-transparent"></div>
        <div class="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[rgb(var(--bg-base))] to-transparent"></div>

        <div class="logo-ticker-track">
          <!-- Two identical groups — animation scrolls exactly one group (-50%) then resets seamlessly -->
          <template v-for="group in 2" :key="'g' + group">
            <template v-for="copy in 6" :key="'g' + group + 'c' + copy">
              <a href="https://www.nvidia.com/en-us/startups/" target="_blank" rel="noopener noreferrer" class="logo-ticker-item" :aria-hidden="group > 1 || copy > 1 ? true : undefined">
                <img src="/logos/nvidia-inception.png" :alt="group === 1 && copy === 1 ? 'NVIDIA Inception Program' : ''" class="logo-ticker-img logo-ticker-img--nvidia dark:hidden" />
                <img src="/logos/nvidia-inception-dark.png" :alt="group === 1 && copy === 1 ? 'NVIDIA Inception Program' : ''" class="logo-ticker-img logo-ticker-img--nvidia logo-ticker-img--nvidia-dark hidden dark:block" />
              </a>
              <a href="https://www.nsf.gov/news/special_reports/i-corps/" target="_blank" rel="noopener noreferrer" class="logo-ticker-item" :aria-hidden="group > 1 || copy > 1 ? true : undefined">
                <img src="/logos/nsf-icorps.png" :alt="group === 1 && copy === 1 ? 'NSF I-Corps' : ''" class="logo-ticker-img" />
              </a>
              <a href="https://startup.google.com/" target="_blank" rel="noopener noreferrer" class="logo-ticker-item" :aria-hidden="group > 1 || copy > 1 ? true : undefined">
                <img src="/logos/google-for-startups.png" :alt="group === 1 && copy === 1 ? 'Google for Startups' : ''" class="logo-ticker-img logo-ticker-img--google" />
              </a>
            </template>
          </template>
        </div>
      </div>
    </section>

    <!-- Stats Section - Hidden for now -->
    <!--
    <section class="relative z-20 -mt-20 px-6 reveal-section">
      <div class="mx-auto max-w-5xl">
        <div class="card-group grid grid-cols-2 gap-4 md:grid-cols-4">
          <div class="card-reveal rounded-2xl border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-card))/0.8] p-6 text-center backdrop-blur-xl">
            <div class="stat-number text-3xl font-bold text-cyan-400" data-value="1000">0</div>
            <div class="mt-1 text-sm text-[rgb(var(--text-body))]">Candidates Designed</div>
          </div>
          <div class="card-reveal rounded-2xl border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-card))/0.8] p-6 text-center backdrop-blur-xl">
            <div class="stat-number text-3xl font-bold text-purple-400" data-value="47">0</div>
            <div class="mt-1 text-sm text-[rgb(var(--text-body))]">Active Programs</div>
          </div>
          <div class="card-reveal rounded-2xl border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-card))/0.8] p-6 text-center backdrop-blur-xl">
            <div class="stat-number text-3xl font-bold text-blue-400" data-value="12">0</div>
            <div class="mt-1 text-sm text-[rgb(var(--text-body))]">IND-Enabling</div>
          </div>
          <div class="card-reveal rounded-2xl border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-card))/0.8] p-6 text-center backdrop-blur-xl">
            <div class="stat-number text-3xl font-bold text-green-400" data-value="94">0</div>
            <div class="mt-1 text-sm text-[rgb(var(--text-body))]">% Validation Rate</div>
          </div>
        </div>
      </div>
    </section>
    -->

    <!-- Two Ways We Solve It -->
    <section id="solutions" class="relative z-10 px-6 py-32 reveal-section">
      <div class="mx-auto max-w-6xl">
        <div class="mb-16 text-center">
          <span class="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-600/40 dark:border-emerald-500/30 bg-emerald-500/15 dark:bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300 backdrop-blur-sm">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Get Started
          </span>
          <h2 class="mb-4 text-4xl font-bold text-[rgb(var(--text-heading))] md:text-5xl">
            Two Ways <span class="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 dark:from-cyan-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">We Solve It</span>
          </h2>
        </div>

        <div class="card-group grid gap-8 md:grid-cols-2">
          <!-- Helixir AI Platform -->
          <div class="card-reveal group relative overflow-hidden rounded-3xl border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-card))/0.5] p-1 h-full">
            <div class="absolute inset-0 bg-gradient-to-b from-cyan-500/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div class="relative h-full rounded-[1.25rem] bg-[rgb(var(--bg-card))] p-8">
              <div class="mb-6 flex items-center gap-4">
                <div class="pulse flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg shadow-cyan-500/30">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-[rgb(var(--text-heading))]">Helixir AI Platform</h3>
                </div>
              </div>
              <p class="mb-6 text-lg text-[rgb(var(--text-body))]">
                Self-serve mRNA design for researchers and biotech teams. Immediate access, immediate value.
              </p>
              <ul class="space-y-3 text-sm mb-8">
                <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                  <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                  Self-serve, start free
                </li>
                <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                  <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                  Pay-as-you-go pricing
                </li>
                <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                  <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                  Scales with your research
                </li>
              </ul>
              <RouterLink to="/platform" class="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                Try Helixir AI
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </RouterLink>
            </div>
          </div>

          <!-- Pharma Partnerships -->
          <div class="card-reveal group relative overflow-hidden rounded-3xl border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-card))/0.5] p-1 h-full">
            <div class="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div class="relative h-full rounded-[1.25rem] bg-[rgb(var(--bg-card))] p-8">
              <div class="mb-6 flex items-center gap-4">
                <div class="pulse flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-[rgb(var(--text-heading))]">Pharma Partnerships</h3>
                </div>
              </div>
              <p class="mb-6 text-lg text-[rgb(var(--text-body))]">
                Custom mRNA design programs for pharma and biotech. Higher-value engagements with milestone-based upside.
              </p>
              <ul class="space-y-3 text-sm mb-8">
                <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                  <span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  Per-program engagement
                </li>
                <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                  <span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  Milestone + royalty structure
                </li>
                <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                  <span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  Dedicated support team
                </li>
              </ul>
              <RouterLink to="/contact" class="inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                Schedule a call
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- Why Partner Section -->
    <section class="relative z-10 px-6 py-32 reveal-section">
      <div class="mx-auto max-w-6xl">
        <div class="mb-16 text-center">
          <span class="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-600/40 dark:border-teal-500/30 bg-teal-500/15 dark:bg-teal-500/10 px-5 py-2 text-sm font-medium text-teal-700 dark:text-teal-300 backdrop-blur-sm">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
            </span>
            Our Advantage
          </span>
          <h2 class="mb-4 text-4xl font-bold text-[rgb(var(--text-heading))] md:text-5xl">
            Why <span class="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 dark:from-cyan-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">DeepBio Scientific</span>
          </h2>
        </div>

        <div class="card-group grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div class="card-reveal group rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 ring-1 ring-cyan-500/30 transition-transform group-hover:scale-110">
              <svg class="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 class="mb-2 text-lg font-bold text-[rgb(var(--text-heading))] group-hover:text-cyan-400 transition-colors">World Model Architecture</h3>
            <p class="text-sm text-[rgb(var(--text-body))]">A provenance-grounded world model that reasons across biological systems, not just pattern-matching on molecules.</p>
          </div>

          <div class="card-reveal group rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl transition-all duration-300 hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-1">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-500/5 ring-1 ring-teal-500/30 transition-transform group-hover:scale-110">
              <svg class="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </div>
            <h3 class="mb-2 text-lg font-bold text-[rgb(var(--text-heading))] group-hover:text-teal-400 transition-colors">Higher Success Rates</h3>
            <p class="text-sm text-[rgb(var(--text-body))]">Calibrated probability models predict and improve clinical success, addressing the 90% failure rate problem.</p>
          </div>

          <div class="card-reveal group rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 ring-1 ring-emerald-500/30 transition-transform group-hover:scale-110">
              <svg class="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h3 class="mb-2 text-lg font-bold text-[rgb(var(--text-heading))] group-hover:text-emerald-400 transition-colors">30-50% Time Savings</h3>
            <p class="text-sm text-[rgb(var(--text-body))]">Cut years off development timelines with AI-driven automation across every pipeline stage.</p>
          </div>

          <div class="card-reveal group rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 ring-1 ring-blue-500/30 transition-transform group-hover:scale-110">
              <svg class="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <h3 class="mb-2 text-lg font-bold text-[rgb(var(--text-heading))] group-hover:text-blue-400 transition-colors">AgentFabric™</h3>
            <p class="text-sm text-[rgb(var(--text-body))]">Specialist agents debate and iterate, with a judge agent forcing explicit tradeoffs and decisions.</p>
          </div>

          <div class="card-reveal group rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 ring-1 ring-indigo-500/30 transition-transform group-hover:scale-110">
              <svg class="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <h3 class="mb-2 text-lg font-bold text-[rgb(var(--text-heading))] group-hover:text-indigo-400 transition-colors">Trial Optimization</h3>
            <p class="text-sm text-[rgb(var(--text-body))]">AI-generated protocols, patient matching, and eligibility criteria that maximize recruitment and success.</p>
          </div>

          <div class="card-reveal group rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl transition-all duration-300 hover:border-slate-500/30 hover:shadow-lg hover:shadow-slate-500/10 hover:-translate-y-1">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500/20 to-slate-500/5 ring-1 ring-slate-500/30 transition-transform group-hover:scale-110">
              <svg class="w-7 h-7 text-[rgb(var(--text-body))]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <h3 class="mb-2 text-lg font-bold text-[rgb(var(--text-heading))] group-hover:text-[rgb(var(--text-primary))] transition-colors">Full Audit Trail</h3>
            <p class="text-sm text-[rgb(var(--text-body))]">Every prediction traced to source data. No hallucinations, just grounded, explainable reasoning.</p>
          </div>
        </div>
      </div>
    </section>


    <!-- CTA Section -->
    <section class="relative z-10 overflow-hidden px-6 py-32 reveal-section">
      <div class="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-blue-600/20"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.15),transparent_50%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.15),transparent_50%)]"></div>

      <!-- Animated orbs in CTA -->
      <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>

      <div class="relative mx-auto max-w-4xl text-center">
        <h2 class="mb-6 text-4xl font-bold text-[rgb(var(--text-heading))] md:text-6xl">
          Join Us in Building a
          <span class="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 dark:from-cyan-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent animate-gradient">Disease-Free World</span>
        </h2>
        <p class="mx-auto mb-12 max-w-2xl text-xl text-[rgb(var(--text-primary))]">
          Partner with us to accelerate your therapeutic program from concept to clinic.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <RouterLink
            to="/contact"
            class="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-bold text-slate-900 shadow-2xl transition-all hover:shadow-white/30 hover:scale-105"
          >
            <span class="relative z-10">Schedule Partnership Call</span>
            <div class="absolute inset-0 bg-gradient-to-r from-cyan-100 to-purple-100 opacity-0 transition-opacity group-hover:opacity-100"></div>
          </RouterLink>
          <RouterLink
            to="/case-studies"
            class="rounded-full border-2 border-white/30 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10 hover:scale-105"
          >
            View Research Highlights
          </RouterLink>
        </div>
      </div>
    </section>
    </template>

    <!-- Footer -->
    <footer class="border-t border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-base))] px-6 py-16">
      <div class="mx-auto max-w-6xl">
        <div class="mb-12 grid gap-12 md:grid-cols-4">
          <div>
            <RouterLink to="/" class="mb-4 flex items-center gap-3">
              <img
                :src="deepbioLogo"
                alt="DeepBio Scientific Logo"
                class="h-10 w-auto"
              />
              <img
                :src="deepbioText"
                alt="DeepBio Scientific"
                class="h-8 w-auto"
              />
            </RouterLink>
            <p class="text-sm text-[rgb(var(--text-muted))]">
              AI-powered platform for optimizing every stage of the drug discovery pipeline.
            </p>
            <div class="mt-4 flex items-center gap-3">
              <a href="https://www.linkedin.com/company/deepbio-scientific/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="flex h-8 w-8 items-center justify-center rounded-lg text-[rgb(var(--text-muted))] transition-colors hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-500/15 dark:hover:text-blue-400">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <!-- <a href="#" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" class="flex h-8 w-8 items-center justify-center rounded-lg text-[rgb(var(--text-muted))] transition-colors hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="flex h-8 w-8 items-center justify-center rounded-lg text-[rgb(var(--text-muted))] transition-colors hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Bluesky" class="flex h-8 w-8 items-center justify-center rounded-lg text-[rgb(var(--text-muted))] transition-colors hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-sky-500/15 dark:hover:text-sky-400">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.627 3.585 3.493 6.18 3.252-4.466.766-8.423 2.632-3.203 9.204C9.876 27.268 11.383 18.317 12 16.56c.617 1.757 2.124 10.708 8.399 6.143 5.22-6.572 1.263-8.438-3.203-9.204 2.595.241 5.395-.625 6.18-3.252.246-.828.624-5.789.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/></svg>
              </a> -->
            </div>
          </div>
          <div>
            <h4 class="mb-4 font-bold text-[rgb(var(--text-heading))]">Platform</h4>
            <ul class="space-y-2 text-sm text-[rgb(var(--text-body))]">
              <li><RouterLink to="/technology" class="transition hover:text-[rgb(var(--text-heading))]">Technology</RouterLink></li>
              <li><RouterLink to="/research" class="transition hover:text-[rgb(var(--text-heading))]">Research</RouterLink></li>
              <li><RouterLink to="/case-studies" class="transition hover:text-[rgb(var(--text-heading))]">Research Highlights</RouterLink></li>
            </ul>
          </div>
          <div>
            <h4 class="mb-4 font-bold text-[rgb(var(--text-heading))]">Company</h4>
            <ul class="space-y-2 text-sm text-[rgb(var(--text-body))]">
              <li><RouterLink to="/about" class="transition hover:text-[rgb(var(--text-heading))]">About</RouterLink></li>
              <li><RouterLink to="/contact" class="transition hover:text-[rgb(var(--text-heading))]">Contact</RouterLink></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-[rgb(var(--border-primary))] pt-8">
          <p class="text-center text-sm text-[rgb(var(--text-muted))]">
            © {{ new Date().getFullYear() }} DeepBio Scientific. Building towards a disease-free world.
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

/* Animated gradient text */
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

/* Floating particles animation */
.floating-particle {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Logo Ticker */
.logo-ticker-wrapper {
  position: relative;
  overflow: hidden;
}

.logo-ticker-track {
  display: flex;
  align-items: center;
  width: max-content;
  animation: ticker-scroll 30s linear infinite;
  will-change: transform;
}

.logo-ticker-wrapper:hover .logo-ticker-track {
  animation-play-state: paused;
}

.logo-ticker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0 3rem;
}

.logo-ticker-img {
  height: 52px;
  width: auto;
  filter: grayscale(1) opacity(0.4);
  transition: filter 0.4s ease, transform 0.4s ease;
}

.logo-ticker-img--nvidia {
  height: 85px;
}

.logo-ticker-img--nvidia-dark {
  padding: 10px 0;
}

.logo-ticker-img--google {
  height: 100px;
}

:deep(.dark) .logo-ticker-img,
:global(.dark) .logo-ticker-img {
  filter: grayscale(1) opacity(0.35) brightness(1.8);
}

.logo-ticker-item:hover .logo-ticker-img {
  filter: grayscale(0) opacity(1);
}

:deep(.dark) .logo-ticker-item:hover .logo-ticker-img,
:global(.dark) .logo-ticker-item:hover .logo-ticker-img {
  filter: grayscale(0) opacity(1) brightness(1.2);
}

@keyframes ticker-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Fallback for when JS doesn't load - ensure visibility */
@media (prefers-reduced-motion: reduce) {
  .reveal-ready {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .animate-gradient {
    animation: none;
  }

  .floating-particle {
    animation: none;
  }

  .logo-ticker-track {
    animation: none;
    justify-content: center;
  }
}
</style>
