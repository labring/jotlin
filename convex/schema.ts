import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(), //creator
    isArchived: v.boolean(),
    isPublished: v.boolean(),
    collaborators: v.optional(v.array(v.string())), //collaborators,can edit default
    parentDocument: v.optional(v.id('documents')),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
  })
    .index('by_user', ['userId'])
    .index('by_parent', ['parentDocument'])
    .index('by_user_parent', ['userId', 'parentDocument']),

  invitations: defineTable({
    documentId: v.id('documents'),
    userEmail: v.string(),
    collaboratorEmail: v.string(), //invite our collaborator
    isAccepted: v.boolean(),
    isReplied: v.boolean(), //when you reply me,isAccepted is your reply
  })
    .index('by_user', ['userEmail'])
    .index('by_collaborator', ['collaboratorEmail'])
    .index('by_user_collaborator', ['userEmail', 'collaboratorEmail']),
})
