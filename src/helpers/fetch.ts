import axios from 'axios'
import { appConfig } from '@/config'
import type { User } from '@/types'
import { useAuthStore } from '@/stores/auth'

let isRefreshing = false

let queue: QueueItem[] = []

function handleQueue(err: Error | null, token = '') {
  queue.forEach((prom) => {
    if (err) {
      prom.reject(err)
    } else {
      prom.resolve(token)
    }
  })
  queue = []
}

interface QueueItem {
  resolve: (value: string | PromiseLike<string>) => void
  reject: (reason?: any) => void
}

export const axiosInstance = axios.create({
  withCredentials: true
})

const refreshTokenUrl = `${appConfig.apiHost}/auth/refresh-token`
const logoutUrl = `${appConfig.apiHost}/auth/logout`

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const originalRequest = error.config

    const authStore = useAuthStore()

    if (originalRequest.url === refreshTokenUrl || originalRequest.url === logoutUrl) {
      authStore.user = undefined
      return Promise.reject(error)
    }

    if (error.response.status === 403) {
      authStore.user = undefined
      return Promise.reject(error)
    }

    if (error.response.status !== 401) {
      authStore.user = undefined
      return Promise.reject(error)
    }

    // There are no request trying to get the refresh token
    if (!isRefreshing && !originalRequest._retry) {
      originalRequest._retry = true

      isRefreshing = true

      return new Promise((resolve, reject) => {
        axiosInstance
          .post<{ token: string; user: User }>(refreshTokenUrl)
          .then((res) => {
            authStore.user = res.data.user

            resolve(axiosInstance(originalRequest))

            handleQueue(null, res.data.token)
          })
          .catch((err) => {
            handleQueue(err)
            reject(err)
          })
          .then(() => {
            isRefreshing = false
          })
      })
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        queue.push({ resolve, reject })
      })
        .then(() => {
          return axios(originalRequest)
        })
        .catch((err) => {
          return err
        })
    }
    return Promise.reject(error)
  }
)
