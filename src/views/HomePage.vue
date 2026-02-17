<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTheme } from '@/composables/useTheme'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo({
  title: 'DeepBio Scientific - AI-Powered Drug Discovery Platform',
  description: 'Design mRNA and protein therapeutics with AI. From natural language specifications to validated therapeutic candidates using evolutionary AI and molecular biology.',
  path: '/',
})

const { canvasColors } = useTheme()

const heroCanvas = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null
let time = 0
let mouseX = 0
let mouseY = 0
let smoothMouseX = 0
let smoothMouseY = 0
let canvasWidth = 0
let canvasHeight = 0
let isCanvasSized = false

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

const colors = {
  adenine: '#22d3ee',
  uracil: '#f472b6',
  guanine: '#a78bfa',
  cytosine: '#4ade80',
  backbone: '#38bdf8',
  ribosome: '#fbbf24',
  amino: '#f43f5e',
}

function initVisualization() {
  nucleotides.length = 0
  molecules.length = 0

  const helixLength = 50 // Reduced for better performance
  const helixRadius = 120
  const helixPitch = 5

  for (let i = 0; i < helixLength; i++) {
    const t = i / helixLength
    const angle = t * Math.PI * helixPitch
    const y = (t - 0.5) * 500

    const baseTypes: ('A' | 'U' | 'G' | 'C')[] = ['A', 'U', 'G', 'C']
    const type1 = baseTypes[i % 4]
    const complementMap: Record<string, 'A' | 'U' | 'G' | 'C'> = { A: 'U', U: 'A', G: 'C', C: 'G' }
    const type2 = complementMap[type1]

    const colorMap = { A: colors.adenine, U: colors.uracil, G: colors.guanine, C: colors.cytosine }

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

  for (let i = 0; i < 20; i++) {
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

function sizeCanvas() {
  const canvas = heroCanvas.value
  if (!canvas) return
  
  const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap DPR for performance
  const rect = canvas.getBoundingClientRect()
  
  canvasWidth = rect.width
  canvasHeight = rect.height
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  
  const ctx = canvas.getContext('2d')
  if (ctx) ctx.scale(dpr, dpr)
  
  isCanvasSized = true
}

function drawHeroBackground() {
  const canvas = heroCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (!isCanvasSized) sizeCanvas()

  const width = canvasWidth
  const height = canvasHeight
  const centerX = width / 2
  const centerY = height / 2

  // Smooth mouse interpolation for fluid movement
  smoothMouseX += (mouseX - smoothMouseX) * 0.08
  smoothMouseY += (mouseY - smoothMouseY) * 0.08

  ctx.fillStyle = canvasColors.value.trailClear
  ctx.fillRect(0, 0, width, height)

  const targetMouseX = (smoothMouseX - centerX) * 0.0003
  const targetMouseY = (smoothMouseY - centerY) * 0.0003

  ctx.strokeStyle = canvasColors.value.connectionStroke
  ctx.lineWidth = 1

  for (let i = 0; i < nucleotides.length; i += 2) {
    const n1 = nucleotides[i]
    const n2 = nucleotides[i + 1]
    if (!n1 || !n2) continue

    const wave = Math.sin(time * 0.02 + n1.phase) * 8

    const x1 = n1.baseX + wave * Math.cos(n1.phase) + Math.cos(time * 0.01 + n1.phase) * targetMouseX * 500
    const y1 = n1.baseY + Math.sin(time * 0.015 + n1.phase) * 3
    const z1 = n1.baseZ + wave * Math.sin(n1.phase)

    const x2 = n2.baseX + wave * Math.cos(n2.phase) + Math.cos(time * 0.01 + n2.phase) * targetMouseX * 500
    const y2 = n2.baseY + Math.sin(time * 0.015 + n2.phase) * 3
    const z2 = n2.baseZ + wave * Math.sin(n2.phase)

    const rotY = time * 0.008 + targetMouseX * 2
    const rotX = targetMouseY

    const cos1 = Math.cos(rotY)
    const sin1 = Math.sin(rotY)
    const cos2 = Math.cos(rotX)
    const sin2 = Math.sin(rotX)

    const rx1 = x1 * cos1 - z1 * sin1
    let rz1 = x1 * sin1 + z1 * cos1
    const ry1 = y1 * cos2 - rz1 * sin2
    rz1 = y1 * sin2 + rz1 * cos2

    const rx2 = x2 * cos1 - z2 * sin1
    let rz2 = x2 * sin1 + z2 * cos1
    const ry2 = y2 * cos2 - rz2 * sin2
    rz2 = y2 * sin2 + rz2 * cos2

    const fov = 500
    const minZ = -fov + 50

    const safeZ1 = Math.max(rz1, minZ)
    const safeZ2 = Math.max(rz2, minZ)

    const scale1 = fov / (safeZ1 + fov)
    const scale2 = fov / (safeZ2 + fov)

    if (scale1 <= 0 || scale2 <= 0) continue

    const screenX1 = centerX + rx1 * scale1
    const screenY1 = centerY + ry1 * scale1
    const screenX2 = centerX + rx2 * scale2
    const screenY2 = centerY + ry2 * scale2

    ctx.beginPath()
    ctx.moveTo(screenX1, screenY1)
    ctx.lineTo(screenX2, screenY2)
    ctx.stroke()

    n1.x = rx1
    n1.y = ry1
    n1.z = rz1
    n2.x = rx2
    n2.y = ry2
    n2.z = rz2
  }

  // Sort only every 10 frames for performance
  if (time % 10 === 0) {
    nucleotides.sort((a, b) => a.z - b.z)
  }

  for (const n of nucleotides) {
    const fov = 500
    const minZ = -fov + 50
    const safeZ = Math.max(n.z, minZ)
    const scale = fov / (safeZ + fov)

    if (scale <= 0) continue

    const screenX = centerX + n.x * scale
    const screenY = centerY + n.y * scale
    const baseRadius = 6
    const radius = Math.max(0.5, baseRadius * scale)

    // Simplified glow effect without creating new gradient objects
    ctx.globalAlpha = Math.max(0.1, scale * 0.4)
    ctx.fillStyle = n.color
    ctx.beginPath()
    ctx.arc(screenX, screenY, radius * 2.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.globalAlpha = Math.max(0.3, Math.min(1, scale * 1.5))
    ctx.beginPath()
    ctx.arc(screenX, screenY, radius, 0, Math.PI * 2)
    ctx.fill()

    if (scale > 0.6) {
      ctx.globalAlpha = 0.9
      ctx.fillStyle = canvasColors.value.nucleotideLabel
      ctx.font = `${Math.max(8, 10 * scale)}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(n.type, screenX, screenY)
    }
  }

  ctx.globalAlpha = 1

  // Cache rotation values outside the loop
  const rotY = time * 0.008 + targetMouseX * 2
  const cosRotY = Math.cos(rotY)
  const sinRotY = Math.sin(rotY)

  for (const mol of molecules) {
    mol.x += mol.vx
    mol.y += mol.vy
    mol.z += mol.vz
    mol.rotation += mol.rotationSpeed

    if (Math.abs(mol.x) > 400) mol.vx *= -1
    if (Math.abs(mol.y) > 400) mol.vy *= -1
    if (Math.abs(mol.z) > 400) mol.vz *= -1

    const rx = mol.x * cosRotY - mol.z * sinRotY
    const rz = mol.x * sinRotY + mol.z * cosRotY

    const fov = 500
    const minZ = -fov + 50
    const safeZ = Math.max(rz, minZ)
    const scale = fov / (safeZ + fov)

    if (scale <= 0) continue

    const screenX = centerX + rx * scale
    const screenY = centerY + mol.y * scale
    const size = Math.max(1, mol.size * scale)

    ctx.globalAlpha = Math.max(0.2, Math.min(0.7, scale))
    ctx.fillStyle = mol.color

    if (mol.type === 'ribosome') {
      // Simplified ribosome - no gradient
      ctx.globalAlpha = Math.max(0.15, scale * 0.3)
      ctx.beginPath()
      ctx.ellipse(screenX, screenY, size * 2, size * 1.3, mol.rotation, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.globalAlpha = Math.max(0.4, scale * 0.8)
      ctx.beginPath()
      ctx.ellipse(screenX, screenY, size * 1.2, size * 0.8, mol.rotation, 0, Math.PI * 2)
      ctx.fill()
    } else if (mol.type === 'amino') {
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
    isCanvasSized = false
    sizeCanvas()
  }
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  // Initialize mouse at center of window for smooth start
  smoothMouseX = window.innerWidth / 2
  smoothMouseY = window.innerHeight / 2
  mouseX = smoothMouseX
  mouseY = smoothMouseY
  
  initVisualization()
  if (heroCanvas.value) {
    sizeCanvas()
    animate()
  }

  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  window.addEventListener('resize', handleResize)

  gsap.from('.hero-word', { duration: 1, opacity: 0, y: 50, stagger: 0.15, ease: 'power3.out', delay: 0.3 })
  gsap.from('.hero-subtext', { duration: 1, opacity: 0, y: 30, delay: 0.8, ease: 'power3.out' })
  gsap.from('.hero-btn', { duration: 0.8, opacity: 0, y: 20, scale: 0.9, stagger: 0.15, delay: 1.1, ease: 'back.out(1.7)' })
  gsap.from('.hero-badge', { duration: 1, opacity: 0, scale: 0.8, delay: 0.2, ease: 'elastic.out(1, 0.5)' })

  gsap.to('.hero-canvas', {
    scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1 },
    y: 200,
    scale: 1.1,
    opacity: 0.3,
  })

  gsap.to('.hero-content', {
    scrollTrigger: { trigger: '.hero-section', start: 'top top', end: '50% top', scrub: 1 },
    y: -100,
    opacity: 0,
  })

  const observerOptions = { root: null, rootMargin: '50px', threshold: 0.1 }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => entry.target.classList.add('revealed'))
        revealObserver.unobserve(entry.target)
      }
    })
  }, observerOptions)

  const setupReveal = (el: Element, delay = 0) => {
    const htmlEl = el as HTMLElement
    htmlEl.style.transitionDelay = `${delay}ms`
    el.classList.add('reveal-ready')
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setTimeout(() => el.classList.add('revealed'), 100 + delay)
    } else {
      revealObserver.observe(el)
    }
  }

  document.querySelectorAll('.reveal-section').forEach((section) => setupReveal(section))
  document.querySelectorAll('.card-group').forEach((group) => {
    const cards = group.querySelectorAll('.card-reveal')
    cards.forEach((card, index) => setupReveal(card, index * 80))
  })
  document.querySelectorAll('.card-reveal:not(.card-group .card-reveal)').forEach((card, index) => setupReveal(card, index * 50))

  const floatElements = document.querySelectorAll('.float')
  if (floatElements.length > 0) {
    gsap.to(floatElements, { duration: 3, y: -15, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.2 })
  }
  
  const pulseElements = document.querySelectorAll('.pulse')
  if (pulseElements.length > 0) {
    gsap.to(pulseElements, { scale: 1.05, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }

  setTimeout(() => ScrollTrigger.refresh(), 100)
})

onUnmounted(() => {
  if (animationId !== null) cancelAnimationFrame(animationId)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-32">
      <div class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[rgb(var(--bg-base))] via-transparent to-[rgb(var(--bg-base))]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.08),transparent_60%)]"></div>
      <canvas ref="heroCanvas" class="hero-canvas absolute inset-0 h-full w-full" style="opacity: 0.85"></canvas>

      <div class="hero-content relative z-20 mx-auto max-w-5xl text-center">
        <div class="hero-badge mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 backdrop-blur-sm">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
          </span>
          <span class="text-sm font-medium text-cyan-300">AI-Powered Therapeutic Design</span>
        </div>

        <h1 class="mb-8 text-5xl font-bold leading-tight tracking-tight text-[rgb(var(--text-heading))] md:text-7xl lg:text-8xl">
          <span class="hero-word block">Design</span>
          <span class="hero-word block">
            <span class="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">mRNA</span>
            &
            <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Protein</span>
          </span>
          <span class="hero-word block text-[rgb(var(--text-primary))]">Therapeutics</span>
        </h1>

        <p class="hero-subtext mx-auto mb-12 max-w-3xl text-lg text-[rgb(var(--text-body))] md:text-xl lg:text-2xl">
          From natural language specifications to validated therapeutic candidates.
          <span class="text-[rgb(var(--text-heading))]">Evolutionary AI</span> meets
          <span class="text-cyan-400">molecular biology</span>.
        </p>

        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/contact" class="hero-btn group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-cyan-500/30 transition-all hover:shadow-cyan-500/50">
            <span class="relative z-10">Start Discovery</span>
            <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100"></div>
          </router-link>
          <router-link to="/technology" class="hero-btn rounded-full border-2 border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-card))/0.5] px-8 py-4 text-lg font-semibold text-[rgb(var(--text-heading))] backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-[rgb(var(--bg-card-muted))/0.5]">
            Explore Platform
          </router-link>
        </div>
      </div>

      <div class="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 animate-bounce">
        <div class="flex h-10 w-6 items-start justify-center rounded-full border-2 border-slate-600 p-1">
          <div class="h-2 w-1 animate-pulse rounded-full bg-cyan-400"></div>
        </div>
      </div>
    </section>

    <!-- Platform Section -->
    <section id="platform" class="reveal-section px-6 py-32">
      <div class="mx-auto max-w-6xl">
        <div class="mb-16 text-center">
          <span class="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-300">Platform</span>
          <h2 class="mb-4 text-4xl font-bold text-[rgb(var(--text-heading))] md:text-5xl">
            Four Integrated <span class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Layers</span>
          </h2>
          <p class="mx-auto max-w-2xl text-lg text-[rgb(var(--text-body))]">A unified platform combining language models, evolutionary optimization, and molecular simulation</p>
        </div>

        <div class="card-group grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div class="card-reveal group relative overflow-hidden rounded-2xl border border-[rgb(var(--border-primary))] bg-gradient-to-b from-[rgb(var(--bg-card))] to-[rgb(var(--bg-card))/0.5] p-8 transition-all hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10">
            <div class="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-cyan-500/10 blur-3xl transition-all group-hover:bg-cyan-500/20"></div>
            <div class="relative">
              <div class="float mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 ring-1 ring-cyan-500/30">
                <svg class="h-7 w-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 class="mb-3 text-xl font-bold text-[rgb(var(--text-heading))]">Natural Language Spec</h3>
              <p class="text-sm leading-relaxed text-[rgb(var(--text-body))]">Describe your therapeutic goal in plain English. Our compiler converts intent to precise molecular constraints.</p>
            </div>
          </div>

          <div class="card-reveal group relative overflow-hidden rounded-2xl border border-[rgb(var(--border-primary))] bg-gradient-to-b from-[rgb(var(--bg-card))] to-[rgb(var(--bg-card))/0.5] p-8 transition-all hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10">
            <div class="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-purple-500/10 blur-3xl transition-all group-hover:bg-purple-500/20"></div>
            <div class="relative">
              <div class="float mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 ring-1 ring-purple-500/30">
                <svg class="h-7 w-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 class="mb-3 text-xl font-bold text-[rgb(var(--text-heading))]">Agentic Optimization</h3>
              <p class="text-sm leading-relaxed text-[rgb(var(--text-body))]">AgentFabric™ critiques, refines, and iterates on candidates across binding, stability, and manufacturability.</p>
            </div>
          </div>

          <div class="card-reveal group relative overflow-hidden rounded-2xl border border-[rgb(var(--border-primary))] bg-gradient-to-b from-[rgb(var(--bg-card))] to-[rgb(var(--bg-card))/0.5] p-8 transition-all hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10">
            <div class="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-blue-500/10 blur-3xl transition-all group-hover:bg-blue-500/20"></div>
            <div class="relative">
              <div class="float mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 ring-1 ring-blue-500/30">
                <svg class="h-7 w-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="mb-3 text-xl font-bold text-[rgb(var(--text-heading))]">Evolutionary Search</h3>
              <p class="text-sm leading-relaxed text-[rgb(var(--text-body))]">Population-based genetic algorithms explore sequence space with Pareto-optimal selection.</p>
            </div>
          </div>

          <div class="card-reveal group relative overflow-hidden rounded-2xl border border-[rgb(var(--border-primary))] bg-gradient-to-b from-[rgb(var(--bg-card))] to-[rgb(var(--bg-card))/0.5] p-8 transition-all hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10">
            <div class="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-green-500/10 blur-3xl transition-all group-hover:bg-green-500/20"></div>
            <div class="relative">
              <div class="float mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 ring-1 ring-green-500/30">
                <svg class="h-7 w-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 class="mb-3 text-xl font-bold text-[rgb(var(--text-heading))]">Delivery & mRNA</h3>
              <p class="text-sm leading-relaxed text-[rgb(var(--text-body))]">Co-design mRNA constructs with optimized codons, UTRs, and delivery formulations.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="reveal-section relative overflow-hidden px-6 py-32">
      <div class="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-blue-600/20"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.15),transparent_50%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.15),transparent_50%)]"></div>

      <div class="relative mx-auto max-w-4xl text-center">
        <h2 class="mb-6 text-4xl font-bold text-[rgb(var(--text-heading))] md:text-6xl">
          Ready to Design the
          <span class="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Future</span>?
        </h2>
        <p class="mx-auto mb-12 max-w-2xl text-xl text-[rgb(var(--text-primary))]">Partner with us to accelerate your therapeutic program from concept to clinic.</p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/contact" class="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-bold text-slate-900 shadow-2xl transition-all hover:shadow-white/20">
            <span class="relative z-10">Schedule Partnership Call</span>
          </router-link>
          <router-link to="/case-studies" class="rounded-full border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/5">
            View Case Studies
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.reveal-ready {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.reveal-ready.revealed {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal-ready {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>

