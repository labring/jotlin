import axios from 'axios'

import type { InternalAxiosRequestConfig } from 'axios'

// 拦截 request，添加 token 凭据
axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.headers?.Authorization) {
    const token = localStorage.getItem('token')
    if (token)
      config.headers = Object.assign({}, config.headers, {
        Authorization: `Bearer ${token}`,
      })
  }
  return config
})

// 拦截response，将response转换为response.data
axios.interceptors.response.use((response) => {
  response = response.data
  return response
})

export default axios
