import useSWR from 'swr'
import axios from '@/lib/axios'
import { User } from '@/api/user'

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export const useUserInfo = (email: string) => {
  const { data, isLoading } = useSWR<User>(
    `/api/user/get-info-by-email?email=${email}`,
    fetcher
  )

  return {
    userInfo: data,
    isLoading,
  }
}
