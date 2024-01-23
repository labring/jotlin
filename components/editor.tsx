'use client'

import { BlockNoteEditor } from '@blocknote/core'
import { BlockNoteView, useBlockNote } from '@blocknote/react'
import { useTheme } from 'next-themes'
import { useEdgeStore } from '@/lib/edgestore'

import '@blocknote/react/style.css'
import { useCallback, useEffect } from 'react'

interface EditorProps {
  onChange: (value: string) => void
  initialContent?: string
  editable?: boolean
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme()
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

  // monitor clipboard,when last paste item is image,update block that inserter's place
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      console.log(event.clipboardData)
      const items = event.clipboardData ? event.clipboardData.items : []

      const item = items[items.length - 1]

      if (item.kind === 'file' && item.type.match('^image/')) {
        const file = item.getAsFile() as File
        const currentBlock = editor.getTextCursorPosition().block

        handleUpload(file).then((imageUrl) => {
          editor.updateBlock(currentBlock, {
            type: 'image',
            props: { url: imageUrl },
          })
        })
      }
    }

    document.addEventListener('paste', handlePaste)

    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [editor, handleUpload])

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  )
}

export default Editor
