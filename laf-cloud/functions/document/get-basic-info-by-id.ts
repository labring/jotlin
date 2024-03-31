import cloud from '@lafjs/cloud'
import {ObjectId} from "mongodb"

const db = cloud.mongo.db

export default async function (ctx: FunctionContext) {
  const userId = ctx.user.uid
  const documentId = ctx.query.id
  const objectId = new ObjectId(documentId)

  const document = await db.collection("documents").findOne({
    _id:objectId
  })

  if(!document){
    return {error:"Not found."}
  }
  
  const {title,icon} = document

  return {title,icon} 
}
