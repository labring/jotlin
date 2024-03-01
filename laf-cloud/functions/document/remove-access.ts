import cloud, { FunctionContext } from '@lafjs/cloud'
import { ObjectId } from 'mongodb'

const db = cloud.mongo.db

export default async function (ctx: FunctionContext) {
  const {documentId,collaboratorEmail} = ctx.body
  const userId = ctx.user.uid
  const objectUserId = new ObjectId(userId)

  // find user email
  const user = await db.collection("users").findOne({
    _id:objectUserId
  })

  const userEmailAddress = user.emailAddress

  const existingInvitation = await db.collection("invitations").findOne({
    userEmail:userEmailAddress,
    collaboratorEmail,
    isAccepted:true,
    documentId,
  })
  
  if (!existingInvitation||!existingInvitation.isValid){
    return {error:"Not found"}
  }

  // recursive remove current document's children document's collaborators
  const recursiveRemove = async(documentId:string)=>{
    const children =  await db.collection("documents").find({
      parentDocument:documentId
    }).toArray()

    for(child of children){
      const afterRemovedCollaborators = child.collaborators.filter(
          (collaborator) => collaborator !== collaboratorEmail
        )

      await db.collection("documents").updateOne({
        _id:child._id
      },{
        $set:{
          collaborators:afterRemovedCollaborators
        }
      })
      await recursiveRemove(child._id)
    }
  }

  const objectdocumentId = new objectId(documentId)
  const document =  await db.collection("documents").findOne({
      _id:objectdocumentId
    })
  const afterRemovedCollaboratorsTemp = document.collaborators.filter(
          (collaborator) => collaborator !== collaboratorEmail
  )
  const removeNotioce = await db.collection('documents').updateOne({
        _id:objectdocumentId
      },{
        $set:{
          collaborators:afterRemovedCollaborators
        }
      })

  if(!removeNotice.acknowledged){
    return {error:"Failed to remove access."}
  }

  recursiveRemove(documentId)

  const deleteInvitationNotice = await db.collection('invitations').updateOne({
    userEmail:userEmailAddress,
    collaboratorEmail,
    isAccepted:true,
    documentId,
  },{
    $set:{isValid:false}
  })

  if(!deleteInvitationNotice.acknowledged){
    return {error:"Failed to delete invitation"}
  }
  
  return { msg:'ok' }
}

