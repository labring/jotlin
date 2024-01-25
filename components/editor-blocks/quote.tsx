import { defaultBlockSchema, defaultBlockSpecs } from '@blocknote/core'
import { createReactBlockSpec, ReactSlashMenuItem } from '@blocknote/react'
import { TbBlockquote } from 'react-icons/tb'

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

const blockSchema = {
  ...defaultBlockSchema,
  blockquote: BlockQuoteBlock.config,
}

const blockSpecs = {
  ...defaultBlockSpecs,
  blockquote: BlockQuoteBlock,
}

const insertBlockQuote: ReactSlashMenuItem<typeof blockSchema> = {
  name: 'Blockquote',
  execute: (editor) => {
    editor.updateBlock(editor.getTextCursorPosition().block, {
      type: 'blockquote',
    })
  },
  aliases: ['quote'],
  hint: 'Used to define a block of text referenced from another source',
  group: 'Advanced',
  icon: <TbBlockquote />,
}
export { blockSchema, blockSpecs, insertBlockQuote }
