import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Header from '../views/HeaderView.vue'
import Style from '../views/StyleView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/header',
      component: Header,
    },
    {
      path: '/style-guide',
      component: Style,
    }
  ],
})

export default router
