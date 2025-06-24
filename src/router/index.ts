import { createRouter, createWebHistory } from 'vue-router'
import Router from './Router.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'router',
      component: Router,
    },
  ],
})

export default router
