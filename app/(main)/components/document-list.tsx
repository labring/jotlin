'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import Item from './item'
import { cn } from '@/lib/utils'
import { FileIcon } from 'lucide-react'
import { Doc } from '@/api/document'
import axios from '@/lib/axios'
import useSWR from 'swr'

interface DocumentListProps {
  parentDocumentId?: string
  level?: number
  data?: Doc[]
}

const DocumentList = ({ parentDocumentId, level = 0 }: DocumentListProps) => {
  const params = useParams()
  const router = useRouter()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // function: 切换展开状态
  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }))
  }

  parentDocumentId = parentDocumentId ? parentDocumentId : ''

  const fetcher = (url: string) => axios.get(url).then((res) => res.data.data)
  const { data: documents } = useSWR(
    `/api/document/sidebar?parentDocument=${parentDocumentId}`,
    fetcher,
    { refreshInterval: 1000 }
  )

  // function: 点击重定向到文档详情页
  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    )
  }

  return (
    <>
      {/* 展开时渲染，level=0时隐藏 */}
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
        className={cn(
          'hidden text-sm font-medium text-muted-foreground/80',
          expanded && 'last:block', //展开时将父元素的最后一个子元素设置为block，如果没有文档的话，就只有这个p元素，就会被设置为block，然后显示
          level === 0 && 'hidden'
        )}>
        No pages inside
      </p>
      {documents.map((document: Doc) => (
        <div key={document._id}>
          <Item
            id={document._id}
            onClick={() => onRedirect(document._id)}
            label={document.title as string}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            level={level}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
          />
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  )
}

export default DocumentList
