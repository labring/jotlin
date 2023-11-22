'use client'

import { useConvexAuth } from 'convex/react'
import { Spinner } from '../../components/spinner'
import { redirect } from 'next/navigation'
import Navigation from './_components/navigation'
import { SearchCommand } from '@/components/search-command'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth()
  // 加载动画
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }
  // 没有登录则跳转到marketing页面
  if (!isAuthenticated) {
    return redirect('/')
  }
  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}

export default MainLayout
