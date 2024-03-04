'use client'

import { archive, create } from '@/api/document'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/hooks/use-session'
import { cn } from '@/lib/utils'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ItemProps {
  id?: string
  documentIcon?: string
  active?: boolean
  expanded?: boolean
  isSearch?: boolean
  level?: number
  onExpand?: () => void
  label: string
  onClick?: () => void
  icon: LucideIcon
}

const Item = ({
  id,
  documentIcon,
  active,
  expanded,
  isSearch,
  label,
  onExpand,
  level = 0,
  onClick,
  icon: Icon,
}: ItemProps) => {
  const { user } = useSession()
  const router = useRouter()

  const onArchive = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation()
    if (!id) return
    try {
      toast.loading('Moving to trash...')
      const response = await archive(id).then(() => router.push('/documents'))
      toast.success('Note moved to trash!')
    } catch (error) {
      toast.error('Failed to archive note.')
    }
  }

  //切换展开状态
  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation() //阻止事件冒泡，因为父元素上绑定点击打开文档详情的函数，不阻止会进入详情页
    onExpand?.()
  }

  const onCreate = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation()

    if (!id) return

    try {
      const response = await create('Untitled', id)
      const documentId = response.data
      if (!expanded) {
        onExpand?.()
      }
      router.push(`/documents/${documentId}`)
    } catch (error) {
      toast.error('Failed to create a new note.')
    }
  }

  const ChevronIcon = expanded ? ChevronDown : ChevronRight

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : '12px' }}
      className={cn(
        'group flex min-h-[27px] w-full items-center py-1 pr-3 text-sm font-medium text-muted-foreground hover:bg-primary/5',
        active && 'bg-primary/5 text-primary'
      )}>
      {/* 展开子文档三角符 */}
      {!!id && (
        <div
          role="button"
          className="mr-1 h-full rounded-sm  hover:bg-neutral-300
          dark:hover:bg-neutral-600"
          onClick={handleExpand}>
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {/* 文档的自定义emoji Icon，如果有就渲染，没有就渲染默认的icon */}
      {documentIcon ? (
        <div className="mr-2 shrink-0 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="mr-2 h-[18px] w-[18px] shrink-0 text-muted-foreground" />
      )}
      {/* 文档名字 */}
      <span className="truncate">{label}</span>
      {/* 当是搜索时呈现 */}
      {isSearch && (
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">Control</span>K
        </kbd>
      )}
      {/* 右侧功能区 */}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          {/*下拉菜单，三个小点 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                role="button"
                className="ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
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
          <div
            role="button"
            onClick={onCreate}
            className="ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : '12px',
      }}
      className="flex gap-x-2 py-[3px]">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  )
}
export default Item
