import { useMutation, useQuery } from '@tanstack/vue-query'
import { type Ref, unref } from 'vue'
import queryString from 'query-string'
import { useAppToast } from './toast'
import { appConfig } from '@/config'
import { axiosInstance } from '@/helpers/fetch'
import type { Company, CompanyCreate, CompanyUpdate } from '@/types'

export function useGetCompanies(options: {
  page?: Ref<number> | number
  limit?: number | Ref<number>
  search?: Ref<string> | string
  isDeleted?: Ref<boolean> | boolean
}) {
  return useQuery(
    ['users', 'list', options.page, options.limit, options.search, options.isDeleted],
    async () => {
      const query = queryString.stringify({
        page: unref(options.page),
        limit: unref(options.limit) || 10,
        search: unref(options.search),
        isDeleted: unref(options.isDeleted)
      })

      const result = await axiosInstance.get<{
        data: Company[]
        meta: {
          hasNextPage: boolean
        }
      }>(`${appConfig.apiHost}/admin/companies?${query}`)
      return result.data
    },
    {
      refetchInterval: 30000
    }
  )
}

export function useCreateCompany(
  options: {
    onSuccess?: () => void
  } = {}
) {
  const toast = useAppToast()
  return useMutation({
    mutationFn: async (data: CompanyCreate) => {
      await axiosInstance.post(`${appConfig.apiHost}/admin/companies`, data)
    },
    onSuccess: () => {
      toast.success('Company created')
      options.onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(error)
    }
  })
}

export function useUpdateCompany(
  options: {
    onSuccess?: () => void
  } = {}
) {
  const toast = useAppToast()
  return useMutation({
    mutationFn: async (data: { data: CompanyUpdate; id: number }) => {
      await axiosInstance.patch(`${appConfig.apiHost}/admin/companies/${data.id}`, data.data)
    },
    onSuccess: () => {
      toast.success('Company updated')
      options.onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(error)
    }
  })
}

export function useGetCompany(options: { id?: Ref<number> | number }) {
  return useQuery(
    ['company', options.id],
    async () => {
      const id = unref(options.id)
      const result = await axiosInstance.get<{ data: Company }>(
        `${appConfig.apiHost}/companies/${id}`
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
