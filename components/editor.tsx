'use client'

import {
  BlockNoteView,
  useBlockNote,
  getDefaultReactSlashMenuItems,
} from '@blocknote/react'
import { useTheme } from 'next-themes'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  blockSchema,
  blockSpecs,
  insertBlockQuote,
} from './editor-blocks/quote'
import '@blocknote/react/style.css'
import { upload } from '@/api/image'
import { useSession } from '@/hooks/use-session'

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
  const [provider, setProvider] = useState<WebsocketProvider>()
  const { user } = useSession()
  const handleUpload = useCallback(async (file: File) => {
    const response = await upload({
      file,
    })
    return response.data.url
  }, [])

  const doc = useMemo(() => {
    return new Y.Doc()
  }, [])

  // collaboration
  // useEffect(() => {
  //   const newProvider = new WebsocketProvider(
  //     'ws://localhost:1234',
  //     documentId as string,
  //     doc
  //   )

  //   setProvider(newProvider)
  //   newProvider.on('status', (event: any) => {
  //     console.log(event.status) // logs "connected" or "disconnected"
  //   })

  //   return () => {
  //     newProvider.destroy()
  //   }
  // }, [documentId, doc])

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
    // collaboration: {
    //   provider,
    //   fragment: doc.getXmlFragment('document-store'),
    //   user: {
    //     name: user?.username as string,
    //     color: '#ff0000',
    //   },
    // },
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
          const blocksFromMarkdown =
            await editor.tryParseMarkdownToBlocks(markdown)

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
