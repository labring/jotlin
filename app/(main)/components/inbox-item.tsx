'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Spinner } from '@/components/spinner'
import { ScrollArea } from '@/components/ui/scroll-area'
import InviteItem from './invite-item'

const InboxItem = () => {
  const invitations = useQuery(api.invitations.getByEmail)

  if (invitations === undefined) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    )
  }

  if (invitations.length === 0) {
    return <div>No invitations</div>
  }

  return (
    <ScrollArea className="h-[400px]">
      {invitations.map((invitation) => (
        <div key={invitation._id}>
          <InviteItem
            documentId={invitation.documentId}
            userEmail={invitation.userEmail}
            collaboratorEmail={invitation.collaboratorEmail}
            isAccepted={invitation.isAccepted}
            isReplied={invitation.isReplied}
          />
        </div>
      ))}
    </ScrollArea>
  )
}

export default InboxItem
