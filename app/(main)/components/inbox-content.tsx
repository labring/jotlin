'use client'

import { Spinner } from '@/components/spinner'
import { ScrollArea } from '@/components/ui/scroll-area'
import InviteItem from './invite-item'
import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/use-session'
import { Invitation, getByEmail } from '@/api/invitation'
import useSWR from 'swr'
import axios from 'axios'

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

const InboxContent = () => {
  const { user } = useSession()

  const { data: invitations } = useSWR<Invitation[]>(
    `/api/invitation/get-by-email?email=${user?.emailAddress}`,
    fetcher
  )
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
          <InviteItem invitation={invitation} />
        </div>
      ))}
    </ScrollArea>
  )
}

export default InboxContent
