'use client'

import { Spinner } from '@/components/spinner'
import { ScrollArea } from '@/components/ui/scroll-area'
import InviteItem from './invite-item'
import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/use-session'
import { Invitation, getByEmail } from '@/api/invitation'

const InboxItem = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const { user } = useSession()
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await getByEmail(user?.emailAddress as string)
        setInvitations(response.data.data)
      } catch (error) {
        console.error('Error fetching document:', error)
      }
    }

    fetchDocument()
  }, [user?.emailAddress])

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
