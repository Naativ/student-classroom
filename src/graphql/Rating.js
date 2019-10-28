import gql from 'graphql-tag'

export const UPSERT_RATING = gql`
  mutation appointmentRating($input: AppointmentRatingInput!) {
    appointmentRating(input: $input) {
      id
      appointmentId
      score
      comment
    }
  }
`
