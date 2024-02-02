'use client'

import axios from 'axios'
import { Button } from '@/components/ui/button'
import Input from '@/components/inputs/input'
import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import AuthSocialButton from './AuthSocialButton'
import { Github } from 'lucide-react'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Variant = 'LOGIN' | 'REGISTER'

const AuthForm = () => {
  const session = useSession()
  const router = useRouter()
  const [variant, setVariant] = useState<Variant>('LOGIN')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users')
    }
  }, [session?.status, router])

  // function：切换登录状态
  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER')
    } else {
      setVariant('LOGIN')
    }
  }, [variant])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  // function: 表单提交逻辑
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    // Register Logic
    if (variant === 'REGISTER') {
      axios
        .post('/api/register', data)
        .then(() => signIn('credentials', data))
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => setIsLoading(false))
    }
    // Login Logic
    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials')
          }
          if (callback?.ok && !callback?.error) {
            toast.success('Logged in!')
            router.push('/users')
          }
        })
        .finally(() => setIsLoading(false))
    }
  }

  // function: 社交账号登录
  const socialAction = (action: string) => {
    setIsLoading(true)
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid Credentials')
        }
        if (callback?.ok && !callback?.error) {
          toast.success('Logged in!')
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        {/* Auth表单 */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              label="Name"
              required
              register={register}
              id="name"
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            label="Email address"
            register={register}
            required
            id="email"
            type="email"
            errors={errors}
            disabled={isLoading}
          />
          <Input
            label="Password"
            required
            register={register}
            id="password"
            type="password"
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} type="submit" className="w-full">
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>
        {/* 表单下面 */}
        <div className="mt-6">
          {/* 分割线 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 ">or continue with</span>
            </div>
          </div>
          {/* 社交登录按钮 */}
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={Github}
              onClick={() => socialAction('github')}
            />
          </div>
        </div>
        {/* 切换到另一个表单区(注册<->登录) */}
        <div
          className="
            mt-6
            flex
            justify-center
            gap-2
            px-2
            text-sm
            text-gray-500
        ">
          <div>
            {variant === 'LOGIN'
              ? 'New to Messenger?'
              : 'Already have an account?'}
          </div>
          <div onClick={toggleVariant} className="cursor-pointer underline">
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  )
}
export default AuthForm
