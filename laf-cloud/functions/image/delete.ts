import cloud, { FunctionContext } from '@lafjs/cloud'

export default async function (ctx: FunctionContext) {
  const bucket = cloud.storage.bucket('images')

  // example:https://oss.laf.dev/fo6csv-images/1709484546709_1c4ba8c1b4f4b12c346d09011bafc9d1450d401edad2f3ff2.jpg

  const url = ctx.query.url
  const parts = url.split('/')
  const fileName = parts[parts.length - 1]

  await bucket.deleteFile(fileName)

  return { msg: 'ok' }
}
