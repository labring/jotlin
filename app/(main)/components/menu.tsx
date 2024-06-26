'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, Trash } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { archive } from '@/api/document'
import { useSession } from '@/hooks/use-session'

interface MenuProps {
  documentId: string
}

const Menu = ({ documentId }: MenuProps) => {
  const router = useRouter()
  const { user } = useSession()

  const onArchive = async () => {
    try {
      toast.loading('Moving to trash...')
      const response = archive(documentId)
      toast.success('Note moved to trash.')
      router.push('/documents')
    } catch (error) {
      toast.error('Failed to archive note.')
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount>
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="p-2 text-xs text-muted-foreground">
          Last edited by:{user?.username}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-6 w-10" />
}

export default Menu
