import axios from '@/lib/axios'

export const githubLogin = (code: string) => {
  return axios.get(`/api/github-auth?code=${code}`)
}

export const getUserInfo = () => {
  return axios.get('/api/user/get-info')
}
