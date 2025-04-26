<template>
    <div class="bg-white min-h-screen p-6 rounded-xl shadow">
  
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">New Sales Invoice</h1>
        <Button variant="solid" label="Save" @click="createSalesInvoice = true" />
      </div>
  
      <!-- Confirmation Dialog -->
      <Dialog
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
  
      <!-- Tabs -->
      <Tabs
        v-model="tabIndex"
        :tabs="[
          { label: 'Details' },
          { label: 'Payments' },
          { label: 'Address & Contact' },
          { label: 'Terms' },
          { label: 'More Info' }
        ]"
        class="mb-4"
      />
  
      <!-- Invoice Header Fields -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <FormControl label="Series" type="text" v-model="form.series" />
        <FormControl label="Date" type="date" v-model="form.date" />
        <FormControl
          type="select"
          :options="customerOptions"
          placeholder="Select Customer"
          label="Customer"
          v-model="form.customer"
        />
        <FormControl label="Posting Time" type="time" v-model="form.posting_time" />
        <FormControl label="Payment Due Date" type="date" v-model="form.due_date" />
      </div>
  
      <!-- Item Table -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-2">Items</h2>
        <table class="w-full text-sm border rounded-lg overflow-hidden">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2 text-left">No.</th>
              <th class="p-2 text-left">Item</th>
              <th class="p-2 text-left">Quantity</th>
              <th class="p-2 text-left">Rate (INR)</th>
              <th class="p-2 text-left">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in form.items" :key="index">
              <td class="p-2">{{ index + 1 }}</td>
              <td class="p-2 w-[25%]">
                <FormControl
                  type="select"
                  :options="ItemOptions"
                  v-model="item.item_code"
                />
              </td>
              <td class="p-2 text-left">
                <FormControl type="text" v-model="item.qty" placeholder="0" />
              </td>
              <td class="p-2 text-left">
                <FormControl type="text" v-model="item.rate" placeholder="0.00" />
              </td>
              <td class="p-2 text-left">
                <FormControl
                  type="text"
                  v-model="item.amount"
                  placeholder="0.00"
                  :disabled="true"
                />
              </td>
            </tr>
          </tbody>
        </table>
  
        <!-- Add Row and Upload -->
        <div class="mt-4 flex gap-3">
          <Button label="Add Row" @click="addRow" />
          <Button label="Upload" theme="gray" />
        </div>
      </div>
  
      <!-- Totals -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <FormControl label="Total Quantity" type="text" v-model="form.total_qty" :disabled="true" />
        <FormControl label="Total (INR)" type="text" v-model="form.total" :disabled="true" />
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
    createListResource
  } from 'frappe-ui'

  import { useRouter } from 'vue-router'

  const router = useRouter()

  const goToForm = () => {
    router.push('/sales_invoice')
  }

  // Tab index and dialog state
  const tabIndex = ref(0)
  const createSalesInvoice = ref(false)
  
  // Sales Invoice form with total fields
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
  
  // Recalculate item amounts and totals
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
  
  // Add a new item row
  function addRow() {
    form.items.push({ item_code: '', qty: 0, rate: 0, amount: 0 })
  }
  
  // Reset form to default
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
  
  // Fetch customers
  const customer = createListResource({
    doctype: 'Customer',
    fields: ['name'],
    limit_page_length: 999
  })
  const customerOptions = computed(() => {
    return (customer.list.data || []).map(c => ({ label: c.name, value: c.name }))
  })
  
  // Fetch items
  const item = createListResource({
    doctype: 'Item',
    fields: ['name'],
    limit_page_length: 999
  })
  const ItemOptions = computed(() => {
    return (item.list.data || []).map(i => ({ label: i.name, value: i.name }))
  })
  
  // Sales invoice resource
  const sales_invoices = createListResource({
    doctype: 'Sales Invoice',
    fields: ['name', 'customer', 'posting_date', 'status'],
    limit_page_length: 999
  })
  
  // Initial data fetch
  customer.list.fetch()
  item.list.fetch()
  sales_invoices.list.fetch()
  </script>
  