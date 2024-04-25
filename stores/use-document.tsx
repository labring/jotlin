import { mutate } from 'swr'
import { create } from 'zustand'

import { Doc } from '@/api/document'

type DocumentStore = {
  document: Doc | undefined
  onSetDocument: (doc: Doc) => void
}

export const useDocument = create<DocumentStore>((set) => ({
  document: undefined,
  onSetDocument: (doc) => {
    set({ document: doc }),
      mutate(
        (key) =>
          typeof key === 'string' && key.startsWith('/api/document/sidebar')
      )
  },
}))
