import useSWR from 'swr'

import axios from '@/lib/axios'
import { Doc } from '@/api/document'

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export const useDocumentById = (id: string) => {
  const { data: document, mutate } = useSWR<Doc>(
    `/api/document/get-by-id?id=${id}`,
    fetcher
  )

  return {
    document,
    mutate,
  }
}
