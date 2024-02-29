import axios from '@/lib/axios'

interface Document {
  title: string
  userId: string
  isArchived: boolean
  isPublished: boolean
  collaborators?: [string]
  parentDocument?: string
  content?: string
  coverImage?: string
}

// create a new document
export const create = (document: Document) => {
  return axios.post('/api/document/create', {
    data: document,
  })
}

// archive a document to trash
export const archive = (id: string) => {
  return axios.put(`/api/document/archive?id=${id}`)
}

// get sidebar
export const getSidebar = (parentDocument: string) => {
  return axios.get(`/api/document/sidebar?id=${parentDocument}`)
}

// get documents which are archived
export const getTrash = () => {
  return axios.get('/api/document/get-trash')
}

// restore document to normal
export const restore = (id: string) => {
  return axios.put(`/api/document/restore?id=${id}`)
}

// remove document forever
export const remove = (id: string) => {
  return axios.delete(`/api/document/remove?id=${id}`)
}

// search document
export const getSearch = (param: string) => {
  return axios.get(`/api/document/search?param=${param}`)
}

// get document by Id
export const getById = (id: string) => {
  return axios.get(`/api/document/get-by-id?id=${id}`)
}

// get basic information by id: title and icon
export const getBasicInfoById = (id: string) => {
  return axios.get(`/api/document/get-basic-info-by-id?id=${id}`)
}

// update document content
export const update = (document: Document) => {
  return axios.put('/api/document/update', {
    data: document,
  })
}

// remove Icon
export const removeIcon = (id: string) => {
  return axios.delete(`/api/document/remove-icon?id=${id}`)
}

// remove coverImage
export const removeCoverImage = (id: string) => {
  return axios.delete(`/api/document/remove-cover-image?id=${id}`)
}

// remove access to this document
export const removeAccess = (documentId: string, collaboratorEmail: string) => {
  return axios.put('/api/document/invitation', {
    data: { documentId, collaboratorEmail },
  })
}
