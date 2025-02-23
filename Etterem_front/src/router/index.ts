import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OrderView from '@/views/OrderView.vue'
import UserView from '@/views/UserView.vue'
import MenuView from '@/views/MenuView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegistrationView from '@/views/auth/RegistrationView.vue'
import EmailSentView from '@/views/infoPages/EmailSentView.vue'
import EmailVerifyView from '@/views/auth/EmailVerifyView.vue'
import PasswordResetView from '@/views/auth/PasswordResetView.vue'
import PasswordResetEmailView from '@/views/auth/PasswordResetEmailView.vue'
import EmailSentPasswordChangeView from '@/views/infoPages/EmailSentPasswordChangeView.vue'
import OrderPlacedView from '@/views/infoPages/OrderPlacedView.vue'
import PageNotFound from '@/views/infoPages/PageNotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: HomeView,
    },
    {
      path: '/order',
      name: 'Order',
      component: OrderView,
    },
    {
      path: '/menu',
      name: 'Menu',
      component: MenuView,
    },
    {
      path: '/user',
      name: 'User',
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
    {
      path: '/email-sent-pw-change',
      name: 'email-sent-pw-change',
      component: EmailSentPasswordChangeView,
    },
    {
      path: '/password-reset-email',
      name: 'password-reset-email',
      component: PasswordResetEmailView,
    },
    {
      path: '/password-reset',
      name: 'password-reset',
      component: PasswordResetView,
    },
    {
      path: '/order-placed/:id/:price',
      name: 'order-placed',
      component: OrderPlacedView,
    },



    {
      path: '/:catchAll(.*)',  
      name: 'page-not-found',
      component: PageNotFound,
    },
  ],
})

export default router
