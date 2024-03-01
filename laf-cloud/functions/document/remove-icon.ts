import cloud, { FunctionContext } from '@lafjs/cloud'
import { ObjectId } from 'mongodb'

const db = cloud.mongo.db

export default async function (ctx: FunctionContext) {
  const id = ctx.query.id
  const userId = ctx.user.uid

  const objectId = new ObjectId(id)

  const existingDocument = await db.collection("documents").findOne({
  _id:objectId
  })
  
  if (!existingDocument){
    return {error:"Not found"}
  }

  if (existingDocument.userId!==userId){
    return {error:"Unauthorized"}
  }

  const updateNotice = await db.collection("documents").updateOne({
        _id:objectId
      },{
        $set:{icon:undefined}
      })

  if(!updateNotice.acknowledged){
    return {error:"Failed to update document."}
  }

  const updatedDocument = await db.collection("documents").findOne({
    _id:objectId
  })
  
  return { data: updatedDocument }
}

