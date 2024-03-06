'use client'

import IconPicker from './icon-picker'
import { ImageIcon, Smile, X } from 'lucide-react'
import { Button } from './ui/button'
import { ElementRef, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { useCoverImage } from '@/stores/use-cover-image'
import { Doc, removeIcon, update } from '@/api/document'
import { mutate } from 'swr'

interface ToolbarProps {
  initialData: Doc
  preview?: boolean
}

const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<'textarea'>>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialData.title)

  const coverImage = useCoverImage()
  const enableInput = () => {
    if (preview) return
    setIsEditing(true)

    setTimeout(() => {
      setValue(initialData.title)
      inputRef.current?.focus()
    }, 0)
  }

  const disableInput = () => setIsEditing(false)
  const onInput = async (value: string) => {
    setValue(value)
    await update({
      _id: initialData._id,
      title: value || 'Untitled',
    })
  }
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      disableInput()
    }
  }
  const onIconSelect = async (icon: string) => {
    await update({
      _id: initialData._id,
      icon,
    })
    mutate(
      (key) =>
        typeof key === 'string' && key.startsWith('/api/document/get-by-id')
    )
  }
  const onRemoveIcon = async () => {
    await removeIcon(initialData._id)
  }
  return (
    <div className="group relative pl-[54px]">
      {!!initialData.icon && !preview && (
        <div className="group/icon flex items-center gap-x-2 pt-6">
          <IconPicker onChange={onIconSelect}>
            {/* FIXME:浏览器无法正确渲染emoji */}
            <p className="text-6xl transition hover:opacity-75">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full text-xs text-muted-foreground opacity-0 transition group-hover/icon:opacity-100"
            variant="outline"
            size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="pt-6 text-6xl">{initialData.icon}</p>
      )}
      <div className="flex items-center gap-x-1 py-4 opacity-0 group-hover:opacity-100">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-xs text-muted-foreground"
              variant="outline"
              size="sm">
              <Smile className="mr-2 h-4 w-4" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm">
            <ImageIcon className="mr-2 h-4 w-4" />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="resize-none break-words bg-transparent text-5xl font-bold text-[#3F3F3F] outline-none dark:text-[#CFCFCF]"
        />
      ) : (
        <div
          onClick={enableInput}
          className="break-words pb-[11.5px] text-5xl font-bold text-[#3F3F3F] outline-none dark:text-[#CFCFCF]">
          {initialData.title}
        </div>
      )}
    </div>
  )
}

export default Toolbar
