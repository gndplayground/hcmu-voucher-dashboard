import { useMutation, useQuery } from '@tanstack/vue-query'
import { unref, type Ref } from 'vue'
import queryString from 'query-string'
import { useAppToast } from './toast'
import { axiosInstance } from '@/helpers/fetch'
import { appConfig } from '@/config'
import type { Role, User } from '@/types'

export function useGetUser(options: { id?: number | Ref<number> }) {
  return useQuery(
    ['users', options.id],
    async () => {
      const id = unref(options.id)
      const result = await axiosInstance.get<{ data: User }>(
        `${appConfig.apiHost}/admin/users/${id}`
      )
      return result.data.data
    },
    {
      initialData: undefined,
      refetchInterval: 30000,
      enabled: options.id !== undefined
    }
  )
}

export function useGetListUsers(options: {
  page?: Ref<number> | number
  limit?: number | Ref<number>
  search?: Ref<string> | string
}) {
  return useQuery(
    ['users', 'list', options.page, options.limit, options.search],
    async () => {
      const query = queryString.stringify({
        page: unref(options.page),
        limit: unref(options.limit) || 10,
        search: unref(options.search)
      })

      const result = await axiosInstance.get<{
        data: User[]
        meta: {
          hasNextPage: boolean
        }
      }>(`${appConfig.apiHost}/admin/users?${query}`)
      return result.data
    },
    {
      refetchInterval: 30000
    }
  )
}

export function useCreateUser(
  options: {
    onSuccess?: () => void
  } = {}
) {
  const toast = useAppToast()
  return useMutation({
    mutationFn: async (data: { email: string; password: string; role: Role }) => {
      await axiosInstance.post(`${appConfig.apiHost}/admin/users`, data)
    },
    onSuccess: () => {
      toast.success('User created')
      options.onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(error)
    }
  })
}

export function useUpdateUser(
  options: {
    onSuccess?: () => void
  } = {}
) {
  const toast = useAppToast()
  return useMutation({
    mutationFn: async (data: {
      password?: string
      role?: Role
      id: number
      isDisabled?: boolean
      profile?: {
        companyId?: number
      }
    }) => {
      await axiosInstance.patch(`${appConfig.apiHost}/admin/users/${data.id}`, data)
    },
    onSuccess: () => {
      toast.success('User updated')
      options.onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(error)
    }
  })
}
