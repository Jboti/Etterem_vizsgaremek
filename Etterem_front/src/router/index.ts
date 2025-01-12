import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RendelesView from '@/views/RendelesView.vue'
import FelhasznaloView from '@/views/FelhasznaloView.vue'
import MenuView from '@/views/MenuView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import PasswordResetEmailView from '@/views/auth/PasswordResetEmailView.vue'
import PasswordResetView from '@/views/auth/PasswordResetView.vue'
import RegistrationView from '@/views/auth/RegistrationView.vue'
import SetPasswordView from '@/views/auth/SetPasswordView.vue'

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
    {
      path: '/login',
      name: 'Bejelentkezés',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'Regisztráció',
      component: RegistrationView,
    },
    {
      path: '/passwordreset',
      name: 'PasswordReset',
      component: PasswordResetView,
    },
    {
      path: '/passwordresetemail',
      name: 'PasswordResetEmail',
      component: PasswordResetEmailView,
    },
    {
      path: '/setpassword',
      name: 'SetPassword',
      component: SetPasswordView,
    },
  ],
})

export default router
