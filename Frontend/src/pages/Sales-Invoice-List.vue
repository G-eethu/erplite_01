<template>
  <div class="m-3 flex">
    <!-- Sidebar -->
    <SidebarLink class="w-1/5" />

    <!-- Main Content -->
    <div class="w-4/5 ml-3">
      <!-- Heading and Create Button -->
      <div class="flex items-baseline justify-between mb-4">
        <h2 class="text--800 font-semibold text-xl">Sales Invoice</h2>
        <Button
          variant="solid"
          theme="gray"
          size="sm"
          label="Create"
          @click="goToForm"
        />
      </div>

      <!-- Invoice List -->
      <ListView
        v-if="tasks.list.data"
        :columns="[
          { label: 'Customer', key: 'customer'},
          { label: 'Date', key: 'posting_date' },
          { label: 'Status', key: 'status' },
          { label: 'ID', key: 'name' }
        ]"
        :rows="tasks.list.data"
        :options="{
          onRowClick: (row) => router.push(`/edit_sales_invoice`),
          selectable: true, 
          showTooltip: true,
          resizeColumn: true,
          onSelectionChange: (rows) => selectedRows = rows 
        }"
        row-key="name"
      >
      </ListView>

    </div>
  </div>
</template>


<script setup>
  import { useRouter } from 'vue-router'
  import { createListResource} from 'frappe-ui'
  import { ListView, Button } from 'frappe-ui'
  import SidebarLink from './SidebarLink.vue'

  const router = useRouter()

  const goToForm = () => {
    router.push('/sales_invoice')
  }

  const goToEditForm = () => {
    router.push('/edit_sales_invoice')
  }

  const tasks = createListResource({
    doctype: "Sales Invoice",
    fields: ['customer', 'posting_date', 'status', 'name'],
    orderBy: 'creation desc'
  })

  tasks.list.fetch()
</script>