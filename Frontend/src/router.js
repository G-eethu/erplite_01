import { createRouter, createWebHistory } from 'vue-router'
import { session } from './data/session'
import { userResource } from '@/data/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
  },
  {
    name: 'Login',
    path: '/account/login',
    component: () => import('@/pages/Login.vue'),
  },
  {
    name: 'Item',
    path: '/Item',
    component: () => import('@/pages/Item.vue'),
  },
  {
    name: 'Sales Invoice List',
    path: '/sales_invoice_list',
    component: () => import('@/pages/Sales-Invoice-List.vue'),
  },
  {
    name: 'Sales Invoice',
    path: '/sales_invoice',
    component: () => import('@/pages/Sales-Invoice.vue'),
  },
  {
    name: 'Todo',
    path: '/todo',
    component: () => import('@/pages/Todo.vue'),
  },
  {
    name: 'Customer',
    path: '/customer',
    component: () => import('@/pages/Customer.vue'),
  },
  {
    name: 'ChartOfAccounts',
    path: '/chart_of_accounts',
    component: () => import('@/pages/ChartOfAccounts.vue'),
  },
]

let router = createRouter({
  history: createWebHistory('/Frontend'),
  routes,
})

router.beforeEach(async (to, from, next) => {
  let isLoggedIn = session.isLoggedIn
  try {
    await userResource.promise
  } catch (error) {
    isLoggedIn = false
  }

  if (to.name === 'Login' && isLoggedIn) {
    next({ name: 'Home' })
  } else if (to.name !== 'Login' && !isLoggedIn) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
