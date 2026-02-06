<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import deepbioLogo from '@/assets/deepbio-logo.png'
import deepbioText from '@/assets/deepbio-text.png'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useTheme } from '@/composables/useTheme'

gsap.registerPlugin(ScrollTrigger)

const { init: initTheme, canvasColors } = useTheme()
initTheme()

const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const route = useRoute()
const isHomePage = computed(() => route.path === '/')

const navLinks = [
  { name: 'Technology', path: '/technology' },
  { name: 'Research', path: '/research' },
  { name: 'Case Studies', path: '/case-studies' },
  { name: 'Platform', path: 'https://demo.deepbioscientific.com', external: true },
  { name: 'About', path: '/about' },
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
          <div class="hero-badge mb-6 lg:mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 backdrop-blur-sm self-center lg:self-start">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
            </span>
            <span class="text-sm font-medium text-cyan-300">End-to-End Drug Discovery AI</span>
          </div>

          <!-- Slogan -->
          <p class="hero-word text-lg lg:text-xl font-medium text-emerald-400 mb-4 tracking-wide">
            From Molecule to Market, Faster.
          </p>

          <!-- Hero text -->
          <h1 class="mb-6 lg:mb-8 text-4xl font-bold leading-tight tracking-tight text-[rgb(var(--text-heading))] md:text-5xl lg:text-6xl xl:text-7xl">
            <span class="hero-word block">Reinventing</span>
            <span class="hero-word block">
              <span class="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Drug Discovery</span>
            </span>
          </h1>

          <p class="hero-subtext mb-8 lg:mb-10 max-w-xl text-base text-[rgb(var(--text-body))] md:text-lg lg:text-xl mx-auto lg:mx-0">
            <span class="text-[rgb(var(--text-heading))] font-medium">90% of clinical trials fail.</span> We're changing that with 
            <span class="text-cyan-400">AgentFabric™</span> that optimizes every stage, from target discovery to regulatory approval.
          </p>

          <div class="flex flex-wrap justify-center lg:justify-start gap-4">
            <RouterLink
              to="/contact"
              class="hero-btn group relative inline-block overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-3 lg:px-8 lg:py-4 text-base lg:text-lg font-semibold text-white shadow-2xl shadow-cyan-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-105"
              style="opacity: 1; visibility: visible;"
            >
              <span class="relative z-10">Partner With Us</span>
              <div
                class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 transition-opacity group-hover:opacity-100"
              ></div>
            </RouterLink>
          </div>

          <!-- Key Stats Row -->
          <div class="mt-10 lg:mt-12 grid grid-cols-3 gap-4 lg:gap-8">
            <div class="hero-stat text-center lg:text-left">
              <div class="text-2xl lg:text-3xl font-bold text-cyan-400">10-15 yrs</div>
              <div class="text-xs lg:text-sm text-[rgb(var(--text-muted))]">Current Timeline</div>
            </div>
            <div class="hero-stat text-center">
              <div class="text-2xl lg:text-3xl font-bold text-emerald-400">30-50%</div>
              <div class="text-xs lg:text-sm text-[rgb(var(--text-muted))]">Time Saved</div>
            </div>
            <div class="hero-stat text-center lg:text-right">
              <div class="text-2xl lg:text-3xl font-bold text-teal-400">90%→↑</div>
              <div class="text-xs lg:text-sm text-[rgb(var(--text-muted))]">Trial Success</div>
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

    <!-- Drug Discovery Pipeline Section -->
    <section id="pipeline" class="relative z-10 px-6 py-32 reveal-section">
      <div class="mx-auto max-w-6xl">
        <div class="mb-16 text-center">
          <span class="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-300 backdrop-blur-sm">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Full Pipeline Coverage
          </span>
          <h2 class="mb-4 text-4xl font-bold text-[rgb(var(--text-heading))] md:text-5xl">
            Every Stage. <span class="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Optimized.</span>
          </h2>
          <p class="mx-auto max-w-2xl text-lg text-[rgb(var(--text-body))]">
            We don't just design molecules. We optimize the entire drug discovery pipeline to dramatically reduce time and improve success rates.
          </p>
        </div>

        <!-- Pipeline Timeline - Clean Table Design (Desktop) -->
        <div class="hidden lg:block relative mb-16 overflow-hidden rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card))/0.8] backdrop-blur-xl">
          <!-- Header Row -->
          <div class="grid grid-cols-5 border-b border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card-muted))/0.3]">
            <div class="p-4 text-center border-r border-[rgb(var(--border-subtle))/0.3]">
              <div class="flex h-8 w-8 mx-auto items-center justify-center rounded-full bg-cyan-500 text-white font-bold text-xs">1</div>
            </div>
            <div class="p-4 text-center border-r border-[rgb(var(--border-subtle))/0.3]">
              <div class="flex h-8 w-8 mx-auto items-center justify-center rounded-full bg-teal-500 text-white font-bold text-xs">2</div>
            </div>
            <div class="p-4 text-center border-r border-[rgb(var(--border-subtle))/0.3]">
              <div class="flex h-8 w-8 mx-auto items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs">3</div>
            </div>
            <div class="p-4 text-center border-r border-[rgb(var(--border-subtle))/0.3]">
              <div class="flex h-8 w-8 mx-auto items-center justify-center rounded-full bg-blue-500 text-white font-bold text-xs">4</div>
            </div>
            <div class="p-4 text-center">
              <div class="flex h-8 w-8 mx-auto items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-xs">5</div>
            </div>
          </div>
          
          <!-- Stage Names -->
          <div class="grid grid-cols-5 border-b border-[rgb(var(--border-subtle))/0.5]">
            <div class="p-4 text-center border-r border-[rgb(var(--border-subtle))/0.3]">
              <h3 class="text-sm font-bold text-[rgb(var(--text-heading))]">Target Discovery</h3>
            </div>
            <div class="p-4 text-center border-r border-[rgb(var(--border-subtle))/0.3]">
              <h3 class="text-sm font-bold text-[rgb(var(--text-heading))]">Lead Optimization</h3>
            </div>
            <div class="p-4 text-center border-r border-[rgb(var(--border-subtle))/0.3]">
              <h3 class="text-sm font-bold text-[rgb(var(--text-heading))]">Preclinical</h3>
            </div>
            <div class="p-4 text-center border-r border-[rgb(var(--border-subtle))/0.3]">
              <h3 class="text-sm font-bold text-[rgb(var(--text-heading))]">Clinical Trials</h3>
            </div>
            <div class="p-4 text-center">
              <h3 class="text-sm font-bold text-[rgb(var(--text-heading))]">Regulatory</h3>
            </div>
          </div>

          <!-- Traditional Timeline -->
          <div class="grid grid-cols-5 border-b border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card-muted))/0.2]">
            <div class="p-4 text-center border-r border-[rgb(var(--border-subtle))/0.3]">
              <div class="text-xs text-[rgb(var(--text-muted))] mb-1">Traditional</div>
              <div class="text-sm text-[rgb(var(--text-body))] line-through">2-3 years</div>
            </div>
            <div class="p-4 text-center border-r border-[rgb(var(--border-subtle))/0.3]">
              <div class="text-xs text-[rgb(var(--text-muted))] mb-1">Traditional</div>
              <div class="text-sm text-[rgb(var(--text-body))] line-through">2-4 years</div>
            </div>
            <div class="p-4 text-center border-r border-[rgb(var(--border-subtle))/0.3]">
              <div class="text-xs text-[rgb(var(--text-muted))] mb-1">Traditional</div>
              <div class="text-sm text-[rgb(var(--text-body))] line-through">1-2 years</div>
            </div>
            <div class="p-4 text-center border-r border-[rgb(var(--border-subtle))/0.3]">
              <div class="text-xs text-[rgb(var(--text-muted))] mb-1">Traditional</div>
              <div class="text-sm text-[rgb(var(--text-body))] line-through">6-8 years</div>
            </div>
            <div class="p-4 text-center">
              <div class="text-xs text-[rgb(var(--text-muted))] mb-1">Traditional</div>
              <div class="text-sm text-[rgb(var(--text-body))] line-through">1-2 years</div>
            </div>
          </div>

          <!-- Our Timeline -->
          <div class="grid grid-cols-5">
            <div class="p-4 text-center border-r border-[rgb(var(--border-subtle))/0.3]">
              <div class="text-xs text-emerald-400 mb-1">With Helixir AI</div>
              <div class="text-lg font-bold text-emerald-400">6-12 mo</div>
            </div>
            <div class="p-4 text-center border-r border-[rgb(var(--border-subtle))/0.3]">
              <div class="text-xs text-emerald-400 mb-1">With Helixir AI</div>
              <div class="text-lg font-bold text-emerald-400">8-18 mo</div>
            </div>
            <div class="p-4 text-center border-r border-[rgb(var(--border-subtle))/0.3]">
              <div class="text-xs text-emerald-400 mb-1">With Helixir AI</div>
              <div class="text-lg font-bold text-emerald-400">6-18 mo</div>
            </div>
            <div class="p-4 text-center border-r border-[rgb(var(--border-subtle))/0.3]">
              <div class="text-xs text-emerald-400 mb-1">With Helixir AI</div>
              <div class="text-lg font-bold text-emerald-400">3-5 years</div>
            </div>
            <div class="p-4 text-center">
              <div class="text-xs text-emerald-400 mb-1">With Helixir AI</div>
              <div class="text-lg font-bold text-emerald-400">6-12 mo</div>
            </div>
          </div>
        </div>

        <!-- Mobile-friendly card version -->
        <div class="grid grid-cols-1 gap-4 mb-8 lg:hidden">
          <div class="card-reveal rounded-xl border border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card))/0.8] p-5 flex items-center gap-4">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white font-bold text-sm">1</div>
            <div class="flex-1">
              <h3 class="font-bold text-[rgb(var(--text-heading))]">Target Discovery</h3>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-[rgb(var(--text-muted))] line-through">2-3 yrs</span>
                <span class="text-emerald-400">→</span>
                <span class="text-emerald-400 font-bold">6-12 mo</span>
              </div>
            </div>
          </div>
          <div class="card-reveal rounded-xl border border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card))/0.8] p-5 flex items-center gap-4">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-500 text-white font-bold text-sm">2</div>
            <div class="flex-1">
              <h3 class="font-bold text-[rgb(var(--text-heading))]">Lead Optimization</h3>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-[rgb(var(--text-muted))] line-through">2-4 yrs</span>
                <span class="text-emerald-400">→</span>
                <span class="text-emerald-400 font-bold">8-18 mo</span>
              </div>
            </div>
          </div>
          <div class="card-reveal rounded-xl border border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card))/0.8] p-5 flex items-center gap-4">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-sm">3</div>
            <div class="flex-1">
              <h3 class="font-bold text-[rgb(var(--text-heading))]">Preclinical</h3>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-[rgb(var(--text-muted))] line-through">1-2 yrs</span>
                <span class="text-emerald-400">→</span>
                <span class="text-emerald-400 font-bold">6-12 mo</span>
              </div>
            </div>
          </div>
          <div class="card-reveal rounded-xl border border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card))/0.8] p-5 flex items-center gap-4">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm">4</div>
            <div class="flex-1">
              <h3 class="font-bold text-[rgb(var(--text-heading))]">Clinical Trials</h3>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-[rgb(var(--text-muted))] line-through">6-8 yrs</span>
                <span class="text-emerald-400">→</span>
                <span class="text-emerald-400 font-bold">3-5 yrs</span>
              </div>
            </div>
          </div>
          <div class="card-reveal rounded-xl border border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card))/0.8] p-5 flex items-center gap-4">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-sm">5</div>
            <div class="flex-1">
              <h3 class="font-bold text-[rgb(var(--text-heading))]">Regulatory</h3>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-[rgb(var(--text-muted))] line-through">1-2 yrs</span>
                <span class="text-emerald-400">→</span>
                <span class="text-emerald-400 font-bold">6-12 mo</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Time Saved Summary -->
        <div class="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-[rgb(var(--bg-card))/0.5] to-cyan-500/10 p-8 text-center">
          <div class="flex flex-col md:flex-row items-center justify-center gap-8">
            <div>
              <div class="text-[rgb(var(--text-body))] text-sm mb-1">Traditional Timeline</div>
              <div class="text-3xl font-bold text-[rgb(var(--text-muted))] line-through">10-15 years</div>
            </div>
            <div class="text-4xl text-emerald-400">→</div>
            <div>
              <div class="text-emerald-400 text-sm mb-1">With Helixir AI Platform</div>
              <div class="text-4xl font-bold text-[rgb(var(--text-heading))]">5-8 years</div>
            </div>
            <div class="hidden md:block h-16 w-px bg-[rgb(var(--border-muted))]"></div>
            <div>
              <div class="text-[rgb(var(--text-body))] text-sm mb-1">Time Saved</div>
              <div class="text-4xl font-bold text-emerald-400">30-50%</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Science Section - Modalities -->
    <section id="science" class="relative z-10 bg-gradient-to-b from-transparent via-[rgb(var(--bg-card))/0.5] to-transparent px-6 py-32 reveal-section">
      <div class="mx-auto max-w-6xl">
        <div class="mb-16 text-center">
          <span class="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-medium text-cyan-300 backdrop-blur-sm">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
            </span>
            Therapeutic Modalities
          </span>
          <h2 class="mb-4 text-4xl font-bold text-[rgb(var(--text-heading))] md:text-5xl">
            Purpose-Built for <span class="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Biologics</span>
          </h2>
          <p class="mx-auto max-w-2xl text-lg text-[rgb(var(--text-body))]">
            Specialized pipelines for each therapeutic modality with validated experimental workflows
          </p>
        </div>

        <div class="card-group grid gap-8 md:grid-cols-3">
          <!-- mRNA Therapeutics -->
          <div class="card-reveal group relative overflow-hidden rounded-3xl border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-card))/0.5] p-1 h-full">
            <div class="absolute inset-0 bg-gradient-to-b from-cyan-500/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div class="relative h-full rounded-[1.25rem] bg-[rgb(var(--bg-card))] p-8">
              <div class="mb-6 flex items-center gap-4">
                <div class="pulse flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/30">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
              </div>
              <div>
                  <h3 class="text-2xl font-bold text-[rgb(var(--text-heading))]">mRNA</h3>
                  <p class="text-cyan-400">Therapeutics</p>
              </div>
              </div>
              <p class="mb-6 text-[rgb(var(--text-body))]">
                Optimize expression, stability, and immunogenicity with delivery-aware design.
              </p>
              <ul class="space-y-3 text-sm">
                <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                  <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                  Codon optimization & UTR design
                </li>
                <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                  <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                  Personalized neoantigen vaccines
                </li>
                <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                  <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                  Protein replacement therapy
                </li>
              </ul>
            </div>
          </div>

          <!-- Protein Design -->
          <div class="card-reveal group relative overflow-hidden rounded-3xl border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-card))/0.5] p-1 h-full">
            <div class="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div class="relative h-full rounded-[1.25rem] bg-[rgb(var(--bg-card))] p-8">
              <div class="mb-6 flex items-center gap-4">
                <div class="pulse flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/>
                </svg>
              </div>
              <div>
                  <h3 class="text-2xl font-bold text-[rgb(var(--text-heading))]">Protein</h3>
                  <p class="text-purple-400">Binders & Scaffolds</p>
              </div>
              </div>
              <p class="mb-6 text-[rgb(var(--text-body))]">
                Structure-informed design for binding specificity across diverse scaffold families.
              </p>
              <ul class="space-y-3 text-sm">
                <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                  <span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  De novo protein design
                </li>
                <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                  <span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  Bispecific & multispecific
                </li>
                <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                  <span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  Tissue-targeting scaffolds
                </li>
              </ul>
            </div>
          </div>

          <!-- Peptide Therapeutics -->
          <div class="card-reveal group relative overflow-hidden rounded-3xl border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-card))/0.5] p-1 h-full">
            <div class="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            <div class="relative h-full rounded-[1.25rem] bg-[rgb(var(--bg-card))] p-8">
              <div class="mb-6 flex items-center gap-4">
                <div class="pulse flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                  <h3 class="text-2xl font-bold text-[rgb(var(--text-heading))]">Peptide</h3>
                  <p class="text-blue-400">Therapeutics</p>
                </div>
              </div>
              <p class="mb-6 text-[rgb(var(--text-body))]">
                Rapid iteration on potency and stability with well-characterized validation assays.
              </p>
              <ul class="space-y-3 text-sm">
                <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                  <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  GLP-1R, GCGR agonists
                </li>
                <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                  <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  Cytokine mimetics
                </li>
                <li class="flex items-center gap-3 text-[rgb(var(--text-primary))]">
                  <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  Stapled & cyclic peptides
                </li>
              </ul>
              </div>
            </div>
          </div>
      </div>
    </section>

    <!-- Why Partner Section -->
    <section class="relative z-10 px-6 py-32 reveal-section">
      <div class="mx-auto max-w-6xl">
        <div class="mb-16 text-center">
          <span class="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-5 py-2 text-sm font-medium text-teal-300 backdrop-blur-sm">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
            </span>
            Our Advantage
          </span>
          <h2 class="mb-4 text-4xl font-bold text-[rgb(var(--text-heading))] md:text-5xl">
            Why <span class="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">DeepBio Scientific</span>
          </h2>
        </div>

        <div class="card-group grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div class="card-reveal group rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 ring-1 ring-cyan-500/30 transition-transform group-hover:scale-110">
              <svg class="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 class="mb-2 text-lg font-bold text-[rgb(var(--text-heading))] group-hover:text-cyan-400 transition-colors">End-to-End Coverage</h3>
            <p class="text-sm text-[rgb(var(--text-body))]">We optimize every stage, from target discovery through regulatory approval, not just molecule design.</p>
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

    <!-- Partnership Models -->
    <section id="partnerships" class="relative z-10 bg-gradient-to-b from-transparent via-[rgb(var(--bg-card))/0.5] to-transparent px-6 py-32 reveal-section">
      <div class="mx-auto max-w-6xl">
        <div class="mb-16 text-center">
          <span class="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-5 py-2 text-sm font-medium text-green-300 backdrop-blur-sm">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            Partnerships
          </span>
          <h2 class="mb-4 text-4xl font-bold text-[rgb(var(--text-heading))] md:text-5xl">
            Design & Platform <span class="bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient">Services</span>
          </h2>
          <p class="mx-auto max-w-2xl text-lg text-[rgb(var(--text-body))]">
            Flexible services tailored to your stage and strategy
          </p>
        </div>

        <!-- Service Categories Grid -->
        <div class="card-group grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <!-- Design Services -->
          <div class="card-reveal group rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 ring-1 ring-cyan-500/30 transition-transform group-hover:scale-110">
              <svg class="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <span class="mb-3 inline-block rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 ring-1 ring-cyan-500/30">
              DESIGN SERVICES
            </span>
            <h4 class="text-lg font-bold text-[rgb(var(--text-heading))] mb-2 group-hover:text-cyan-400 transition-colors">Molecular Design</h4>
            <p class="text-sm text-[rgb(var(--text-body))]">AI-driven molecule design, optimization, and validation per program</p>
          </div>

          <!-- Preclinical -->
          <div class="card-reveal group rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl transition-all duration-300 hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-1">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-500/5 ring-1 ring-teal-500/30 transition-transform group-hover:scale-110">
              <svg class="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
            </div>
            <span class="mb-3 inline-block rounded-full bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-400 ring-1 ring-teal-500/30">
              PLATFORM SERVICES
            </span>
            <h4 class="text-lg font-bold text-[rgb(var(--text-heading))] mb-2 group-hover:text-teal-400 transition-colors">Preclinical</h4>
            <p class="text-sm text-[rgb(var(--text-body))]">ADMET prediction, toxicity screening, and lead optimization per asset</p>
          </div>

          <!-- Trial Optimization -->
          <div class="card-reveal group rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 ring-1 ring-purple-500/30 transition-transform group-hover:scale-110">
              <svg class="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <span class="mb-3 inline-block rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400 ring-1 ring-purple-500/30">
              PLATFORM SERVICES
            </span>
            <h4 class="text-lg font-bold text-[rgb(var(--text-heading))] mb-2 group-hover:text-purple-400 transition-colors">Trial Optimization</h4>
            <p class="text-sm text-[rgb(var(--text-body))]">Protocol design, patient stratification, and endpoint prediction per trial</p>
          </div>

          <!-- Regulatory Intel -->
          <div class="card-reveal group rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 ring-1 ring-blue-500/30 transition-transform group-hover:scale-110">
              <svg class="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <span class="mb-3 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-blue-500/30">
              PLATFORM SERVICES
            </span>
            <h4 class="text-lg font-bold text-[rgb(var(--text-heading))] mb-2 group-hover:text-blue-400 transition-colors">Regulatory Intel</h4>
            <p class="text-sm text-[rgb(var(--text-body))]">Submission guidance, compliance analysis, and documentation per filing</p>
          </div>
        </div>

        <!-- Bottom Row - Enterprise & Milestones -->
        <div class="card-group grid gap-6 md:grid-cols-2 mt-6">
          <!-- Enterprise Platform -->
          <div class="card-reveal group rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 ring-1 ring-emerald-500/30 transition-transform group-hover:scale-110">
              <svg class="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            </div>
            <h4 class="text-lg font-bold text-[rgb(var(--text-heading))] mb-2 group-hover:text-emerald-400 transition-colors">Enterprise Platform</h4>
            <p class="text-sm text-[rgb(var(--text-body))] mb-3">Unlimited queries, full API access, dedicated support team, and custom integrations</p>
            <div class="flex items-center gap-2 text-xs text-emerald-400">
              <span class="relative flex h-2 w-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Coming soon on AWS, Azure, and Google Cloud Marketplaces
            </div>
          </div>

          <!-- Success Milestones -->
          <div class="card-reveal group rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1">
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 ring-1 ring-amber-500/30 transition-transform group-hover:scale-110">
              <svg class="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
            </div>
            <h4 class="text-lg font-bold text-[rgb(var(--text-heading))] mb-2 group-hover:text-amber-400 transition-colors">Success Milestones</h4>
            <p class="text-sm text-[rgb(var(--text-body))]">Performance bonuses on IND filing, phase advancement, and regulatory approval</p>
          </div>
        </div>

        <!-- Customer LTV Banner -->
        <div class="card-reveal mt-8 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/20 hover:scale-[1.01]">
          <div class="flex items-center justify-center gap-3 mb-2">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            <p class="text-xl font-bold text-[rgb(var(--text-heading))]">Customer LTV</p>
          </div>
          <p class="text-white/90">
            Single entry point expands over <span class="font-bold">4-year asset lifecycle</span>
          </p>
        </div>

        <!-- Partnership Model Footer -->
        <div class="text-center mt-8 p-6 rounded-xl border border-[rgb(var(--border-subtle))/0.3] bg-[rgb(var(--bg-card))/0.3]">
          <p class="text-[rgb(var(--text-primary))] mb-3">
            <span class="font-semibold text-[rgb(var(--text-heading))]">Partnership Model:</span> Upfront per program, plus 
            <span class="font-bold text-teal-400">downstream royalty</span> on successful commercialization
          </p>
          <div class="flex flex-wrap items-center justify-center gap-3 text-sm text-[rgb(var(--text-body))]">
            <span class="font-semibold text-[rgb(var(--text-heading))] mr-1">Enterprise Platform:</span>
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.75 11.35a4.32 4.32 0 0 1-.79-.08 3.9 3.9 0 0 1-.73-.23l-.17-.04h-.12l-.15.14-.08.08a4.6 4.6 0 0 1-3.38 1.38 4.63 4.63 0 0 1-3.38-1.38l-.08-.08-.15-.14h-.12l-.17.04a3.9 3.9 0 0 1-.73.23 4.32 4.32 0 0 1-.79.08 4.4 4.4 0 0 1-4.4-4.4v-.03A4.4 4.4 0 0 1 7.9 2.5h.02a4.35 4.35 0 0 1 .79.08 3.9 3.9 0 0 1 .73.22l.17.05h.12l.15-.14.08-.08a4.6 4.6 0 0 1 3.38-1.38 4.63 4.63 0 0 1 3.38 1.38l.08.08.15.14h.12l.17-.05a3.9 3.9 0 0 1 .73-.22 4.35 4.35 0 0 1 .79-.08h.02a4.4 4.4 0 0 1 4.4 4.42v.03a4.4 4.4 0 0 1-4.4 4.4z"/>
              </svg>
              <span>AWS Marketplace</span>
            </span>
            <span class="text-[rgb(var(--text-muted))]">•</span>
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.5 9.3V15l6.5 3.8 6.5-3.8V9.3L12 5.5 5.5 9.3zm6.5 7.2l-4.5-2.6v-4l4.5 2.6v4zm1-5.3L8.5 8.6 12 6.5l3.5 2.1L12 11.2zm5.5 2.7l-4.5 2.6v-4l4.5-2.6v4z"/>
              </svg>
              <span>Google Cloud Marketplace</span>
            </span>
            <span class="text-[rgb(var(--text-muted))]">•</span>
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>Azure Marketplace</span>
            </span>
            <span class="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/30">
              <span class="relative flex h-1.5 w-1.5">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </span>
              Coming Soon
            </span>
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
          <span class="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent animate-gradient">Disease-Free World</span>
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
            View Case Studies
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
          </div>
          <div>
            <h4 class="mb-4 font-bold text-[rgb(var(--text-heading))]">Platform</h4>
            <ul class="space-y-2 text-sm text-[rgb(var(--text-body))]">
              <li><RouterLink to="/technology" class="transition hover:text-[rgb(var(--text-heading))]">Technology</RouterLink></li>
              <li><RouterLink to="/research" class="transition hover:text-[rgb(var(--text-heading))]">Research</RouterLink></li>
              <li><RouterLink to="/case-studies" class="transition hover:text-[rgb(var(--text-heading))]">Case Studies</RouterLink></li>
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
            © 2025 DeepBio Scientific. Building towards a disease-free world.
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
}
</style>
