import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Header from '@/views/HeaderView.vue'
import Style from '@/views/StyleView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path:'/header',
      name: 'header',
      component: Header,
    },
    {
      path: '/style-guide',
      name: 'styleGuide',
      component: Style,
    }
  ],
})

export default router
