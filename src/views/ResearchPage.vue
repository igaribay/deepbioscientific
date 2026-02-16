<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import gsap from 'gsap'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo({
  title: 'Research & Publications',
  description: 'Peer-reviewed research in drug-target interaction, mRNA language models, fair machine learning, and large language models. Explore our scientific foundation and publications.',
  path: '/research',
})

// Publications from Google Scholar (https://scholar.google.com/citations?user=0RKzNtIAAAAJ&hl=en)
const publications = [
  // 2025
  {
    title: 'Equi-mRNA: Protein Translation Equivariant Encoding for mRNA Language Models',
    authors: 'Yazdani-Jahromi M., Khodabandeh Yalabadi A., Garibay O.O.',
    journal: 'NeurIPS',
    year: 2025,
    citations: 1,
    color: 'cyan',
    url: 'https://arxiv.org/abs/2508.15103',
  },
  {
    title: 'BoKDiff: Best-of-K Diffusion Alignment for Target-Specific 3D Molecule Generation',
    authors: 'Khodabandeh Yalabadi A., Yazdani-Jahromi M., Garibay O.O.',
    journal: 'Bioinformatics Advances',
    year: 2025,
    citations: 1,
    color: 'cyan',
    url: 'https://academic.oup.com/bioinformaticsadvances/article/5/1/vbaf137/8159881',
  },
  {
    title: 'FairContrast: Enhancing Fairness through Contrastive Learning and Customized Augmenting Methods on Tabular Data',
    authors: 'Tayebi A., Khodabandeh Yalabadi A., Yazdani-Jahromi M., Garibay O.O.',
    journal: 'arXiv',
    year: 2025,
    citations: 0,
    color: 'emerald',
    url: 'https://arxiv.org/abs/2510.02017',
  },
  {
    title: 'Evaluating Fairness and Bias in Large Language Models for Tabular Data',
    authors: 'Tayebi A., Garibay O.O.',
    journal: 'AAAI',
    year: 2025,
    citations: 2,
    color: 'emerald',
    url: 'https://dl.acm.org/doi/10.1007/978-3-031-93415-5_7',
  },
  {
    title: 'LLM-Mixer: Multiscale Mixing in LLMs for Time Series Forecasting',
    authors: 'Kowsher M., Sobuj M.S.I., Prottasha N.J., Alanis E.A., Garibay O., Yousefi N.',
    journal: 'TRL Workshop',
    year: 2025,
    citations: 8,
    color: 'blue',
    url: 'https://arxiv.org/abs/2410.11674',
  },
  {
    title: 'Predicting Through Generation: Why Generation is Better for Prediction',
    authors: 'Kowsher M., Prottasha N.J., Bhat P., Yu C.N., Soltanalian M., Garibay I., Garibay O.',
    journal: 'arXiv',
    year: 2025,
    citations: 1,
    color: 'blue',
    url: 'https://arxiv.org/abs/2502.17817',
  },
  // 2024
  {
    title: 'Fair Bilevel Neural Network (FairBiNN): On Balancing Fairness and Accuracy via Stackelberg Equilibrium',
    authors: 'Yazdani-Jahromi M., Khodabandeh Yalabadi A., Rajabi A.A., Tayebi A., Garibay I., Garibay O.O.',
    journal: 'NeurIPS',
    year: 2024,
    citations: 5,
    color: 'emerald',
    url: 'https://arxiv.org/abs/2410.16432',
  },
  {
    title: 'FragXsiteDTI: An Interpretable Transformer-Based Model for Drug-Target Interaction Prediction',
    authors: 'Yazdani-Jahromi M., Yousefi N., Tayebi A., Kolber E., Craig K., Garibay I., Garibay O.O.',
    journal: 'RECOMB',
    year: 2024,
    citations: 45,
    color: 'cyan',
    url: 'https://arxiv.org/abs/2311.02326',
  },
  {
    title: 'Parameter-Efficient Fine-Tuning of Large Language Models Using Semantic Knowledge Tuning',
    authors: 'Prottasha N.J., Mahmud A., Sobuj M.S.I., Bhat P., Kowsher M., Yousefi N., Garibay O.O.',
    journal: 'Scientific Reports',
    year: 2024,
    citations: 17,
    color: 'blue',
    url: 'https://arxiv.org/abs/2410.08598',
  },
  {
    title: 'Distance Correlation GAN: Fair Tabular Data Generation with Generative Adversarial Networks',
    authors: 'Rajabi A., Yazdani-Jahromi M., Garibay O.O.',
    journal: 'Artificial Intelligence in HCI',
    year: 2024,
    citations: 12,
    color: 'emerald',
    url: 'https://link.springer.com/chapter/10.1007/978-3-031-35891-3_26',
  },
  {
    title: 'A Quantum Leap for Fairness: Quantum Bayesian Approach for Fair Decision Making',
    authors: 'Mutlu E., Garibay O.O.',
    journal: ' HCI International 2021',
    year: 2024,
    citations: 3,
    color: 'emerald',
    url: 'https://link.springer.com/chapter/10.1007/978-3-030-90963-5_37',
  },
  {
    title: 'Learning Fair Representations: Mitigating Statistical Dependencies',
    authors: 'Tayebi A., Yazdani-Jahromi M., Khodabandeh Yalabadi A., Yousefi N., Garibay O.O.',
    journal: 'HCII',
    year: 2024,
    citations: 4,
    color: 'emerald',
    url: 'https://link.springer.com/chapter/10.1007/978-3-031-60611-3_8',
  },
  {
    title: 'Improving Fairness via Deep Ensemble Framework Using Preprocessing Interventions',
    authors: 'Tayebi A., Garibay O.O.',
    journal: 'Machine Learning',
    year: 2024,
    citations: 6,
    color: 'emerald',
    url: 'https://link.springer.com/chapter/10.1007/978-3-031-35891-3_29',
  },
  {
    title: 'Examining Sialic Acid Derivatives as Potential Inhibitors of SARS-CoV-2 Spike Protein',
    authors: 'Banerjee T., Gosai A., Yousefi N., Garibay O.O., Seal S., Balasubramanian G.',
    journal: 'J. Biomolecular Structure and Dynamics',
    year: 2024,
    citations: 8,
    color: 'cyan',
    url: 'https://pubmed.ncbi.nlm.nih.gov/37424217/#:~:text=The%20infection%20can%20be%20prevented,proteins%20of%20the%20coronaviridae%20family.',
  },
  {
    title: 'Does Self-Attention Need Separate Weights in Transformers?',
    authors: 'Kowsher M., Prottasha N.J., Yu C.N., Garibay O.O., Yousefi N.',
    journal: 'arXiv',
    year: 2024,
    citations: 2,
    color: 'blue',
    url: 'https://arxiv.org/abs/2412.00359',
  },
  // 2023
  {
    title: 'Six Human-Centered Artificial Intelligence Grand Challenges',
    authors: 'Ozmen Garibay O., Winslow B., Andolina S., Antona M., Bodenschatz A., et al.',
    journal: 'International Journal of Human–Computer Interaction',
    year: 2023,
    citations: 606,
    color: 'blue',
    url: 'https://www.tandfonline.com/doi/full/10.1080/10447318.2022.2153320',
  },
  {
    title: 'AttentionSiteDTI: An Interpretable Graph-Based Model for Drug-Target Interaction Prediction Using NLP Sentence-Level Relation Classification',
    authors: 'Yazdani-Jahromi M., Yousefi N., Tayebi A., Kolanthai E., Neal C.J., Seal S., Garibay O.O.',
    journal: 'Briefings in Bioinformatics',
    year: 2023,
    citations: 118,
    color: 'cyan',
    url: 'https://academic.oup.com/bib/article/23/4/bbac272/6640006',
  },
  {
    title: 'BindingSite-AugmentedDTA: Enabling a Next-Generation Pipeline for Interpretable Prediction Models in Drug Repurposing',
    authors: 'Yousefi N., Yazdani-Jahromi M., Tayebi A., Kolanthai E., Neal C.J., Seal S., Garibay O.O.',
    journal: 'Briefings in Bioinformatics',
    year: 2023,
    citations: 52,
    color: 'cyan',
    url: 'https://academic.oup.com/bib/article/24/3/bbad136/7140297',
  },
  {
    title: 'UnbiasedDTI: Mitigating Real-World Bias of Drug-Target Interaction Prediction by Using Deep Ensemble-Balanced Learning',
    authors: 'Tayebi A., Yousefi N., Yazdani-Jahromi M., Kolanthai E., Neal C.J., Seal S., Garibay O.O.',
    journal: 'Molecules',
    year: 2023,
    citations: 28,
    color: 'cyan',
    url: 'https://www.mdpi.com/1420-3049/27/9/2980',
  },
  {
    title: 'Contrastive Counterfactual Fairness in Algorithmic Decision-Making',
    authors: 'Mutlu E., Yousefi N., Garibay O.O.',
    journal: 'AIES 2022',
    year: 2023,
    citations: 18,
    color: 'emerald',
    url: 'https://dl.acm.org/doi/10.1145/3514094.3534143',
  },
  // 2022
  {
    title: 'TabFairGAN: Fair Tabular Data Generation with Generative Adversarial Networks',
    authors: 'Rajabi A., Garibay O.O.',
    journal: 'Machine Learning and Knowledge Extraction',
    year: 2022,
    citations: 113,
    color: 'emerald',
    url: 'https://arxiv.org/abs/2109.00666',
  },
  // 2021

  // Earlier foundational work
  {
    title: 'The Modular Genetic Algorithm: Exploiting Regularities in the Problem Space',
    authors: 'Garibay O.O., Garibay I., Wu A.S.',
    journal: 'ISCIS',
    year: 2003,
    citations: 27,
    color: 'slate',
    url: 'https://link.springer.com/chapter/10.1007/978-3-540-39737-3_73',
  },
  {
    title: 'Effects of Module Encapsulation in Repetitively Modular Genotypes on the Search Space',
    authors: 'Garibay I., Garibay O.O., Wu A.S.',
    journal: 'GECCO',
    year: 2004,
    citations: 18,
    color: 'slate',
    url: 'https://link.springer.com/chapter/10.1007/978-3-540-24854-5_110',
  },
]

// Sort by year descending
const sortedPublications = computed(() => 
  [...publications].sort((a, b) => b.year - a.year)
)

// Show more functionality
const showCount = ref(6)
const displayedPublications = computed(() => sortedPublications.value.slice(0, showCount.value))
const hasMore = computed(() => showCount.value < publications.length)

function showMore() {
  showCount.value = Math.min(showCount.value + 6, publications.length)
}

// Calculate total citations
const totalCitations = computed(() => publications.reduce((sum, pub) => sum + pub.citations, 0))
const totalPublications = computed(() => publications.length)

const focusAreas = [
  {
    title: 'Drug-Target Interaction',
    description: 'Interpretable AI models for drug discovery, including attention-based DTI prediction, binding site analysis, and molecular generation.',
    color: 'cyan',
  },
  {
    title: 'Fairness in Machine Learning',
    description: 'Novel approaches to algorithmic fairness using GANs, game theory, contrastive learning, and quantum computing.',
    color: 'emerald',
  },
  {
    title: 'Large Language Models',
    description: 'Parameter-efficient fine-tuning, time series forecasting, and architectural innovations in transformers.',
    color: 'blue',
  },
  {
    title: 'Evolutionary Computation & COVID-19',
    description: 'Foundational work on modular genetic algorithms, agent-based modeling, and pandemic containment strategies.',
    color: 'teal',
  },
]

// Color classes helper for dynamic styling
const colorClasses: Record<string, { badge: string; icon: string }> = {
  cyan: {
    badge: 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/30',
    icon: 'bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 ring-cyan-500/30 text-cyan-400',
  },
  emerald: {
    badge: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30',
    icon: 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 ring-emerald-500/30 text-emerald-400',
  },
  blue: {
    badge: 'bg-blue-500/10 text-blue-400 ring-blue-500/30',
    icon: 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 ring-blue-500/30 text-blue-400',
  },
  teal: {
    badge: 'bg-teal-500/10 text-teal-400 ring-teal-500/30',
    icon: 'bg-gradient-to-br from-teal-500/20 to-teal-500/5 ring-teal-500/30 text-teal-400',
  },
  slate: {
    badge: 'bg-slate-500/10 text-[rgb(var(--text-body))] ring-slate-500/30',
    icon: 'bg-gradient-to-br from-slate-500/20 to-slate-500/5 ring-slate-500/30 text-[rgb(var(--text-body))]',
  },
}

function getBadgeClass(color: string) {
  return colorClasses[color]?.badge || colorClasses.slate.badge
}

onMounted(() => {
  gsap.fromTo('.hero-title', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
  )
  
  gsap.fromTo('.hero-badge', 
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 }
  )

  const cards = document.querySelectorAll('.research-card')
  if (cards.length > 0) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out', delay: 0.3 }
    )
  }
})
</script>

<template>
  <div class="min-h-screen pt-24 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"></div>
      <div class="absolute bottom-1/3 right-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-2/3 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" style="animation-delay: 2s"></div>
      <div class="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
    </div>

    <!-- Hero -->
    <section class="relative z-10 px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <div class="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 backdrop-blur-sm">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
          </span>
          <span class="text-sm font-medium text-cyan-300">Research & Publications</span>
        </div>
        
        <h1 class="hero-title mb-6 text-5xl font-bold text-[rgb(var(--text-heading))] md:text-7xl">
          Scientific <span class="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Foundation</span>
        </h1>
        <p class="hero-title max-w-3xl text-xl text-[rgb(var(--text-body))] leading-relaxed">
          Our platform is built on peer-reviewed research in <span class="text-cyan-400">drug discovery</span>, 
          <span class="text-emerald-400">fair machine learning</span>, and <span class="text-blue-400">large language models</span>.
        </p>
        
        <!-- Research Stats -->
        <div class="hero-title mt-12 flex flex-wrap items-center gap-8">
          <div class="text-center">
            <div class="text-4xl font-bold text-cyan-400">{{ totalPublications }}+</div>
            <div class="text-sm text-[rgb(var(--text-muted))]">Publications</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-teal-400">{{ totalCitations.toLocaleString() }}+</div>
            <div class="text-sm text-[rgb(var(--text-muted))]">Citations</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Focus Areas -->
    <section class="relative z-10 px-6 py-16">
      <div class="mx-auto max-w-6xl">
        <div class="text-center mb-12">
          <span class="mb-4 inline-block rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1 text-sm font-medium text-teal-300">
            Research Areas
          </span>
          <h2 class="text-3xl font-bold text-[rgb(var(--text-heading))] md:text-4xl">Core Focus Areas</h2>
        </div>
        
        <div class="grid gap-6 md:grid-cols-2">
          <div 
            v-for="area in focusAreas" 
            :key="area.title"
            class="research-card group relative rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card))/0.8] p-8 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-[rgb(var(--border-muted))]"
          >
            <div class="flex items-start mb-6">
              <div 
                class="flex h-12 w-12 items-center justify-center rounded-xl ring-1"
                :class="[
                  area.color === 'cyan' ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 ring-cyan-500/30' : '',
                  area.color === 'teal' ? 'bg-gradient-to-br from-teal-500/20 to-teal-500/5 ring-teal-500/30' : '',
                  area.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 ring-emerald-500/30' : '',
                  area.color === 'blue' ? 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 ring-blue-500/30' : '',
                ]"
              >
                <svg class="w-6 h-6" :class="'text-' + area.color + '-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <h3 class="mb-3 text-xl font-bold text-[rgb(var(--text-heading))]">{{ area.title }}</h3>
            <p class="text-[rgb(var(--text-body))] text-sm">{{ area.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Publications -->
    <section class="relative z-10 bg-gradient-to-b from-transparent via-[rgb(var(--bg-card))/0.5] to-transparent px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <div class="mb-8">
          <span class="mb-4 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-sm font-medium text-cyan-300">
            Publications
          </span>
          <h2 class="text-3xl font-bold text-[rgb(var(--text-heading))]">Recent Publications</h2>
        </div>
        
        <div class="space-y-3">
          <a 
            v-for="pub in displayedPublications" 
            :key="pub.title"
            :href="pub.url"
            target="_blank"
            rel="noopener noreferrer"
            class="research-card group relative block rounded-xl border border-[rgb(var(--border-subtle))/0.5] bg-[rgb(var(--bg-card))/0.8] p-5 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:bg-[rgb(var(--bg-card))/0.9] cursor-pointer"
          >
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <span 
                    class="rounded-full px-2.5 py-0.5 text-xs font-medium ring-1"
                    :class="getBadgeClass(pub.color)"
                  >
                    {{ pub.journal }}
                  </span>
                  <span class="text-xs text-[rgb(var(--text-muted))]">{{ pub.year }}</span>
                </div>
                
                <h3 class="mb-1 font-semibold text-[rgb(var(--text-heading))] group-hover:text-cyan-400 transition-colors text-sm md:text-base flex items-center gap-2">
                  {{ pub.title }}
                  <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </h3>
                <p class="text-xs text-[rgb(var(--text-muted))]">{{ pub.authors }}</p>
              </div>
              
              <div class="flex items-center gap-1 text-[rgb(var(--text-body))] text-sm whitespace-nowrap">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span :class="pub.citations >= 50 ? 'text-cyan-400 font-semibold' : ''">{{ pub.citations }}</span>
              </div>
            </div>
          </a>
        </div>
        
        <!-- See More Button -->
        <div v-if="hasMore" class="mt-8 text-center">
          <button 
            @click="showMore"
            class="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-card-muted))/0.5] px-6 py-3 text-sm font-medium text-[rgb(var(--text-primary))] transition-all hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-[rgb(var(--bg-card-muted))]"
          >
            See More Publications
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <p class="mt-2 text-xs text-[rgb(var(--text-muted))]">
            Showing {{ displayedPublications.length }} of {{ totalPublications }} publications
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative z-10 px-6 pb-20">
      <div class="mx-auto max-w-4xl">
        <div class="relative rounded-3xl border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-card))/0.8] p-12 text-center overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-emerald-500/5"></div>
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-cyan-500/20 to-transparent rounded-full blur-3xl"></div>
          
          <div class="relative">
            <h2 class="mb-6 text-3xl font-bold text-[rgb(var(--text-heading))]">Interested in Collaborating?</h2>
            <p class="mb-8 text-lg text-[rgb(var(--text-body))] max-w-2xl mx-auto">
              We partner with academic institutions and industry leaders to advance therapeutic discovery.
            </p>
            <router-link 
              to="/contact"
              class="inline-block rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 py-4 font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:shadow-emerald-500/50"
            >
              Discuss Collaboration
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.research-card {
  opacity: 1;
}
</style>

