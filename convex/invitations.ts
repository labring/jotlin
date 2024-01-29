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

// function: 被邀请者更新邀请（回复邀请，同意或者拒绝），同意的话将用户id加到documents的collaborators里
export const update = mutation({
  args: {
    id: v.id('invitations'),
    documentId: v.id('documents'),
    isAccepted: v.boolean(),
    isReplied: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const userEmail = identity.email
    const userId = identity.subject

    const { isAccepted, isReplied } = args

    const existingInvitation = await ctx.db.get(args.id)

    if (!existingInvitation) {
      throw new Error('Not found')
    }

    // you are invited,so is collaboratorEmail
    if (existingInvitation.collaboratorEmail !== userEmail) {
      throw new Error('Unauthorized')
    }

    const invitation = await ctx.db.patch(args.id, {
      isAccepted,
      isReplied,
    })

    // update documents if isAccepted is true
    if (isAccepted) {
      // update current documents and their children
      const recursiveUpdate = async (documentId: Id<'documents'>) => {
        const children = await ctx.db
          .query('documents')
          .withIndex('by_parent', (q) => q.eq('parentDocument', documentId))
          .collect()

        for (const child of children) {
          await ctx.db.patch(child._id, {
            collaborators: [...child.collaborators!, userId],
          })
          await recursiveUpdate(child._id)
        }
      }

      const document = (await ctx.db.get(args.documentId)) as Doc<'documents'>
      const updatedCollaborators = [...document.collaborators!, userId]
      await ctx.db.patch(args.documentId, {
        collaborators: updatedCollaborators,
      })
    }
    return invitation
  },
})

// function: 移除某人权限,移除某人在document里的collaborations的项，递归去除子文档的相应项，同时移除相应的invitation
// note: 保留父文档权限（如果有的话），被移除用户无法访问子文档但是可以访问有权限的父文档
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

    // remove document's collaboration
    const recursiveRemove = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_parent', (q) => q.eq('parentDocument', documentId))
        .collect()

      for (const child of children) {
        const removedCollaborators = child.collaborators!.filter(
          (collaborator) => collaborator !== args.collaboratorEmail
        )
        await ctx.db.patch(child._id, {
          collaborators: removedCollaborators,
        })
        await recursiveRemove(child._id)
      }
    }

    const invitation = await ctx.db.delete(existingInvitation._id)

    return invitation
  },
})
