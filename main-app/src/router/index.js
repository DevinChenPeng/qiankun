import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Layout from '../views/Layout.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Layout',
    component: Layout,
    meta: { requiresAuth: true }
  },
  {
    path: '/micro-app1/:pathMatch(.*)*',
    name: 'MicroApp1',
    component: Layout,
    meta: { requiresAuth: true }
  },
  {
    path: '/micro-app2/:pathMatch(.*)*',
    name: 'MicroApp2',
    component: Layout,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userInfo = sessionStorage.getItem('userInfo')
  if (to.meta.requiresAuth && !userInfo) {
    next('/login')
  } else {
    next()
  }
})

export default router
