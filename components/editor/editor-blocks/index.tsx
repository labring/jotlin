import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
} from '@blocknote/react'
import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core'

import { BlockQuoteBlock, insertBlockQuote } from './quote'
import { fencedCodeBlock, insertFencedCodeBlock } from './fenced-code'

const blockSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    blockquote: BlockQuoteBlock,
    fencedCode: fencedCodeBlock,
  },
})

const getCustomSlashMenuItems = (
  editor: typeof blockSchema.BlockNoteEditor
): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor),
  insertBlockQuote(editor),
  insertFencedCodeBlock(editor),
]

export { blockSchema, getCustomSlashMenuItems }
