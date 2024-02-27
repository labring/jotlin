import axios from 'axios'

import type { InternalAxiosRequestConfig } from 'axios'
import { useSession } from '../hooks/use-session'

// 拦截 request，添加 token 凭据
axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.headers?.token) {
    const { token } = useSession()
    if (token) config.headers = Object.assign({}, config.headers, { token })
  }
  return config
})

export default axios
