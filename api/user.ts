import axios from '@/lib/axios'

export interface User {
  _id: string
  username: string
  imageUrl: string
  emailAddress: string
  created_at: string
}

export const githubLogin = (code: string) => {
  return axios.get(`/api/github-auth?code=${code}`)
}

export const getUserInfo = () => {
  return axios.get('/api/user/get-info')
}

export const getUserInfoByEmail = (email: string) => {
  return axios.get(`/api/user/get-info-by-email?email=${email}`)
}
