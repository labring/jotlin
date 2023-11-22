import { cn } from '@/lib/utils'
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ElementRef, useRef, useState, useEffect } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import UserItem from './user-item'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Item from './item'
import { toast } from 'sonner'
import DocumentList from './document-list'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import TrashBox from './trash-box'
import { useSearch } from '@/hooks/use-search'

const Navigation = () => {
  const search = useSearch()
  const pathname = usePathname()
  const isMobile = useMediaQuery('(max-width:768px)')
  const create = useMutation(api.documents.create)

  const isResizingRef = useRef(false)
  const sidebarRef = useRef<ElementRef<'aside'>>(null)
  const navbarRef = useRef<ElementRef<'div'>>(null)
  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (isMobile) {
      collapse()
    } else {
      resetWidth()
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile) {
      collapse()
    }
  }, [pathname, isMobile])
  // 鼠标按下添加事件监听器
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault()
    event.stopPropagation()

    isResizingRef.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // 鼠标移动->改变侧边栏宽度和主栏样式
  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return
    let newWidth = event.clientX
    if (newWidth < 240) newWidth = 240
    if (newWidth > 480) newWidth = 480

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
      navbarRef.current.style.setProperty('left', `${newWidth}px`)
      navbarRef.current.style.setProperty('width', `calc(100%-${newWidth}px)`)
    }
  }

  // 鼠标抬起则移除事件监听器
  const handleMouseUp = () => {
    isResizingRef.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  // function：重置侧边栏宽度
  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false)
      setIsResetting(true)

      sidebarRef.current.style.width = isMobile ? '100%' : '240px'
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : 'calc(100%-240px)'
      )
      navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px')

      // 这里是为了实现重置过程的一个小动画，300ms的动画当isResetting为true时，动画结束则设置isResetting为false
      setTimeout(() => {
        setIsResetting(false)
      }, 300)
    }
  }

  // function:折叠按钮
  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true)
      setIsResetting(true)

      sidebarRef.current.style.width = '0'
      navbarRef.current.style.setProperty('width', '100%')
      navbarRef.current.style.setProperty('left', '0')
      setTimeout(() => setIsResetting(false), 300)
    }
  }

  // function:创建一个新文件
  const handleCreate = () => {
    const promise = create({ title: 'Untitled' })
    toast.promise(promise, {
      loading: 'Create a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note',
    })
  }
  return (
    <>
      {/* 左侧边栏 */}
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'w-0'
        )}>
        <div
          role="button"
          onClick={collapse}
          className={cn(
            'h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition',
            isMobile && 'opacity-100'
          )}>
          <ChevronsLeft className="h-6 w-6" />
        </div>
        {/* 用户信息+操作栏 */}
        <div>
          <UserItem />
          <Item onClick={search.onOpen} label="Search" icon={Search} isSearch />
          <Item onClick={() => {}} label="Settings" icon={Settings} />
          <Item onClick={handleCreate} label="New Page" icon={PlusCircle} />
        </div>
        {/* 文档列表 */}
        <div className="mt-4">
          <DocumentList />
          <Item onClick={handleCreate} icon={Plus} label="Add a page" />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? 'bottom' : 'right'}>
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        {/* 侧栏和主栏的分界线 */}
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      {/* 主栏的导航部分 */}
      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'left-0 w-full'
        )}>
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              onClick={resetWidth}
              role="button"
              className="h-6 w-6 text-muted-foreground"
            />
          )}
        </nav>
      </div>
    </>
  )
}

export default Navigation
