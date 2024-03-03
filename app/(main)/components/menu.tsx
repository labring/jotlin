'use client'

import { useUser } from '@clerk/clerk-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Trash } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { archive } from '@/api/document'

interface MenuProps {
  documentId: string
}

const Menu = ({ documentId }: MenuProps) => {
  const router = useRouter()
  const { user } = useUser()

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
          Last edited by:{user?.fullName}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-6 w-10" />
}

export default Menu
