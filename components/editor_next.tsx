'use client'

import { createReactEditorJS } from 'react-editor-js'
import { editorJSTools } from '@/config/editor'
import { API, BlockMutationEvent, OutputData } from '@editorjs/editorjs'
import { useCallback, useRef } from 'react'

interface EditorProps {
  onSave: (value: string) => void
  initialContent?: string
  editable?: boolean
}

interface EditorCore {
  destroy(): Promise<void>

  clear(): Promise<void>

  save(): Promise<OutputData>

  render(data: OutputData): Promise<void>
}

type Event = BlockMutationEvent | BlockMutationEvent[]

const Editor = ({ onSave, initialContent, editable }: EditorProps) => {
  const ReactEditorJS = createReactEditorJS()
  const editorCore = useRef<EditorCore | null>(null)

  const handleInitialize = useCallback((instance: EditorCore) => {
    if (editorCore.current === null) {
      editorCore.current = instance
    }
  }, [])

  const onChange = async (api: API, event: Event) => {
    if (editorCore.current !== null) {
      const savedData = await editorCore.current.save()
      onSave(JSON.stringify(savedData))
    }
  }

  return (
    <ReactEditorJS
      onInitialize={handleInitialize}
      tools={editorJSTools}
      defaultValue={JSON.parse(initialContent ?? '{}')}
      onChange={onChange}
      readOnly={editable}
      holder={'editorjs'}
      placeholder={'Let`s write an awesome story!'}
      autofocus={true}
    />
  )
}

export default Editor
