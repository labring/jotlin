'use client'

import {
  BlockNoteView,
  useBlockNote,
  getDefaultReactSlashMenuItems,
} from '@blocknote/react'
import { useTheme } from 'next-themes'
import { useEdgeStore } from '@/lib/edgestore'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  blockSchema,
  blockSpecs,
  insertBlockQuote,
} from './editor-blocks/quote'
import '@blocknote/react/style.css'

interface EditorProps {
  onChange: (value: string) => void
  initialContent?: string
  editable?: boolean
  documentId?: string
}

const Editor = ({
  onChange,
  initialContent,
  editable,
  documentId,
}: EditorProps) => {
  const { resolvedTheme } = useTheme()
  const { edgestore } = useEdgeStore()
  const [provider, setProvider] = useState<WebrtcProvider>()

  const handleUpload = useCallback(
    async (file: File) => {
      const response = await edgestore.publicFiles.upload({
        file,
      })
      return response.url
    },
    [edgestore.publicFiles]
  )

  const doc = useMemo(() => {
    return new Y.Doc()
  }, [])

  // collaboration
  useEffect(() => {
    const newProvider = new WebrtcProvider(documentId as string, doc)
    setProvider(newProvider)
    return () => {
      newProvider.destroy()
    }
  }, [documentId, doc])

  const editor = useBlockNote({
    editable,
    blockSpecs: blockSpecs,
    slashMenuItems: [
      ...getDefaultReactSlashMenuItems(blockSchema),
      insertBlockQuote,
    ],
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2))
    },
    uploadFile: handleUpload,
    collaboration: {
      provider,
      fragment: doc.getXmlFragment('document-store'),
      user: {
        name: 'alex lee',
        color: '#ff0000',
      },
    },
  })

  // monitor clipboard,when last paste item is image,update currentBlock;
  // when last paste item is md-text,insert after currentBlock.
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
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
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  )
}

export default Editor
