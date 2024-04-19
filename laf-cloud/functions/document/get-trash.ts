import { db } from '@/lib'
import { FunctionContext } from '@lafjs/cloud'

export default async function (ctx: FunctionContext) {
  const userId = ctx.user.uid

  const documents = await db
    .collection('documents')
    .find({
      isArchived: true,
      userId,
    })
    .toArray()

  return documents
}
