import { createReactBlockSpec } from '@blocknote/react'
import { TbBlockquote } from 'react-icons/tb'
import { blockSchema } from './index'

const BlockQuoteBlock = createReactBlockSpec(
  {
    type: 'blockquote',
    propSchema: {},
    content: 'inline',
  },
  {
    render: ({ block, contentRef }) => {
      return <blockquote ref={contentRef}></blockquote>
    },
  }
)

const insertBlockQuote = (editor: typeof blockSchema.BlockNoteEditor) => ({
  title: 'Blockquote',
  onItemClick: () => {
    editor.updateBlock(editor.getTextCursorPosition().block, {
      type: 'blockquote',
    })
  },
  aliases: ['quote'],
  subtext: 'Used to define a block of text referenced from another source',
  group: 'Advanced',
  icon: <TbBlockquote />,
})

export { BlockQuoteBlock, insertBlockQuote }
