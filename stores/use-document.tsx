import { Doc } from '@/api/document'
import { mutate } from 'swr'
import { create } from 'zustand'

type DocumentStore = {
  document: Doc | null
  onSetDocument: (doc: Doc) => void
}

export const useDocument = create<DocumentStore>((set) => ({
  document: null,
  onSetDocument: (doc) => {
    set({ document: doc }),
      mutate(
        (key) =>
          typeof key === 'string' && key.startsWith('/api/document/sidebar')
      )
  },
}))
