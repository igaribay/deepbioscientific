import type { RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'

export const routes: RouteRecordRaw[] = [
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
  // Blog route - disabled for now
  // {
  //   path: '/blog',
  //   name: 'blog',
  //   component: () => import('../views/BlogPage.vue'),
  // },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutPage.vue'),
  },
  // Careers route - disabled for now
  // {
  //   path: '/careers',
  //   name: 'careers',
  //   component: () => import('../views/CareersPage.vue'),
  // },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/ContactPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/',
  },
]
