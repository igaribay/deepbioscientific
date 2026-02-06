<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import deepbioLogo from '@/assets/deepbio-logo.png'
import deepbioText from '@/assets/deepbio-text.png'

const formData = ref({
  name: '',
  email: '',
  company: '',
  interest: '',
  message: '',
})

const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')

// Web3Forms access key
const WEB3FORMS_ACCESS_KEY = '15fdca5b-cf53-4188-b3e2-9be3d64c5477'

const interests = [
  'Schedule a Demo',
  'Partnership Inquiries',
  'Research Collaborations',
  'Investment',
  'Press & Media',
  'Other',
]

const contactInfo = [
  { 
    title: 'Email',
    value: 'partnerships@deepbioscientific.com',
    href: 'mailto:partnerships@deepbioscientific.com',
    icon: 'email',
    color: 'cyan'
  },
]

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

  gsap.from('.contact-element', {
    opacity: 0,
    y: 40,
    stagger: 0.15,
    duration: 0.7,
    ease: 'power3.out',
    delay: 0.3,
  })
  
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

const handleSubmit = async () => {
  isSubmitting.value = true
  showError.value = false
  errorMessage.value = ''

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `New Contact: ${formData.value.interest} from ${formData.value.name}`,
        from_name: 'DeepBio Scientific Website',
        name: formData.value.name,
        email: formData.value.email,
        company: formData.value.company || 'Not provided',
        interest: formData.value.interest,
        message: formData.value.message,
      })
    })

    const result = await response.json()

    if (result.success) {
      showSuccess.value = true
      formData.value = { name: '', email: '', company: '', interest: '', message: '' }
      setTimeout(() => {
        showSuccess.value = false
      }, 5000)
    } else {
      showError.value = true
      errorMessage.value = result.message || 'Something went wrong. Please try again.'
      setTimeout(() => {
        showError.value = false
      }, 5000)
    }
  } catch (error) {
    showError.value = true
    errorMessage.value = 'Network error. Please check your connection and try again.'
    setTimeout(() => {
      showError.value = false
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen pt-24 relative overflow-hidden">
    <!-- Animated Background -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <!-- Gradient orbs -->
      <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/3 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-2/3 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
      
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
          <span class="text-sm font-medium text-cyan-300">Contact Us</span>
        </div>
        
        <h1 class="hero-title mb-6 text-5xl font-bold text-[rgb(var(--text-heading))] md:text-7xl">
          Let's <span class="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient">Connect</span>
        </h1>
        <p class="hero-title max-w-3xl text-xl text-[rgb(var(--text-body))] leading-relaxed">
          Interested in partnering with DeepBio Scientific? We'd love to hear about your 
          <span class="text-cyan-400">therapeutic programs</span> and how we can help.
        </p>
      </div>
    </section>

    <!-- Contact Form & Info -->
    <section class="relative z-10 px-6 pb-32">
      <div class="mx-auto max-w-6xl">
        <div class="grid gap-12 lg:grid-cols-2">
          <!-- Form -->
          <div class="contact-element relative rounded-3xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent"></div>
            
            <!-- Success Message -->
            <Transition name="fade">
              <div 
                v-if="showSuccess"
                class="absolute inset-0 flex items-center justify-center bg-[rgb(var(--bg-card))/0.95] backdrop-blur-sm z-10 rounded-3xl"
              >
                <div class="text-center">
                  <div class="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-[rgb(var(--text-heading))] mb-2">Message Sent!</h3>
                  <p class="text-[rgb(var(--text-body))]">We'll get back to you soon.</p>
                </div>
              </div>
            </Transition>

            <!-- Error Message -->
            <Transition name="fade">
              <div 
                v-if="showError"
                class="absolute inset-0 flex items-center justify-center bg-[rgb(var(--bg-card))/0.95] backdrop-blur-sm z-10 rounded-3xl"
              >
                <div class="text-center">
                  <div class="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-[rgb(var(--text-heading))] mb-2">Oops!</h3>
                  <p class="text-[rgb(var(--text-body))]">{{ errorMessage }}</p>
                </div>
              </div>
            </Transition>
            
            <div class="relative">
              <h2 class="mb-6 text-2xl font-bold text-[rgb(var(--text-heading))]">Send Us a Message</h2>
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid gap-6 md:grid-cols-2">
                  <div>
                    <label for="name" class="mb-2 block text-sm font-medium text-[rgb(var(--text-primary))]">Name *</label>
                    <input
                      id="name"
                      v-model="formData.name"
                      type="text"
                      required
                      autocomplete="name"
                      class="w-full rounded-xl border border-[rgb(var(--border-muted))/0.5] bg-[rgb(var(--bg-card-muted))/0.5] px-4 py-3 text-[rgb(var(--text-heading))] placeholder-[rgb(var(--text-muted))] backdrop-blur-sm transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 hover:border-[rgb(var(--border-subtle))]"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label for="email" class="mb-2 block text-sm font-medium text-[rgb(var(--text-primary))]">Email *</label>
                    <input
                      id="email"
                      v-model="formData.email"
                      type="email"
                      required
                      autocomplete="email"
                      class="w-full rounded-xl border border-[rgb(var(--border-muted))/0.5] bg-[rgb(var(--bg-card-muted))/0.5] px-4 py-3 text-[rgb(var(--text-heading))] placeholder-[rgb(var(--text-muted))] backdrop-blur-sm transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 hover:border-[rgb(var(--border-subtle))]"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label for="company" class="mb-2 block text-sm font-medium text-[rgb(var(--text-primary))]">Company</label>
                  <input
                    id="company"
                    v-model="formData.company"
                    type="text"
                    autocomplete="organization"
                    class="w-full rounded-xl border border-[rgb(var(--border-muted))/0.5] bg-[rgb(var(--bg-card-muted))/0.5] px-4 py-3 text-[rgb(var(--text-heading))] placeholder-[rgb(var(--text-muted))] backdrop-blur-sm transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 hover:border-[rgb(var(--border-subtle))]"
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <label for="interest" class="mb-2 block text-sm font-medium text-[rgb(var(--text-primary))]">Interest *</label>
                  <select
                    id="interest"
                    v-model="formData.interest"
                    required
                    autocomplete="off"
                    class="w-full rounded-xl border border-[rgb(var(--border-muted))/0.5] bg-[rgb(var(--bg-card-muted))/0.5] px-4 py-3 text-[rgb(var(--text-heading))] backdrop-blur-sm transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 hover:border-[rgb(var(--border-subtle))]"
                  >
                    <option value="" disabled class="bg-[rgb(var(--bg-secondary))]">Select your interest</option>
                    <option v-for="interest in interests" :key="interest" :value="interest" class="bg-[rgb(var(--bg-secondary))]">
                      {{ interest }}
                    </option>
                  </select>
                </div>

                <div>
                  <label for="message" class="mb-2 block text-sm font-medium text-[rgb(var(--text-primary))]">Message *</label>
                  <textarea
                    id="message"
                    v-model="formData.message"
                    required
                    rows="5"
                    autocomplete="off"
                    class="w-full resize-none rounded-xl border border-[rgb(var(--border-muted))/0.5] bg-[rgb(var(--bg-card-muted))/0.5] px-4 py-3 text-[rgb(var(--text-heading))] placeholder-[rgb(var(--text-muted))] backdrop-blur-sm transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 hover:border-[rgb(var(--border-subtle))]"
                    placeholder="Tell us about your project or inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="relative z-10 flex items-center justify-center gap-2">
                    <svg v-if="isSubmitting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                  </span>
                  <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100"></div>
                </button>
              </form>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="space-y-8">
            <!-- Logo Section -->
            <div class="contact-element relative rounded-3xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-transparent"></div>
              <div class="relative flex flex-col items-center text-center">
                <img 
                  :src="deepbioLogo" 
                  alt="DeepBio Scientific Logo" 
                  class="h-24 w-auto mb-4"
                />
                <img 
                  :src="deepbioText" 
                  alt="DeepBio Scientific" 
                  class="h-10 w-auto mb-4"
                />
                <p class="text-[rgb(var(--text-body))] text-sm leading-relaxed max-w-sm">
                  AI-powered drug discovery platform accelerating therapeutic development from molecule to market.
                </p>
              </div>
            </div>

            <div class="contact-element relative rounded-3xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent"></div>
              <div class="relative">
                <h2 class="mb-6 text-2xl font-bold text-[rgb(var(--text-heading))]">Contact Information</h2>
                <div class="space-y-6">
                  <div 
                    v-for="info in contactInfo" 
                    :key="info.title"
                    class="group flex items-start gap-4"
                  >
                    <div 
                      class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl ring-1 transition-transform group-hover:scale-110"
                      :class="[
                        info.color === 'cyan' ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 ring-cyan-500/30' : '',
                        info.color === 'purple' ? 'bg-gradient-to-br from-purple-500/20 to-purple-500/5 ring-purple-500/30' : '',
                        info.color === 'pink' ? 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 ring-blue-500/30' : '',
                      ]"
                    >
                      <!-- Email Icon -->
                      <svg 
                        class="h-6 w-6 text-cyan-400"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-bold text-[rgb(var(--text-heading))]">{{ info.title }}</h3>
                      <a 
                        v-if="info.href" 
                        :href="info.href" 
                        class="transition-colors"
                        :class="info.color === 'cyan' ? 'text-cyan-400 hover:text-cyan-300' : 'text-[rgb(var(--text-body))]'"
                      >
                        {{ info.value }}
                      </a>
                      <p v-else class="text-[rgb(var(--text-body))]">{{ info.value }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="contact-element relative rounded-3xl border border-[rgb(var(--border-subtle))/0.5] bg-gradient-to-br from-[rgb(var(--bg-card))/0.9] to-[rgb(var(--bg-card))/0.5] p-8 backdrop-blur-xl overflow-hidden group hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
              <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative">
                <div class="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 ring-1 ring-green-500/30">
                  <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 class="mb-4 text-xl font-bold text-[rgb(var(--text-heading))]">Schedule a Call</h2>
                <p class="mb-6 text-[rgb(var(--text-body))]">
                  Prefer to talk directly? Book a 30-minute call with our partnerships team.
                </p>
                <button class="w-full rounded-xl border border-[rgb(var(--border-muted))/0.5] bg-[rgb(var(--bg-card-muted))/0.5] px-6 py-3 font-medium text-[rgb(var(--text-heading))] backdrop-blur-sm transition-all hover:border-green-500/50 hover:bg-[rgb(var(--border-muted))/0.5] hover:shadow-lg hover:shadow-green-500/10">
                  Book a Meeting
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
