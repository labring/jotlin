'use client'

import { create } from '@/api/invitation'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface InviteProps {
  documentId: string
}

const Invite = ({ documentId }: InviteProps) => {
  const [collaboratorEmail, setCollaboratorEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onInvite = (e: FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      toast.loading('Inviting...')
      const response = create({ documentId, collaboratorEmail }).finally(() =>
        setIsSubmitting(false)
      )
      toast.success('Invitation has been sent')
    } catch (error) {
      toast.error('Failed to invite him.')
    }
  }

  const onRemovePrivilege = () => {
    setIsSubmitting(true)

    const promise = remove({
      collaboratorEmail,
      documentId,
    }).finally(() => setIsSubmitting(false))

    toast.promise(promise, {
      loading: 'removing...',
      success: 'Privilege has been removed',
      error: 'Failed to remove him.',
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Invite
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        <form onSubmit={onInvite} className="flex space-x-1">
          <input
            type="email"
            required
            disabled={isSubmitting}
            onChange={(e) => setCollaboratorEmail(e.target.value)}
            placeholder="Enter collaborator email..."
            className="h-8 flex-1 truncate rounded-md border bg-muted px-2 text-xs focus-within:ring-transparent"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-8 text-xs"
            size="sm">
            Submit
          </Button>
        </form>
        {/* user board */}
        <div className="mt-2 space-y-2">UserBoard</div>
      </PopoverContent>
    </Popover>
  )
}

export default Invite
