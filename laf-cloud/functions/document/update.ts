import { FunctionContext } from '@lafjs/cloud'
import { ObjectId } from 'mongodb'
import { db } from '@/lib'

export default async function (ctx: FunctionContext) {
  const { _id, ...rest } = ctx.body

  const objectId = new ObjectId(_id)

  const existingDocument = await db.collection('documents').findOne({
    _id: objectId,
  })

  if (!existingDocument) {
    return { error: 'Not found' }
  }
  
  // FIXME: 暂时不处理update认证
  // if (existingDocument.userId !== userId) {
  //   return { error: 'Unauthorized' }
  // }

  const updateNotice = await db.collection('documents').updateOne(
    {
      _id: objectId,
    },
    {
      $set: { ...rest },
    }
  )

  if (!updateNotice.acknowledged) {
    return { error: 'Failed to update document.' }
  }

  const updatedDocument = await db.collection('documents').findOne({
    _id: objectId,
  })

  return updatedDocument
}
