'use client'

import Logo from './logo'
import { cn } from '@/lib/utils'
import { useScrollTop } from '@/hooks/use-scroll-top'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { Spinner } from '@/components/spinner'
import Link from 'next/link'
import { useAuth } from '@/stores/use-auth'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useSession } from '@/hooks/use-session'

const Navbar = () => {
  const { isAuthenticated, isLoading, user } = useSession()
  const scrolled = useScrollTop()
  const authModal = useAuth()
  return (
    <div
      className={cn(
        'fixed top-0 z-50 flex w-full items-center bg-background p-6 dark:bg-[#1F1F1F]',
        scrolled && 'border-b shadow-sm'
      )}>
      <Logo />
      <div className="flex w-full items-center justify-between gap-x-2 md:ml-auto md:justify-end">
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" onClick={authModal.onOpen}>
              Log in
            </Button>
            <Button size="sm" onClick={authModal.onOpen}>
              Get Jotlin free
            </Button>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">Enter Jotlin</Link>
            </Button>
            <Avatar>
              <AvatarImage
                src={user?.imageUrl}
                alt={user?.username}></AvatarImage>
            </Avatar>
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  )
}

export default Navbar
