'use client'

import { Spinner } from '../../components/spinner'
import { redirect } from 'next/navigation'
import Navigation from './components/navigation'
import { SearchCommand } from '@/components/search-command'
import { useSession } from '@/hooks/use-session'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useSession()

  // 加载动画
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }
  // 没有登录则跳转到marketing页面
  if (!isAuthenticated) {
    return redirect('/')
  }
  return (
    <div className="flex h-full dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="h-full flex-1 overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}

export default MainLayout
