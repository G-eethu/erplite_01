<template>
  <div class="bg-white min-h-screen p-6 rounded-xl shadow">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">New Sales Invoice</h1>
      <Button variant="solid" label="Save" @click="createSalesInvoice = true" />
    </div>

    <Dialog
      v-if="createSalesInvoice"
      v-model="createSalesInvoice"
      :options="{
        title: 'Confirm',
        message: 'Are you sure you want to confirm this action?',
        size: '2xl',
        icon: {
          name: 'alert-triangle',
          appearance: 'warning',
        },
        actions: [
          {
            label: 'Create',
            variant: 'solid',
            onClick(close) {
              sales_invoices.insert.submit(
                { ...form },
                {
                  onSuccess() {
                    resetForm()
                    close()
                    router.push('/sales_invoice_list')
                  }
                }
              )
            }
          }
        ]
      }"
    />

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
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in form.items" :key="index">
            <td class="p-2">{{ index + 1 }}</td>
            <td class="p-2 w-[25%]">
              <div class="flex items-center gap-2">
                <FrappeLink
                  v-model="item.item_code"
                  doctype="Item"
                  :filters="{}"
                  placeholder="Select Item"
                  @create-new="showNewItemDialog = true"
                  class="flex-1"
                />
                <Button label="+New" variant="solid" theme="gray" size="sm" @click="(showNewItemDialog = true, selectedItemRowIndex = index)" />
              </div>
            </td>
            <td class="p-2 text-left">
              <FormControl type="text" v-model="item.qty" placeholder="0" />
            </td>
            <td class="p-2 text-left">
              <FormControl type="text" v-model="item.rate" placeholder="0.00" />
            </td>
            <td class="p-2 text-left">
              <FormControl type="text" v-model="item.amount" placeholder="0.00" :disabled="true" />
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

    <!-- Dialog for Adding New Item -->
    <Dialog
      v-if="showNewItemDialog"
      v-model="showNewItemDialog"
      :options="{
        title: 'New Item',
        size: '2xl',
        actions: [
          {
            label: 'Create',
            variant: 'solid',
            onClick(close) {
              item.insert.submit({ ...newItem }, {
                onSuccess(data) {
                  form.item = data.name;
                  newItem.item_code = '';
                  newItem.item_name = '';
                  newItem.item_group = '';
                  newItem.stock_uom = '';
                  item.list.fetch();
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
              placeholder="Enter Item Code"
              label="Item Code"
              v-model="newItem.item_code"
            />
          </div>
          <div class="p-2">
            <FormControl
              type="text"
              placeholder="Enter Item Name"
              label="Item Name"
              v-model="newItem.item_name"
            />
          </div>
          <div class="p-2">
            <FormControl
              type="select"
              :options="itemGroupOptions"
              placeholder="Enter Item Group"
              label="Item Group"
              v-model="newItem.item_group"
            />
          </div>
          <div class="p-2">
            <FormControl
              type="text"
              placeholder="Default Unit of Measure"
              label="Default Unit of Measure"
              v-model="newItem.stock_uom"
            />
          </div>
        </form>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
  import { ref, reactive, computed, watchEffect } from 'vue'
  import {
    FormControl,
    Button,
    Tabs,
    Dialog,
    createListResource
  } from 'frappe-ui'
  import { useRouter } from 'vue-router'
  import FrappeLink from '@/components/frappe-ui/Link.vue'

  const router = useRouter()

  const tabIndex = ref(0)
  const createSalesInvoice = ref(false)
  const showNewCustomerDialog = ref(false)
  const showNewItemDialog = ref(false)
  const selectedItemRowIndex = ref(null)

  const newCustomer = reactive({
    customer_name: '',
    customer_type: 'Individual',
    customer_group: '',
    territory: ''
  })

  const newItem = reactive({
    item_code: '',
    item_name: '',
    item_group: '',
    stock_uom: 'Nos'
  })

  const form = reactive({
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
    form.series = 'ACC-SINV-.YYYY.-'
    form.date = new Date().toISOString().substr(0, 10)
    form.customer = ''
    form.posting_time = new Date().toLocaleTimeString('en-GB').slice(0, 5)
    form.due_date = ''
    form.total_qty = 0
    form.total = 0
    form.items = [{ item_code: '', qty: 0, rate: 0, amount: 0 }]
  }

  const customer = createListResource({
    doctype: 'Customer',
    fields: ['name', 'customer_name', 'customer_type', 'territory'],
    limit_page_length: 999
  })

  const item = createListResource({
    doctype: 'Item',
    fields: ['name', 'item_name', 'description', 'standard_rate'],
    limit_page_length: 999
  })

  const sales_invoices = createListResource({
    doctype: 'Sales Invoice',
    fields: ['name', 'customer', 'posting_date', 'status'],
    limit_page_length: 999
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

  const itemGroup = createListResource({
    doctype: 'Item Group',
    fields: ['name'],
    limit_page_length: 999
  })

  const itemGroupOptions = computed(() => {
    return (itemGroup.list.data || []).map(group => group.name)
  })

  customers.list.fetch()
  customerGroups.list.fetch()
  territory.list.fetch()
  itemGroup.list.fetch()
  customer.list.fetch()
  item.list.fetch()
  sales_invoices.list.fetch()
</script>
