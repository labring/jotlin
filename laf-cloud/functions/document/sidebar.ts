import cloud, { FunctionContext } from '@lafjs/cloud'
import {ObjectId} from "mongodb"

const db = cloud.mongo.db

export default async function (ctx: FunctionContext) {
  const {parentDocument,type} = ctx.query
  const userId = ctx.user.uid

  const userInfo = await db.collection("users").findOne({
    _id: new ObjectId(userId)
  })

  const userEmail = userInfo.emailAddress

  let documents

  if(type==='share'){
    // 你分享给别人
    let documentsA = await db.collection("documents").find({
    parentDocument,
    isArchived:false,
    userId,
    collaborators: {  $not: { $size: 0 }}
    }).toArray()

    // 别人分享给你
    let documentsB = await db.collection("documents").find({
    parentDocument,
    isArchived:false,
    collaborators: userEmail
    }).toArray()

    documents = [...documentsA,...documentsB]
  }
  
  else if(type==='private'){
    documents = await db.collection("documents").find({
    parentDocument,
    isArchived:false,
    userId,
    collaborators: { $size: 0 }
    }).toArray()
  }
  else{
    return {error:'The type parameter is invalid.'}
  }
  
  return documents
}
