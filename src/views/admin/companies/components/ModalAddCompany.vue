<script setup lang="ts">
import { Modal } from 'flowbite-vue'
import { Form } from 'vee-validate'
import * as yup from 'yup'

import ValidationInput from '@/components/ValidationInput.vue'
import Button from '@/components/Button.vue'
import AppText from '@/components/AppText'
import type { CompanyCreate } from '@/types'
import { useCreateCompany } from '@/composables/company'

const emit = defineEmits(['success'])

const createCompany = useCreateCompany({
  onSuccess() {
    emit('success')
  }
})

const props = defineProps({
  onClose: {
    type: Function,
    required: true
  }
})

const schema = yup.object<CompanyCreate>({
  name: yup.string().required().max(128),
  phone: yup.string().max(16).optional().nullable(),
  address: yup.string().max(256).optional().nullable(),
  website: yup.string().max(256).optional().nullable()
})

function handleAdd(values: any) {
  createCompany.mutate(values)
}
</script>

<template>
  <Modal @close="props.onClose">
    <template #header>
      <AppText variant="title"> Add company </AppText>
    </template>
    <template #body>
      <Form class="block mx-auto" :validation-schema="schema" @submit="handleAdd">
        <div>
          <ValidationInput
            name="name"
            placeholder="Name"
            label="Name"
            :disabled="createCompany.isLoading.value"
          />
          <div class="mt-4">
            <ValidationInput
              name="phone"
              placeholder="Phone"
              label="Phone"
              :disabled="createCompany.isLoading.value"
            />
          </div>
          <div class="mt-4">
            <ValidationInput
              name="address"
              placeholder="Address"
              label="Address"
              :disabled="createCompany.isLoading.value"
            />
          </div>
          <div class="mt-4">
            <ValidationInput
              name="website"
              placeholder="Website"
              label="Website"
              :disabled="createCompany.isLoading.value"
            />
          </div>
          <div class="text-center mt-4">
            <Button color="default" :disabled="createCompany.isLoading.value">Add</Button>
          </div>
        </div>
      </Form>
    </template>
  </Modal>
</template>
