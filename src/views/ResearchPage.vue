<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'

const publications = [
  {
    title: 'Evolutionary Optimization of Therapeutic Proteins Using Multi-Agent Systems',
    authors: 'Chen, L., Smith, J., et al.',
    journal: 'Nature Methods',
    year: '2025',
    doi: '10.1038/xxx',
  },
  {
    title: 'Natural Language Interfaces for Molecular Design Specifications',
    authors: 'Kumar, A., Johnson, M., et al.',
    journal: 'Science',
    year: '2025',
    doi: '10.1126/xxx',
  },
  {
    title: 'Pareto-Optimal Selection in Therapeutic Sequence Space',
    authors: 'Williams, R., Chen, L., et al.',
    journal: 'Cell Systems',
    year: '2024',
    doi: '10.1016/xxx',
  },
]

const focusAreas = [
  {
    title: 'Protein Language Models',
    description: 'Developing next-generation embeddings and generative models for therapeutic protein design.',
    icon: 'brain',
    color: 'cyan',
  },
  {
    title: 'Structure Prediction',
    description: 'Advancing accuracy and speed of protein structure prediction for drug design applications.',
    icon: 'cube',
    color: 'purple',
  },
  {
    title: 'mRNA Optimization',
    description: 'Novel approaches to codon optimization, UTR design, and expression prediction.',
    icon: 'dna',
    color: 'pink',
  },
  {
    title: 'Delivery Systems',
    description: 'Computational design of lipid nanoparticles and tissue-targeting strategies.',
    icon: 'truck',
    color: 'green',
  },
]

onMounted(() => {
  const cards = document.querySelectorAll('.research-card')
  if (cards.length > 0) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out', delay: 0.2 }
    )
  }
})
</script>

<template>
  <div class="min-h-screen pt-24">
    <!-- Hero -->
    <section class="px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <span class="mb-4 inline-block rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1 text-sm font-medium text-pink-300">
          Research
        </span>
        <h1 class="mb-6 text-5xl font-bold text-white md:text-6xl">
          Advancing <span class="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Science</span>
        </h1>
        <p class="max-w-3xl text-xl text-slate-400">
          Our research team is pushing the boundaries of computational biology, machine learning, and therapeutic design.
        </p>
      </div>
    </section>

    <!-- Focus Areas -->
    <section class="px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-12 text-3xl font-bold text-white">Research Focus Areas</h2>
        <div class="grid gap-6 md:grid-cols-2">
          <div 
            v-for="area in focusAreas" 
            :key="area.title"
            class="research-card group rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-slate-700"
          >
            <div 
              class="mb-6 flex h-14 w-14 items-center justify-center rounded-xl ring-1"
              :class="[
                area.color === 'cyan' ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 ring-cyan-500/30' : '',
                area.color === 'purple' ? 'bg-gradient-to-br from-purple-500/20 to-purple-500/5 ring-purple-500/30' : '',
                area.color === 'pink' ? 'bg-gradient-to-br from-pink-500/20 to-pink-500/5 ring-pink-500/30' : '',
                area.color === 'green' ? 'bg-gradient-to-br from-green-500/20 to-green-500/5 ring-green-500/30' : '',
              ]"
            >
              <svg 
                class="h-7 w-7"
                :class="[
                  area.color === 'cyan' ? 'text-cyan-400' : '',
                  area.color === 'purple' ? 'text-purple-400' : '',
                  area.color === 'pink' ? 'text-pink-400' : '',
                  area.color === 'green' ? 'text-green-400' : '',
                ]"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="mb-3 text-xl font-bold text-white">{{ area.title }}</h3>
            <p class="text-slate-400">{{ area.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Publications -->
    <section class="bg-gradient-to-b from-[#020617] via-slate-900/30 to-[#020617] px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-12 text-3xl font-bold text-white">Recent Publications</h2>
        <div class="space-y-6">
          <div 
            v-for="pub in publications" 
            :key="pub.title"
            class="research-card rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-slate-700"
          >
            <h3 class="mb-2 text-lg font-bold text-white">{{ pub.title }}</h3>
            <p class="mb-3 text-sm text-slate-400">{{ pub.authors }}</p>
            <div class="flex items-center gap-4 text-sm">
              <span class="font-medium text-cyan-400">{{ pub.journal }}</span>
              <span class="text-slate-500">{{ pub.year }}</span>
              <a href="#" class="text-purple-400 hover:text-purple-300">DOI: {{ pub.doi }}</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Collaborations CTA -->
    <section class="px-6 py-20">
      <div class="mx-auto max-w-4xl text-center">
        <h2 class="mb-6 text-3xl font-bold text-white">Research Collaborations</h2>
        <p class="mb-8 text-lg text-slate-400">
          We partner with leading academic institutions and research organizations worldwide. Interested in collaborating?
        </p>
        <router-link 
          to="/contact"
          class="inline-block rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-500/50"
        >
          Discuss Collaboration
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.research-card {
  opacity: 1;
}
</style>

