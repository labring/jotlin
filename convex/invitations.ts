import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { Doc, Id } from './_generated/dataModel'

// function: 创建新邀请
export const create = mutation({
  args: {
    collaboratorEmail: v.string(),
    documentId: v.id('documents'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    // NOTE: 这里暂时认为所有用户都有email
    const userEmail = identity.email!

    const invitation = await ctx.db.insert('invitations', {
      userEmail,
      collaboratorEmail: args.collaboratorEmail,
      documentId: args.documentId,
      isAccepted: false,
      isReplied: false,
    })

    return invitation
  },
})

// function: 获取邀请信息列表
export const getByEmail = query({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const userEmail = identity.email!

    const invitationOther = await ctx.db
      .query('invitations')
      .withIndex('by_user', (q) => q.eq('userEmail', userEmail))
      .collect()
    const invitationMe = await ctx.db
      .query('invitations')
      .withIndex('by_collaborator', (q) => q.eq('collaboratorEmail', userEmail))
      .collect()

    const invitations = [...invitationOther, ...invitationMe].sort(
      (a, b) => a._creationTime - b._creationTime
    )

    return invitations
  },
})

// function: 更新邀请（回复邀请，答应或者拒绝）
export const update = mutation({
  args: {
    id: v.id('invitations'),
    isAccepted: v.boolean(),
    isReplied: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const userEmail = identity.email

    const { isAccepted, isReplied } = args

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    // you are invited,so is collaboratorEmail
    if (existingDocument.collaboratorEmail !== userEmail) {
      throw new Error('Unauthorized')
    }

    const invitation = await ctx.db.patch(args.id, {
      isAccepted,
      isReplied,
    })

    return invitation
  },
})

// function: 移除某人权限
export const remove = mutation({
  args: { collaboratorEmail: v.string(), documentId: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const userEmail = identity.email!

    // only one,so first()
    const existingInvitation = await ctx.db
      .query('invitations')
      .withIndex('by_user_collaborator', (q) =>
        q
          .eq('userEmail', userEmail)
          .eq('collaboratorEmail', args.collaboratorEmail)
      )
      .filter((q) =>
        q.and(
          q.eq(q.field('isAccepted'), true),
          q.eq(q.field('documentId'), args.documentId)
        )
      )
      .first()

    if (!existingInvitation) {
      throw new Error('Not found')
    }

    const invitation = await ctx.db.delete(existingInvitation._id)

    return invitation
  },
})
