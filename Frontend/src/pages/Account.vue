<template>
    <div class="m-3 flex">
      <!-- Sidebar -->
      <SidebarLink class="w-1/5" />
  
      <!-- Main Content -->
      <div class="w-4/5 ml-3">
        <!-- Heading and Create Button -->
        <div class="flex items-baseline justify-between mb-4">
          <h2 class="text-gray-900 font-semibold text-xl">Account</h2>
          <Button
            variant="solid"
            theme="gray"
            size="sm"
            label="Create"
            :loading="false"
            :disabled="false"
            @click="createDialogShown = true"
          />
        </div>
  
        <Dialog
        :options="{
            title: 'New Account',
            size: '2xl',
            actions: [
            {
                label: 'Create',
                variant: 'solid',
                onClick(close) {
                // You can handle form submission here
                accounts.insert.submit(
                    { ...newAccount },
                    {
                    onSuccess() {
                        close()
                        accounts.list.fetch() // refresh list
                    }
                    }
                )
                }
            }
            ]
        }"
        v-model="createDialogShown"
        >
        <template #body-content>
            <form class="grid grid-cols-2 gap-4 p-4">
            <FormControl
                label="Account Name"
                type="text"
                placeholder="Enter Account Name"
                v-model="newAccount.account_name"
                required
            />
            <!-- <FormControl
                label="Parent Account"
                type="link"
                doctype="Account"
                placeholder="Select Parent Account"
                v-model="newAccount.parent_account"
                required
            /> -->
            <FormControl
                type="select"
                :options="accountOptions"
                placeholder="Select Parent Accounty"
                label="Parent Account"
                v-model="newAccount.parent_account"
                required
            />
            <FormControl
                label="Account Number"
                type="text"
                placeholder="Enter Account Number"
                v-model="newAccount.account_number"
            />
            <FormControl
                label="Account Type"
                type="select"
                :options="accountTypes"
                v-model="newAccount.account_type"
            />
            <FormControl
                label="Tax Rate"
                type="number"
                placeholder="Tax Rate"
                v-model="newAccount.tax_rate"
            />
            <FormControl
                label="Balance Must Be"
                type="select"
                :options="['Debit', 'Credit']"
                v-model="newAccount.balance_must_be"
            />
            <FormControl
                type="select"
                :options="companyOptions"
                placeholder="Select Company"
                label="Company"
                v-model="newAccount.company"
                required
            />
            <FormControl
                label="Currency"
                type="data"
                placeholder="Currency"
                v-model="newAccount.currency"
            />
            <div class="col-span-2 flex items-center space-x-4 mt-2">
                <FormControl
                label="Is Group"
                type="checkbox"
                v-model="newAccount.is_group"
                />
                <FormControl
                label="Disable"
                type="checkbox"
                v-model="newAccount.disabled"
                />
            </div>
            </form>
        </template>
        </Dialog>

  
        <!-- Task List -->
        <ListView
            v-if="accounts.list.data && accounts.list.data.length"
            :columns="[
                { label: 'ID', key: 'name' },
                { label: 'Account Name', key: 'account_name' },
                { label: 'Account Number', key: 'account_number' }
            ]"
            :rows="accounts.list.data"
            :options="{ 
                selectable: true,
                showTooltip: true, 
            }"
            row-key="name"
        />
      </div>
    </div>
</template>
    
<script setup>
    import { ref, reactive, computed } from 'vue'
    import { createListResource } from 'frappe-ui'
    import { ListView, Dialog, FormControl } from 'frappe-ui'
    import { onKeyStroke } from '@vueuse/core'
    import SidebarLink from './SidebarLink.vue'
    
    const createDialogShown = ref(false)
    
    const newAccount = reactive({
        account_name: '',
        parent_account: '',
        account_number: '',
        account_type: '',
        tax_rate: '',
        balance_must_be: '',
        company: 'Team back Office',
        currency: 'INR',
        is_group: false,
        disabled: false
    })

    const accountTypes = [
        'Accumulated Depreciation',
        'Asset Received But Not Billed',
        'Bank',
        'Cash',
        'Chargeable',
        'Capital Work in Progress',
        'Cost of Goods Sold',
        'Current Asset',
        'Current Liability',
        'Depreciation',
        'Direct Expense',
        'Direct Income',
        'Equity',
        'Expense Account',
        'Expenses Included In Asset Valuation',
        'Expenses Included In Valuation',
        'Fixed Asset',
        'Income Account',
        'Indirect Expense',
        'Indirect Income',
        'Liability',
        'Payable',
        'Receivable',
        'Round Off',
        'Round Off for Opening',
        'Stock',
        'Stock Adjustment',
        'Stock Received But Not Billed',
        'Service Received But Not Billed',
        'Tax',
        'Temporary'
    ]

    
    onKeyStroke(['c', 'C'], () => {
      createDialogShown.value = true
    })
    
    const accounts = createListResource({
      doctype: "Account",
      fields: ['name', 'account_name', 'account_number'],
      orderBy: 'creation desc',
      limit: 999
    })

    const company = createListResource({
        doctype: 'Company',
        fields: ['name'],
        limit_page_length: 999
    })

    const companyOptions = computed(() => {
        return (company.list.data || []).map(group => group.name)
    })

    const account = createListResource({
        doctype: 'Account',
        fields: ['name'],
        limit_page_length: 999
    })

    const accountOptions = computed(() => {
        return (account.list.data || []).map(group => group.name)
    })

    accounts.list.fetch()
    company.list.fetch()
    account.list.fetch()
</script>