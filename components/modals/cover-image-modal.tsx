'use client'

import { useCoverImage } from '@/stores/use-cover-image'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'
import { useState } from 'react'
import { useEdgeStore } from '@/lib/edgestore'
import { useParams } from 'next/navigation'
import { SingleImageDropzone } from '../single-image-dropzone'
import { update } from '@/api/document'

const CoverImageModal = () => {
  const params = useParams()
  const coverImage = useCoverImage()
  const { edgestore } = useEdgeStore()
  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onClose = () => {
    setFile(undefined)
    setIsSubmitting(false)
    coverImage.onClose()
  }
  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true)
      setFile(file)

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url,
        },
      })
      await update({
        _id: params.documentId as string,
        coverImage: res.url,
      })
    }
    onClose()
  }

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CoverImageModal
