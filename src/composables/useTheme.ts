import { ref, computed } from 'vue'

const isDark = ref(false)

function init() {
  if (typeof window === 'undefined') return
  const stored = localStorage.getItem('theme')
  if (stored === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }
}

function toggle() {
  if (typeof window === 'undefined') return
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const canvasColors = computed(() => ({
  connectionStroke: isDark.value ? 'rgba(100,116,139,0.3)' : 'rgba(148,163,184,0.4)',
  nucleotideLabel: isDark.value ? 'rgba(255,255,255,0.9)' : 'rgba(15,23,42,0.9)',
  trailClear: isDark.value ? 'rgba(2,6,23,0.15)' : 'rgba(255,255,255,0.15)',
}))

export function useTheme() {
  return {
    isDark,
    toggle,
    init,
    canvasColors,
  }
}
