import { TbBlockquote } from 'react-icons/tb'
import { createReactBlockSpec } from '@blocknote/react'

import { blockSchema } from './index'

const BlockQuoteBlock = createReactBlockSpec(
  {
    type: 'blockquote',
    propSchema: {},
    content: 'inline',
  },
  {
    render: ({ contentRef }) => {
      return <blockquote ref={contentRef}></blockquote>
    },
    parse: (element) => {
      if (element.tagName === 'BLOCKQUOTE') {
        return {}
      }
    },
  }
)

// FIXME: This is a temporary solution to avoid group key same error(to other)
const insertBlockQuote = (editor: typeof blockSchema.BlockNoteEditor) => ({
  title: 'Blockquote',
  onItemClick: () => {
    editor.updateBlock(editor.getTextCursorPosition().block, {
      type: 'blockquote',
    })
  },
  aliases: ['quote'],
  subtext: 'Used to define a block of text referenced from another source',
  group: 'Other',
  icon: <TbBlockquote />,
})

export { BlockQuoteBlock, insertBlockQuote }
