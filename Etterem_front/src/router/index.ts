import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OrderView from '@/views/OrderView.vue'
import UserView from '@/views/UserView.vue'
import MenuView from '@/views/MenuView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegistrationView from '@/views/auth/RegistrationView.vue'
import EmailSentView from '@/views/auth/EmailSentView.vue'
import EmailVerifyView from '@/views/auth/EmailVerifyView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Főoldal',
      component: HomeView,
    },
    {
      path: '/order',
      name: 'Rendelés',
      component: OrderView,
    },
    {
      path: '/menu',
      name: 'Menü',
      component: MenuView,
    },
    {
      path: '/user',
      name: 'Felhasználó',
      component: UserView,
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
      path: '/email-verify',
      name: 'email-verify',
      component: EmailVerifyView,
    },
    {
      path: '/email-sent',
      name: 'email-sent',
      component: EmailSentView,
    },
  ],
})

export default router
