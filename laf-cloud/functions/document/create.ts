import cloud, { FunctionContext } from '@lafjs/cloud'
import { ObjectId } from 'mongodb'

const db = cloud.mongo.db

// schema
interface Document{
  title:string
  userId:string
  isArchived:boolean
  isPublished:boolean
  collaborators:[string]
  parentDocument?:ObjectId
  content?:string
  coverImage?:string 
}

export default async function (ctx: FunctionContext) {
  
  const uid = ctx.user.uid
  const {title,parentDocument} = ctx.body
  const document = {
    title,
    parentDocument,
    userId: uid,
    isArchived: false,
    isPublished: false,
    collaborators:[]
  }

  const documentCursor = await db.collection('documents').insertOne(document)
  
  if(documentCursor.insertedId){
    return {data:document}
  }

  return {error:"Failed to create new document." }
}