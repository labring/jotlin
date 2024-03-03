import axios from '@/lib/axios'

export interface Invitation {
  _id: string
  documentId: string
  userEmail: string
  collaboratorEmail: string
  isAccepted: boolean
  isReplied: boolean
}

type CreateParams = Pick<Invitation, 'documentId' | 'collaboratorEmail'>
// create a new invitation
export const create = (invitation: CreateParams) => {
  return axios.post('/api/invitation/create', {
    data: invitation,
  })
}

// get invitation by email
export const getByEmail = (email: string) => {
  return axios.get(`/api/invitation/get-by-email?email=${email}`)
}

// update invitation
export const update = (invitation: Invitation) => {
  return axios.put('/api/invitation/update', {
    data: invitation,
  })
}
