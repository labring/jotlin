import cloud, { FunctionContext } from '@lafjs/cloud'

const db = cloud.mongo.db

export default async function (ctx: FunctionContext) {
  const parentDocumentId = ctx.query.parentDocument
  const userId = ctx.user.uid
  
  const documents = await db.collection("documents").find({
    parentDocument:parentDocumentId,
    isArchived:false
    userId
  }).toArray()
  
  return { data: documents }
}
