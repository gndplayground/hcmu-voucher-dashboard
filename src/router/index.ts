import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { path: '/login' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        noLayout: true
      }
    },
    {
      path: '/admin',
      components: {
        default: () => import('@/views/AdminDashboard.vue'),
        Sidebar: () => import('@/components/SideBar.vue'),
        Navbar: () => import('@/components/NavBar.vue')
      },
      children: [
        {
          path: 'users',
          component: () => import('@/views/AdminUserView.vue')
        },
        {
          path: 'companies',
          component: () => import('@/views/AdminCompanyView.vue')
        }
      ]
    }
  ]
})

export default router
