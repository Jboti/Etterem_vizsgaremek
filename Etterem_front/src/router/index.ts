import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RendelesView from '@/views/RendelesView.vue'
import FelhasznaloView from '@/views/FelhasznaloView.vue'
import MenuView from '@/views/MenuView.vue'

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
      path: '/menu',
      name: 'Menu',
      component: MenuView,
    },
    {
      path: '/felhasznalo',
      name: 'Felhasznalo',
      component: FelhasznaloView,
    },
  ],
})

export default router
