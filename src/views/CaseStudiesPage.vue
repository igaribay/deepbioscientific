<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'

const caseStudies = [
  {
    id: 1,
    title: 'GLP-1 Agonist Optimization',
    partner: 'Major Pharma Partner',
    category: 'Peptide Therapeutics',
    description: 'Optimized a novel GLP-1 receptor agonist for improved stability and reduced immunogenicity.',
    results: [
      { metric: '10x', label: 'Faster Design Cycles' },
      { metric: '47%', label: 'Improved Stability' },
      { metric: '3', label: 'IND-Enabling Candidates' },
    ],
    color: 'cyan',
  },
  {
    id: 2,
    title: 'De Novo Protein Binder Design',
    partner: 'Biotech Startup',
    category: 'Protein Design',
    description: 'Designed novel protein binders targeting an undruggable oncology target with high specificity.',
    results: [
      { metric: '1000+', label: 'Candidates Evaluated' },
      { metric: '<10nM', label: 'Binding Affinity' },
      { metric: '8 weeks', label: 'To Lead Candidate' },
    ],
    color: 'purple',
  },
  {
    id: 3,
    title: 'mRNA Vaccine Optimization',
    partner: 'Academic Institution',
    category: 'mRNA Therapeutics',
    description: 'Optimized mRNA constructs for a personalized neoantigen cancer vaccine with improved expression.',
    results: [
      { metric: '5x', label: 'Expression Increase' },
      { metric: '94%', label: 'Validation Rate' },
      { metric: '2x', label: 'Half-life Extension' },
    ],
    color: 'pink',
  },
]

const testimonials = [
  {
    quote: "Sequentia's platform accelerated our peptide program by over a year. The quality of candidates exceeded our expectations.",
    author: 'VP of Discovery',
    company: 'Top 10 Pharma',
  },
  {
    quote: "The ability to specify our therapeutic goals in natural language and get optimized candidates back is transformative.",
    author: 'CSO',
    company: 'Clinical-Stage Biotech',
  },
]

onMounted(() => {
  const cards = document.querySelectorAll('.case-card')
  if (cards.length > 0) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'power3.out', delay: 0.2 }
    )
  }
})
</script>

<template>
  <div class="min-h-screen pt-24">
    <!-- Hero -->
    <section class="px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <span class="mb-4 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-sm font-medium text-amber-300">
          Case Studies
        </span>
        <h1 class="mb-6 text-5xl font-bold text-white md:text-6xl">
          Proven <span class="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Results</span>
        </h1>
        <p class="max-w-3xl text-xl text-slate-400">
          See how our partners are using Sequentia's platform to accelerate therapeutic discovery and development.
        </p>
      </div>
    </section>

    <!-- Case Studies Grid -->
    <section class="px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <div class="grid gap-8 lg:grid-cols-3">
          <div 
            v-for="study in caseStudies" 
            :key="study.id"
            class="case-card group rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-slate-700"
          >
            <div class="mb-4">
              <span 
                class="rounded-full px-3 py-1 text-xs font-medium ring-1"
                :class="[
                  study.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/30' : '',
                  study.color === 'purple' ? 'bg-purple-500/10 text-purple-400 ring-purple-500/30' : '',
                  study.color === 'pink' ? 'bg-pink-500/10 text-pink-400 ring-pink-500/30' : '',
                ]"
              >
                {{ study.category }}
              </span>
            </div>
            
            <h3 class="mb-2 text-xl font-bold text-white">{{ study.title }}</h3>
            <p class="mb-2 text-sm text-slate-500">{{ study.partner }}</p>
            <p class="mb-6 text-slate-400">{{ study.description }}</p>
            
            <div class="grid grid-cols-3 gap-4 border-t border-slate-800 pt-6">
              <div v-for="result in study.results" :key="result.label" class="text-center">
                <div 
                  class="text-2xl font-bold"
                  :class="[
                    study.color === 'cyan' ? 'text-cyan-400' : '',
                    study.color === 'purple' ? 'text-purple-400' : '',
                    study.color === 'pink' ? 'text-pink-400' : '',
                  ]"
                >
                  {{ result.metric }}
                </div>
                <div class="text-xs text-slate-500">{{ result.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="bg-gradient-to-b from-[#020617] via-slate-900/30 to-[#020617] px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-12 text-center text-3xl font-bold text-white">What Partners Say</h2>
        <div class="grid gap-8 md:grid-cols-2">
          <div 
            v-for="testimonial in testimonials" 
            :key="testimonial.author"
            class="case-card rounded-2xl border border-slate-800 bg-slate-900/50 p-8"
          >
            <svg class="mb-4 h-10 w-10 text-cyan-500/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p class="mb-6 text-lg text-slate-300">{{ testimonial.quote }}</p>
            <div>
              <p class="font-bold text-white">{{ testimonial.author }}</p>
              <p class="text-sm text-slate-500">{{ testimonial.company }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="px-6 py-20">
      <div class="mx-auto max-w-4xl text-center">
        <h2 class="mb-6 text-3xl font-bold text-white">Ready to Start Your Success Story?</h2>
        <p class="mb-8 text-lg text-slate-400">
          Join leading pharmaceutical and biotech companies using Sequentia to accelerate therapeutic discovery.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link 
            to="/contact"
            class="rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-500/50"
          >
            Start a Partnership
          </router-link>
          <button class="rounded-full border border-slate-700 px-8 py-4 font-medium text-white transition-all hover:border-cyan-500/50 hover:bg-slate-800">
            Download Full Case Studies
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.case-card {
  opacity: 1;
}
</style>

