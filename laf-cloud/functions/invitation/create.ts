import cloud, { FunctionContext } from '@lafjs/cloud'
import { ObjectId } from 'mongodb'

const db = cloud.mongo.db

// schema
interface Invitation{
  documentId:ObjectId
  userEmail:string
  collaboratorEmail:string
  isAccepted:boolean
  isReplied:boolean
  isValid:boolean
}

export default async function (ctx: FunctionContext) {
  const invitationParams = ctx.body

  const invitation = {
    ...invitationParams,
    isAccepted:false,
    isReplied:false,
    isValid:true,
    created_at: new Date(),
  }
  
  // if there is one invitation which is not replied
  const existingInvitation = await db.collection('invitations').findOne({
    ...invitationParams,
    isValid:true,
    isReplied:false
  })

  if(existingInvitation){
    return {error:"Don't create same invitation repeatedly"}
  }
  
  const invitationNotice = await db.collection('invitations').insertOne(invitation)

  if(!invitationNotice.acknowledged){
    return {error:"Failed to create invitation."}
  }

  return { data: invitation }
}