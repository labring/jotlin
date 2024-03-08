'use client'

import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { FileIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Doc, getBasicInfoById } from '@/api/document'
import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/use-session'
import { User, getUserInfoByEmail } from '@/api/user'
import { Invitation, update } from '@/api/invitation'
import { mutate } from 'swr'

type DocumentInfo = Pick<Doc, 'title' | 'icon'>
type UserInfo = Pick<User, 'username' | 'imageUrl'>

interface InviteItemProps {
  invitation: Invitation
}

const InviteItem = ({ invitation }: InviteItemProps) => {
  const { user } = useSession()
  const {
    _id,
    documentId,
    userEmail,
    collaboratorEmail,
    isAccepted,
    isReplied,
    isValid,
  } = invitation
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | undefined>(
    undefined
  )
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined)

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

  useEffect(() => {
    if (collaboratorEmail === user?.emailAddress) {
      const fetchUserInfo = async () => {
        try {
          const response = await getUserInfoByEmail(userEmail)
          setUserInfo(response.data)
          console.log(response)
        } catch (error) {
          console.error('Error fetching userInfo:', error)
        }
      }
      fetchUserInfo()
    }
  }, [collaboratorEmail, user?.emailAddress, userEmail])

  const accept = async () => {
    try {
      await update({ _id, isAccepted: true })
      mutate(
        (key) =>
          typeof key === 'string' &&
          key.startsWith('/api/invitation/get-by-email')
      )
    } catch (error) {
      console.log(error)
    }
  }
  const reject = async () => {
    try {
      await update({ _id, isAccepted: false })
      mutate(
        (key) =>
          typeof key === 'string' &&
          key.startsWith('/api/invitation/get-by-email')
      )
    } catch (error) {
      console.log(error)
    }
  }

  // if document has been removed
  if (!isValid) {
    return <div>The document related invitation has been deleted</div>
  }

  if (documentInfo === undefined || userInfo === undefined) {
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
              <span className="font-medium">{documentInfo?.title}</span>
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
            <AvatarImage
              src={userInfo?.imageUrl}
              alt={userInfo?.username}></AvatarImage>
          </Avatar>
          <div>
            You are invited by <span className="font-light">{userEmail}</span>{' '}
            to
            <span className="ml-2">
              {documentInfo?.icon ? (
                <span>{documentInfo.icon}</span>
              ) : (
                <FileIcon
                  className="inline-block text-muted-foreground"
                  size={20}
                />
              )}
              <span className="align-middle font-medium">
                {documentInfo?.title}
              </span>
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
                  <button onClick={reject} className="ml-2 text-sm">
                    reject
                  </button>
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
