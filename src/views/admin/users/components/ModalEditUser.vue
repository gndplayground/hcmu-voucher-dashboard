<script setup lang="ts">
import { Modal } from 'flowbite-vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { ref, watch } from 'vue'
import ValidationInput from '@/components/ValidationInput.vue'
import Button from '@/components/Button.vue'
import AppText from '@/components/AppText'
import ValidationSelect from '@/components/ValidationSelect.vue'
import { useGetUser, useUpdateUser } from '@/composables/user'
import ValidationCheckbox from '@/components/ValidationCheckbox.vue'
import { wait } from '@/helpers/timer'

const emit = defineEmits(['success'])

const props = defineProps({
  onClose: {
    type: Function,
    required: true
  },
  userId: {
    type: [Number],
    default: undefined
  }
})

const userDetail = useGetUser({
  id: props.userId
})

const updateUser = useUpdateUser()

const schema = yup.object({
  password: yup.string().min(6).optional(),
  role: yup.string().oneOf(['ADMIN', 'USER', 'COMPANY'])
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema
})

const isReady = ref(false)

watch(
  () => {
    return {
      fetched: userDetail.isFetched.value,
      ready: isReady.value
    }
  },
  async ({ fetched, ready }) => {
    if (fetched && !ready) {
      await wait(100)
      resetForm({
        values: {
          role: userDetail.data.value?.role,
          isDisabled: userDetail.data.value?.isDisabled
        }
      })
      isReady.value = true
    }
  },
  { immediate: true }
)

const onSubmit = handleSubmit(async (values) => {
  await updateUser.mutateAsync({
    password: values.password || undefined,
    role: values.role,
    isDisabled: values.isDisabled,
    id: props.userId || 0
  })
  emit('success')
})
</script>

<template>
  <Modal @close="props.onClose" size="xl">
    <template #header>
      <AppText variant="title"> Edit user: {{ userDetail.data.value?.email }} </AppText>
    </template>
    <template #body>
      <form class="block mx-auto" @submit.prevent="onSubmit">
        <div>
          <div class="mt-4">
            <ValidationInput
              name="password"
              placeholder="Password"
              type="password"
              label="Password"
              :disabled="updateUser.isLoading.value"
            />
          </div>
          <div class="mt-4">
            <ValidationSelect name="role" label="Role" :disabled="updateUser.isLoading.value">
              <option value="USER">USER</option>
              <option value="COMPANY">COMPANY</option>
              <option value="ADMIN">ADMIN</option>
            </ValidationSelect>
          </div>
          <div class="mt-4">
            <ValidationCheckbox name="isDisabled" :disabled="updateUser.isLoading.value">
              <template v-slot:label> Is disabled </template>
            </ValidationCheckbox>
          </div>
          <div class="text-center mt-4">
            <Button color="default" :disabled="updateUser.isLoading.value">Edit</Button>
          </div>
        </div>
      </form>
    </template>
  </Modal>
</template>
