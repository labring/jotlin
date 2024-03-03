'use client'

import { getTrash, remove, restore, Doc } from '@/api/document'
import ConfirmModal from '@/components/modals/confirm-modal'
import { Spinner } from '@/components/spinner'
import { Input } from '@/components/ui/input'
import { Search, Trash, Undo } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const TrashBox = () => {
  const router = useRouter()
  const params = useParams()
  const [documents, setDocuments] = useState<Doc[] | undefined>(undefined)

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await getTrash()
        setDocuments(response.data.data)
      } catch (error) {
        console.error('Error fetching Trash:', error)
      }
    }

    fetchDocument()
  }, [params.documentId])

  const [search, setSearch] = useState('')
  const filteredDocuments = documents?.filter((document) => {
    return document?.title?.toLowerCase().includes(search.toLowerCase())
  })

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }

  const onRestore = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: string
  ) => {
    event.stopPropagation()
    try {
      toast.loading('Restoring note...')
      await restore(documentId)
      toast.success('Note restored!')
    } catch {
      toast.error('Failed to restore note.')
    }
  }

  const onRemove = async (documentId: string) => {
    try {
      toast.loading('Deleting note...')
      await remove(documentId)
      toast.success('Note deleted!')
    } catch {
      toast.error('Failed to delete note.')
    }

    if (params.documentId === documentId) {
      router.push('/documents')
    }
  }

  if (documents === undefined) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    )
  }
  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 bg-secondary px-2 focus-visible:ring-transparent"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden pb-2 text-center text-xs text-muted-foreground last:block">
          No documents found.
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document._id}
            role="button"
            onClick={() => onClick(document._id)}
            className="flex w-full items-center justify-between rounded-sm text-sm text-primary hover:bg-primary/5">
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <div
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-300"
                role="button"
                onClick={(e) => onRestore(e, document._id)}>
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-300">
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrashBox
