<template>
  <div class="m-5">
    <div class="flex items-baseline justify-between mb-4">
      <h2 class="text-gray-900 font-semibold text-xl">Customer List</h2>
      <Button
        variant="solid"
        theme="gray"
        size="sm"
        label="Create"
        :loading="false"
        :disabled="false"
        @click="createDialogShown = true"
      ></Button>
    </div>

    <Dialog
      v-model="createDialogShown"
      :options="{
        title: 'New Customer',
        size: '2xl',
        actions: [
          {
            label: 'Create',
            variant: 'solid',
            onClick(close) {
              customers.insert.submit({ ...newCustomer }, {
                onSuccess() {
                  resetForm();
                  close();
                }
              });
            }
          }
        ]
      }"
    >
      <template #body-content>
        <form class="space-y-3">
          <div class="p-2">
            <FormControl
              type="text"
              placeholder="Enter Name"
              label="Customer Name"
              v-model="newCustomer.customer_name"
            />
          </div>
          <div class="p-2">
            <FormControl
              type="select"
              :options="['Company', 'Individual', 'Partnership']"
              placeholder="Select Customer Type"
              label="Customer Type"
              v-model="newCustomer.customer_type"
            />
          </div>
          <div class="p-2">
            <FormControl
              type="select"
              :options="customerGroupOptions"
              placeholder="Select Customer Group"
              label="Customer Group"
              v-model="newCustomer.customer_group"
            />
          </div>
          <div class="p-2">
            <FormControl
              type="select"
              :options="territoryOptions"
              placeholder="Select Territory"
              label="Territory"
              v-model="newCustomer.territory"
            />
          </div>
          <div class="p-1">
            <Button
              :variant="'solid'"
              :ref_for="true"
              theme="gray"
              size="sm"
              label="Button"
              :loading="false"
              :loadingText="null"
              :disabled="false"
              :link="null"
            >
              Button
            </Button>
          </div>

        </form>
      </template>
    </Dialog>
      <ListView
        v-if="customers.list.data && customers.list.data.length"
        :columns="[
          { label: 'Customer Name', key: 'customer_name' },
          { label: 'Customer Type', key: 'customer_type' },
          { label: 'Customer Group', key: 'customer_group' },
          { label: 'Territory', key: 'territory' },
          { label: 'ID', key: 'name' }
        ]"
        :rows="customers.list.data"
        :options="{
          onRowClick: (row) => console.log(row),
          selectable: true,
          showTooltip: true,
          resizeColumn: true,
          onSelectionChange: (rows) => selectedRows = rows
        }"
        row-key="name"
      />

      <div v-else class="text-center text-gray-500 py-10">
        No customers found.
      </div>
  </div>
</template>


<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { createListResource } from 'frappe-ui'
import { ListView, Dialog, FormControl, Button } from 'frappe-ui'
import { onKeyStroke } from '@vueuse/core'

const createDialogShown = ref(false)
const selectedRows = ref([])

const newCustomer = reactive({
  customer_name: '',
  customer_type: 'Company',
  customer_group: '',
  territory: ''
})

function resetForm() {
  newCustomer.customer_name = ''
  newCustomer.customer_type = 'Company'
  newCustomer.customer_group = ''
  newCustomer.territory = ''
}

function deleteSelected() {
  selectedRows.value.forEach(row => {
    customers.delete.submit(row.name, {
      onSuccess() {
        customers.list.fetch()
      }
    })
  })
  selectedRows.value = []
}

function editSelected() {
  console.log('Edit customers:', selectedRows.value)
  // Future enhancement: Open bulk edit dialog here
}

watch(createDialogShown, (val) => {
  if (!val) resetForm()
})

onKeyStroke(['c', 'C'], () => {
  createDialogShown.value = true
})

const customers = createListResource({
  doctype: 'Customer',
  fields: ['customer_name', 'customer_type', 'customer_group','territory', 'name'],
  orderBy: 'creation desc'
})

const customerGroups = createListResource({
  doctype: 'Customer Group',
  fields: ['name'],
  limit_page_length: 999
})

const customerGroupOptions = computed(() => {
  return (customerGroups.list.data || []).map(group => group.name)
})

const territory = createListResource({
  doctype: 'Territory',
  fields: ['name'],
  limit_page_length: 999
})

const territoryOptions = computed(() => {
  return (territory.list.data || []).map(group => group.name)
})

customers.list.fetch()
customerGroups.list.fetch()
territory.list.fetch()
</script>