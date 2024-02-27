import axios from 'axios'

export const githubLogin = (code: string) => {
  return axios.get(`/api/github-auth?code=${code}`)
}
