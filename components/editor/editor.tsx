'use client'

import {
  BlockNoteView,
  useCreateBlockNote,
  SuggestionMenuController,
} from '@blocknote/react'
import * as Y from 'yjs'
import { marked } from 'marked'
import { useTheme } from 'next-themes'
import { WebrtcProvider } from 'y-webrtc'
import { useCallback, useEffect } from 'react'
import { filterSuggestionItems } from '@blocknote/core'

import '@blocknote/react/style.css'

import { upload } from '@/api/image'
import { useSession } from '@/hooks/use-session'
import { getRandomLightColor } from '@/lib/utils'
import { blockSchema, getCustomSlashMenuItems } from './editor-blocks'

interface EditorProps {
  onChange: (value: string) => void
  initialContent?: string
  webrtcProvider?: WebrtcProvider
  ydoc?: Y.Doc
  editable?: boolean
}

const Editor = ({
  onChange,
  initialContent,
  editable,
  webrtcProvider,
  ydoc,
}: EditorProps) => {
  const { resolvedTheme } = useTheme()
  const { user } = useSession()

  const handleUpload = useCallback(async (file: File) => {
    const response = await upload({
      file,
    })
    return response.data
  }, [])

  const editor = useCreateBlockNote({
    schema: blockSchema,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    uploadFile: handleUpload,
    collaboration:
      webrtcProvider && ydoc
        ? {
            provider: webrtcProvider,
            fragment: ydoc.getXmlFragment('document-store'),
            user: {
              name: user?.username as string,
              color: getRandomLightColor(),
            },
          }
        : undefined,
  })

  // FIXME: 粘贴大量markdown文本时会出现粘贴两次的情况
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
      } else if (item.kind === 'string') {
        item.getAsString(async (markdown) => {
          console.log(markdown)
          const markdownHtml = await marked.parse(markdown, { breaks: true })
          console.log(markdownHtml)

          const blocksFromHTML = await editor.tryParseHTMLToBlocks(markdownHtml)
          editor.replaceBlocks([currentBlock], blocksFromHTML)
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
        editable={editable}
        editor={editor}
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        onChange={() => {
          onChange(JSON.stringify(editor.document, null, 2))
        }}
        slashMenu={false}>
        <SuggestionMenuController
          triggerCharacter={'/'}
          getItems={async (query) =>
            filterSuggestionItems(getCustomSlashMenuItems(editor), query)
          }
        />
      </BlockNoteView>
    </div>
  )
}

export default Editor
