import cloud, { FunctionContext } from '@lafjs/cloud'

const db = cloud.mongo.db

export default async function (ctx: FunctionContext) {
  const userId = ctx.user.uid
  
  const documents = await db.collection("documents").find({
    isArchived:true
    userId
  }).toArray()
  
  return documents
}
