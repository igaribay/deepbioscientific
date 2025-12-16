<script setup lang="ts">
import { ref } from 'vue'

const scrolled = ref(false)

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 10
  })
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav
      class="fixed top-0 w-full z-50 transition-all duration-300"
      :class="scrolled ? 'bg-white shadow-md' : 'bg-white'"
    >
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
            <span class="text-white font-bold text-lg">S</span>
          </div>
          <span class="text-xl font-bold text-dark-900">Sequentia</span>
        </div>
        <button class="btn-primary">Get Started</button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-32 pb-20 px-6 bg-gradient-to-b from-primary-50 to-white">
      <div class="max-w-4xl mx-auto text-center animate-fade-in">
        <h1 class="text-5xl md:text-6xl font-bold text-dark-900 mb-6 leading-tight">
          Design Therapeutics with
          <span class="gradient-text"> Natural Language</span>
        </h1>
        <p class="text-xl text-dark-600 mb-8 max-w-2xl mx-auto">
          From protein sequence to mRNA construct to delivery strategy—all integrated in one evolutionary design platform. Define your objectives in natural language and receive optimized candidates with full traceability.
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <button class="btn-primary text-lg">Launch Studio</button>
          <button class="btn-secondary text-lg">Read White Paper</button>
        </div>
      </div>
    </section>

    <!-- Four Layers Section -->
    <section class="py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <h2 class="section-title text-center mb-16">Four Integrated Layers</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Layer 1 -->
          <div class="feature-card">
            <div class="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-dark-900 mb-3">Natural Language Spec</h3>
            <p class="text-dark-600">Describe target biology, mechanism, constraints, and preferences. Convert to machine-readable objectives automatically.</p>
          </div>

          <!-- Layer 2 -->
          <div class="feature-card">
            <div class="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0m3.135-8.135l-.707.707M17 19.364l-.707-.707" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-dark-900 mb-3">Agentic Workflow</h3>
            <p class="text-dark-600">Coordinated agents propose, critique, and iteratively improve designs across function, structure, and immunogenicity.</p>
          </div>

          <!-- Layer 3 -->
          <div class="feature-card">
            <div class="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-dark-900 mb-3">Evolutionary Generation</h3>
            <p class="text-dark-600">Population-based search with recombination and mutation operators. Multi-objective optimization across potency, stability, and manufacturability.</p>
          </div>

          <!-- Layer 4 -->
          <div class="feature-card">
            <div class="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-dark-900 mb-3">mRNA & Delivery</h3>
            <p class="text-dark-600">Co-design mRNA constructs with codon optimization, UTR selection, and delivery strategy recommendations.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Features Section -->
    <section class="py-20 px-6 bg-dark-900 text-white">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold mb-16 text-center">Why Sequentia</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- Feature 1 -->
          <div class="animate-slide-up" style="animation-delay: 0.1s">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-1">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-2">Multi-Objective Optimization</h3>
                <p class="text-dark-300">Potency, stability, immunogenicity, and manufacturability—all optimized together, not sequentially.</p>
              </div>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="animate-slide-up" style="animation-delay: 0.2s">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center flex-shrink-0 mt-1">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-2">Diversity Management</h3>
                <p class="text-dark-300">Evolutionary operators prevent mode collapse and explore diverse sequence families intelligently.</p>
              </div>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="animate-slide-up" style="animation-delay: 0.3s">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-1">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-2">Human-in-Loop Control</h3>
                <p class="text-dark-300">Choose your oversight mode—micromanage, guided, high-level, or regulated. Full traceability always.</p>
              </div>
            </div>
          </div>

          <!-- Feature 4 -->
          <div class="animate-slide-up" style="animation-delay: 0.4s">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center flex-shrink-0 mt-1">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-2">Interpretable Operators</h3>
                <p class="text-dark-300">Recombination blocks, motif locking, and mutation budgets map to intuitive design actions.</p>
              </div>
            </div>
          </div>

          <!-- Feature 5 -->
          <div class="animate-slide-up" style="animation-delay: 0.5s">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-1">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-2">Integrated Co-Design</h3>
                <p class="text-dark-300">Protein, mRNA construct, and delivery strategy optimized together with tight feedback loops.</p>
              </div>
            </div>
          </div>

          <!-- Feature 6 -->
          <div class="animate-slide-up" style="animation-delay: 0.6s">
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center flex-shrink-0 mt-1">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold mb-2">Audit & Governance</h3>
                <p class="text-dark-300">Strong compliance, role-based access, and full audit logs. Regulated workflow mode for enterprise.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Use Cases Section -->
    <section class="py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <h2 class="section-title text-center mb-4">Built for Therapeutic Innovation</h2>
        <p class="section-subtitle text-center mb-16 max-w-2xl mx-auto">Three proven beachheads to accelerate your discovery</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Peptide Therapeutics -->
          <div class="feature-card">
            <div class="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-dark-900 mb-2">Peptide Therapeutics</h3>
            <p class="text-dark-600 mb-4">Well-defined targets with fast synthesis cycles. Rapid iteration from specification to candidate validation.</p>
            <ul class="space-y-2 text-sm text-dark-600">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                Potency optimization
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                Stability engineering
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                Manufacturability
              </li>
            </ul>
          </div>

          <!-- Protein Binders -->
          <div class="feature-card">
            <div class="w-14 h-14 rounded-lg bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-accent-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-dark-900 mb-2">Protein Binder Design</h3>
            <p class="text-dark-600 mb-4">Immediate value from structure prediction and developability screening. Explore binding landscapes.</p>
            <ul class="space-y-2 text-sm text-dark-600">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent-600"></span>
                Structure optimization
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent-600"></span>
                Binding prediction
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent-600"></span>
                Specificity screening
              </li>
            </ul>
          </div>

          <!-- mRNA Optimization -->
          <div class="feature-card">
            <div class="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-dark-900 mb-2">mRNA Construct Optimization</h3>
            <p class="text-dark-600 mb-4">Low-friction entry point. Optimize existing protein sequences end-to-end, codon to delivery.</p>
            <ul class="space-y-2 text-sm text-dark-600">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                Codon optimization
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                UTR design
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                Delivery fit
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Offerings Section -->
    <section class="py-20 px-6 bg-dark-50">
      <div class="max-w-6xl mx-auto">
        <h2 class="section-title text-center mb-16">Three Ways to Work</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Research Studio -->
          <div class="bg-white rounded-xl border border-dark-200 p-8 hover:shadow-lg transition-shadow">
            <h3 class="text-2xl font-bold text-dark-900 mb-4">Research Studio</h3>
            <p class="text-dark-600 mb-6">Interactive environment for scientists exploring discovery and design space.</p>
            <ul class="space-y-3 text-dark-600 mb-8">
              <li class="flex items-start gap-3">
                <span class="text-primary-600 font-bold mt-0.5">→</span>
                <span>Live design iteration</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-primary-600 font-bold mt-0.5">→</span>
                <span>Real-time scoring</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-primary-600 font-bold mt-0.5">→</span>
                <span>Interactive visualizations</span>
              </li>
            </ul>
            <button class="btn-secondary w-full">Learn More</button>
          </div>

          <!-- Enterprise Workflow -->
          <div class="bg-white rounded-xl border border-dark-200 p-8 hover:shadow-lg transition-shadow ring-2 ring-primary-600 relative">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span class="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Popular</span>
            </div>
            <h3 class="text-2xl font-bold text-dark-900 mb-4">Enterprise Workflow</h3>
            <p class="text-dark-600 mb-6">Governed pipelines with LIMS integration and compliance ready outputs.</p>
            <ul class="space-y-3 text-dark-600 mb-8">
              <li class="flex items-start gap-3">
                <span class="text-primary-600 font-bold mt-0.5">→</span>
                <span>Governed design loops</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-primary-600 font-bold mt-0.5">→</span>
                <span>Audit trails & compliance</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-primary-600 font-bold mt-0.5">→</span>
                <span>LIMS integration</span>
              </li>
            </ul>
            <button class="btn-primary w-full">Get Started</button>
          </div>

          <!-- API & SDK -->
          <div class="bg-white rounded-xl border border-dark-200 p-8 hover:shadow-lg transition-shadow">
            <h3 class="text-2xl font-bold text-dark-900 mb-4">API & SDK</h3>
            <p class="text-dark-600 mb-6">Programmatic access to generation, scoring, and design modules.</p>
            <ul class="space-y-3 text-dark-600 mb-8">
              <li class="flex items-start gap-3">
                <span class="text-accent-600 font-bold mt-0.5">→</span>
                <span>Generation pipeline</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-accent-600 font-bold mt-0.5">→</span>
                <span>Scoring modules</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-accent-600 font-bold mt-0.5">→</span>
                <span>Batch design runs</span>
              </li>
            </ul>
            <button class="btn-secondary w-full">Documentation</button>
          </div>
        </div>
      </div>
    </section>

    <!-- System Architecture Section -->
    <section class="py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <h2 class="section-title text-center mb-4">Modular, Auditable, Replaceable</h2>
        <p class="section-subtitle text-center mb-16 max-w-2xl mx-auto">Core components designed for transparency and extensibility</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Component 1 -->
          <div class="feature-card group">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition">
                <span class="font-bold text-primary-700">A</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-dark-900 mb-2">Intent Compiler</h3>
                <p class="text-dark-600 text-sm">Transforms user text into objectives, constraints, and test plans. Produces experiment graph with required predictors.</p>
              </div>
            </div>
          </div>

          <!-- Component 2 -->
          <div class="feature-card group">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-200 transition">
                <span class="font-bold text-accent-700">B</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-dark-900 mb-2">Candidate Generator</h3>
                <p class="text-dark-600 text-sm">Initializes populations from known scaffolds, de novo seeds, motif templates, and optional user imports.</p>
              </div>
            </div>
          </div>

          <!-- Component 3 -->
          <div class="feature-card group">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition">
                <span class="font-bold text-primary-700">C</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-dark-900 mb-2">Evolutionary Optimizer</h3>
                <p class="text-dark-600 text-sm">Population updates with tournament selection, Pareto ranking, block crossover, and motif-preserving mutations.</p>
              </div>
            </div>
          </div>

          <!-- Component 4 -->
          <div class="feature-card group">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-200 transition">
                <span class="font-bold text-accent-700">D</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-dark-900 mb-2">Scoring Suite</h3>
                <p class="text-dark-600 text-sm">Structure prediction, binding surrogates, developability, toxicity, immunogenicity, expression, and manufacturability.</p>
              </div>
            </div>
          </div>

          <!-- Component 5 -->
          <div class="feature-card group">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition">
                <span class="font-bold text-primary-700">E</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-dark-900 mb-2">mRNA Designer</h3>
                <p class="text-dark-600 text-sm">Codon optimization, UTR design, motif checking, secondary structure prediction, and translation efficiency tuning.</p>
              </div>
            </div>
          </div>

          <!-- Component 6 -->
          <div class="feature-card group">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-200 transition">
                <span class="font-bold text-accent-700">F</span>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-dark-900 mb-2">Delivery Designer</h3>
                <p class="text-dark-600 text-sm">Recommends formulation candidates based on tissue, route, payload, and stability. Outputs tradeoff analysis.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Oversight Modes Section -->
    <section class="py-20 px-6 bg-gradient-to-b from-dark-900 to-dark-800 text-white">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-4">Your Control, Your Way</h2>
        <p class="text-center text-dark-300 mb-16 max-w-2xl mx-auto">Configurable oversight modes for different team preferences and compliance requirements.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Mode 1 -->
          <div class="bg-dark-800 border border-dark-700 rounded-lg p-6 hover:border-primary-600 transition">
            <div class="w-12 h-12 rounded-lg bg-primary-900 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 10a6 6 0 1-12 0 6 6 0 0112 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold mb-2">Micromanage Mode</h3>
            <p class="text-dark-400 text-sm">Approve each stage gate. Edit motifs, lock residues, set mutation budgets, override selections.</p>
          </div>

          <!-- Mode 2 -->
          <div class="bg-dark-800 border border-dark-700 rounded-lg p-6 hover:border-accent-600 transition">
            <div class="w-12 h-12 rounded-lg bg-accent-900 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2 9.5A6.5 6.5 0 0110 16a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5zM16.293 7.293a1 1 0 011.414 0L18 8.586l1.293-1.293a1 1 0 111.414 1.414L19.414 10l1.293 1.293a1 1 0 01-1.414 1.414L18 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L16.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-bold mb-2">Guided Mode</h3>
            <p class="text-dark-400 text-sm">Set objectives and review at checkpoints. System proposes actions and explains tradeoffs concisely.</p>
          </div>

          <!-- Mode 3 -->
          <div class="bg-dark-800 border border-dark-700 rounded-lg p-6 hover:border-primary-600 transition">
            <div class="w-12 h-12 rounded-lg bg-primary-900 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold mb-2">High-Level Mode</h3>
            <p class="text-dark-400 text-sm">Provide goals and constraints. Receive ranked deliverables with minimal prompts. Full audit trail.</p>
          </div>

          <!-- Mode 4 -->
          <div class="bg-dark-800 border border-dark-700 rounded-lg p-6 hover:border-accent-600 transition">
            <div class="w-12 h-12 rounded-lg bg-accent-900 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-bold mb-2">Regulated Workflow</h3>
            <p class="text-dark-400 text-sm">Mandatory reviews, policy checks, restricted operations. Compliance-ready enterprise mode.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Safety & Governance Section -->
    <section class="py-20 px-6">
      <div class="max-w-6xl mx-auto">
        <h2 class="section-title text-center mb-16">Safety by Design</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 class="text-2xl font-bold text-dark-900 mb-6">Governance & Compliance</h3>
            <ul class="space-y-4">
              <li class="flex items-start gap-4">
                <div class="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold text-dark-900 mb-1">Access Control & Logging</h4>
                  <p class="text-dark-600">Strong authentication, role-based permissions, and full audit logs for all operations.</p>
                </div>
              </li>
              <li class="flex items-start gap-4">
                <div class="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold text-dark-900 mb-1">Policy Constraints</h4>
                  <p class="text-dark-600">Automated checks restrict sensitive targets. Red teaming and safety validation built-in.</p>
                </div>
              </li>
              <li class="flex items-start gap-4">
                <div class="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold text-dark-900 mb-1">Data Governance</h4>
                  <p class="text-dark-600">Clear separation of customer, internal, and public data with optional on-prem or VPC deployments.</p>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-2xl font-bold text-dark-900 mb-6">Human Accountability</h3>
            <ul class="space-y-4">
              <li class="flex items-start gap-4">
                <div class="w-5 h-5 rounded-full bg-accent-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold text-dark-900 mb-1">Decision Support, Not Decision Maker</h4>
                  <p class="text-dark-600">All final decisions require human approval. Platform is a tool, humans retain control.</p>
                </div>
              </li>
              <li class="flex items-start gap-4">
                <div class="w-5 h-5 rounded-full bg-accent-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold text-dark-900 mb-1">Full Traceability</h4>
                  <p class="text-dark-600">Every decision logged with rationale. Diffs between iterations. Reproducible workflows.</p>
                </div>
              </li>
              <li class="flex items-start gap-4">
                <div class="w-5 h-5 rounded-full bg-accent-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold text-dark-900 mb-1">Audit & Compliance Export</h4>
                  <p class="text-dark-600">Export complete design history, provenance, and validation summaries for regulatory review.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Roadmap Section -->
    <section class="py-20 px-6 bg-dark-50">
      <div class="max-w-4xl mx-auto">
        <h2 class="section-title text-center mb-16">Our Path Forward</h2>
        <div class="space-y-8">
          <!-- Phase 1 -->
          <div class="flex gap-8 items-start">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">1</div>
              <div class="w-1 h-20 bg-dark-300 mt-4"></div>
            </div>
            <div class="pb-8">
              <h3 class="text-2xl font-bold text-dark-900 mb-2">Phase 1: MVP</h3>
              <p class="text-dark-600 mb-4">Natural language spec, baseline evolutionary engine, core scoring, mRNA design, and review interface.</p>
              <div class="flex gap-3 flex-wrap">
                <span class="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">NL Specification</span>
                <span class="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">Evolutionary Search</span>
                <span class="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">Scoring Suite</span>
              </div>
            </div>
          </div>

          <!-- Phase 2 -->
          <div class="flex gap-8 items-start">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-full bg-accent-600 text-white flex items-center justify-center font-bold text-lg">2</div>
              <div class="w-1 h-20 bg-dark-300 mt-4"></div>
            </div>
            <div class="pb-8">
              <h3 class="text-2xl font-bold text-dark-900 mb-2">Phase 2: Co-Design Loops</h3>
              <p class="text-dark-600 mb-4">Tight coupling between protein and mRNA/delivery scoring, improved operators, better interpretability.</p>
              <div class="flex gap-3 flex-wrap">
                <span class="px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-sm font-medium">Feedback Loops</span>
                <span class="px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-sm font-medium">Advanced Operators</span>
                <span class="px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-sm font-medium">Interpretability</span>
              </div>
            </div>
          </div>

          <!-- Phase 3 -->
          <div class="flex gap-8 items-start">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">3</div>
              <div class="w-1 h-20 bg-dark-300 mt-4"></div>
            </div>
            <div class="pb-8">
              <h3 class="text-2xl font-bold text-dark-900 mb-2">Phase 3: Enterprise Readiness</h3>
              <p class="text-dark-600 mb-4">Governance mode, advanced access controls, deployment options, integrations, and reporting.</p>
              <div class="flex gap-3 flex-wrap">
                <span class="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">Governance</span>
                <span class="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">Integrations</span>
                <span class="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">Deployment</span>
              </div>
            </div>
          </div>

          <!-- Phase 4 -->
          <div class="flex gap-8 items-start">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-full bg-accent-600 text-white flex items-center justify-center font-bold text-lg">4</div>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-dark-900 mb-2">Phase 4: Learning Loop</h3>
              <p class="text-dark-600 mb-4">Closed-loop learning from wet lab results, improved surrogates, adaptive selection policies.</p>
              <div class="flex gap-3 flex-wrap">
                <span class="px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-sm font-medium">Outcome Feedback</span>
                <span class="px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-sm font-medium">Surrogate Learning</span>
                <span class="px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-sm font-medium">Adaptation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 px-6 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-5xl font-bold mb-6">Ready to Transform Therapeutic Design?</h2>
        <p class="text-xl text-primary-100 mb-12 max-w-2xl mx-auto">
          Join innovative biotech teams building the next generation of protein and peptide therapeutics.
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <button class="bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors">
            Start Free Trial
          </button>
          <button class="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
            Schedule Demo
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark-900 text-dark-400 py-12 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center">
                <span class="text-white font-bold">S</span>
              </div>
              <span class="font-bold text-white">Sequentia</span>
            </div>
            <p class="text-sm">Natural language to mRNA design platform for therapeutic innovation.</p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Product</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition">Research Studio</a></li>
              <li><a href="#" class="hover:text-white transition">Enterprise</a></li>
              <li><a href="#" class="hover:text-white transition">API</a></li>
              <li><a href="#" class="hover:text-white transition">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Resources</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition">Documentation</a></li>
              <li><a href="#" class="hover:text-white transition">Blog</a></li>
              <li><a href="#" class="hover:text-white transition">Webinars</a></li>
              <li><a href="#" class="hover:text-white transition">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Company</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition">About</a></li>
              <li><a href="#" class="hover:text-white transition">Contact</a></li>
              <li><a href="#" class="hover:text-white transition">Privacy</a></li>
              <li><a href="#" class="hover:text-white transition">Terms</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-dark-800 pt-8">
          <p class="text-center text-sm">© 2025 Sequentia. All rights reserved. Advancing therapeutic design through evolutionary computing.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
</style>
