import axios from '@/lib/axios'

export interface Invitation {
  _id: string
  documentId: string
  userEmail: string
  collaboratorEmail: string
  isAccepted: boolean
  isReplied: boolean
  isValid: boolean
}

type CreateParams = Pick<
  Invitation,
  'documentId' | 'collaboratorEmail' | 'userEmail'
>
// create a new invitation
export const create = (invitation: CreateParams) => {
  return axios.post('/api/invitation/create', invitation)
}

// get invitation by email
export const getByEmail = (email: string) => {
  return axios.get(`/api/invitation/get-by-email?email=${email}`)
}

type UpdateParams = Pick<Invitation, 'isAccepted' | '_id'>
// update invitation
export const update = (invitation: UpdateParams) => {
  return axios.put('/api/invitation/update', invitation)
}
