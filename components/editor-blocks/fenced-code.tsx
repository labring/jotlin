import { defaultProps } from '@blocknote/core'
import { createReactBlockSpec } from '@blocknote/react'
import { TbCode } from 'react-icons/tb'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { blockSchema } from './index'

const fencedCodeBlock = createReactBlockSpec(
  {
    type: 'fencedCode',
    propSchema: {
      ...defaultProps,
      language: { default: 'js' },
    },
    content: 'inline',
  },
  {
    render: ({ contentRef, block }) => (
      <div className="relative rounded-md bg-foreground/5 p-2">
        <Select defaultValue={block.props.language}>
          <SelectTrigger className="absolute right-1 top-1 h-max w-[180px] p-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* FIXME: 语言列表待增加,js和javascript缩写影响 */}
              <SelectLabel>Languages</SelectLabel>
              <SelectItem value="js">JavaScript</SelectItem>
              <SelectItem value="jsx">React</SelectItem>
              <SelectItem value="cs">C#</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <pre>
          <code ref={contentRef} className={block.props.language}></code>
        </pre>
      </div>
    ),
    parse: (element) => {
      if (
        element.tagName === 'PRE' &&
        element.children.length === 1 &&
        element.children[0].tagName === 'CODE'
      ) {
        const classList = element.children[0].className.split(' ')
        let language = ''
        classList.forEach((className) => {
          if (className.startsWith('language-')) {
            language = className.substring(9)
          }
        })

        return { language: language ? language : 'js' }
      }
    },
  }
)

const insertFencedCodeBlock = (editor: typeof blockSchema.BlockNoteEditor) => ({
  title: 'Fenced Code',
  onItemClick: () => {
    editor.updateBlock(editor.getTextCursorPosition().block, {
      type: 'fencedCode',
    })
  },
  aliases: ['code'],
  group: 'Other',
  icon: <TbCode />,
})
export { insertFencedCodeBlock, fencedCodeBlock }
