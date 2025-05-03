<template>
  <Tree
    v-if="treeData"
    :options="{
      showIndentationGuides: true,
      rowHeight: '30px',
      indentWidth: '15px',
    }"
    nodeKey="name"
    :node="treeData"
    @node-click="onNodeClick"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Tree } from 'frappe-ui'
import { call } from 'frappe-ui'

const treeData = ref(null)

onMounted(async () => {
  try {
    const response = await call('frappe.client.get_list', {
      doctype: 'Account',
      fields: ['name', 'account_name', 'parent_account', 'is_group', 'company'],
      filters: { disabled: 0 },
      limit: 1000,
      order_by: 'lft asc',
    })

    const accounts = response?.message
    if (Array.isArray(accounts)) {
      treeData.value = buildTree(accounts)
    } else {
      console.error('Invalid account list response:', response)
    }
  } catch (error) {
    console.error('Failed to fetch accounts:', error)
  }
})

// Convert flat list to tree
function buildTree(accounts) {
  const accountMap = {}
  const roots = []

  accounts.forEach(acc => {
    accountMap[acc.name] = {
      ...acc,
      label: `${acc.account_name} (${acc.company})`,
      name: acc.name,
      children: []
    }
  })

  accounts.forEach(acc => {
    if (acc.parent_account && accountMap[acc.parent_account]) {
      accountMap[acc.parent_account].children.push(accountMap[acc.name])
    } else {
      roots.push(accountMap[acc.name])
    }
  })

  return {
    name: 'Chart of Accounts',
    label: 'Chart of Accounts',
    children: roots
  }
}

// Redirect to ERPNext view when node is clicked
function onNodeClick(node) {
  const accountName = encodeURIComponent(node.name)
  window.location.href = `/app/account/view/tree?account=${accountName}`
}
</script>
