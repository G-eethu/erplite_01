<template>
    <div
      class="h-screen bg-gray-100 border-r flex flex-col p-4 transition-all duration-300"
      :class="isExpanded ? 'w-64' : 'w-16'"
    >
      <!-- Sidebar Title -->
      <h1
        class="text-xl font-semibold mb-6 whitespace-nowrap overflow-hidden transition-opacity duration-200"
        :class="{ 'opacity-0': !isExpanded }"
      >
        Dashboard
      </h1>
  
      <!-- Navigation Links -->
      <nav class="flex flex-col gap-4">
        <RouterLink
          to="/sales_invoice_list"
          class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          :class="{ 'font-bold': $route.path === '/sales_invoice_list' }"
        >
          <Icon icon="lucide:file-text" class="h-5 w-5" />
          <span
            class="transition-opacity duration-200"
            :class="{ 'opacity-0': !isExpanded }"
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
            class="transition-opacity duration-200"
            :class="{ 'opacity-0': !isExpanded }"
          >
            Customers
          </span>
        </RouterLink>
  
        <RouterLink
          to="/chart_of_accounts"
          class="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          :class="{ 'font-bold': $route.path === '/chart_of_accounts' }"
        >
          <Icon icon="lucide:folder" class="h-5 w-5" />
          <span
            class="transition-opacity duration-200"
            :class="{ 'opacity-0': !isExpanded }"
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
            class="transition-opacity duration-200"
            :class="{ 'opacity-0': !isExpanded }"
          >
            Item
          </span>
        </RouterLink>
      </nav>
  
      <!-- Spacer -->
      <div class="flex-grow"></div>
  
      <!-- Collapse/Expand -->
      <button
        class="mt-6 flex items-center gap-2 text-gray-500 hover:text-gray-700"
        @click="toggleSidebar"
      >
        <Icon
          :icon="isExpanded ? 'lucide:arrow-left' : 'lucide:arrow-right'"
          class="h-4 w-4"
        />
        <span
          class="transition-opacity duration-200"
          :class="{ 'opacity-0': !isExpanded }"
        >
          {{ isExpanded ? 'Collapse' : 'Expand' }}
        </span>
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { Icon } from '@iconify/vue'
  
  const isExpanded = ref(true)
  
  function toggleSidebar() {
    isExpanded.value = !isExpanded.value
  }
  </script>
  