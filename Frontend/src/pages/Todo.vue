<template>
    <ListView
      class="min-h-[300px]"
      row-key="name"
      :columns="columns"
      :rows="todos.list.data"
      :options="{
        onRowClick: (row) => console.log('Clicked:', row),
        selectable: true,
        showTooltip: true,
        resizeColumn: true
      }"
    >
      <!-- Table Header -->
      <ListHeader>
        <ListHeaderItem v-for="col in columns" :key="col.key" :item="col" />
      </ListHeader>
  
      <!-- Table Rows -->
      <ListRows>
        <ListRow
          v-for="row in todos.list.data"
          :key="row.name"
          :row="row"
        >
          <template #default="{ column, item }">
            <ListRowItem
              :item="typeof item === 'object' ? item.label : item"
              :align="column.align || 'left'"
            />
          </template>
        </ListRow>
      </ListRows>
  
      <!-- Selection Banner -->
      <ListSelectBanner>
        <template #actions="{ unselectAll }">
          <div class="flex gap-2">
            <Button
              variant="ghost"
              theme="red"
              label="Delete Selected"
              @click="deleteSelected"
            ></Button>
            <Button
              variant="ghost"
              label="Unselect All"
              @click="unselectAll"
            ></Button>
          </div>
        </template>
      </ListSelectBanner>
    </ListView>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import {
    ListView,
    ListRows,
    ListRow,
    ListRowItem,
    ListSelectBanner,
    ListHeader,
    ListHeaderItem,
    Button,
    createListResource
  } from 'frappe-ui'
  
  const columns = [
    { label: 'Description', key: 'description' },
    { label: 'Status', key: 'status'},
    { label: 'Priority', key: 'priority'},
    { label: 'Due Date', key: 'date' },
  ]
  
  const todos = createListResource({
    doctype: 'ToDo',
    fields: ['description', 'status', 'priority', 'date'],
    orderBy: 'modified desc',
    pageLength: 20
  })
  
  todos.list.fetch()
  
  function deleteSelected() {
    const selectedNames = todos.list.selected.map(row => row.name)
    selectedNames.forEach(name => {
      todos.delete.submit({ name }, {
        onSuccess: () => {
          todos.list.fetch()
        }
      })
    })
  }
  </script>
  