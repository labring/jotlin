const setupWSConnection = require('@/utils').setupWSConnection

export async function main(ctx: FunctionContext) {
  if (ctx.method === 'WebSocket:connection') {
    const conn = ctx.socket
    console.log(ctx)
    setupWSConnection(conn, ctx.request)
    ctx.socket.send('hi connection succeed')
  }
  // if (ctx.method === 'WebSocket:message') {
  //   const { data } = ctx.params
  //   ctx.socket.send(data.toString())
  // }

  if (ctx.method === 'WebSocket:error') {
    const error = ctx.params
    console.log(error)
  }

  if (ctx.method === 'WebSocket:close') {
    const { code, reason } = ctx.params
    console.log(code, reason)
  }
}
