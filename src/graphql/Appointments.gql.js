import gql from 'graphql-tag'

export const cancelAppointment = gql`
  mutation CancelAppointment($input:AppointmentCancelInput!) {
    cancelAppointment(input:$input) {
      id
      canceled
      canceledReason
    }
  }
`

export const createAppointment = gql`
  mutation CreateAppointment($appt: AppointmentCreateInput) {
    upsertAppointment(input: $appt) {
      id
    }
  }
`

export const getAppointments = gql`
  query getAppointments($input: AppointmentQuery!) {
    appointments(input: $input) {
      id
      scheduledDate
      startTime
      endTime
      createdOn
      updatedOn
      host {
        id
        displayName
      }
      participants {
        id
        displayName
        contacts {
          emails {
            email
          }
        }
        phoneNumbers {
          number
        }
        timezone {
          name
        }
      }
    }
  }
`

export const upsertAppointment = gql`
  mutation UpdateAppointment($appt: AppointmentUpsertInput) {
    upsertAppointment(input: $appt) {
      id
      hostId
      scheduledDate
      startTime
      endTime
      timeLimit
      maxParticipant
      canceled
      canceledReason
      type
      createdOn
      updatedOn
    }
  }
`
export const getInterviewById = gql`
  query getInterviewById($apptId: Int!){
    appointment(id: $apptId){
      id
      hostId
      scheduledDate
      startTime
      endTime
      timeLimit
      maxParticipant
      canceled
      canceledReason
      type
      createdOn
      updatedOn
      participantIds
      host{
        id
        name
        contacts {
          emails {
            email
          }
        }
      }
      participants{
        id
        name
        contacts {
          emails {
            email
          }
        }
        surveys{
          id
          answers{
            questionName
            values{
              value
            }
          }
        }
      }
    }
  }
`

export const APPOINTMENT_BY_BOOKING_ID = gql`
  mutation appointmentObtain($input: AppointmentObtainInput!){
    appointmentObtain(input: $input){
      id
      hostId
      scheduledDate
      startTime
      endTime
      timeLimit
      maxParticipant
      canceled
      canceledReason
      type
      participantIds
    }
  }
`

export const INSERT_APPOINTMENT_LOG = gql`
  mutation appointmentLog($input: AppointmentLogInput!){
    appointmentLog(input: $input){
      id
      typeId
      memberId
      appointmentId
    }
  }
`
