'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'

import { useAuth } from '@/stores/use-auth'
import { useSession } from '@/hooks/use-session'

const Heading = () => {
  const authModal = useAuth()
  const { isAuthenticated, signIn, isLoading } = useSession()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const router = useRouter()

  // 获取code向laf发起请求
  useEffect(() => {
    if (code && !isAuthenticated && !isLoading) {
      signIn(code)
      router.push('/')
    }
  }, [code, signIn, router, isAuthenticated, isLoading])

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl">
        Your Ideas,Documents,&Plans. Unified. With LLM.
      </h1>
      <h3 className="text-base font-medium sm:text-xl md:text-2xl">
        Jotlin is the workspace for you to unlock the potential
        <br />
        of LLM to writing, planning, and collaborating.
      </h3>
      {/* 加载动画 */}
      {isLoading && (
        <div className="flex w-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {/* 登录之后显示 */}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href="/documents">
            Enter Jotlin
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}
      {/* 未登录时的显示框 */}
      {!isAuthenticated && !isLoading && (
        <Button onClick={authModal.onOpen}>
          Get Jotlin free
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export default Heading
