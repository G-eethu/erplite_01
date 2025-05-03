<template>
  <div class="m-3 flex">
    <SidebarLink class="w-1/5" />

    <div class="w-4/5 ml-3">
      <div class="flex items-center justify-between mb-4">
      <h2 class="text-gray-900 font-semibold text-xl">Customer List</h2>

      <div class="flex items-center gap-2">
        <select
          v-model="searchQuery"
          class="border border-gray-300 rounded px-3 py-1 text-sm w-64"
        >
          <option value="">All Customers</option>
          <option
            v-for="customer in customers.list.data"
            :key="customer.name"
            :value="customer.customer_name"
          >
            {{ customer.customer_name }}
          </option>
        </select>

        <Button
          variant="solid"
          theme="gray"
          size="sm"
          label="Create"
          :loading="false"
          :disabled="false"
          @click="createDialogShown = true"
        >
          Create
          <template #suffix>
            <span class="font-mono bg-white/50 rounded-sm px-1">C</span>
          </template>
        </Button>
      </div>
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
                    customers.list.fetch();
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
          </form>
        </template>
      </Dialog>

      <!-- Edit Customer Dialog -->
      <Dialog
        v-model="editDialogShown"
        :options="{
          title: 'Edit Customer',
          size: '2xl',
          actions: [
            {
              label: 'Save',
              variant: 'solid',
              onClick(close) {
                customers.setValue.submit({ ...newCustomer }, {
                  onSuccess() {
                    resetForm();
                    customers.list.fetch();
                    close();
                  }
                });
              }
            },
            {
              label : 'Delete',
              variant: 'outline',
              theme: 'red',
              onClick(close){
                customers.delete.submit(newCustomer.name, {
                  onSuccess() {
                    close();
                  }
                })
              }
            }
          ]
        }"
      >
        <template #body-content>
          <form class="space-y-3">
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
          </form>
        </template>
      </Dialog>

      <!-- Customer List -->
      <ListView
        v-if="customers.list.data && customers.list.data.length"
        :columns="[
          { label: 'Customer Name', key: 'customer_name' },
          { label: 'Customer Type', key: 'customer_type' },
          { label: 'Customer Group', key: 'customer_group' },
          { label: 'Territory', key: 'territory' },
          { label: 'ID', key: 'name' }
        ]"
        :rows="filteredCustomers"
        :options="{
          selectable: false,
          showTooltip: false,
          onRowClick: (row) => {
            editDialogShown = true;
            Object.assign(newCustomer, row);
          }
        }"
        row-key="name"
      />


      <!-- Empty state -->
      <div v-else class="text-center text-gray-500 py-10">
        No customers found.
      </div>
    </div>
  </div>
</template>


<script setup>
  import { ref, reactive, watch, computed } from 'vue'
  import { createListResource } from 'frappe-ui'
  import { ListView, Dialog, FormControl, Button } from 'frappe-ui'
  import { onKeyStroke } from '@vueuse/core'
  import SidebarLink from './SidebarLink.vue'

  const searchQuery = ref('')

  const filteredCustomers = computed(() => {
    if (!searchQuery.value.trim()) return customers.list.data || []
    return (customers.list.data || []).filter(customer =>
      customer.customer_name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  const createDialogShown = ref(false)
  const editDialogShown = ref(false)
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

  // function deleteSelected() {
  //   selectedRows.value.forEach(row => {
  //     customers.delete.submit(row.name, {
  //       onSuccess() {
  //         customers.list.fetch()
  //       }
  //     })
  //   })
  //   selectedRows.value = []
  // }

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