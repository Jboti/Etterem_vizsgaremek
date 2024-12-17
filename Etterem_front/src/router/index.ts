import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RendelesView from '@/views/RendelesView.vue'
import TeamView from '@/views/TeamView.vue'
import BlogView from '@/views/BlogView.vue'
import ServicesView from '@/views/ServicesView.vue'
import ContactView from '@/views/ContactView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/rendeles',
      name: 'Rendeles',
      component: RendelesView,
    },
    {
      path: '/team',
      name: 'Team',
      component: TeamView,
    },
    {
      path: '/blog',
      name: 'Blog',
      component: BlogView,
    },
    {
      path: '/services',
      name: 'Services',
      component: ServicesView,
    },
    {
      path: '/contact',
      name: 'Contact',
      component: ContactView,
    },
  ],
})

export default router
