import cloud, { FunctionContext } from '@lafjs/cloud'
import { ObjectId } from 'mongodb'

const db = cloud.mongo.db

export default async function (ctx: FunctionContext) {
  const {_id,isAccepted} = ctx.body
  const userId = ctx.user.uid
  // if there is one invitation which is not replied
  const existingInvitation = await db.collection('invitations').findOne({
    _id:new ObjectId(_id)
  })

  if(!existingInvitation){
    return {error:"Invitation is not found."}
  }

  const documentId = existingInvitation.documentId

  const user = await db.collection("users").findOne({
    _id:new ObjectId(userId)
  })

  // you are invited,so is collaboratorEmail
  if(existingInvitation.collaboratorEmail!==user.emailAddress){
    return {error:"Unauthorized"}
  }
  
  const invitationNotice = await db.collection('invitations').updateOne({_id:new ObjectId(_id)},{
    $set:{
      isReplied:true,
      isAccepted
    }
  })

  if(!invitationNotice.acknowledged){
    return {error:"Failed to update invitation."}
  }

  // update document
  const recursiveUpdate = async(documentId:string)=>{
    const children = await db.collection('documents').find({
      parentDocument:documentId
    }).toArray()
    for(const child of children){
      await db.collection("documents").updateOne({_id:child._id},{
        $set:{
          collaborators:[...child.collaborators,user.emailAddress]
        }
      })
      await recursiveUpdate(child._id)
    } 
  }
  
  const document = await db.collection("documents").findOne({
    _id:new ObjectId(documentId)
  })

  const updateCollaborators = [...document.collaborators,user.emailAddress]

  const updateDocumentNotice = await db.collection("documents").updateOne({_id:new ObjectId(documentId)},{
    $set:{
      collaborators:updateCollaborators
    }
  })

  if(!updateDocumentNotice){
    return {error:"Failed to update Document about collaborators"}
  }

  recursiveUpdate(documentId)

  const updatedInvitation = await db.collection("invitations").findOne({
    _id:new ObjectId(_id)
  })

  return updatedInvitation
}