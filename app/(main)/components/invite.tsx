'use client'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface InviteProps {
  documentId: Id<'documents'>
}

const Invite = ({ documentId }: InviteProps) => {
  const create = useMutation(api.invitations.create)
  const remove = useMutation(api.invitations.remove)

  const [collaboratorEmail, setCollaboratorEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onInvite = (e: FormEvent) => {
    e.preventDefault()

    console.log(collaboratorEmail)

    setIsSubmitting(true)

    const promise = create({ documentId, collaboratorEmail }).finally(() =>
      setIsSubmitting(false)
    )

    toast.promise(promise, {
      loading: 'Inviting...',
      success: 'Invitation has been sent',
      error: 'Failed to invite him.',
    })
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
            className="flex-1 px-2 text-xs border rounded-md h-8 bg-muted truncate focus-within:ring-transparent"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="text-xs h-8"
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
