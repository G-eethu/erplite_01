<template>
    <div class="m-3 flex">
      <SidebarLink class="w-1/5" />
  
      <div class="w-4/5 ml-3">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-gray-900 font-semibold text-xl">Sales Invoice</h2>
  
          <div class="flex items-center gap-2">
            <select
              v-model="searchQuery"
              class="border border-gray-300 rounded px-3 py-1 text-sm w-64"
            >
              <option value="">All Invoices</option>
              <option
                v-for="invoice in sales_invoices.list.data"
                :key="invoice.name"
                :value="invoice.customer"
              >
                {{ invoice.customer }}
              </option>
            </select>
  
            <Button
              variant="solid"
              theme="gray"
              size="sm"
              label="Create"
              :loading="false"
              :disabled="false"
              @click="openCreateDialog"
            />
          </div>
        </div>
  
        <!-- Sales Invoice Dialog -->
        <Dialog
          v-model="createDialogShown"
          :options="{
            title: 'Sales Invoice',
            size: 'full',
            persistent: true,
            closeOnEsc: false,
            actions: [
              {
                label: 'Save',
                variant: 'solid',
                onClick(close) {
                    sales_invoices.insert.submit({ ...form }, {
                    onSuccess() {
                      resetForm()
                      sales_invoices.list.fetch()
                      close()
                    }
                  })
                }
              }
            ]
          }"
        >
          <template #body-content>
            <Tabs
              v-model="tabIndex"
              :tabs="[
                { label: 'Details' }
              ]"
              class="mb-4"
            />
  
            <div class="grid grid-cols-2 gap-4 mb-6">
              <FormControl label="Series" type="text" v-model="form.series" />
              <FormControl label="Date" type="date" v-model="form.date" />
              
              <div>
                <label class="block text-sm text-gray-700 mb-1">
                  Customer <span class="text-red-500"></span>
                </label>
  
                <div class="flex items-center gap-2">
                  <FrappeLink
                    v-model="form.customer"
                    doctype="Customer"
                    :filters="{}"
                    placeholder="Select Customer"
                    @create-new="showNewCustomerDialog = true"
                    class="flex-1"
                  />
  
                  <Button
                    label="+New"
                    variant="solid"
                    theme="gray"
                    size="sm"
                    @click="showNewCustomerDialog = true"
                  />
                </div>
              </div>
              <FormControl label="Posting Time" type="time" v-model="form.posting_time" />
              <FormControl label="Payment Due Date" type="date" v-model="form.due_date" />
            </div>
  
            <div class="mb-6">
              <h2 class="text-lg font-semibold mb-2">Items</h2>
              <table class="w-full text-sm border rounded-lg overflow-hidden">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="p-2 text-left">No.</th>
                    <th class="p-2 text-left">Item</th>
                    <th class="p-2 text-left">Quantity</th>
                    <th class="p-2 text-left">Rate</th>
                    <th class="p-2 text-left">Amount</th>
                    <th class="p-2 text-left">Tax template</th>
                    <th class="p-2 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in form.items"
                    :key="index"
                    class="even:bg-gray-50 odd:bg-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td class="p-1 text-center text-gray-600 font-medium w-10">{{ index + 1 }}</td>
                    <td class="p-2 w-[25%] text-gray-500">
                      <div class="flex items-center gap-2">
                        <FrappeLink
                          v-model="item.item_code"
                          doctype="Item"
                          :filters="{}"
                          placeholder="Select Item"
                          @create-new="showNewItemDialog = true"
                          class="flex-1"
                        />
                        <Button
                          label="+New"
                          variant="solid"
                          theme="gray"
                          size="sm"
                          @click="(showNewItemDialog = true, selectedItemRowIndex = index)"
                        />
                      </div>
                    </td>
                    <td class="p-2 text-left text-gray-300">
                      <FormControl type="text" v-model="item.qty" placeholder="0" />
                    </td>
                    <td class="p-2 text-left text-gray-300">
                      <FormControl type="text" v-model="item.rate" placeholder="0.00" />
                    </td>
                    <td class="p-2 text-left text-gray-300 font-semibold">
                      <FormControl
                        type="text"
                        v-model="item.amount"
                        placeholder="0.00"
                        :disabled="true"
                      />
                    </td>
                    <td class="p-2 text-left text-gray-300 font-semibold">
                        <FormControl
                            type="select"
                            :options="taxTemplateOptions"
                            placeholder=""
                            v-model="item.tax_template"
                        />
                    </td>
                    <td class="p-2 text-center">
                      <Trash2
                        class="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer"
                        @click="form.items.splice(index, 1)"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
  
              <div class="mt-4 flex gap-3">
                <Button label="Add Row" @click="addRow" />
                <Button label="Upload" theme="gray" />
              </div>
            </div>
  
            <div class="grid grid-cols-2 gap-4 mb-6">
              <FormControl label="Total Quantity" type="text" v-model="form.total_qty" :disabled="true" />
              <FormControl label="Total" type="text" v-model="form.total" :disabled="true" />
            </div>
  
            <!-- Customer Dialog Box -->
            <Dialog
              v-if="showNewCustomerDialog"
              v-model="showNewCustomerDialog"
              :options="{
                title: 'New Customer',
                size: '2xl',
                actions: [
                  {
                    label: 'Create',
                    variant: 'solid',
                    onClick(close) {
                      customers.insert.submit({ ...newCustomer }, {
                        onSuccess(data) {
                          form.customer = data.name;
                          newCustomer.customer_name = '';
                          newCustomer.customer_type = 'Individual';
                          newCustomer.customer_group = '';
                          newCustomer.territory = '';
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
          </template>
        </Dialog>
  
        <!-- Edit Sales Invoice Dialog -->
        <Dialog
          v-model="editDialogShown"
          :options="{
            title: 'Edit Sales Invoice',
            size: 'full',
            persistent: true,
            closeOnEsc: false,
            actions: [
              {
                label: 'Save',
                variant: 'solid',
                onClick(close) {
                    invoices.setValue.submit({ ...form }, {
                    onSuccess() {
                      resetForm()
                      invoices.list.fetch()
                      close()
                    }
                  })
                }
              },
              {
                label: 'Delete',
                variant: 'outline',
                theme: 'red',
                onClick(close) {
                    invoices.delete.submit(form.name, {
                    onSuccess() {
                      resetForm()
                      invoices.list.fetch()
                      close()
                    }
                  })
                }
              }
            ]
          }"
        >
          <template #body-content>
            <Tabs
              v-model="tabIndex"
              :tabs="[
                { label: 'Details' }
              ]"
              class="mb-4"
            />
  
            <div class="grid grid-cols-2 gap-4 mb-6">
              <FormControl label="Date" type="date" v-model="form.date" />
              
              <div>
                <label class="block text-sm text-gray-700 mb-1">
                  Customer <span class="text-red-500"></span>
                </label>
  
                <div class="flex items-center gap-2">
                  <FrappeLink
                    v-model="form.customer"
                    doctype="Customer"
                    :filters="{}"
                    placeholder="Select Customer"
                    @create-new="showNewCustomerDialog = true"
                    class="flex-1"
                  />
  
                  <Button
                    label="+New"
                    variant="solid"
                    theme="gray"
                    size="sm"
                    @click="showNewCustomerDialog = true"
                  />
                </div>
              </div>
              <FormControl label="Posting Time" type="time" v-model="form.posting_time" />
              <FormControl label="Payment Due Date" type="date" v-model="form.due_date" />
            </div>
  
            <div class="mb-6">
              <h2 class="text-lg font-semibold mb-2">Items</h2>
              <table class="w-full text-sm border rounded-lg overflow-hidden">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="p-2 text-left">No.</th>
                    <th class="p-2 text-left">Item</th>
                    <th class="p-2 text-left">Quantity</th>
                    <th class="p-2 text-left">Rate</th>
                    <th class="p-2 text-left">Amount</th>
                    <th class="p-2 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in form.items"
                    :key="index"
                    class="even:bg-gray-50 odd:bg-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td class="p-2 text-center text-gray-600 font-medium w-10">{{ index + 1 }}</td>
                    <td class="p-2 w-[25%] text-gray-500">
                      <div class="flex items-center gap-2">
                        <FrappeLink
                          v-model="item.item_code"
                          doctype="Item"
                          :filters="{}"
                          placeholder="Select Item"
                          @create-new="showNewItemDialog = true"
                          class="flex-1"
                        />
                        <Button
                          label="+New"
                          variant="solid"
                          theme="gray"
                          size="sm"
                          @click="(showNewItemDialog = true, selectedItemRowIndex = index)"
                        />
                      </div>
                    </td>
                    <td class="p-2 text-left text-gray-700">
                      <FormControl type="text" v-model="item.qty" placeholder="0" />
                    </td>
                    <td class="p-2 text-left text-gray-700">
                      <FormControl type="text" v-model="item.rate" placeholder="0.00" />
                    </td>
                    <td class="p-2 text-left text-gray-800 font-semibold">
                      <FormControl
                        type="text"
                        v-model="item.amount"
                        placeholder="0.00"
                        :disabled="true"
                      />
                    </td>
                    <td class="p-2 text-center">
                      <Trash2
                        class="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer"
                        @click="form.items.splice(index, 1)"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
  
              <div class="mt-4 flex gap-3">
                <Button label="Add Row" @click="addRow" />
                <Button label="Upload" theme="gray" />
              </div>
            </div>
  
            <div class="grid grid-cols-2 gap-4 mb-6">
              <FormControl label="Total Quantity" type="text" v-model="form.total_qty" :disabled="true" />
              <FormControl label="Total" type="text" v-model="form.total" :disabled="true" />
            </div>
          </template>
        </Dialog>
  
        <!-- List View -->
        <ListView
          v-if="sales_invoices.list.data && sales_invoices.list.data.length"
          :columns="[
            { label: 'Customer', key: 'customer' },
            { label: 'Posting Date', key: 'posting_date' },
            { 
                label: 'Status', 
                key: 'status',
                cellRenderer: 'StatusBadge'
            },
            { label: 'ID', key: 'name' }
          ]"
          :rows="filteredInvoices"
          :options="{
            selectable: false,
            showTooltip: true,
            onRowClick: (row) => {
            editDialogShown = true;
            Object.assign(form, row);
          }
          }"
          row-key="name"
            >
            <template #StatusBadge="{ row }">
                <Badge
                variant="solid"
                :theme="getStatusTheme(row.status)"
                size="sm"
                :label="row.status"
                />
            </template>
        </ListView>
  
        <div v-else class="text-center text-gray-500 py-10">
          No invoices found.
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, watchEffect } from 'vue'
  import {
    FormControl,
    Button,
    Tabs,
    Dialog,
    ListView,
    createListResource
  } from 'frappe-ui'
  import { useRouter } from 'vue-router'
  import FrappeLink from '@/components/frappe-ui/Link.vue'
  import { Trash2 } from 'lucide-vue-next'
  import SidebarLink from './SidebarLink.vue'
  
  const router = useRouter()
  
  const tabIndex = ref(0)
  const createDialogShown = ref(false)
  const editDialogShown = ref(false)
  const showNewCustomerDialog = ref(false)
  const showNewItemDialog = ref(false)
  const selectedItemRowIndex = ref(null)
  const searchQuery = ref('')
  
  const newCustomer = reactive({
    customer_name: '',
    customer_type: 'Individual',
    customer_group: '',
    territory: ''
  })

  function getStatusTheme(status) {
    switch (status?.toLowerCase()) {
        case 'paid':
        return 'green';
        case 'unpaid':
        return 'red';
        case 'overdue':
        return 'orange';
        case 'draft':
        return 'gray';
        case 'cancelled':
        return 'red';
        default:
        return 'blue';
    }
  }

  
  function deleteRow(index) {
    if (form.items.length > 1) {
      form.items.splice(index, 1)
    }
  }
  
  const newItem = reactive({
    item_code: '',
    item_name: '',
    item_group: '',
    stock_uom: 'Nos'
  })
  
  const form = reactive({
    name: '',  // Added name field for editing
    series: 'ACC-SINV-.YYYY.-',
    date: new Date().toISOString().substr(0, 10),
    customer: '',
    posting_time: new Date().toLocaleTimeString('en-GB').slice(0, 5),
    due_date: '',
    total_qty: 0,
    total: 0,
    items: [
      { item_code: '', qty: 0, rate: 0, amount: 0 }
    ]
  })
  
  watchEffect(() => {
    let totalQty = 0
    let totalAmount = 0
  
    form.items.forEach(item => {
      const qty = parseFloat(item.qty) || 0
      const rate = parseFloat(item.rate) || 0
      item.amount = qty * rate
      totalQty += qty
      totalAmount += item.amount
    })
  
    form.total_qty = totalQty
    form.total = totalAmount.toFixed(2)
  })
  
  function addRow() {
    form.items.push({ item_code: '', qty: 0, rate: 0, amount: 0 })
  }
  
  function resetForm() {
    form.name = ''
    form.series = 'ACC-SINV-.YYYY.-'
    form.date = new Date().toISOString().substr(0, 10)
    form.customer = ''
    form.posting_time = new Date().toLocaleTimeString('en-GB').slice(0, 5)
    form.due_date = ''
    form.total_qty = 0
    form.total = 0
    form.items = [{ item_code: '', qty: 0, rate: 0, amount: 0  }]
  }
  
  function openCreateDialog() {
    resetForm()
    createDialogShown.value = true
  }
  
//   // Fixed function to handle row clicks
//   function handleRowClick(row) {
//     // Fetch the full invoice data including items
//     invoices.get.submit(row.name, {
//       onSuccess(data) {
//         // Copy all data from the fetched invoice to the form
//         Object.assign(form, data)
//         editDialogShown.value = true
//       }
//     })
//   }
  
  // Define the invoices resource with all needed methods
  const invoices = createListResource({
    doctype: 'Sales Invoice',
    fields: ['name', 'customer', 'posting_date', 'status', 'items', 'total_qty', 'total', 'due_date', 'series', 'date', 'posting_time'],
    limit_page_length: 999,
    insert: { doctype: 'Sales Invoice' },
    setValue: { doctype: 'Sales Invoice' },
    delete: { doctype: 'Sales Invoice' },
    get: { doctype: 'Sales Invoice' }
  })
  
  const sales_invoices = createListResource({
    doctype: 'Sales Invoice',
    fields: ['name', 'customer', 'posting_date', 'status', 'items.item_code', 'items.qty', 'items.rate', 'items.amount', 'total_qty', 'total'],
    limit_page_length: 999
  })
  
  const customers = createListResource({
    doctype: 'Customer',
    fields: ['customer_name', 'customer_type', 'customer_group','territory', 'name'],
    orderBy: 'creation desc',
    insert: { doctype: 'Customer' }
  })
  
  const customerGroups = createListResource({
    doctype: 'Customer Group',
    fields: ['name'],
    limit_page_length: 999
  })
  
  const customerGroupOptions = computed(() => {
    return (customerGroups.list.data || []).map(group => group.name)
  })

  const taxTemplate = createListResource({
    doctype: 'Item Tax Template',
    fields: ['name'],
    limit_page_length: 999
  })
  
  const taxTemplateOptions = computed(() => {
    return (taxTemplate.list.data || []).map(group => group.name)
  })
  
  const territory = createListResource({
    doctype: 'Territory',
    fields: ['name'],
    limit_page_length: 999
  })
  
  const territoryOptions = computed(() => {
    return (territory.list.data || []).map(group => group.name)
  })
  
  const filteredInvoices = computed(() => {
    if (!searchQuery.value.trim()) return sales_invoices.list.data || []
    return (sales_invoices.list.data || []).filter(invoice =>
      invoice.customer?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
  
  customers.list.fetch()
  customerGroups.list.fetch()
  territory.list.fetch()
  sales_invoices.list.fetch()
  invoices.list.fetch()
  taxTemplate.list.fetch()
</script>