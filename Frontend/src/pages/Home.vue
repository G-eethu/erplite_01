<template>
  <div class="m-5">
    <div class="flex items-baseline justify-between mb-4">
      <h2 class="text-gray-900 font-semibold text-xl">Tasks</h2>
      <Button
        variant="solid"
        theme="gray"
        size="sm"
        label="Create"
        :loading="false"
        :disabled="false"
        @click="createDialogShown = true"
      ></Button>
    </div>

    <Dialog
      :options="{
        title: 'New Task',
        size: '2xl',
        actions: [
          {
            label: 'Create',
            variant: 'solid',
            onClick(close) {
              tasks.insert.submit({
                ...newTask
              }, {
                onSuccess() {
                  resetForm()
                  close()
                }
              })
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
              placeholder="Enter subject"
              label="Subject"
              v-model="newTask.subject"
            />
          </div>
          <div class="p-2">
            <FormControl
              type="select"
              :options="['Open', 'Closed', 'Working']"
              placeholder="Select status"
              label="Status"
              v-model="newTask.status"
            />
          </div>
          <div class="p-2">
            <FormControl
              type="textarea"
              placeholder="Enter description"
              label="Description"
              v-model="newTask.description"
            />
          </div>
        </form>
      </template>
    </Dialog>

    <!-- ListView Component -->
    <ListView
      v-if="tasks.list.data"
      :columns="[
        { label: 'Subject', key: 'subject', width: 0.4 },
        { label: 'Status', key: 'status' },
        { label: 'Description', key: 'description' }
      ]"
      :rows="tasks.list.data"
      :options="{ showTooltip: false }"
    />
    <div v-else class="text-center text-gray-500">No tasks found.</div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { createListResource } from 'frappe-ui'
import { ListView, Dialog, FormControl } from 'frappe-ui'
import { onKeyStroke } from '@vueuse/core'

const createDialogShown = ref(false)

const newTask = reactive({
  subject: '',
  status: 'Open',
  description: ''
})

function resetForm() {
  newTask.subject = ''
  newTask.status = 'Open'
  newTask.description = ''
}

watch(createDialogShown, (val) => {
  if (!val) resetForm()
})

onKeyStroke(['c', 'C'], () => {
  createDialogShown.value = true
})

const tasks = createListResource({
  doctype: 'Task',
  fields: ['subject', 'status', 'description'],
  orderBy: 'creation desc'
})

tasks.list.fetch()
</script>
