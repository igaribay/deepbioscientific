<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const flowchartRef = ref<HTMLDivElement | null>(null)

// Animated flowchart steps
const steps = [
  { id: 1, title: 'Natural Language Input', description: 'Describe therapeutic goal', icon: 'chat', color: 'cyan' },
  { id: 2, title: 'Specification Compiler', description: 'Convert to molecular constraints', icon: 'code', color: 'purple' },
  { id: 3, title: 'Population Initialization', description: 'Generate diverse candidates', icon: 'users', color: 'pink' },
  { id: 4, title: 'Evolutionary Optimization', description: 'Multi-objective search', icon: 'dna', color: 'green' },
  { id: 5, title: 'Scoring & Validation', description: 'Structure, binding, safety', icon: 'check', color: 'amber' },
  { id: 6, title: 'mRNA Design', description: 'Codon optimization & UTRs', icon: 'flask', color: 'blue' },
  { id: 7, title: 'Delivery Formulation', description: 'LNP & targeting', icon: 'truck', color: 'rose' },
  { id: 8, title: 'Validated Candidate', description: 'Ready for preclinical', icon: 'star', color: 'cyan' },
]

const activeStep = ref(0)
let animationInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  // Animate flowchart steps
  const flowSteps = document.querySelectorAll('.flow-step')
  if (flowSteps.length > 0) {
    gsap.fromTo(
      flowSteps,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out', delay: 0.3 }
    )
  }

  // Animate connecting lines
  const flowLines = document.querySelectorAll('.flow-line')
  if (flowLines.length > 0) {
    gsap.fromTo(
      flowLines,
      { scaleX: 0 },
      { scaleX: 1, stagger: 0.15, duration: 0.5, ease: 'power2.out', delay: 0.5 }
    )
  }

  // Auto-advance through steps
  animationInterval = setInterval(() => {
    activeStep.value = (activeStep.value + 1) % steps.length
  }, 2000)
})

onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval)
})

const getStepColor = (color: string, isActive: boolean) => {
  const colors: Record<string, { bg: string; ring: string; text: string }> = {
    cyan: { bg: 'from-cyan-500/20 to-cyan-500/5', ring: 'ring-cyan-500/50', text: 'text-cyan-400' },
    purple: { bg: 'from-purple-500/20 to-purple-500/5', ring: 'ring-purple-500/50', text: 'text-purple-400' },
    pink: { bg: 'from-pink-500/20 to-pink-500/5', ring: 'ring-pink-500/50', text: 'text-pink-400' },
    green: { bg: 'from-green-500/20 to-green-500/5', ring: 'ring-green-500/50', text: 'text-green-400' },
    amber: { bg: 'from-amber-500/20 to-amber-500/5', ring: 'ring-amber-500/50', text: 'text-amber-400' },
    blue: { bg: 'from-blue-500/20 to-blue-500/5', ring: 'ring-blue-500/50', text: 'text-blue-400' },
    rose: { bg: 'from-rose-500/20 to-rose-500/5', ring: 'ring-rose-500/50', text: 'text-rose-400' },
  }
  return colors[color] || colors.cyan
}
</script>

<template>
  <div class="min-h-screen pt-24">
    <!-- Hero -->
    <section class="px-6 py-20">
      <div class="mx-auto max-w-6xl text-center">
        <span class="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-300">
          Technology
        </span>
        <h1 class="mb-6 text-5xl font-bold text-white md:text-6xl">
          Platform <span class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Architecture</span>
        </h1>
        <p class="mx-auto max-w-3xl text-xl text-slate-400">
          An end-to-end platform for therapeutic protein and mRNA design, from natural language specifications to validated candidates ready for preclinical development.
        </p>
      </div>
    </section>

    <!-- Animated Flowchart -->
    <section class="px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-12 text-center text-3xl font-bold text-white">Design Pipeline</h2>
        
        <div ref="flowchartRef" class="relative">
          <!-- Desktop Flowchart -->
          <div class="hidden lg:block">
            <div class="grid grid-cols-4 gap-8">
              <template v-for="(step, index) in steps" :key="step.id">
                <div 
                  class="flow-step relative"
                  :class="{ 'col-start-1': index === 4 }"
                >
                  <!-- Connecting line -->
                  <div 
                    v-if="index < steps.length - 1 && index !== 3"
                    class="flow-line absolute -right-4 top-1/2 h-0.5 w-8 origin-left bg-gradient-to-r from-slate-600 to-slate-700"
                    :class="{ 'opacity-100': activeStep > index, 'opacity-30': activeStep <= index }"
                  ></div>
                  
                  <!-- Down arrow after step 4 -->
                  <div 
                    v-if="index === 3"
                    class="absolute -bottom-8 left-1/2 h-8 w-0.5 -translate-x-1/2 bg-gradient-to-b from-slate-600 to-slate-700"
                    :class="{ 'opacity-100': activeStep > 3, 'opacity-30': activeStep <= 3 }"
                  ></div>
                  
                  <!-- Step Card -->
                  <div 
                    class="group relative rounded-2xl border p-6 transition-all duration-500"
                    :class="[
                      activeStep === index 
                        ? 'border-' + step.color + '-500/50 bg-slate-900 shadow-xl shadow-' + step.color + '-500/20 scale-105' 
                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    ]"
                  >
                    <div 
                      class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ring-1 transition-transform group-hover:scale-110"
                      :class="[getStepColor(step.color, activeStep === index).bg, getStepColor(step.color, activeStep === index).ring]"
                    >
                      <span class="text-lg font-bold" :class="getStepColor(step.color, activeStep === index).text">{{ step.id }}</span>
                    </div>
                    <h3 class="mb-2 text-lg font-bold text-white">{{ step.title }}</h3>
                    <p class="text-sm text-slate-400">{{ step.description }}</p>
                    
                    <!-- Active indicator -->
                    <div 
                      v-if="activeStep === index"
                      class="absolute -inset-px rounded-2xl opacity-50"
                      :class="'bg-gradient-to-r from-' + step.color + '-500/20 to-transparent'"
                    ></div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Mobile Flowchart (Vertical) -->
          <div class="lg:hidden">
            <div class="space-y-4">
              <div 
                v-for="(step, index) in steps" 
                :key="step.id"
                class="flow-step relative"
              >
                <!-- Connecting line -->
                <div 
                  v-if="index < steps.length - 1"
                  class="flow-line absolute -bottom-4 left-6 h-4 w-0.5 bg-gradient-to-b from-slate-600 to-slate-700"
                ></div>
                
                <!-- Step Card -->
                <div 
                  class="flex items-start gap-4 rounded-xl border p-4 transition-all"
                  :class="[
                    activeStep === index 
                      ? 'border-' + step.color + '-500/50 bg-slate-900' 
                      : 'border-slate-800 bg-slate-900/50'
                  ]"
                >
                  <div 
                    class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1"
                    :class="[getStepColor(step.color, activeStep === index).bg, getStepColor(step.color, activeStep === index).ring]"
                  >
                    <span class="text-lg font-bold" :class="getStepColor(step.color, activeStep === index).text">{{ step.id }}</span>
                  </div>
                  <div>
                    <h3 class="font-bold text-white">{{ step.title }}</h3>
                    <p class="text-sm text-slate-400">{{ step.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Technology Details -->
    <section class="bg-gradient-to-b from-[#020617] via-slate-900/30 to-[#020617] px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <div class="grid gap-8 md:grid-cols-2">
          <div class="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <h3 class="mb-4 text-2xl font-bold text-white">Foundation Models</h3>
            <p class="mb-6 text-slate-400">
              Our platform leverages state-of-the-art protein language models and structure prediction to understand and generate novel therapeutic sequences.
            </p>
            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                ESM-2 embeddings for sequence understanding
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                AlphaFold-based structure prediction
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                Custom fine-tuned generation models
              </li>
            </ul>
          </div>

          <div class="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <h3 class="mb-4 text-2xl font-bold text-white">Evolutionary Engine</h3>
            <p class="mb-6 text-slate-400">
              Multi-objective genetic algorithms explore the vast sequence space while maintaining diversity and optimizing multiple properties simultaneously.
            </p>
            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                NSGA-III for Pareto optimization
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                Adaptive mutation strategies
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                Diversity preservation mechanisms
              </li>
            </ul>
          </div>

          <div class="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <h3 class="mb-4 text-2xl font-bold text-white">Scoring Suite</h3>
            <p class="mb-6 text-slate-400">
              Comprehensive evaluation of candidates across binding affinity, stability, immunogenicity, manufacturability, and safety profiles.
            </p>
            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-pink-500"></span>
                Binding affinity prediction
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-pink-500"></span>
                Thermostability estimation
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-pink-500"></span>
                Immunogenicity screening
              </li>
            </ul>
          </div>

          <div class="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <h3 class="mb-4 text-2xl font-bold text-white">mRNA Optimizer</h3>
            <p class="mb-6 text-slate-400">
              End-to-end mRNA sequence design with codon optimization, UTR selection, and secondary structure considerations.
            </p>
            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                Tissue-specific codon optimization
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                5' and 3' UTR design
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                mRNA stability prediction
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.flow-step {
  will-change: transform, opacity;
  opacity: 1;
}
</style>

