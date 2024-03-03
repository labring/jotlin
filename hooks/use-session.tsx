'use client'

import { getUserInfo, githubLogin } from '@/api/user'
import { useLocalStorage } from 'usehooks-ts'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'

interface User {
  _id: string
  username: string
  imageUrl: string
  emailAddress: string
  created_at: string
}

export const useSession = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setAuthentication] = useLocalStorage(
    'isAuthenticated',
    false,
    {
      initializeWithValue: false,
    }
  )
  // store json default,we should use serializer let it become normal string,otherwise will add double quotation marks
  const [token, setToken] = useLocalStorage('token', '', {
    serializer: (value) => value,
    deserializer: (value) => value,
    initializeWithValue: false,
  })
  const [user, setUser] = useLocalStorage<User | undefined>('user', undefined)

  //Keep loading until the state is determined(because useLocalStorage hook)
  useEffect(() => {
    setIsLoading(false)
  }, [])

  const signIn = async (code: string) => {
    setIsLoading(true)
    const response = await githubLogin(code)

    if (response.data.data.error) {
      toast.error(response.data.data.error)
    }
    if (response.data.data.access_token) {
      setAuthentication(true)
      setToken(response.data.data.access_token)
      toast.success('Login successfully')

      // get user info and store to localStorage
      const userinfoRes = await getUserInfo()
      setUser(userinfoRes.data.data)
    }

    setIsLoading(false)
  }

  const signOut = () => {
    setAuthentication(false)
    setToken('')
    redirect('/')
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
