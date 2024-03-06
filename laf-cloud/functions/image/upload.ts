import cloud, { FunctionContext } from '@lafjs/cloud'
import { createReadStream } from 'fs'

export default async function (ctx: FunctionContext) {  
  if(ctx.files?.length===0){
    return 'No file found.'
  }

  const bucket = cloud.storage.bucket('images')
  const replaceTargetUrl = ctx.body.replaceTargetUrl
  if (replaceTargetUrl){
    await bucket.deleteFile(replaceTargetUrl)
  }

  const file = ctx.files[0]
  const stream = createReadStream(file.path)

  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.originalname}`;

  await bucket.writeFile(fileName, stream,{
    ContentType:file.mimetype
  });

  const url = bucket.externalUrl(fileName)

  return url
}
