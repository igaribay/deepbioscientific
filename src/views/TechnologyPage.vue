<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo({
  title: 'Equi-mRNA Foundation Model — AI Co-Scientist for mRNA Therapeutics',
  description: 'The first equivariant foundation model for mRNA sequence design. SO(2) symmetry-aware architecture with NeurIPS 2025 benchmarks. Powering the Helixir AI co-scientist platform.',
  path: '/technology',
})

onMounted(() => {
  gsap.fromTo('.hero-title',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
  )

  gsap.fromTo('.hero-badge',
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 }
  )

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
      <div class="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-1/3 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-2/3 right-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 2s"></div>
      <div class="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      <div v-for="i in 15" :key="i"
        class="floating-particle absolute w-1 h-1 rounded-full"
        :class="[i % 3 === 0 ? 'bg-purple-400' : i % 3 === 1 ? 'bg-cyan-400' : 'bg-emerald-400']"
        :style="{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: 0.3 + Math.random() * 0.4 }"
      ></div>
    </div>

    <!-- Hero Section: Equi-mRNA Foundation Model -->
    <section class="relative z-10 px-6 py-16 lg:py-24">
      <div class="mx-auto max-w-6xl text-center">
        <div class="hero-badge mb-6 inline-flex items-center gap-3 rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-2 backdrop-blur-sm">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
          </span>
          <span class="text-sm font-medium text-purple-300">NeurIPS 2025 &middot; Peer-Reviewed</span>
        </div>

        <h1 class="hero-title mb-6 text-4xl font-bold text-[rgb(var(--text-heading))] md:text-6xl lg:text-7xl">
          Equi-mRNA
          <span class="block mt-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Foundation Model</span>
        </h1>

        <p class="hero-title mx-auto max-w-3xl text-lg text-[rgb(var(--text-body))] leading-relaxed md:text-xl mb-8">
          The first codon-level equivariant mRNA language model. SO(2) symmetry-aware architecture that
          <span class="text-purple-400 font-medium">outperforms traditional models</span> on expression prediction, stability assessment, and sequence generation.
        </p>

        <!-- Key Stats -->
        <div class="flex flex-wrap justify-center gap-8 lg:gap-16 mb-12">
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-purple-400">~10%</div>
            <div class="text-sm text-[rgb(var(--text-muted))]">Accuracy gain across 6 benchmarks</div>
          </div>
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-cyan-400">4.3x</div>
            <div class="text-sm text-[rgb(var(--text-muted))]">Generative fidelity improvement (FBD)</div>
          </div>
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-emerald-400">~28%</div>
            <div class="text-sm text-[rgb(var(--text-muted))]">Better functional property preservation</div>
          </div>
        </div>

        <!-- Capital Efficiency callout -->
        <div class="flex flex-wrap justify-center gap-6 mb-12">
          <div class="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-card))/0.5] px-4 py-2 text-sm">
            <span class="text-[rgb(var(--text-muted))]">Trained on</span>
            <span class="font-bold text-[rgb(var(--text-heading))]">25M sequences</span>
          </div>
          <div class="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-card))/0.5] px-4 py-2 text-sm">
            <span class="text-[rgb(var(--text-muted))]">15M params beats</span>
            <span class="font-bold text-[rgb(var(--text-heading))]">82M-param models</span>
          </div>
          <div class="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-card))/0.5] px-4 py-2 text-sm">
            <span class="text-[rgb(var(--text-muted))]">Validated on</span>
            <span class="font-bold text-[rgb(var(--text-heading))]">6 biological benchmarks</span>
          </div>
        </div>

        <a
          href="https://arxiv.org/abs/2508.15103"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 px-7 py-3.5 font-semibold text-white transition-all duration-200 hover:from-purple-700 hover:to-purple-600 active:scale-95 shadow-lg shadow-purple-500/25"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Read the NeurIPS 2025 Paper
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </a>
      </div>
    </section>

    <!-- Why Now -->
    <section class="relative z-10 px-6 py-16 border-t border-[rgb(var(--border-subtle))/0.5]">
      <div class="mx-auto max-w-5xl">
        <div class="rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card))/0.5] p-8 lg:p-10">
          <div class="text-center mb-8">
            <span class="mb-3 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-300">
              Why Now
            </span>
            <h2 class="text-2xl font-bold text-[rgb(var(--text-heading))] md:text-3xl">The Timing Is Right</h2>
          </div>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="mb-3 flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-emerald-500/15">
                <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 class="font-bold text-[rgb(var(--text-heading))] mb-2">AI Co-Scientist Validated</h3>
              <p class="text-sm text-[rgb(var(--text-body))]">Google proved the model works — but went horizontal. We go vertical on mRNA where depth matters most.</p>
            </div>
            <div class="text-center">
              <div class="mb-3 flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-cyan-500/15">
                <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>
              </div>
              <h3 class="font-bold text-[rgb(var(--text-heading))] mb-2">mRNA Beyond Vaccines</h3>
              <p class="text-sm text-[rgb(var(--text-body))]">The pipeline is exploding into protein replacement, gene editing, and personalized cancer medicine — each needing better optimization.</p>
            </div>
            <div class="text-center">
              <div class="mb-3 flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-purple-500/15">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
              </div>
              <h3 class="font-bold text-[rgb(var(--text-heading))] mb-2">Foundation Models at Scale</h3>
              <p class="text-sm text-[rgb(var(--text-body))]">For the first time, language models can learn biological language at scale. Equi-mRNA adds the missing physics — codon symmetry.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How Equi-mRNA Works -->
    <section class="relative z-10 px-6 py-20 border-t border-[rgb(var(--border-subtle))/0.5]">
      <div class="mx-auto max-w-6xl">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span class="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300">
              The Architecture
            </span>
            <h2 class="text-3xl font-bold text-[rgb(var(--text-heading))] md:text-4xl mb-6">
              SO(2) Equivariant <span class="text-purple-400">Codon Encoding</span>
            </h2>
            <p class="text-[rgb(var(--text-body))] leading-relaxed mb-6">
              mRNA codons encoding the same amino acid are <span class="text-[rgb(var(--text-heading))]">synonymous</span> — they share function but differ in sequence. Traditional models ignore this. Equi-mRNA explicitly encodes these symmetries as cyclic subgroups of SO(2).
            </p>
            <p class="text-[rgb(var(--text-body))] leading-relaxed mb-6">
              By integrating group-theoretic priors with an auxiliary equivariance loss and symmetry-aware pooling, the model learns <span class="text-purple-400">biologically grounded representations</span> that capture what matters: function, not just sequence.
            </p>

            <!-- Interpretability proof -->
            <div class="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 mb-8">
              <p class="text-sm text-[rgb(var(--text-heading))] font-medium mb-1">Validated: the model learned real biology</p>
              <p class="text-xs text-[rgb(var(--text-body))]">
                Learned codon rotations correlate with GC-content biases (r=0.98, R&sup2;=0.97) and tRNA abundance patterns (&rho;=&minus;0.69) — confirming the model captures known biological constraints, not just statistical patterns.
              </p>
            </div>

            <!-- Key Results -->
            <div class="grid grid-cols-2 gap-4">
              <div class="rounded-xl border border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card))/0.5] p-4">
                <div class="text-3xl font-bold text-purple-400 mb-1">~10%</div>
                <div class="text-sm text-[rgb(var(--text-body))]">Accuracy gain across expression, stability, and riboswitch benchmarks</div>
              </div>
              <div class="rounded-xl border border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card))/0.5] p-4">
                <div class="text-3xl font-bold text-cyan-400 mb-1">4.3x</div>
                <div class="text-sm text-[rgb(var(--text-body))]">More realistic mRNA constructs (Frechet BioDistance)</div>
              </div>
              <div class="rounded-xl border border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card))/0.5] p-4">
                <div class="text-3xl font-bold text-emerald-400 mb-1">15M</div>
                <div class="text-sm text-[rgb(var(--text-body))]">params beats RNA-FM, RNABERT (82M), CodonBert (82M), and HELM (50M)</div>
              </div>
              <div class="rounded-xl border border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card))/0.5] p-4">
                <div class="text-3xl font-bold text-teal-400 mb-1">25M</div>
                <div class="text-sm text-[rgb(var(--text-body))]">protein-coding sequences from 56M RefSeq entries for training</div>
              </div>
            </div>
          </div>

          <!-- Visual: How It Works Steps -->
          <div class="relative">
            <div class="rounded-3xl border border-[rgb(var(--border-primary))] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl">
              <h3 class="text-xl font-bold text-[rgb(var(--text-heading))] mb-6 text-center">How Equi-mRNA Works</h3>

              <div class="space-y-4">
                <div class="flex items-center gap-4 p-4 rounded-xl bg-[rgb(var(--bg-card-muted))/0.5] border border-[rgb(var(--border-muted))/0.5]">
                  <div class="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">1</div>
                  <div>
                    <div class="font-semibold text-[rgb(var(--text-heading))] text-sm">Codon-Level Tokenization</div>
                    <div class="text-xs text-[rgb(var(--text-body))]">Encodes mRNA at codon level (3-nucleotide units)</div>
                  </div>
                </div>

                <div class="flex items-center gap-4 p-4 rounded-xl bg-[rgb(var(--bg-card-muted))/0.5] border border-[rgb(var(--border-muted))/0.5]">
                  <div class="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">2</div>
                  <div>
                    <div class="font-semibold text-[rgb(var(--text-heading))] text-sm">Synonymous Symmetry Encoding</div>
                    <div class="text-xs text-[rgb(var(--text-body))]">Maps codon degeneracy to SO(2) cyclic subgroups</div>
                  </div>
                </div>

                <div class="flex items-center gap-4 p-4 rounded-xl bg-[rgb(var(--bg-card-muted))/0.5] border border-[rgb(var(--border-muted))/0.5]">
                  <div class="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold">3</div>
                  <div>
                    <div class="font-semibold text-[rgb(var(--text-heading))] text-sm">Equivariance Loss</div>
                    <div class="text-xs text-[rgb(var(--text-body))]">Auxiliary loss ensures symmetry preservation during training</div>
                  </div>
                </div>

                <div class="flex items-center gap-4 p-4 rounded-xl bg-[rgb(var(--bg-card-muted))/0.5] border border-[rgb(var(--border-muted))/0.5]">
                  <div class="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">4</div>
                  <div>
                    <div class="font-semibold text-[rgb(var(--text-heading))] text-sm">Symmetry-Aware Pooling</div>
                    <div class="text-xs text-[rgb(var(--text-body))]">Aggregates representations respecting biological structure</div>
                  </div>
                </div>
              </div>

              <!-- Applications -->
              <div class="mt-6 pt-6 border-t border-[rgb(var(--border-muted))/0.5]">
                <div class="text-xs text-[rgb(var(--text-muted))] uppercase tracking-wider mb-3">Applications</div>
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

    <!-- The Problem We Solve -->
    <section class="relative z-10 px-6 py-20 bg-gradient-to-b from-transparent via-[rgb(var(--bg-card))/0.5] to-transparent">
      <div class="mx-auto max-w-5xl">
        <div class="rounded-3xl border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-card))/0.8] p-10 lg:p-12">
          <div class="text-center mb-10">
            <span class="mb-4 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-300">
              The Problem
            </span>
            <h2 class="text-3xl font-bold text-[rgb(var(--text-heading))] md:text-4xl mb-4">
              The Codon Optimization <span class="text-amber-400">Crisis</span>
            </h2>
            <p class="mx-auto max-w-3xl text-[rgb(var(--text-body))] leading-relaxed">
              The mRNA therapeutics market is projected to grow from <span class="text-[rgb(var(--text-heading))] font-medium">$6B to $20.4B by 2032</span>.
              But expansion beyond vaccines faces a fundamental computational bottleneck.
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8 mb-10">
            <div class="text-center">
              <div class="text-4xl font-bold text-amber-400 mb-2">10<sup class="text-2xl">632</sup></div>
              <div class="text-[rgb(var(--text-body))]">possible mRNA sequences for a single protein</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-red-400 mb-2">90%</div>
              <div class="text-[rgb(var(--text-body))]">of clinical trials fail</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-[rgb(var(--text-body))] mb-2">0</div>
              <div class="text-[rgb(var(--text-body))]">existing tools exploit the genetic code's group structure</div>
            </div>
          </div>

          <div class="border-t border-[rgb(var(--border-muted))] pt-8">
            <h3 class="text-lg font-bold text-[rgb(var(--text-heading))] mb-6 text-center">Pain Points Equi-mRNA Solves</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="flex items-start gap-3 p-4 rounded-xl bg-[rgb(var(--bg-card-muted))/0.5] border border-[rgb(var(--border-muted))/0.5]">
                <span class="text-purple-400 font-bold text-lg mt-0.5">1</span>
                <div>
                  <div class="font-semibold text-[rgb(var(--text-heading))] text-sm">Multi-objective optimization</div>
                  <div class="text-xs text-[rgb(var(--text-body))]">Stability vs. expression vs. safety — current methods can't optimize all three simultaneously</div>
                </div>
              </div>
              <div class="flex items-start gap-3 p-4 rounded-xl bg-[rgb(var(--bg-card-muted))/0.5] border border-[rgb(var(--border-muted))/0.5]">
                <span class="text-purple-400 font-bold text-lg mt-0.5">2</span>
                <div>
                  <div class="font-semibold text-[rgb(var(--text-heading))] text-sm">Ribosomal frameshifting</div>
                  <div class="text-xs text-[rgb(var(--text-body))]">Modified bases cause +1 frameshifting at "slippery sequences" — a safety-critical codon selection problem</div>
                </div>
              </div>
              <div class="flex items-start gap-3 p-4 rounded-xl bg-[rgb(var(--bg-card-muted))/0.5] border border-[rgb(var(--border-muted))/0.5]">
                <span class="text-purple-400 font-bold text-lg mt-0.5">3</span>
                <div>
                  <div class="font-semibold text-[rgb(var(--text-heading))] text-sm">Generalization failure</div>
                  <div class="text-xs text-[rgb(var(--text-body))]">Deep learning models trained on reporter constructs don't generalize to real-world mRNAs</div>
                </div>
              </div>
              <div class="flex items-start gap-3 p-4 rounded-xl bg-[rgb(var(--bg-card-muted))/0.5] border border-[rgb(var(--border-muted))/0.5]">
                <span class="text-purple-400 font-bold text-lg mt-0.5">4</span>
                <div>
                  <div class="font-semibold text-[rgb(var(--text-heading))] text-sm">Stability-expression tradeoff</div>
                  <div class="text-xs text-[rgb(var(--text-body))]">Best sequences have neither highest CAI nor lowest MFE — an intermediate sweet spot that requires principled navigation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Competitive Differentiation -->
    <section class="relative z-10 px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-12">
          <span class="mb-4 inline-block rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-300">
            Competitive Landscape
          </span>
          <h2 class="text-3xl font-bold text-[rgb(var(--text-heading))] md:text-4xl mb-4">
            Why <span class="text-teal-400">Equi-mRNA</span> Is Different
          </h2>
          <p class="mx-auto max-w-3xl text-[rgb(var(--text-body))]">
            All existing approaches treat codon selection as a discrete combinatorial, sequence generation, or frequency lookup problem.
            <span class="text-[rgb(var(--text-heading))] font-medium">None exploit the mathematical group structure of the genetic code itself.</span>
          </p>
        </div>

        <!-- Comparison Table -->
        <div class="overflow-x-auto rounded-2xl border border-[rgb(var(--border-subtle))/0.5]">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-[rgb(var(--bg-card-muted))/0.5]">
                <th class="text-left p-4 font-semibold text-[rgb(var(--text-heading))]">Approach</th>
                <th class="text-left p-4 font-semibold text-[rgb(var(--text-heading))]">Method</th>
                <th class="text-left p-4 font-semibold text-[rgb(var(--text-heading))]">Limitation</th>
                <th class="text-left p-4 font-semibold text-purple-400">Equi-mRNA Advantage</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[rgb(var(--border-subtle))/0.3]">
              <tr class="bg-[rgb(var(--bg-card))/0.5]">
                <td class="p-4 font-medium text-[rgb(var(--text-heading))]">LinearDesign (Baidu)</td>
                <td class="p-4 text-[rgb(var(--text-body))]">Lattice parsing from linguistics</td>
                <td class="p-4 text-[rgb(var(--text-body))]">Optimizes only MFE + CAI; no frameshifting awareness</td>
                <td class="p-4 text-purple-400">Multi-objective with safety constraints</td>
              </tr>
              <tr class="bg-[rgb(var(--bg-card))/0.3]">
                <td class="p-4 font-medium text-[rgb(var(--text-heading))]">GEMORNA (Raina Bio)</td>
                <td class="p-4 text-[rgb(var(--text-body))]">Transformer-based generative model</td>
                <td class="p-4 text-[rgb(var(--text-body))]">Black box; requires retraining per application</td>
                <td class="p-4 text-purple-400">Interpretable, symmetry-grounded</td>
              </tr>
              <tr class="bg-[rgb(var(--bg-card))/0.5]">
                <td class="p-4 font-medium text-[rgb(var(--text-heading))]">RNop (2025)</td>
                <td class="p-4 text-[rgb(var(--text-body))]">Deep learning with 4 loss functions</td>
                <td class="p-4 text-[rgb(var(--text-body))]">Limited by training distribution (3M sequences)</td>
                <td class="p-4 text-purple-400">Physics-informed inductive bias</td>
              </tr>
              <tr class="bg-[rgb(var(--bg-card))/0.3]">
                <td class="p-4 font-medium text-[rgb(var(--text-heading))]">GenSmart (GenScript)</td>
                <td class="p-4 text-[rgb(var(--text-body))]">Frequency tables only</td>
                <td class="p-4 text-[rgb(var(--text-body))]">No structure awareness</td>
                <td class="p-4 text-purple-400">Holistic multi-property optimization</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- From Foundation Model to Platform -->
    <section class="relative z-10 px-6 py-20 bg-gradient-to-b from-transparent via-[rgb(var(--bg-card))/0.5] to-transparent">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-12">
          <span class="mb-4 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-300">
            From Model to Platform
          </span>
          <h2 class="text-3xl font-bold text-[rgb(var(--text-heading))] md:text-4xl lg:text-5xl mb-4">
            How Agents Use <span class="text-cyan-400">Equi-mRNA</span>
          </h2>
          <p class="mx-auto max-w-3xl text-lg text-[rgb(var(--text-body))]">
            Equi-mRNA is the foundation. Helixir AI wraps it in specialized agents that design, predict, and explain — with every result traced back to its source.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 mb-12">
          <!-- Design Agent -->
          <div class="rounded-2xl border border-[rgb(var(--border-muted))/0.5] bg-[rgb(var(--bg-card))/0.8] p-6 relative overflow-hidden">
            <div class="absolute top-0 left-0 right-0 h-1 bg-cyan-500"></div>
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 ring-1 ring-cyan-500/30">
              <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
            </div>
            <h3 class="text-lg font-bold text-cyan-400 mb-3">Design Agents</h3>
            <p class="text-sm text-[rgb(var(--text-body))] leading-relaxed mb-4">
              Generate optimized mRNA sequences using Equi-mRNA predictions for codon optimization, UTR design, and stability.
            </p>
            <p class="text-xs text-[rgb(var(--text-muted))]">Hypothesis &middot; Design &middot; Stability &middot; Ranking</p>
          </div>

          <!-- Critique Agent -->
          <div class="rounded-2xl border border-[rgb(var(--border-muted))/0.5] bg-[rgb(var(--bg-card))/0.8] p-6 relative overflow-hidden">
            <div class="absolute top-0 left-0 right-0 h-1 bg-purple-500"></div>
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 ring-1 ring-purple-500/30">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <h3 class="text-lg font-bold text-purple-400 mb-3">Critique Agents</h3>
            <p class="text-sm text-[rgb(var(--text-body))] leading-relaxed mb-4">
              Evaluate candidates across binding, stability, and immunogenicity. A judge agent forces explicit tradeoffs.
            </p>
            <p class="text-xs text-[rgb(var(--text-muted))]">Critique &middot; Tradeoffs &middot; Iteration &middot; QC</p>
          </div>

          <!-- Provenance Agent -->
          <div class="rounded-2xl border border-[rgb(var(--border-muted))/0.5] bg-[rgb(var(--bg-card))/0.8] p-6 relative overflow-hidden">
            <div class="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 ring-1 ring-emerald-500/30">
              <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <h3 class="text-lg font-bold text-emerald-400 mb-3">Provenance Engine</h3>
            <p class="text-sm text-[rgb(var(--text-body))] leading-relaxed mb-4">
              Every prediction traced to source data. No hallucinations — just grounded, explainable reasoning. This is what sets us apart from Google AI Co-Scientist.
            </p>
            <p class="text-xs text-[rgb(var(--text-muted))]">Audit Trail &middot; Explainability &middot; Grounding</p>
          </div>
        </div>

        <!-- Human-in-the-loop note -->
        <div class="rounded-xl bg-[rgb(var(--bg-card-muted))/0.6] border border-[rgb(var(--border-muted))/0.5] p-5 text-center">
          <p class="text-[rgb(var(--text-primary))]">
            AI drafts, analyzes, recommends &middot; <span class="text-[rgb(var(--text-heading))] font-medium">Scientists review, refine, decide</span> &middot; Shared context across all agents
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative z-10 px-6 py-20">
      <div class="mx-auto max-w-4xl">
        <div class="relative rounded-3xl border border-[rgb(var(--border-primary))] bg-gradient-to-br from-[rgb(var(--bg-card))] via-[rgb(var(--bg-card))/0.95] to-[rgb(var(--bg-card))] p-12 text-center overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-emerald-500/5"></div>
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-purple-500/20 to-transparent rounded-full blur-3xl"></div>

          <div class="relative">
            <h2 class="mb-6 text-3xl font-bold text-[rgb(var(--text-heading))] md:text-4xl">
              Build on <span class="text-purple-400">Equi-mRNA</span>
            </h2>
            <p class="mb-8 text-lg text-[rgb(var(--text-body))] max-w-2xl mx-auto">
              Try the Helixir AI platform or partner with us on a custom mRNA design program.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
              <router-link
                to="/platform"
                class="rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-cyan-500/50 hover:scale-105"
              >
                Try Helixir AI
              </router-link>
              <router-link
                to="/contact"
                class="rounded-full border border-[rgb(var(--border-muted))] px-8 py-4 font-medium text-[rgb(var(--text-heading))] transition-all hover:border-purple-500/50 hover:bg-[rgb(var(--bg-card-muted))/0.5] backdrop-blur-sm"
              >
                Partner With Us
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
