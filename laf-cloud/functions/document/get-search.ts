import cloud from '@lafjs/cloud'

const db = cloud.mongo.db
export default async function (ctx: FunctionContext) {
  const userId = ctx.user.uid
  
  const documents = await db.collection("documents").find({
    userId,
    isArchived:false
  }).toArray()

  return documents
}
