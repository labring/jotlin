import {
  BlockNoteEditor,
  BlockNoteSchema,
  defaultBlockSpecs,
} from '@blocknote/core'
import { BlockQuoteBlock, insertBlockQuote } from './quote'
import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
} from '@blocknote/react'

const blockSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    blockquote: BlockQuoteBlock,
  },
})

const getCustomSlashMenuItems = (
  editor: typeof blockSchema.BlockNoteEditor
): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor),
  insertBlockQuote(editor),
]

export { blockSchema, getCustomSlashMenuItems }
