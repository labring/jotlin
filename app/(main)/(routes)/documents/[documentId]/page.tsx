'use client'

import { getById, update } from '@/api/document'
import Cover from '@/components/cover'
import Toolbar from '@/components/toolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { useDocumentById } from '@/hooks/use-document-by-id'
import { useDocument } from '@/stores/use-document'
import dynamic from 'next/dynamic'
import { useEffect, useMemo } from 'react'

interface DocumentIdPageProps {
  params: {
    documentId: string
  }
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import('@/components/editor'), { ssr: false }),
    []
  )
  const { document, onSetDocument } = useDocument()

  useEffect(() => {
    const fetchDocument = async () => {
      const response = await getById(params.documentId)
      const document = response.data
      onSetDocument(document)
    }
    fetchDocument()
  }, [onSetDocument, params.documentId])

  const onChange = async (content: string) => {
    const response = await update({
      _id: params.documentId,
      content,
    })
    const document = response.data
    onSetDocument(document)
  }
  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    )
  }
  if (document === null) {
    return <div>Not found</div>
  }
  // FIXME: data will disappear when we navigate to another page.
  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar initialData={document} />
        <Editor
          onChange={onChange}
          initialContent={document.content}
          documentId={params.documentId}
        />
      </div>
    </div>
  )
}

export default DocumentIdPage
