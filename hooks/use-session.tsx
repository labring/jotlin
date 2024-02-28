'use client'

import { getUserInfo, githubLogin } from '@/api/user'
import { useLocalStorage } from 'usehooks-ts'
import { toast } from 'sonner'
import { useState } from 'react'

interface User {
  _id: string
  username: string
  imageUrl: string
  emailAddress: string
  created_at: string
}

export const useSession = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setAuthentication] = useLocalStorage(
    'isAuthenticated',
    false
  )
  // store json default,we should let it become normal string,otherwise will add double quotation marks
  const [token, setToken] = useLocalStorage('token', '', {
    serializer: (value) => value,
    deserializer: (value) => value,
  })
  const [user, setUser] = useLocalStorage<User | undefined>('user', undefined)

  const signIn = async (code: string) => {
    setIsLoading(true)
    const response = await githubLogin(code)

    if (response.data.error) {
      toast.error(response.data.error)
    }
    if (response.data.access_token) {
      setAuthentication(true)
      setToken(response.data.access_token)
      toast.success('Login successfully')

      // get user info and store to localStorage
      const userinfoRes = await getUserInfo()
      setUser(userinfoRes.data.data)
    }

    setIsLoading(false)
  }

  const signOut = () => {
    setIsLoading(true)
    setAuthentication(false)
    setToken('')
    setIsLoading(false)
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    token,
    signIn,
    signOut,
  }
}
