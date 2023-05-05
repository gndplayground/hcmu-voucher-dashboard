import { defineStore } from 'pinia'
import type { User } from '@/types'

export interface AuthState {
  user?: User
  isValidating: boolean
}

export const useAuthStore = defineStore('auth', {
  state: () =>
    ({
      user: undefined,
      isValidating: true
    } as AuthState)
})
