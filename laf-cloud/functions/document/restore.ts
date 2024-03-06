import cloud, { FunctionContext } from '@lafjs/cloud'
import { ObjectId } from 'mongodb'

const db = cloud.mongo.db

export default async function (ctx: FunctionContext) {
  const documentId = ctx.query.id
  const userId = ctx.user.uid

  const objectId = new ObjectId(documentId)

  const existingDocument = await db.collection("documents").findOne({
  _id:objectId
  })
  
  if (!existingDocument){
    return {error:"Not found"}
  }

  if (existingDocument.userId!==userId){
    return {error:"Unauthorized"}
  }

  // archive current document and its children document
  const recursiveRestore = async (documentId:string)=>{
    const children = await db.collection("documents").find({
      parentDocumentId:documentId
      userId
    }).toArray()
    for(const child of children){
      await db.collection("documents").updateOne({
        _id:child._id
      },{
        $set:{isArchived:false}
      })
      const stringId = child._id.toString()
      await recursiveRestore(stringId)
    }
  }

  let parentArchived = false

  // if parentDocument has been archived,remove binding
  if(existingDocument.parentDocument){
    const parentObjectId = new ObjectId(existingDocument.parentDocument)
    const parent = await db.collection("documents").findOne({
      _id:parentObjectId
    })
    if(parent.isArchived){
      parentArchived = true
    }
  }

  await db.collection("documents").updateMany({
    _id:objectId
  },{
    $set:{
      isArchived:false
    }
  })
  
  if(parentArchived){
    await db.collection("documents").updateMany({
    _id:objectId
  },{
    $set:{
      parentDocument:undefined
    }
  })
  }

  recursiveRestore(documentId)

  const updatedDocument = await db.collection("documents").findOne({
    _id: objectId
  })

  return updatedDocument
}
