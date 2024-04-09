import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core'
import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
} from '@blocknote/react'
import { fencedCodeBlock, insertFencedCodeBlock } from './fenced-code'
import { BlockQuoteBlock, insertBlockQuote } from './quote'

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
