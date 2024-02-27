'use client'

import { githubLogin } from '@/api/user'
import { useLocalStorage } from 'usehooks-ts'
import { toast } from 'sonner'

export const useSession = () => {
  const [status, setStatus] = useLocalStorage<string | null>('status', null)
  const [token, setToken] = useLocalStorage<string | null>('token', null)

  const signIn = async (code: string) => {
    const response = await githubLogin(code)
    console.log(response)
    if (response.data.error) {
      toast.error(response.data.error)
      return null
    }
    setStatus('authenticated')
    setToken(response.data.access_token)
    toast.success('Login successfully')
  }

  const signOut = () => {
    setStatus('unauthenticated')
    setToken(null)
  }

  return {
    status,
    token,
    signIn,
    signOut,
  }
}
