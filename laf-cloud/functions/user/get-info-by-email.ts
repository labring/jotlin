import cloud, { FunctionContext } from '@lafjs/cloud'
import { ObjectId } from 'mongodb'

const db = cloud.mongo.db


export default async function (ctx: FunctionContext) {
  
  const email = ctx.query.email
  

  const userInfo = await db.collection('users').findOne({
    emailAddress:email
  })

  return userInfo
}
