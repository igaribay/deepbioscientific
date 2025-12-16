<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'

const posts = [
  {
    id: 1,
    title: 'Advances in AI-Driven Protein Design',
    excerpt: 'How machine learning is revolutionizing the discovery of novel therapeutic proteins with unprecedented speed and accuracy.',
    category: 'Research',
    date: 'Dec 12, 2025',
    readTime: '8 min read',
    image: 'protein',
  },
  {
    id: 2,
    title: 'mRNA Therapeutics: Beyond Vaccines',
    excerpt: 'Exploring the expanding applications of mRNA technology in protein replacement therapy and rare diseases.',
    category: 'Industry',
    date: 'Dec 8, 2025',
    readTime: '6 min read',
    image: 'mrna',
  },
  {
    id: 3,
    title: 'Multi-Objective Optimization in Drug Design',
    excerpt: 'Balancing potency, safety, and manufacturability using evolutionary algorithms and Pareto optimization.',
    category: 'Technology',
    date: 'Dec 3, 2025',
    readTime: '10 min read',
    image: 'optimization',
  },
  {
    id: 4,
    title: 'The Future of Personalized Medicine',
    excerpt: 'How computational approaches are enabling truly personalized therapeutic design for individual patients.',
    category: 'Vision',
    date: 'Nov 28, 2025',
    readTime: '5 min read',
    image: 'personalized',
  },
  {
    id: 5,
    title: 'Peptide Drug Discovery Acceleration',
    excerpt: 'Case study: Reducing peptide optimization cycles from months to weeks with AI-guided design.',
    category: 'Case Study',
    date: 'Nov 20, 2025',
    readTime: '7 min read',
    image: 'peptide',
  },
  {
    id: 6,
    title: 'LLMs Meet Molecular Biology',
    excerpt: 'Natural language interfaces for therapeutic design: translating clinical goals into molecular specifications.',
    category: 'Research',
    date: 'Nov 15, 2025',
    readTime: '9 min read',
    image: 'llm',
  },
]

const categoryColors: Record<string, string> = {
  Research: 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/30',
  Industry: 'bg-purple-500/10 text-purple-400 ring-purple-500/30',
  Technology: 'bg-pink-500/10 text-pink-400 ring-pink-500/30',
  Vision: 'bg-green-500/10 text-green-400 ring-green-500/30',
  'Case Study': 'bg-amber-500/10 text-amber-400 ring-amber-500/30',
}

onMounted(() => {
  const cards = document.querySelectorAll('.blog-card')
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
        <span class="mb-4 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-sm font-medium text-cyan-300">
          Blog
        </span>
        <h1 class="mb-6 text-5xl font-bold text-white md:text-6xl">
          Insights & <span class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Research</span>
        </h1>
        <p class="max-w-3xl text-xl text-slate-400">
          Stay updated with the latest advances in AI-driven therapeutic design, protein engineering, and mRNA technology.
        </p>
      </div>
    </section>

    <!-- Blog Grid -->
    <section class="px-6 pb-32">
      <div class="mx-auto max-w-6xl">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article 
            v-for="post in posts" 
            :key="post.id"
            class="blog-card group cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 transition-all hover:border-slate-700 hover:shadow-xl hover:shadow-cyan-500/5"
          >
            <!-- Image placeholder -->
            <div class="relative h-48 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
              <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-xl"></div>
              </div>
              <div class="absolute bottom-4 left-4">
                <span 
                  class="rounded-full px-3 py-1 text-xs font-medium ring-1"
                  :class="categoryColors[post.category]"
                >
                  {{ post.category }}
                </span>
              </div>
            </div>

            <div class="p-6">
              <div class="mb-3 flex items-center gap-3 text-xs text-slate-500">
                <span>{{ post.date }}</span>
                <span>•</span>
                <span>{{ post.readTime }}</span>
              </div>
              <h2 class="mb-3 text-xl font-bold text-white transition-colors group-hover:text-cyan-400">
                {{ post.title }}
              </h2>
              <p class="text-sm leading-relaxed text-slate-400">
                {{ post.excerpt }}
              </p>
            </div>
          </article>
        </div>

        <!-- Load More -->
        <div class="mt-12 text-center">
          <button class="rounded-full border border-slate-700 px-8 py-3 font-medium text-white transition-all hover:border-cyan-500/50 hover:bg-slate-800">
            Load More Articles
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.blog-card {
  opacity: 1;
}
</style>

