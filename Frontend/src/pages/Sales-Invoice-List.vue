<template>
  <div class="m-5">
    <!-- Heading and Create Button -->
    <div class="flex items-baseline justify-between mb-4">
      <h2 class="text-gray-900 font-semibold text-xl">Sales Invoice</h2>
      <Button
        variant="solid"
        theme="gray"
        size="sm"
        label="Create"
        @click="goToForm"
      >
    </Button>
    
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
        onRowClick: (row) => console.log(row),
        selectable: true, 
        showTooltip: true,
        resizeColumn: true,
        onSelectionChange: (rows) => selectedRows = rows 
      }"
      row-key="name"
    />
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { createListResource} from 'frappe-ui'
  import { ListView, Button } from 'frappe-ui'

  const router = useRouter()

  const goToForm = () => {
    router.push('/sales_invoice')
  }

  const tasks = createListResource({
    doctype: "Sales Invoice",
    fields: ['customer', 'posting_date', 'status', 'name'],
    orderBy: 'creation desc'
  })

  tasks.list.fetch()
</script>
