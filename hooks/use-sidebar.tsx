import useSWR from 'swr'

import axios from '@/lib/axios'
import { Doc } from '@/api/document'

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export const useSidebar = (parentDocumentId: string, type: string) => {
  const { data: documents, mutate } = useSWR<Doc[]>(
    `/api/document/sidebar?parentDocument=${parentDocumentId}&type=${type}`,
    fetcher
  )

  return {
    documents,
    mutate,
  }
}
