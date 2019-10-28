import gql from 'graphql-tag'

export const UPSERT_BOOKING = gql`
  mutation bookingUpsert($input: ScheduleBookingInput!) {
    bookingUpsert: schedulingBookingUpsert(input: $input) {
      id
      typeId
      hostId
      profileId
      guestId
      start
      end
    }
  }
`

export const GET_BOOKING = gql`
  query bookings($input: BookingFilter!) {
    bookings(input: $input) {
      id
      typeId
      hostId
      availabilityId
      appointments {
        startTime
        endTime
      }
      type {
        name
        key
      }
      host {
        id
        displayName
      }
      guestId
      guest {
        id
        displayName
      }
      profileId
      profile {
        id
        displayName
        enrollments{
          id
          courseId
          priority
          nextLessonIds
        }
        birthdate
      }
      start
      end
    }
  }
`

export const SEARCH_BOOKING = gql`
  query bookings($input: BookingFilter!) {
    bookings(input: $input) {
      id
      typeId
      statusId
      availabilityId
      status {
        key
      }
      hostId
      host {
        displayName
        id
      }
      guestId
      guest {
        id
        displayName
      }
      profileId
      profile {
        id
        displayName
      }
      start
      end
      type {
        name
        key
      }
      appointments {
        scheduledDate
        startTime
        endTime
        host {
          displayName
        }
      }
    }
  }
`
