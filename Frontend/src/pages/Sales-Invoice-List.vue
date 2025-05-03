<template>
  <div class="m-3 flex">
    <!-- Sidebar -->
    <SidebarLink class="w-1/5" />

    <!-- Main Content -->
    <div class="w-4/5 ml-3">
      <!-- Heading and Create Button -->
      <div class="flex items-baseline justify-between mb-4">
        <h2 class="text-blue-800 font-semibold text-xl">Sales Invoice</h2>
        <Button
          variant="solid"
          theme="blue"
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
        <!-- Custom slot for the status column -->
        <template #cell-status="{ row }">
          <span
            class="px-2 py-1 rounded text-xs font-medium"
            :class="{
              'bg-red-100 text-red-700': row.status === 'Unpaid' || row.status === 'Cancelled',
              'bg-green-100 text-green-700': row.status === 'Paid' || row.status === 'Submitted',
              'bg-yellow-100 text-yellow-700': row.status === 'Draft'
            }"
          >
            {{ row.status }}
          </span>
        </template>
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