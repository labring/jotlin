'use client'

import { useSearch } from '@/stores/use-search'
import { File } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/use-session'
import { useState, useEffect } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import { Doc } from '@/api/document'
import axios from '@/lib/axios'
import useSWR from 'swr'

export const SearchCommand = () => {
  const { user } = useSession()
  const router = useRouter()

  const fetcher = (url: string) => axios.get(url).then((res) => res.data.data)
  const { data: documents } = useSWR('/api/document/get-search', fetcher, {
    refreshInterval: 1000,
  })

  const [isMounted, setIsMounted] = useState(false)

  const toggle = useSearch((store) => store.toggle)
  const isOpen = useSearch((store) => store.isOpen)
  const onClose = useSearch((store) => store.onClose)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // watch keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [toggle])

  // function:选定之后跳转相应document页面并关闭command栏
  const onSelect = (id: string) => {
    router.push(`/documents/${id}`)
    onClose()
  }

  // 完全客户端化，阻止服务端渲染
  if (!isMounted) {
    return null
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.username}'s jotlin...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((document: Doc) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              title={document.title}
              onSelect={onSelect}>
              {document.icon ? (
                <p className="mr-2 text-[18px]">{document.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
