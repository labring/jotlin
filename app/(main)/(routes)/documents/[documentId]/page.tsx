'use client'

import { Doc, getById, update } from '@/api/document'
import Cover from '@/components/cover'
import Toolbar from '@/components/toolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { useDocument } from '@/stores/use-document'
import { useEffect, useState } from 'react'
import { debounce } from 'lodash'

import { EditorWrapper } from '@/components/editor-wrapper'

interface DocumentIdPageProps {
  params: {
    documentId: string
  }
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const { onSetDocument } = useDocument()
  const [document, setDocument] = useState<Doc>()

  const onChange = async (content: string) => {
    await update({
      _id: params.documentId,
      content,
    })
  }

  const debounceOnChange = debounce(onChange, 1000)

  useEffect(() => {
    const fetchDocument = async () => {
      const response = await getById(params.documentId)
      const document = response.data
      console.log('fetchDocument', document)
      onSetDocument(document)
      setDocument(document)
    }

    fetchDocument()
  }, [])

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
        <EditorWrapper
          onChange={debounceOnChange}
          documentId={params.documentId}
          initialContent={document.content}
          isShared={document.collaborators!.length > 1}
        />
      </div>
    </div>
  )
}

export default DocumentIdPage
