<template>
    <div class="space-y-4">
      <div
        class="flex items-center justify-between"
        v-for="todo in todos.data"
        :key="todo.name"
      >
        <div>
          {{ todo.description }}
        </div>
        <Badge>{{ todo.status }}</Badge>
      </div>
    </div>
    <Button @click="todos.next()"> Next Page </Button>
  </template>
  <script setup>
  import { createListResource } from 'frappe-ui'
  let todos = createListResource({
    doctype: 'ToDo',
    fields: ['name', 'description', 'status'],
    orderBy: 'creation desc',
    start: 0,
    pageLength: 5,
  })
  todos.fetch()
  </script>