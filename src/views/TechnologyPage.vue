<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

// Helixir Pipeline Stages
const helixirStages = [
  { 
    number: 1, 
    name: 'Discovery', 
    aiMode: 'AI-CoScientist Mode',
    description: 'Hypothesis generation, molecule design, optimization. Scientists review and approve.',
    color: 'cyan' 
  },
  { 
    number: 2, 
    name: 'Preclinical', 
    aiMode: 'Predictive Agents',
    description: 'Success prediction, biomarker discovery, IND prep. Teams review go/no-go.',
    color: 'teal' 
  },
  { 
    number: 3, 
    name: 'Clinical', 
    aiMode: 'Trial Intelligence',
    description: 'Protocol drafting, enrollment simulation, data analysis. Medical officers approve.',
    color: 'emerald' 
  },
  { 
    number: 4, 
    name: 'Regulatory', 
    aiMode: 'Submission Agents',
    description: 'Dossier assembly, compliance checking, gap analysis. Reg affairs signs off.',
    color: 'blue' 
  },
]

// AgentFabric Pillars
const agentFabricPillars = [
  { name: 'Specialized Agents', color: 'cyan' },
  { name: 'Foundation Models', color: 'teal' },
  { name: 'Data Intelligence', color: 'emerald' },
  { name: 'Quality Control', color: 'blue' },
]

// Agent Types
const agentTypes = [
  {
    title: 'Discovery Agents',
    capabilities: 'Hypothesis, Design, Stability, Immunogenicity, Critique, Ranking',
    color: 'cyan'
  },
  {
    title: 'Clinical Agents',
    capabilities: 'Protocol, Eligibility, Endpoint, Site Selection, Enrollment, QC',
    color: 'teal'
  },
  {
    title: 'Regulatory Agents',
    capabilities: 'Dossier, CMC, Compliance, Gap Analysis, Response, Format',
    color: 'emerald'
  },
]

// Pipeline stages with time savings (legacy)
const pipelineStages = [
  { name: 'Target Discovery', traditional: '2-3 years', optimized: '6-18 months', color: 'cyan' },
  { name: 'Lead Optimization', traditional: '2-4 years', optimized: '8-18 months', color: 'teal' },
  { name: 'Preclinical', traditional: '1-2 years', optimized: '6-12 months', color: 'emerald' },
  { name: 'Clinical Trials', traditional: '6-8 years', optimized: '3-5 years', color: 'blue' },
  { name: 'Regulatory', traditional: '1-2 years', optimized: '6-12 months', color: 'indigo' },
]

// What we deliver
const deliverables = [
  'Optimized therapeutic candidates',
  'Clinical trial protocols',
  'Patient screening pipelines', 
  'Success probability reports',
  'Biomarker recommendations',
  'Regulatory submission prep'
]

const activeStage = ref(0)
let stageInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  gsap.fromTo('.hero-title', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
  )
  
  gsap.fromTo('.hero-badge', 
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 }
  )

  stageInterval = setInterval(() => {
    activeStage.value = (activeStage.value + 1) % pipelineStages.length
  }, 2500)
  
  gsap.to('.floating-particle', {
    y: -20,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.2
  })
})

onUnmounted(() => {
  if (stageInterval) clearInterval(stageInterval)
})
</script>

<template>
  <div class="min-h-screen pt-24 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-1/3 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-2/3 right-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 2s"></div>
      <div class="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      <div v-for="i in 15" :key="i" 
        class="floating-particle absolute w-1 h-1 rounded-full"
        :class="[i % 3 === 0 ? 'bg-cyan-400' : i % 3 === 1 ? 'bg-teal-400' : 'bg-emerald-400']"
        :style="{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.3 + Math.random() * 0.4 }"
      ></div>
    </div>

    <!-- Hero Section -->
    <section class="relative z-10 px-6 py-16 lg:py-24">
      <div class="mx-auto max-w-6xl text-center">
        <div class="hero-badge mb-6 inline-flex items-center gap-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 backdrop-blur-sm">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
          </span>
          <span class="text-sm font-medium text-cyan-300">Platform Technology</span>
        </div>
        
        <p class="hero-title text-lg font-medium text-emerald-400 mb-4">From Molecule to Market, Faster.</p>
        
        <h1 class="hero-title mb-6 text-4xl font-bold text-white md:text-6xl lg:text-7xl">
          AI That Tackles the
          <span class="block mt-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Entire Pipeline</span>
        </h1>
        
        <p class="hero-title mx-auto max-w-3xl text-lg text-slate-400 leading-relaxed md:text-xl mb-8">
          Drug discovery has a <span class="text-white font-medium">90% failure rate</span> and takes 
          <span class="text-white font-medium">10-15 years</span>. Our Helixir™ platform 
          optimizes every stage to cut timelines by <span class="text-emerald-400 font-semibold">30-50%</span> 
          and dramatically improve success rates.
        </p>

        <!-- Key Stats -->
        <div class="flex flex-wrap justify-center gap-8 lg:gap-16 mb-12">
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-cyan-400">30-50%</div>
            <div class="text-sm text-slate-500">Time Saved</div>
          </div>
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-teal-400">4</div>
            <div class="text-sm text-slate-500">Pipeline Stages</div>
          </div>
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-emerald-400">1</div>
            <div class="text-sm text-slate-500">Integrated Platform</div>
          </div>
        </div>
      </div>
    </section>

    <!-- The Drug Discovery Crisis - MOVED TO TOP -->
    <section class="relative z-10 px-6 py-20 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
      <div class="mx-auto max-w-4xl">
        <div class="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 lg:p-12">
          <div class="text-center mb-10">
            <svg class="w-12 h-12 mx-auto mb-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <h2 class="text-3xl font-bold text-white md:text-4xl mb-4">
              The Drug Discovery <span class="text-red-400">Crisis</span>
            </h2>
          </div>

          <div class="grid md:grid-cols-3 gap-8 mb-10">
            <div class="text-center">
              <div class="text-5xl font-bold text-red-400 mb-2">90%</div>
              <div class="text-slate-400">of clinical trials fail</div>
            </div>
            <div class="text-center">
              <div class="text-5xl font-bold text-amber-400 mb-2">$2.6B</div>
              <div class="text-slate-400">average cost per drug</div>
            </div>
            <div class="text-center">
              <div class="text-5xl font-bold text-slate-400 mb-2">10-15</div>
              <div class="text-slate-400">years to market</div>
            </div>
          </div>

          <div class="border-t border-slate-700 pt-10">
            <h3 class="text-xl font-bold text-white mb-6 text-center">Our Solution</h3>
            <div class="grid md:grid-cols-3 gap-8">
              <div class="text-center">
                <div class="text-5xl font-bold text-emerald-400 mb-2">↑</div>
                <div class="text-white font-medium">Higher Success Rates</div>
                <div class="text-sm text-slate-400">Calibrated predictions improve trial design</div>
              </div>
              <div class="text-center">
                <div class="text-5xl font-bold text-emerald-400 mb-2">↓</div>
                <div class="text-white font-medium">Lower Costs</div>
                <div class="text-sm text-slate-400">Fewer failed trials, faster iterations</div>
              </div>
              <div class="text-center">
                <div class="text-5xl font-bold text-emerald-400 mb-2">30-50%</div>
                <div class="text-white font-medium">Time Saved</div>
                <div class="text-sm text-slate-400">Across every pipeline stage</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pipeline Overview - Every Stage Accelerated -->
    <section class="relative z-10 px-6 py-20 border-t border-b border-slate-800/50 bg-slate-900/30">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-12">
          <span class="mb-4 inline-block rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-300">
            Full Coverage
          </span>
          <h2 class="text-3xl font-bold text-white md:text-4xl mb-4">
            Every Stage, <span class="text-teal-400">Accelerated</span>
          </h2>
        </div>

        <!-- Pipeline Stages -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div 
            v-for="(stage, index) in pipelineStages" 
            :key="stage.name"
            class="relative rounded-xl border p-5 cursor-pointer transition-all duration-300"
            :class="[
              activeStage === index 
                ? 'border-' + stage.color + '-500/50 bg-slate-900 shadow-lg' 
                : 'border-slate-800/50 bg-slate-900/50 hover:border-slate-700'
            ]"
            @click="activeStage = index"
          >
            <div 
              class="h-10 w-10 mb-3 rounded-full flex items-center justify-center text-sm font-bold"
              :class="'bg-' + stage.color + '-500/20 text-' + stage.color + '-400 ring-1 ring-' + stage.color + '-500/30'"
            >{{ index + 1 }}</div>
            <h3 class="text-sm font-bold text-white mb-2">{{ stage.name }}</h3>
            <div class="text-xs text-slate-500 line-through mb-1">{{ stage.traditional }}</div>
            <div class="text-sm font-bold" :class="'text-' + stage.color + '-400'">{{ stage.optimized }}</div>
          </div>
        </div>

        <!-- Progress indicators -->
        <div class="flex justify-center gap-2">
          <button
            v-for="(stage, index) in pipelineStages"
            :key="index"
            @click="activeStage = index"
            class="h-2 rounded-full transition-all duration-300"
            :class="[activeStage === index ? 'w-8 bg-teal-500' : 'w-2 bg-slate-700 hover:bg-slate-600']"
          ></button>
        </div>
      </div>
    </section>

    <!-- Helixir Platform Section - How We Do It -->
    <section class="relative z-10 px-6 py-20 border-t border-slate-800/50">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-8">
          <span class="mb-4 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-300">
            How We Do It
          </span>
          <h2 class="text-3xl font-bold text-white md:text-4xl lg:text-5xl mb-4">
            Helixir™: One Platform, <span class="text-teal-400">Molecule to Market</span>
          </h2>
        </div>

        <!-- AgentFabric Banner -->
        <div class="rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 p-5 text-center mb-12">
          <p class="text-white font-semibold text-lg">
            Powered by AgentFabric™: Coordinated AI Agents with Human Oversight
          </p>
        </div>

        <!-- Helixir 4 Stages -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div 
            v-for="stage in helixirStages" 
            :key="stage.number"
            class="rounded-2xl border border-slate-700/50 bg-slate-900/80 p-6 relative overflow-hidden"
          >
            <!-- Top border accent -->
            <div 
              class="absolute top-0 left-0 right-0 h-1"
              :class="'bg-' + stage.color + '-500'"
            ></div>
            
            <h3 class="text-xl font-bold text-white mb-3">{{ stage.number }}. {{ stage.name }}</h3>
            <p class="text-sm font-medium mb-4" :class="'text-' + stage.color + '-400'">{{ stage.aiMode }}</p>
            <p class="text-sm text-slate-400 leading-relaxed">{{ stage.description }}</p>
          </div>
        </div>

        <!-- Bottom Banner -->
        <div class="rounded-xl bg-slate-800/60 border border-slate-700/50 p-5 text-center">
          <p class="text-slate-300">
            AI drafts, analyzes, recommends • Humans review, refine, decide • Shared context across stages
          </p>
        </div>
      </div>
    </section>

    <!-- AgentFabric Section -->
    <section class="relative z-10 px-6 py-20 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
      <div class="mx-auto max-w-6xl">
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-white md:text-4xl lg:text-5xl mb-8">
            AgentFabric™: <span class="text-cyan-400">How It Works</span>
          </h2>

          <!-- 4 Pillars -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div 
              v-for="pillar in agentFabricPillars" 
              :key="pillar.name"
              class="rounded-full border py-3 px-6 text-center transition-all hover:scale-105"
              :class="'border-' + pillar.color + '-500/50 bg-slate-900/80'"
            >
              <span class="font-semibold" :class="'text-' + pillar.color + '-400'">{{ pillar.name }}</span>
            </div>
          </div>

          <!-- Agent Types Grid -->
          <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div 
              v-for="agent in agentTypes" 
              :key="agent.title"
              class="rounded-2xl border bg-slate-900/80 p-6"
              :class="'border-' + agent.color + '-500/30'"
            >
              <h3 class="text-lg font-bold mb-4" :class="'text-' + agent.color + '-400'">{{ agent.title }}</h3>
              <p class="text-slate-400 text-sm leading-relaxed">{{ agent.capabilities }}</p>
            </div>
          </div>

          <!-- Human Decision Checkpoints Banner -->
          <div class="rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 p-5 text-center mb-4">
            <p class="text-white font-semibold">
              Human Decision Checkpoints: Scientists Review → Medical Officers Approve → Reg Affairs Signs Off
            </p>
          </div>

          <!-- Bottom Note -->
          <div class="rounded-xl bg-slate-800/60 border border-slate-700/50 p-5 text-center">
            <p class="text-slate-300">
              Not replacing scientists — multiplying their capacity. AI handles volume. Humans own judgment.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Equi-mRNA Technology Section -->
    <section class="relative z-10 px-6 py-20 border-t border-slate-800/50">
      <div class="mx-auto max-w-6xl">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span class="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300">
              Proprietary Technology
            </span>
            <h2 class="text-3xl font-bold text-white md:text-4xl mb-6">
              Equi-mRNA: <span class="text-purple-400">Next-Gen mRNA Design</span>
            </h2>
            <p class="text-slate-400 leading-relaxed mb-6">
              The first codon-level equivariant mRNA language model that explicitly encodes <span class="text-white">synonymous codon symmetries</span> as cyclic subgroups of the 2D Special Orthogonal matrix (SO(2)).
            </p>
            <p class="text-slate-400 leading-relaxed mb-8">
              By integrating group-theoretic priors with an auxiliary equivariance loss and symmetry-aware pooling, Equi-mRNA learns <span class="text-purple-400">biologically grounded representations</span> that outperform traditional models.
            </p>

            <!-- Key Results -->
            <div class="grid grid-cols-2 gap-4 mb-8">
              <div class="rounded-xl border border-slate-800/50 bg-slate-900/50 p-4">
                <div class="text-3xl font-bold text-purple-400 mb-1">~10%</div>
                <div class="text-sm text-slate-400">Accuracy improvement on expression & stability prediction</div>
              </div>
              <div class="rounded-xl border border-slate-800/50 bg-slate-900/50 p-4">
                <div class="text-3xl font-bold text-cyan-400 mb-1">~4x</div>
                <div class="text-sm text-slate-400">More realistic mRNA constructs (Fréchet BioDistance)</div>
              </div>
              <div class="rounded-xl border border-slate-800/50 bg-slate-900/50 p-4">
                <div class="text-3xl font-bold text-emerald-400 mb-1">~28%</div>
                <div class="text-sm text-slate-400">Better at preserving functional properties</div>
              </div>
              <div class="rounded-xl border border-slate-800/50 bg-slate-900/50 p-4">
                <div class="text-3xl font-bold text-teal-400 mb-1">SO(2)</div>
                <div class="text-sm text-slate-400">Symmetry-aware codon encoding</div>
              </div>
            </div>

            <a 
              href="https://arxiv.org/abs/2508.15103" 
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-full border border-purple-500/50 bg-purple-500/10 px-6 py-3 font-medium text-purple-300 transition-all hover:bg-purple-500/20 hover:border-purple-400"
            >
              Read the Paper
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>

          <!-- Visual/Diagram Area -->
          <div class="relative">
            <div class="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-900/50 p-8 backdrop-blur-xl">
              <h3 class="text-xl font-bold text-white mb-6 text-center">How Equi-mRNA Works</h3>
              
              <!-- Visual Steps -->
              <div class="space-y-4">
                <div class="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div class="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">1</div>
                  <div>
                    <div class="font-semibold text-white text-sm">Codon-Level Tokenization</div>
                    <div class="text-xs text-slate-400">Encodes mRNA at codon level (3-nucleotide units)</div>
                  </div>
                </div>
                
                <div class="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div class="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">2</div>
                  <div>
                    <div class="font-semibold text-white text-sm">Synonymous Symmetry Encoding</div>
                    <div class="text-xs text-slate-400">Maps codon degeneracy to SO(2) cyclic subgroups</div>
                  </div>
                </div>
                
                <div class="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div class="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold">3</div>
                  <div>
                    <div class="font-semibold text-white text-sm">Equivariance Loss</div>
                    <div class="text-xs text-slate-400">Auxiliary loss ensures symmetry preservation</div>
                  </div>
                </div>
                
                <div class="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div class="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">4</div>
                  <div>
                    <div class="font-semibold text-white text-sm">Symmetry-Aware Pooling</div>
                    <div class="text-xs text-slate-400">Aggregates representations respecting biological structure</div>
                  </div>
                </div>
              </div>

              <!-- Application Areas -->
              <div class="mt-6 pt-6 border-t border-slate-700/50">
                <div class="text-xs text-slate-500 uppercase tracking-wider mb-3">Applications</div>
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs">Expression Prediction</span>
                  <span class="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs">Stability Assessment</span>
                  <span class="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs">mRNA Generation</span>
                  <span class="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">Therapeutics Design</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Closed-Loop Validation Section -->
    <section class="relative z-10 px-6 py-20 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
      <div class="mx-auto max-w-6xl">
        <h2 class="text-3xl font-bold text-white md:text-4xl lg:text-5xl mb-12">
          Closed-Loop <span class="text-teal-400">Validation</span>
        </h2>

        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Left Column - The Loop -->
          <div class="space-y-4">
            <!-- Helixir Platform -->
            <div class="rounded-2xl border border-slate-700/50 bg-slate-900/80 p-6 relative">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-2xl"></div>
              <h3 class="text-lg font-bold text-teal-400 mb-2">Helixir Platform</h3>
              <p class="text-slate-400 text-sm">Design • Predict • Optimize • Protocol</p>
            </div>

            <!-- Arrow Down - Predictions -->
            <div class="text-center py-2">
              <span class="text-teal-400 text-xl font-semibold">↓ Predictions</span>
            </div>

            <!-- Validation Partners -->
            <div class="rounded-2xl border border-slate-700/50 bg-slate-900/80 p-6 relative">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-2xl"></div>
              <h3 class="text-lg font-bold text-teal-400 mb-2">Validation Partners</h3>
              <p class="text-slate-400 text-sm">UCF Medical • Pharma Labs • CRO Network</p>
            </div>

            <!-- Arrow Up - Experimental Results -->
            <div class="text-center py-2">
              <span class="text-emerald-400 text-xl font-semibold">↑ Experimental Results</span>
            </div>

            <!-- Continuous Learning Banner -->
            <div class="rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-600/20 to-emerald-600/20 p-5 text-center">
              <p class="text-teal-300 font-medium">
                Every cycle improves our foundation models
              </p>
            </div>
          </div>

          <!-- Right Column - Benefits -->
          <div class="space-y-4">
            <!-- Validated Candidates -->
            <div class="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 relative">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-2xl"></div>
              <h3 class="text-lg font-bold text-teal-400 mb-2">Validated Candidates</h3>
              <p class="text-slate-400 text-sm">Molecules proven to work before you scale</p>
            </div>

            <!-- Calibrated Confidence -->
            <div class="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 relative">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-2xl"></div>
              <h3 class="text-lg font-bold text-teal-400 mb-2">Calibrated Confidence</h3>
              <p class="text-slate-400 text-sm">Know where models are strong vs need more data</p>
            </div>

            <!-- Data Moat -->
            <div class="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-6 relative">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-2xl"></div>
              <h3 class="text-lg font-bold text-amber-400 mb-2">Data Moat</h3>
              <p class="text-slate-400 text-sm">Training on results not in any public dataset</p>
            </div>

            <!-- Partner Note -->
            <div class="rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5">
              <p class="text-slate-300 text-sm leading-relaxed">
                Pharma partners plug in their own labs. You keep your data. We improve predictions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- What You Get -->
    <section class="relative z-10 px-6 py-20">
      <div class="mx-auto max-w-4xl">
        <div class="text-center mb-12">
          <span class="mb-4 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-300">
            Deliverables
          </span>
          <h2 class="text-3xl font-bold text-white md:text-4xl mb-4">
            What You <span class="text-cyan-400">Get</span>
          </h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div 
            v-for="item in deliverables" 
            :key="item"
            class="flex items-center gap-3 p-4 rounded-xl border border-slate-800/50 bg-slate-900/50"
          >
            <svg class="h-5 w-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-sm text-slate-300">{{ item }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative z-10 px-6 py-20">
      <div class="mx-auto max-w-4xl">
        <div class="relative rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900 p-12 text-center overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-emerald-500/5"></div>
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-teal-500/20 to-transparent rounded-full blur-3xl"></div>
          
          <div class="relative">
            <h2 class="mb-6 text-3xl font-bold text-white md:text-4xl">
              Ready to Accelerate Your <span class="text-teal-400">Pipeline</span>?
            </h2>
            <p class="mb-8 text-lg text-slate-400 max-w-2xl mx-auto">
              See how our platform can reduce your timelines and improve your success rates.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
              <router-link 
                to="/contact"
                class="rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 py-4 font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-105"
              >
                Schedule a Demo
              </router-link>
              <router-link 
                to="/case-studies"
                class="rounded-full border border-slate-700 px-8 py-4 font-medium text-white transition-all hover:border-teal-500/50 hover:bg-slate-800/50 backdrop-blur-sm"
              >
                View Results
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
</style>
