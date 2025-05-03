<template>
    <div
      class="h-screen bg-gray-100 border-r flex flex-col p-4 transition-all duration-300"
      :class="isExpanded ? 'w-64' : 'w-16'"
    >
      <!-- Sidebar Title -->
      <h1
        class="text-base font-semibold mb-4 whitespace-nowrap overflow-hidden transition-opacity duration-200"
        :class="{ 'hidden': !isExpanded }"
        >
        Dashboard
      </h1>
  
      <!-- Navigation Links -->
      <nav class="flex flex-col gap-4">
        <!-- Core Modules -->
        <RouterLink
            to="/sales_invoice_list"
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/sales_invoice_list' }"
        >
            <Icon icon="lucide:file-text" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Sales Invoice
            </span>
        </RouterLink>
  
        <RouterLink
            to="/customer"
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/customer' }"
        >
            <Icon icon="lucide:user" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Customers
            </span>
        </RouterLink>

        <RouterLink
            to="/account"
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/account' }"
        >
            <Icon icon="lucide:folder" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Account
            </span>
        </RouterLink>
  
        <RouterLink
            to="/chart_of_accounts"
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/chart_of_accounts' }"
        >
            <Icon icon="lucide:folder" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Chart Of Accounts
            </span>
        </RouterLink>
  
        <RouterLink
            to="/item"
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/item' }"
        >
            <Icon icon="lucide:package" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Item
            </span>
        </RouterLink>
  
        <!-- Additional Modules -->
        <RouterLink 
            to="/point_of_sale" 
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/point_of_sale' }"
        >
            <Icon icon="lucide:shopping-cart" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Point Of Sale
            </span>
        </RouterLink>
  
        <RouterLink 
            to="/purchase_invoice_list" 
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/purchase_invoice_list' }"
        >
            <Icon icon="lucide:file-minus" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Purchase Invoice
            </span>
        </RouterLink>
  
        <RouterLink 
            to="/Payment Entry List" 
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/Payment Entry List' }"
        >
            <Icon icon="lucide:credit-card" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Payment Entry
            </span>
        </RouterLink>
  
        <RouterLink 
            to="/Journal Entry List" 
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/Journal Entry List' }"
        >
            <Icon icon="lucide:book" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Journal Entry
            </span>
        </RouterLink>
  
        <RouterLink 
            to="/Landed Cost Voucher" 
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/Landed Cost Voucher' }"
        >
            <Icon icon="lucide:truck" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Landed Cost Voucher
            </span>
        </RouterLink>
  
        <RouterLink 
            to="/stock_entry" 
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/stock_entry' }"
        >
            <Icon icon="lucide:boxes" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Stock Entry
            </span>
        </RouterLink>
  
        <RouterLink 
            to="/stock_reconciliation" 
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/stock_reconciliation' }"
        >
            <Icon icon="lucide:refresh-ccw" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Stock Reconciliation
            </span>
        </RouterLink>
  
        <RouterLink 
            to="/payment_reconciliation" 
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/payment_reconciliation' }"
        >
            <Icon icon="lucide:check-circle" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Payment Reconciliation
            </span>
        </RouterLink>
  
        <!-- Divider -->
        <hr class="my-4 border-gray-300" :class="{ 'opacity-0': !isExpanded }" />
  
        <!-- Reports -->
        <RouterLink 
            to="#"
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/app/query-report/General%20Ledger' }"
            @click="goToGeneralLedger"
        >
            <Icon icon="lucide:clipboard-list" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
                General Ledger
            </span>
        </RouterLink>


  
        <RouterLink 
            to="/accounts_receivable" 
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/accounts_receivable' }"
        >
            <Icon icon="lucide:trending-up" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Accounts Receivable
            </span>
        </RouterLink>
  
        <RouterLink 
            to="/accounts_payable" 
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/accounts_payable' }"
        >
            <Icon icon="lucide:trending-down" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Accounts Payable
            </span>
        </RouterLink>
  
        <RouterLink 
            to="/stock_ledger" 
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/stock_ledger' }"
        >
            <Icon icon="lucide:layers" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Stock Ledger
            </span>
        </RouterLink>
  
        <RouterLink 
            to="/stock_balance" 
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            :class="{ 'font-bold': $route.path === '/stock_balance' }"
        >
            <Icon icon="lucide:bar-chart-2" class="h-5 w-5" />
            <span
                class="transition-all duration-200 text-sm"
                :class="{ 'hidden': !isExpanded }"
            >
            Stock Balance
            </span>
        </RouterLink>
      </nav>
  
      <!-- Spacer -->
      <div class="flex-grow"></div>
  
      <button
        class="mt-6 flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
        @click="toggleSidebar"
        >
        <Icon
            :icon="isExpanded ? 'lucide:arrow-left' : 'lucide:arrow-right'"
            class="h-4 w-4"
        />
        <span
            class="transition-opacity duration-200"
            :class="{ 'hidden': !isExpanded }"
        >
            {{ isExpanded ? 'Collapse' : 'Expand' }}
        </span>
      </button>
  
    </div>
</template>
  
<script setup>
    import { ref, onMounted } from 'vue'
    import { Icon } from '@iconify/vue'
    import moment from 'moment'
    
    const company = ref('')
    const from_date = moment().subtract(30, 'days').format('YYYY-MM-DD')
    const to_date = moment().format('YYYY-MM-DD')
    const group_by = ''

    onMounted(async () => {
        try {
        // Fetch the default company from the Global Defaults doctype
        const globalDefaults = await frappe.call({
            method: 'frappe.core.doctype.global_settings.global_settings.get_defaults',
        })

        company.value = globalDefaults.message?.default_company || ''
        } catch (error) {
        console.error('Error fetching default company:', error)
        }
    })
    
    const url = `/app/query-report/General%20Ledger?company=${encodeURIComponent(company)}&from_date=${from_date}&to_date=${to_date}&group_by=${encodeURIComponent(group_by)}&include_dimensions=1&include_default_book_entries=1`
    
    const isExpanded = ref(true)
    
    function toggleSidebar() {
        isExpanded.value = !isExpanded.value
    }

    // Navigate to the General Ledger report when the link is clicked
    function goToGeneralLedger(event) {
        event.preventDefault();
        window.location.href = url;
    }
</script>
