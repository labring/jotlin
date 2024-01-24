'use client'

import { BlockNoteEditor } from '@blocknote/core'
import { BlockNoteView, useBlockNote } from '@blocknote/react'
import { useTheme } from 'next-themes'
import { useEdgeStore } from '@/lib/edgestore'

import '@blocknote/react/style.css'
import { useCallback, useEffect } from 'react'

interface EditorProps {
  onSave: (value: string) => void
  initialContent?: string
  editable?: boolean
}

interface EditorCore {
  _editorJS?: any
  destroy(): Promise<void>

  clear(): Promise<void>

  save(): Promise<OutputData>

  render(data: OutputData): Promise<void>
}

type Event = BlockMutationEvent | BlockMutationEvent[]

const Editor = ({ onSave, initialContent, editable = true }: EditorProps) => {
  const ReactEditorJS = createReactEditorJS()
  const editorCore = useRef<EditorCore | null>(null)
  const { edgestore } = useEdgeStore()

  const handleUpload = useCallback(
    async (file: File) => {
      const response = await edgestore.publicFiles.upload({
        file,
      })
      return response.url
    },
    [edgestore.publicFiles]
  )

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2))
    },
    uploadFile: handleUpload,
  })

  // monitor clipboard,when last paste item is image,update currentBlock;
  // when last paste item is md-text,insert after currentBlock.
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      // BUG:preventDefault is in Failure state
      // stop default paste for paste default text(for paste block)
      // event.preventDefault()

      const items = event.clipboardData ? event.clipboardData.items : []

      const item = items[items.length - 1]
      const currentBlock = editor.getTextCursorPosition().block

      if (item.kind === 'file' && item.type.match('^image/')) {
        const file = item.getAsFile() as File

        handleUpload(file).then((imageUrl: string) => {
          editor.updateBlock(currentBlock, {
            type: 'image',
            props: { url: imageUrl },
          })
        })
      } else if (item.kind === 'string' && item.type.match('text/plain')) {
        item.getAsString(async (markdown) => {
          const blocksFromMarkdown = await editor.tryParseMarkdownToBlocks(
            markdown
          )

          editor.replaceBlocks([currentBlock], blocksFromMarkdown)
        })
      }
    }

    document.addEventListener('paste', handlePaste)

    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [editor, handleUpload])

  return (
    <ReactEditorJS
      holder={'editorjs'}
      onInitialize={handleInitialize}
      onReady={handleReady}
      tools={editorJSTools}
      defaultValue={JSON.parse(initialContent ?? '{}')}
      onChange={onChange}
      readOnly={!editable}
      placeholder={'Let`s write something here!'}
    />
  )
}

export default Editor
