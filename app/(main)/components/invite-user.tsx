'use client'

import { mutate } from 'swr'
import { toast } from 'sonner'
import { useState } from 'react'

import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'

import { Doc } from '@/api/document'
import { removeAccess } from '@/api/document'
import { useSession } from '@/hooks/use-session'
import { useUserInfo } from '@/hooks/use-user-info'

interface InviteUserProps {
  collaborator: string
  document: Doc
  first?: boolean
}

export const InviteUser = ({
  collaborator,
  document,
  first = false,
}: InviteUserProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useSession()
  const { userInfo: collaboratorInfo, isLoading } = useUserInfo(collaborator)

  const isOwner = document.userId === user?._id

  const onRemovePrivilege = () => {
    setIsSubmitting(true)

    const promise = removeAccess(document._id, collaborator)
      .then((res) => {
        console.log(res)
        mutate(
          (key) =>
            typeof key === 'string' && key.startsWith('/api/document/get-by-id')
        )
      })
      .finally(() => setIsSubmitting(false))

    toast.promise(promise, {
      loading: 'removing...',
      success: 'Privilege has been removed',
      error: 'Failed to remove him.',
    })
  }

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )

  return (
    <div className="mt-4 flex items-center  justify-between gap-x-2 pl-1">
      <div className="flex items-center justify-between gap-x-2">
        <Avatar className="h-7 w-7">
          <AvatarImage
            src={collaboratorInfo?.imageUrl}
            alt={collaboratorInfo?.username}></AvatarImage>
        </Avatar>
        <div>
          {collaboratorInfo && first ? (
            <div className="text-rose-400">创建者</div>
          ) : collaboratorInfo ? (
            <div>协作人</div>
          ) : null}
        </div>
        <div className="text-base font-light">
          {collaboratorInfo?.emailAddress}
        </div>
      </div>
      {first || !isOwner ? (
        <Button className="hidden h-8 w-16"></Button>
      ) : (
        <Button
          onClick={onRemovePrivilege}
          disabled={isSubmitting}
          className="h-8 w-16 text-xs"
          size="sm"
          variant="destructive">
          remove
        </Button>
      )}
    </div>
  )
}
