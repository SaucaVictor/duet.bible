import { createRouter, createWebHistory } from 'vue-router'
import main from '@/views/main.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: main,
    },
    {
      path: '',
      name: 'home',
      component: main,
    },
    {
      path: '/chapters',
      name: 'Chapters',
      component: () => import('../components/Chapters.vue'),
    },
  ],
})

export default router
