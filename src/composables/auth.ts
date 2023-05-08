import { useMutation } from '@tanstack/vue-query'
import { onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { AxiosError } from 'axios'
import { useToast } from 'flowbite-vue'
import { appConfig } from '@/config'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types'
import { axiosInstance } from '@/helpers/fetch'

export function useAuthWatcher() {
  const authStore = useAuthStore()
  const router = useRouter()

  watch(
    () => {
      return {
        user: authStore.user,
        isValidating: authStore.isValidating,
        route: router.currentRoute.value
      }
    },
    ({ user, isValidating, route }) => {
      if (isValidating) return
      if (!user) {
        router.push('/login')
      } else if (route.path === '/login') {
        router.push('/admin')
      }
    },
    { immediate: true }
  )

  onBeforeMount(() => {
    try {
      const saved = localStorage.getItem('user')
      if (!saved) return
      const user = JSON.parse(saved || '')
      if (user) {
        authStore.user = user
      }
    } catch (e) {
      console.log('Error parsing user from localStorage')
    } finally {
      authStore.isValidating = false
    }
  })
}

export function useLogin() {
  const authStore = useAuthStore()

  const toast = useToast()

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const result = await axiosInstance.post<{
        data: {
          token: string
          user: User
        }
      }>(`${appConfig.apiHost}/auth/login`, data)
      authStore.user = result.data.data.user
      localStorage.setItem('user', JSON.stringify(result.data.data.user))
    },
    onError(error) {
      if ((error as any).isAxiosError) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          toast.add({
            type: 'danger',
            text: 'Invalid credentials',
            time: 5000
          })
          return
        }
      }
      toast.add({
        type: 'danger',
        text: `Lỗi ${(error as any)?.message || error}`,
        time: 5000
      })
    }
  })
}

export function useLogout() {
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      await axiosInstance.post<{
        data: {
          token: string
          user: User
        }
      }>(`${appConfig.apiHost}/auth/logout`, data)
    },
    onSettled: () => {
      authStore.user = undefined
      localStorage.removeItem('user')
    }
  })
}
