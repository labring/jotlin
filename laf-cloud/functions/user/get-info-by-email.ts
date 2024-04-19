import { db } from '@/lib'
import { FunctionContext } from '@lafjs/cloud'

export default async function (ctx: FunctionContext) {
  const email = ctx.query.email

  const userInfo = await db.collection('users').findOne({
    emailAddress: email,
  })

  return userInfo
}
