import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/technology',
      name: 'technology',
      component: () => import('../views/TechnologyPage.vue'),
    },
    {
      path: '/research',
      name: 'research',
      component: () => import('../views/ResearchPage.vue'),
    },
    {
      path: '/case-studies',
      name: 'case-studies',
      component: () => import('../views/CaseStudiesPage.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogPage.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutPage.vue'),
    },
    {
      path: '/careers',
      name: 'careers',
      component: () => import('../views/CareersPage.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactPage.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default router

