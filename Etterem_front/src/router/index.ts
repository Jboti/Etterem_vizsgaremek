import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RendelesView from '@/views/RendelesView.vue'
import FelhasznaloView from '@/views/FelhasznaloView.vue'
import MenuView from '@/views/MenuView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import PasswordResetEmailView from '@/views/auth/PasswordResetEmailView.vue'
import PasswordResetView from '@/views/auth/PasswordResetView.vue'
import RegistrationView from '@/views/auth/RegistrationView.vue'
import EmailVertifyView from '@/views/auth/EmailVertifyView.vue'
import EmailSentView from '@/views/auth/EmailSentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Főoldal',
      component: HomeView,
    },
    {
      path: '/rendeles',
      name: 'Rendelés',
      component: RendelesView,
    },
    {
      path: '/menu',
      name: 'Menü',
      component: MenuView,
    },
    {
      path: '/felhasznalo',
      name: 'Felhasználó',
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
      path: '/email-vertify',
      name: 'email-verify',
      component: EmailVertifyView,
    },
    {
      path: '/email-sent',
      name: 'email-sent',
      component: EmailSentView,
    },
  ],
})

export default router
