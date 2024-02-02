'use client'

import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Doc, Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface InviteItemProps {
  documentId: Id<'documents'>
  userEmail: string
  collaboratorEmail: string
  isAccepted: boolean
  isReplied: boolean
}
type DocumentInfo = Pick<Doc<'documents'>, 'title' | 'icon'>

const InviteItem = ({
  documentId,
  userEmail,
  collaboratorEmail,
  isAccepted,
  isReplied,
}: InviteItemProps) => {
  const { user } = useUser()

  const document = useQuery(api.documents.getBasicById, {
    documentId,
  }) as DocumentInfo

  const accept = () => {}

  // if document has been removed
  if (document === null) {
    return <div>The document related invitation has been deleted</div>
  }
  if (document === undefined) {
    return <div>Loading...</div>
  }

  return (
    <>
      {/* 你是邀请人 */}
      {userEmail === user?.primaryEmailAddress!.emailAddress && (
        <div className="mt-2 flex items-start gap-x-2">
          <Avatar className="mt-2 h-7 w-7">
            <AvatarImage
              src={user?.imageUrl}
              alt={user.username!}></AvatarImage>
          </Avatar>
          <div>
            You invite <span className="font-light">{collaboratorEmail}</span>{' '}
            to
            <span className="ml-2">
              {document.icon ? (
                <span>{document.icon}</span>
              ) : (
                <FileIcon className="text-muted-foreground" />
              )}
              <span className="font-medium">{document.title}</span>
            </span>
            <div className="text-right text-xs font-medium text-muted-foreground">
              {!isReplied
                ? 'No reply yet'
                : isReplied && isAccepted
                  ? 'Accepted'
                  : 'rejected'}
            </div>
          </div>
        </div>
      )}
      {/* 你是被邀请人 */}
      {collaboratorEmail === user?.primaryEmailAddress!.emailAddress && (
        <div className="mt-2 flex items-start gap-x-2">
          <Avatar className="mt-2 h-7 w-7">
            <AvatarImage alt="test"></AvatarImage>
          </Avatar>
          <div>
            You are invited by <span className="font-light">{userEmail}</span>{' '}
            to
            <span className="ml-2">
              {document.icon ? (
                <span>{document.icon}</span>
              ) : (
                <FileIcon className="text-muted-foreground" />
              )}
              <span className="font-medium">{document.title}</span>
            </span>
            <div className="text-right text-xs font-medium text-muted-foreground">
              {!isReplied ? (
                <div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-neutral-800"
                    onClick={accept}>
                    accept
                  </Button>
                  {/* <Button size="sm" variant="ghost" onClick={reject}>
                    reject
                  </Button> */}
                </div>
              ) : isReplied && isAccepted ? (
                'Accepted'
              ) : (
                'rejected'
              )}
            </div>
          </div>
        </div>
      )}
      <Separator className="mt-2" />
    </>
  )
}

export default InviteItem
