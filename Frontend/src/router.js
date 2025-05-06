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
    path: '/item',
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
    name: 'Customer',
    path: '/customer',
    component: () => import('@/pages/Customer.vue'),
  },
  {
    name: 'ChartOfAccounts',
    path: '/chart_of_accounts',
    component: () => import('@/pages/ChartOfAccounts.vue'),
  },
  {
    name: 'Todo',
    path: '/todo',
    component: () => import('@/pages/Todo.vue'),
  },
  {
    name: 'Edit Sales Invoice',
    path: '/edit_sales_invoice',
    component: () => import('@/pages/EditSalesinvoice.vue'),
  },
  {
    name: 'Account',
    path: '/account',
    component: () => import('@/pages/Account.vue'),
  },
  {
    name: 'PurchaseInvoiceList',
    path: '/purchase_invoice_list',
    component: () => import('@/pages/PurchaseInvoiceList.vue'),
  },
  {
    name: 'PaymentEntryList',
    path: '/Payment Entry List',
    component: () => import('@/pages/PaymentEntryList.vue'),
  },
  {
    name: 'JournalEntryList',
    path: '/Journal Entry List',
    component: () => import('@/pages/JournalEntryList.vue'),
  },
  {
    name: 'LandedCostVoucher',
    path: '/Landed Cost Voucher',
    component: () => import('@/pages/LandedCostVoucher.vue'),
  },
  {
    name: 'SalesInvoice',
    path: '/SalesInvoice',
    component: () => import('@/pages/SalesInvoice.vue'),
  }
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
