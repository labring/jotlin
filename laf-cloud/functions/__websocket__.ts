export async function main(ctx: FunctionContext) {

  if (ctx.method === "WebSocket:connection") {
    ctx.socket.send('hi connection succeed')
  }

  if (ctx.method === 'WebSocket:message') {
    const { data } = ctx.params
    console.log(data.toString())
    ctx.socket.send("I have received your message");
  }

  if (ctx.method === 'WebSocket:error') {
    const error = ctx.params
    console.log(error)
  }

  if (ctx.method === 'WebSocket:close') {
    const { code, reason } = ctx.params
    console.log(code, reason)
  }
}