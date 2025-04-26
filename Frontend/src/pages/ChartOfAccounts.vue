<template>
    <Tree
      :options="{
        showIndentationGuides: true,
        rowHeight: '30px',
        indentWidth: '15px',
      }"
      nodeKey="name"
      :node="chartOfAccounts"
    />
  </template>
  

  <script setup>
  import { Tree } from 'frappe-ui'
  
  const chartOfAccounts = {
    name: 'Team back Office',
    label: 'Team back Office',
    children: [
      {
        name: 'assets',
        label: 'Application of Funds (Assets) - TBO',
        children: [
          { name: 'current_assets', label: 'Current Assets - TBO', children: [] },
          { name: 'fixed_assets', label: 'Fixed Assets - TBO', children: [] },
          { name: 'investments', label: 'Investments - TBO', children: [] },
          { name: 'temporary_accounts', label: 'Temporary Accounts - TBO', children: [] }
        ]
      },
      {
        name: 'liabilities',
        label: 'Source of Funds (Liabilities) - TBO',
        children: [
          { name: 'capital_account', label: 'Capital Account - TBO', children: [] },
          { name: 'current_liabilities', label: 'Current Liabilities - TBO', children: [] }
        ]
      },
      {
        name: 'income',
        label: 'Income - TBO',
        children: [
          { name: 'direct_income', label: 'Direct Income - TBO', children: [] },
          { name: 'indirect_income', label: 'Indirect Income - TBO', children: [] }
        ]
      },
      {
        name: 'expenses',
        label: 'Expenses - TBO',
        children: [
          { name: 'direct_expenses', label: 'Direct Expenses - TBO', children: [] },
          { name: 'indirect_expenses', label: 'Indirect Expenses - TBO', children: [] }
        ]
      }
    ]
  }
  </script>
  