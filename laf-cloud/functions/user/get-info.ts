import cloud, { FunctionContext } from '@lafjs/cloud'
import { ObjectId } from 'mongodb'

const db = cloud.mongo.db


export default async function (ctx: FunctionContext) {
  
  const uid = ctx.user.uid
  
  const objectId = new ObjectId(uid)

  const userInfo = await db.collection('users').findOne({
    _id: objectId
  })

  return { data: userInfo }
}
