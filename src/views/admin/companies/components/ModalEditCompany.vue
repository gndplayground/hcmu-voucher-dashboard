<script setup lang="ts">
import { Modal } from 'flowbite-vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

import { ref, watch } from 'vue'
import ValidationInput from '@/components/ValidationInput.vue'
import Button from '@/components/Button.vue'
import ValidationCheckbox from '@/components/ValidationCheckbox.vue'
import AppText from '@/components/AppText'
import type { CompanyCreate } from '@/types'
import { useGetCompany, useUpdateCompany } from '@/composables/company'
import { wait } from '@/helpers/timer'

const props = defineProps({
  onClose: {
    type: Function,
    required: true
  },
  companyId: {
    type: [Number],
    default: undefined
  }
})

const emit = defineEmits(['success'])

const schema = yup.object<CompanyCreate>({
  name: yup.string().required().max(128),
  phone: yup.string().max(16).optional().nullable(),
  address: yup.string().max(256).optional().nullable(),
  website: yup.string().max(256).optional().nullable()
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema
})

const companyDetail = useGetCompany({
  id: props.companyId
})

const updateCompany = useUpdateCompany()

const isReady = ref(false)

watch(
  () => {
    return {
      fetched: companyDetail.isFetched.value,
      ready: isReady.value
    }
  },
  async ({ fetched, ready }) => {
    if (fetched && !ready) {
      await wait(100)
      resetForm({
        values: {
          name: companyDetail.data.value?.name,
          phone: companyDetail.data.value?.phone,
          address: companyDetail.data.value?.address,
          website: companyDetail.data.value?.website,
          isDeleted: companyDetail.data.value?.isDeleted
        }
      })
      isReady.value = true
    }
  },
  { immediate: true }
)

const onSubmit = handleSubmit(async (values) => {
  await updateCompany.mutateAsync({
    id: props.companyId || 0,
    data: {
      name: values.name,
      phone: values.phone,
      address: values.address,
      website: values.website,
      isDeleted: values.isDeleted
    }
  })
  emit('success')
})
</script>

<template>
  <Modal @close="props.onClose">
    <template #header>
      <AppText variant="title"> Edit company {{ companyDetail.data.value?.name }} </AppText>
    </template>
    <template #body>
      <form class="block mx-auto" @submit.prevent="onSubmit">
        <div>
          <ValidationInput
            name="name"
            placeholder="Name"
            label="Name"
            :disabled="updateCompany.isLoading.value"
          />
          <div class="mt-4">
            <ValidationInput
              name="phone"
              placeholder="Phone"
              label="Phone"
              :disabled="updateCompany.isLoading.value"
            />
          </div>
          <div class="mt-4">
            <ValidationInput
              name="address"
              placeholder="Address"
              label="Address"
              :disabled="updateCompany.isLoading.value"
            />
          </div>
          <div class="mt-4">
            <ValidationInput
              name="website"
              placeholder="Website"
              label="Website"
              :disabled="updateCompany.isLoading.value"
            />
          </div>
          <div class="mt-4">
            <ValidationCheckbox name="isDeleted" :disabled="updateCompany.isLoading.value">
              <template v-slot:label> Is Deleted </template>
            </ValidationCheckbox>
          </div>
          <div class="text-center mt-4">
            <Button color="default" :disabled="updateCompany.isLoading.value">Edit</Button>
          </div>
        </div>
      </form>
    </template>
  </Modal>
</template>
