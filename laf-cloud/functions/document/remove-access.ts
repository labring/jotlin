import { db } from '@/lib'
import { FunctionContext } from '@lafjs/cloud'
import { ObjectId } from 'mongodb'

export default async function (ctx: FunctionContext) {
  const { documentId, collaboratorEmail } = ctx.body
  const userId = ctx.user.uid
  const objectUserId = new ObjectId(userId)

  // find user email
  const user = await db.collection('users').findOne({
    _id: objectUserId,
  })

  const userEmailAddress = user.emailAddress

  const existingInvitation = await db.collection('invitations').findOne({
    userEmail: userEmailAddress,
    collaboratorEmail,
    isAccepted: true,
    documentId,
  })

  if (!existingInvitation || !existingInvitation.isValid) {
    return { error: 'Invitation not found' }
  }

  let afterRemovedCollaborators

  // recursive remove current document's children document's collaborators
  const recursiveRemove = async (documentId: string) => {
    const children = await db
      .collection('documents')
      .find({
        parentDocument: documentId,
      })
      .toArray()

    for (let child of children) {
      afterRemovedCollaborators = child.collaborators.filter(
        (collaborator) => collaborator !== collaboratorEmail
      )

      await db.collection('documents').updateOne(
        {
          _id: child._id,
        },
        {
          $set: {
            collaborators: afterRemovedCollaborators,
          },
        }
      )
      const stringId = child._id.toString()
      await recursiveRemove(stringId)
    }
  }

  const objectdocumentId = new ObjectId(documentId)
  const document = await db.collection('documents').findOne({
    _id: objectdocumentId,
  })
  afterRemovedCollaborators = document.collaborators.filter(
    (collaborator) => collaborator !== collaboratorEmail
  )
  const removeNotice = await db.collection('documents').updateOne(
    {
      _id: objectdocumentId,
    },
    {
      $set: {
        collaborators: afterRemovedCollaborators,
      },
    }
  )

  if (!removeNotice.acknowledged) {
    return { error: 'Failed to remove access.' }
  }

  recursiveRemove(documentId)

  const deleteInvitationNotice = await db.collection('invitations').updateOne(
    {
      userEmail: userEmailAddress,
      collaboratorEmail,
      isAccepted: true,
      documentId,
    },
    {
      $set: { isValid: false },
    }
  )

  if (!deleteInvitationNotice.acknowledged) {
    return { error: 'Failed to delete invitation' }
  }

  return { msg: 'ok' }
}
