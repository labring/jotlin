'use client'

import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Doc, getBasicInfoById } from '@/api/document'
import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/use-session'

// TODO id to special type
interface InviteItemProps {
  documentId: string
  userEmail: string
  collaboratorEmail: string
  isAccepted: boolean
  isReplied: boolean
}
type DocumentInfo = Pick<Doc, 'title' | 'icon'>

const InviteItem = ({
  documentId,
  userEmail,
  collaboratorEmail,
  isAccepted,
  isReplied,
}: InviteItemProps) => {
  const { user } = useSession()
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | undefined>(
    undefined
  )

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await getBasicInfoById(documentId)
        setDocumentInfo(response.data)
      } catch (error) {
        console.error('Error fetching documentInfo:', error)
      }
    }

    fetchDocument()
  }, [documentId])

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
      {userEmail === user?.emailAddress && (
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
              {documentInfo?.icon ? (
                <span>{documentInfo.icon}</span>
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
      {collaboratorEmail === user?.emailAddress && (
        <div className="mt-2 flex items-start gap-x-2">
          <Avatar className="mt-2 h-7 w-7">
            <AvatarImage alt="test"></AvatarImage>
          </Avatar>
          <div>
            You are invited by <span className="font-light">{userEmail}</span>{' '}
            to
            <span className="ml-2">
              {documentInfo?.icon ? (
                <span>{documentInfo.icon}</span>
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
