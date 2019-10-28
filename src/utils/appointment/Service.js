import get from 'lodash.get'
import { INSERT_APPOINTMENT_LOG } from '@/graphql/Appointments.gql.js'
import { createProvider } from '@/vue-apollo'

const apollo = createProvider().defaultClient

export const TYPE = {
  'tech:misc': 1001,
  'waiting:joined': 1002,
  'device:settings': 1003,
  'device:updated': 1004,
  'room:connected': 1005,
  'room:disconnected': 1006,
  'drawing:enabled': 1007,
  'drawing:completed': 1008,
  'session:ended': 1009,
  'lesson:slide': 1010,
  'lesson:chat': 1011,
  'lesson:tabChanged': 1012,
  'lesson:complete': 1013
}

export const insertLog = logObj => {
  const { appointmentId, note, type } = logObj
  const typeId = TYPE[type]
  return apollo.mutate({
    mutation: INSERT_APPOINTMENT_LOG,
    variables: {
      input: {
        typeId,
        appointmentId,
        note,
        metadata: JSON.stringify(get(logObj, 'metadata', {}))
      }
    }
  })
}
