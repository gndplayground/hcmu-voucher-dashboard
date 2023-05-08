import type { AxiosError } from 'axios'
import { useToast } from 'flowbite-vue'

export function useAppToast() {
  const toast = useToast()

  return {
    success: (text: string) => {
      toast.add({
        type: 'success',
        text,
        time: 5000
      })
    },
    error: (error: any) => {
      if (typeof error !== 'string' && error.isAxiosError) {
        const e = error as AxiosError<any>
        if (e.response?.data?.message) {
          toast.add({
            type: 'danger',
            text: e.response.data.message,
            time: 5000
          })
          return
        }
      }
      toast.add({
        type: 'danger',
        text: `${(error as any)?.message || error}`,
        time: 5000
      })
    }
  }
}
