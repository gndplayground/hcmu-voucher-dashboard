<script setup lang="ts">
import { Modal } from 'flowbite-vue'
import { Form } from 'vee-validate'
import * as yup from 'yup'

import ValidationInput from '@/components/ValidationInput.vue'
import Button from '@/components/Button.vue'
import AppText from '@/components/AppText'
import ValidationSelect from '@/components/ValidationSelect.vue'
import { useCreateUser } from '@/composables/user'

const emit = defineEmits(['success'])

const createUser = useCreateUser({
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

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
  role: yup.string().required().oneOf(['ADMIN', 'USER', 'COMPANY'])
})

function handleAdd(values: Record<string, any>) {
  createUser.mutate({
    email: values.email,
    password: values.password,
    role: values.role
  })
}
</script>

<template>
  <Modal @close="props.onClose">
    <template #header>
      <AppText variant="title"> Thêm người dùng </AppText>
    </template>
    <template #body>
      <Form class="block mx-auto" :validation-schema="schema" @submit="handleAdd">
        <div>
          <ValidationInput
            name="email"
            placeholder="Email"
            label="Email"
            :disabled="createUser.isLoading.value"
          />
          <div class="mt-4">
            <ValidationInput
              name="password"
              placeholder="Mật khẩu"
              type="password"
              label="Mật khẩu"
              :disabled="createUser.isLoading.value"
            />
          </div>
          <div class="mt-4">
            <ValidationSelect name="role" label="Quyền hạn" :disabled="createUser.isLoading.value">
              <option value="USER">USER</option>
              <option value="COMPANY">COMPANY</option>
              <option value="ADMIN">ADMIN</option>
            </ValidationSelect>
          </div>
          <div class="text-center mt-4">
            <Button color="default" :disabled="createUser.isLoading.value">Thêm</Button>
          </div>
        </div>
      </Form>
    </template>
  </Modal>
</template>
