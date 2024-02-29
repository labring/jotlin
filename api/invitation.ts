import axios from '@/lib/axios'

interface Invitation {
  documentId: string
  userEmail: string
  collaboratorEmail: string
  isAccepted: boolean
  isReplied: boolean
}
// create a new invitation
export const create = (invitation: Invitation) => {
  return axios.post('/api/invitation/create', {
    data: invitation,
  })
}

// get invitation by email
export const getByEmail = (email: string) => {
  return axios.get(`/api/invitation/getByEmail?email=${email}`)
}

// update invitation
export const update = (invitation: Invitation) => {
  return axios.put('/api/invitation/update', {
    data: invitation,
  })
}
