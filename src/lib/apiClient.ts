import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://api.escuelajs.co/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[] }>) => {
    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        localStorage.removeItem("access_token")
        window.dispatchEvent(new Event("auth:unauthorized"))
      }

      const errorMessage = Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message || `Request failed with status ${status}`

      return Promise.reject(new Error(errorMessage))
    }

    if (error.request) {
      return Promise.reject(
        new Error("Network error: No response received from server")
      )
    }

    return Promise.reject(error)
  }
)

export default apiClient
