import { useMutation, useQuery } from '@tanstack/vue-query'
import { type Ref, unref } from 'vue'
import queryString from 'query-string'
import { useAppToast } from './toast'
import { appConfig } from '@/config'
import { axiosInstance } from '@/helpers/fetch'
import type { Company, CompanyCreate, CompanyUpdate } from '@/types'

export interface Stats {
  campaigns: {
    active: number
    upcoming: number
  }
  users: {
    user: number
    company: number
  }
  company: number
  tickets: number
}

export function useGetStats() {
  return useQuery(
    ['stats'],
    async () => {
      const result = await axiosInstance.get<{ data: Stats }>(`${appConfig.apiHost}/admin/stats/`)
      return result.data.data
    },
    {
      initialData: undefined,
      refetchInterval: 30000
    }
  )
}
