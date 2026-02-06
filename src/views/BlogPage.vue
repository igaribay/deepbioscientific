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
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 2,
    title: 'mRNA Therapeutics: Beyond Vaccines',
    excerpt: 'Exploring the expanding applications of mRNA technology in protein replacement therapy and rare diseases.',
    category: 'Industry',
    date: 'Dec 8, 2025',
    readTime: '6 min read',
    gradient: 'from-purple-500 to-blue-500',
  },
  {
    id: 3,
    title: 'Multi-Objective Optimization in Drug Design',
    excerpt: 'Balancing potency, safety, and manufacturability using evolutionary algorithms and Pareto optimization.',
    category: 'Technology',
    date: 'Dec 3, 2025',
    readTime: '10 min read',
    gradient: 'from-blue-500 to-orange-500',
  },
  {
    id: 4,
    title: 'The Future of Personalized Medicine',
    excerpt: 'How computational approaches are enabling truly personalized therapeutic design for individual patients.',
    category: 'Vision',
    date: 'Nov 28, 2025',
    readTime: '5 min read',
    gradient: 'from-green-500 to-cyan-500',
  },
  {
    id: 5,
    title: 'Peptide Drug Discovery Acceleration',
    excerpt: 'Case study: Reducing peptide optimization cycles from months to weeks with AI-guided design.',
    category: 'Case Study',
    date: 'Nov 20, 2025',
    readTime: '7 min read',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 6,
    title: 'LLMs Meet Molecular Biology',
    excerpt: 'Natural language interfaces for therapeutic design: translating clinical goals into molecular specifications.',
    category: 'Research',
    date: 'Nov 15, 2025',
    readTime: '9 min read',
    gradient: 'from-blue-500 to-purple-500',
  },
]

const categoryColors: Record<string, { bg: string; text: string; ring: string }> = {
  Research: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', ring: 'ring-cyan-500/30' },
  Industry: { bg: 'bg-purple-500/10', text: 'text-purple-400', ring: 'ring-purple-500/30' },
  Technology: { bg: 'bg-blue-500/10', text: 'text-blue-400', ring: 'ring-blue-500/30' },
  Vision: { bg: 'bg-green-500/10', text: 'text-green-400', ring: 'ring-green-500/30' },
  'Case Study': { bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'ring-amber-500/30' },
}

const featuredPost = posts[0]

onMounted(() => {
  // Hero animations
  gsap.fromTo('.hero-title', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
  )
  
  gsap.fromTo('.hero-badge', 
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 }
  )

  gsap.fromTo('.featured-card',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 }
  )

  const cards = document.querySelectorAll('.blog-card')
  if (cards.length > 0) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out', delay: 0.5 }
    )
  }
  
  // Floating particles animation
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
      <!-- Gradient orbs -->
      <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
      
      <!-- Grid pattern -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      
      <!-- Floating particles -->
      <div v-for="i in 15" :key="i" 
        class="floating-particle absolute w-1 h-1 rounded-full"
        :class="[
          i % 3 === 0 ? 'bg-cyan-400' : i % 3 === 1 ? 'bg-purple-400' : 'bg-blue-400'
        ]"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0.3 + Math.random() * 0.4,
          animationDelay: `${Math.random() * 2}s`
        }"
      ></div>
    </div>

    <!-- Hero -->
    <section class="relative z-10 px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <!-- Badge -->
        <div class="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 backdrop-blur-sm">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
          </span>
          <span class="text-sm font-medium text-cyan-300">Blog</span>
        </div>
        
        <h1 class="hero-title mb-6 text-5xl font-bold text-[rgb(var(--text-heading))] md:text-7xl">
          Insights & <span class="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient">Research</span>
        </h1>
        <p class="hero-title max-w-3xl text-xl text-[rgb(var(--text-body))] leading-relaxed">
          Stay updated with the latest advances in <span class="text-cyan-400">AI-driven therapeutic design</span>, 
          protein engineering, and mRNA technology.
        </p>
      </div>
    </section>

    <!-- Featured Post -->
    <section class="relative z-10 px-6 pb-12">
      <div class="mx-auto max-w-6xl">
        <div class="featured-card group relative rounded-3xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-1 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10">
          <div class="relative grid md:grid-cols-2 gap-8 p-8 lg:p-12">
            <!-- Image -->
            <div class="relative aspect-video md:aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-[rgb(var(--bg-card-muted))] to-[rgb(var(--bg-card))]">
              <div class="absolute inset-0 bg-gradient-to-br" :class="featuredPost.gradient" style="opacity: 0.2"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-32 h-32 rounded-full blur-3xl" :class="`bg-gradient-to-br ${featuredPost.gradient}`" style="opacity: 0.5"></div>
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <svg class="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
              </div>
              <div class="absolute top-4 left-4">
                <span class="rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                  Featured
                </span>
              </div>
            </div>
            
            <!-- Content -->
            <div class="flex flex-col justify-center">
              <div class="mb-4">
                <span 
                  class="rounded-full px-3 py-1 text-xs font-medium ring-1"
                  :class="[categoryColors[featuredPost.category].bg, categoryColors[featuredPost.category].text, categoryColors[featuredPost.category].ring]"
                >
                  {{ featuredPost.category }}
                </span>
              </div>
              
              <h2 class="mb-4 text-2xl font-bold text-[rgb(var(--text-heading))] md:text-3xl group-hover:text-cyan-400 transition-colors">
                {{ featuredPost.title }}
              </h2>
              
              <p class="mb-6 text-[rgb(var(--text-body))] leading-relaxed">
                {{ featuredPost.excerpt }}
              </p>
              
              <div class="flex items-center gap-4 text-sm text-[rgb(var(--text-muted))]">
                <span>{{ featuredPost.date }}</span>
                <span>•</span>
                <span>{{ featuredPost.readTime }}</span>
              </div>
              
              <button class="mt-6 self-start rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-500/50">
                Read Article
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog Grid -->
    <section class="relative z-10 px-6 pb-32">
      <div class="mx-auto max-w-6xl">
        <div class="mb-8 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-[rgb(var(--text-heading))]">Latest Articles</h2>
          <div class="flex gap-2">
            <button 
              v-for="cat in ['All', 'Research', 'Technology', 'Industry']" 
              :key="cat"
              class="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
              :class="cat === 'All' ? 'bg-[rgb(var(--bg-card-muted))] text-[rgb(var(--text-heading))]' : 'text-[rgb(var(--text-body))] hover:text-[rgb(var(--text-heading))] hover:bg-[rgb(var(--bg-card-muted))/0.5]'"
            >
              {{ cat }}
            </button>
          </div>
        </div>
        
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article 
            v-for="post in posts.slice(1)" 
            :key="post.id"
            class="blog-card group cursor-pointer overflow-hidden rounded-2xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] backdrop-blur-xl transition-all duration-500 hover:border-[rgb(var(--border-muted))/0.5] hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1"
          >
            <!-- Image placeholder -->
            <div class="relative h-48 overflow-hidden bg-gradient-to-br from-[rgb(var(--bg-card-muted))] to-[rgb(var(--bg-card))]">
              <div class="absolute inset-0 bg-gradient-to-br" :class="post.gradient" style="opacity: 0.15"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="h-20 w-20 rounded-full blur-2xl" :class="`bg-gradient-to-br ${post.gradient}`" style="opacity: 0.5"></div>
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <svg class="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
              </div>
              <div class="absolute bottom-4 left-4">
                <span 
                  class="rounded-full px-3 py-1 text-xs font-medium ring-1"
                  :class="[categoryColors[post.category].bg, categoryColors[post.category].text, categoryColors[post.category].ring]"
                >
                  {{ post.category }}
                </span>
              </div>
            </div>

            <div class="p-6">
              <div class="mb-3 flex items-center gap-3 text-xs text-[rgb(var(--text-muted))]">
                <span>{{ post.date }}</span>
                <span>•</span>
                <span>{{ post.readTime }}</span>
              </div>
              <h2 class="mb-3 text-xl font-bold text-[rgb(var(--text-heading))] transition-colors group-hover:text-cyan-400">
                {{ post.title }}
              </h2>
              <p class="text-sm leading-relaxed text-[rgb(var(--text-body))]">
                {{ post.excerpt }}
              </p>
              
              <div class="mt-4 flex items-center text-sm font-medium text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100">
                Read more 
                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </article>
        </div>

        <!-- Load More -->
        <div class="mt-12 text-center">
          <button class="rounded-full border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-card-muted))/0.5] px-8 py-3 font-medium text-[rgb(var(--text-heading))] backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-[rgb(var(--bg-card-muted))] hover:shadow-lg hover:shadow-cyan-500/10">
            Load More Articles
          </button>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="relative z-10 px-6 pb-20">
      <div class="mx-auto max-w-4xl">
        <div class="relative rounded-3xl border border-[rgb(var(--border-primary))] bg-gradient-to-br from-[rgb(var(--bg-card))] via-[rgb(var(--bg-card))/0.95] to-[rgb(var(--bg-card))] p-12 text-center overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-blue-500/5"></div>
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-cyan-500/20 to-transparent rounded-full blur-3xl"></div>
          
          <div class="relative">
            <span class="mb-4 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-300">
              Newsletter
            </span>
            <h2 class="mb-4 text-3xl font-bold text-[rgb(var(--text-heading))]">Stay Updated</h2>
            <p class="mb-8 text-[rgb(var(--text-body))] max-w-xl mx-auto">
              Get the latest insights on AI-driven therapeutic design delivered to your inbox monthly.
            </p>
            <form class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="your@email.com"
                class="flex-1 rounded-full border border-[rgb(var(--border-muted))] bg-[rgb(var(--bg-card-muted))/0.5] px-6 py-3 text-[rgb(var(--text-heading))] placeholder-[rgb(var(--text-muted))] backdrop-blur-sm transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <button class="rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-500/50">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.blog-card {
  opacity: 1;
}

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
</style>
