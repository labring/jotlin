import { db } from '@/lib'
import { FunctionContext } from '@lafjs/cloud'

export default async function (ctx: FunctionContext) {
  const emailAddress = ctx.query.email

  const invitationOther = await db
    .collection('invitations')
    .find({
      userEmail: emailAddress,
    })
    .toArray()

  const invitationMe = await db
    .collection('invitations')
    .find({
      collaboratorEmail: emailAddress,
    })
    .toArray()

  const invitations = [...invitationOther, ...invitationMe].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  return invitations
}
