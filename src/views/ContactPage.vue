<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const formData = ref({
  name: '',
  email: '',
  company: '',
  interest: '',
  message: '',
})

const interests = [
  'Partnership Inquiry',
  'Technology License',
  'Research Collaboration',
  'Investment',
  'Press & Media',
  'Other',
]

onMounted(() => {
  gsap.from('.contact-element', {
    opacity: 0,
    y: 30,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power3.out',
    delay: 0.2,
  })
})

const handleSubmit = () => {
  console.log('Form submitted:', formData.value)
  // Handle form submission
}
</script>

<template>
  <div class="min-h-screen pt-24">
    <!-- Hero -->
    <section class="px-6 py-20">
      <div class="mx-auto max-w-6xl">
        <span class="mb-4 inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1 text-sm font-medium text-cyan-300">
          Contact
        </span>
        <h1 class="mb-6 text-5xl font-bold text-white md:text-6xl">
          Let's <span class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Connect</span>
        </h1>
        <p class="max-w-3xl text-xl text-slate-400">
          Interested in partnering with Sequentia? We'd love to hear about your therapeutic programs and how we can help.
        </p>
      </div>
    </section>

    <!-- Contact Form & Info -->
    <section class="px-6 pb-32">
      <div class="mx-auto max-w-6xl">
        <div class="grid gap-12 lg:grid-cols-2">
          <!-- Form -->
          <div class="contact-element rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <h2 class="mb-6 text-2xl font-bold text-white">Send Us a Message</h2>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <label for="name" class="mb-2 block text-sm font-medium text-slate-300">Name *</label>
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  required
                  autocomplete="name"
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label for="email" class="mb-2 block text-sm font-medium text-slate-300">Email *</label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  required
                  autocomplete="email"
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label for="company" class="mb-2 block text-sm font-medium text-slate-300">Company</label>
                <input
                  id="company"
                  v-model="formData.company"
                  type="text"
                  autocomplete="organization"
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="Your company"
                />
              </div>

              <div>
                <label for="interest" class="mb-2 block text-sm font-medium text-slate-300">Interest *</label>
                <select
                  id="interest"
                  v-model="formData.interest"
                  required
                  autocomplete="off"
                  class="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="" disabled>Select your interest</option>
                  <option v-for="interest in interests" :key="interest" :value="interest">
                    {{ interest }}
                  </option>
                </select>
              </div>

              <div>
                <label for="message" class="mb-2 block text-sm font-medium text-slate-300">Message *</label>
                <textarea
                  id="message"
                  v-model="formData.message"
                  required
                  rows="5"
                  autocomplete="off"
                  class="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="Tell us about your project or inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                class="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-500/50"
              >
                Send Message
              </button>
            </form>
          </div>

          <!-- Contact Info -->
          <div class="space-y-8">
            <div class="contact-element rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
              <h2 class="mb-6 text-2xl font-bold text-white">Contact Information</h2>
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-500/30">
                    <svg class="h-6 w-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-white">Email</h3>
                    <a href="mailto:partnerships@sequentia.bio" class="text-cyan-400 hover:text-cyan-300">partnerships@sequentia.bio</a>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500/10 ring-1 ring-purple-500/30">
                    <svg class="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-white">Headquarters</h3>
                    <p class="text-slate-400">San Francisco, CA</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-pink-500/10 ring-1 ring-pink-500/30">
                    <svg class="h-6 w-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-white">Research Lab</h3>
                    <p class="text-slate-400">Boston, MA</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="contact-element rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
              <h2 class="mb-4 text-xl font-bold text-white">Schedule a Call</h2>
              <p class="mb-6 text-slate-400">
                Prefer to talk directly? Book a 30-minute call with our partnerships team.
              </p>
              <button class="w-full rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-medium text-white transition-all hover:border-cyan-500/50 hover:bg-slate-700">
                Book a Meeting
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

