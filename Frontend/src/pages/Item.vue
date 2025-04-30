<template>
  <div class="m-3 flex">
    <!-- Sidebar -->
    <SidebarLink class="w-1/5" />

    <!-- Main Content -->
    <div class="w-4/5 ml-3">
      <!-- Heading and Create Button -->
      <div class="flex items-baseline justify-between mb-4">
        <h2 class="text-gray-900 font-semibold text-xl">Items List</h2>
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

      <!-- Dialog for Adding New Item -->
      <Dialog
        :options="{
          title: 'New Item',
          size: '2xl',
          actions: [
            {
              label: 'Create',
              variant: 'solid',
              onClick(close) {
                tasks.insert.submit(
                  { ...newTask },
                  {
                    onSuccess() {
                      close()
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
          <form class="space-y-3">
            <div class="p-2">
              <FormControl
                type="text"
                placeholder="Enter Item Code"
                label="Item Code"
                v-model="newTask.item_code"
              />
            </div>
            <div class="p-2">
              <FormControl
                type="text"
                placeholder="Enter Item Name"
                label="Item Name"
                v-model="newTask.item_name"
              />
            </div>
            <div class="p-2">
              <FormControl
                type="text"
                placeholder="Enter Item Group"
                label="Item Group"
                v-model="newTask.item_group"
              />
            </div>
            <div class="p-2">
              <FormControl
                type="text"
                placeholder="Default Unit of Measure"
                label="Default Unit of Measure"
                v-model="newTask.stock_uom"
              />
            </div>
          </form>
        </template>
      </Dialog>

      <!-- Task List -->
      <ListView
        v-if="tasks.list.data"
        :columns="[
          { label: 'Item Code', key: 'item_code' },
          { label: 'Item Name', key: 'item_name' },
          { label: 'Item Group', key: 'item_group' },
          { label: 'Default Unit of Measure', key: 'stock_uom' }
        ]"
        :rows="tasks.list.data"
        :options="{ showTooltip: false }"
      />
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { createListResource } from 'frappe-ui'
  import { ListView, Dialog, FormControl } from 'frappe-ui'
  import { onKeyStroke } from '@vueuse/core'
  import SidebarLink from './SidebarLink.vue'
  
  const createDialogShown = ref(false)
  
  const newTask = reactive({
    item_code: '',
    item_name: '',
    item_group: '',
    stock_uom: ''
  })
  
  onKeyStroke(['c', 'C'], () => {
    createDialogShown.value = true
  })
  
  const tasks = createListResource({
    doctype: "Item",
    fields: ['item_code', 'item_name', 'item_group', 'stock_uom'],
    orderBy: 'creation desc'
  })
  
  tasks.list.fetch()
  </script>