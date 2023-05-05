<script setup lang="ts">
import { Button } from 'flowbite-vue'
import { Form } from 'vee-validate'
import * as yup from 'yup'

import { useLogin } from '@/composables/auth'
import ValidationInput from '@/components/ValidationInput.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6)
})

const login = useLogin()

function handleLogin(values: Record<string, any>) {
  login.mutate({
    password: values.password,
    email: values.email
  })
}
</script>

<template>
  <div class="h-screen">
    <Form class="max-w-sm block mx-auto" @submit="handleLogin" :validation-schema="schema">
      {{ authStore.user?.email }}
      <div>
        <ValidationInput
          name="email"
          placeholder="Email"
          label="Email"
          :disabled="login.isLoading.value"
        />
        <div class="mt-4">
          <ValidationInput
            name="password"
            placeholder="Mật khẩu"
            type="password"
            label="Mật khẩu"
            :disabled="login.isLoading.value"
          />
        </div>
        <div class="text-center mt-4">
          <Button color="default" :disabled="login.isLoading.value">Đăng nhập</Button>
        </div>
      </div>
    </Form>
  </div>
</template>
