import { get } from 'lodash'

import {
  GET_BOOKING,
  UPSERT_BOOKING,
  SEARCH_BOOKING
} from '@/graphql/Booking.gql'
import store from '@/store'
import { createProvider } from '@/vue-apollo'

const apollo = createProvider().defaultClient

export const STATUS = {
  reserved: 200,
  archived: 204
}

export const TYPE = {
  interview: 1003,
  classroom: 1004,
  placement: 1006,
  conversation: 1007
}

export const TYPE_KEY = {
  PLACEMENT: 'placement',
  CLASSROOM: 'classroom',
  CONVERSATION: 'conversation'
}

export const MEMBER_TAGS = {
  interviewer: 4
}

export const upsertBooking = (bookingObj, isAssessment = false) => {
  let key, cost
  if (get(bookingObj, 'type') === 'conversation') {
    key = TYPE_KEY.CONVERSATION
    cost = 1000
  } else {
    key = TYPE_KEY.CLASSROOM
    cost = 1000
    if (isAssessment) {
      key = TYPE_KEY.PLACEMENT
      cost = 1002
    }
  }
  let profileId = get(store, 'state.learningProfileStore.currentLearningProfile.id')
  if (get(bookingObj, 'profileId') !== undefined) {
    profileId = get(bookingObj, 'profileId')
  }
  return apollo
    .mutate({
      mutation: UPSERT_BOOKING,
      variables: {
        input: {
          id: get(bookingObj, 'id'),
          availabilityId: get(bookingObj, 'availabilityId'),
          end: get(bookingObj, 'end'),
          guestId: get(store, 'state.member.id'),
          profileId: profileId,
          hostId: get(bookingObj, 'hostId'),
          start: get(bookingObj, 'start'),
          statusId: get(bookingObj, 'statusId') || STATUS['reserved'],
          typeKey: key,
          costFree: false,
          costUnitId: cost
        }
      }
    })
    .then(({ data: { bookingUpsert } }) => bookingUpsert)
}

export const getBookings = range => {
  const { start, end } = range
  return apollo
    .query({
      query: GET_BOOKING,
      variables: {
        input: {
          guestIds: [store.state.member.id],
          typeIds: [TYPE['classroom'], TYPE['placement'], TYPE['conversation']],
          statusIds: [STATUS['reserved']],
          start: start.utc().toISOString(),
          end: end.utc().toISOString()
        }
      },
      fetchPolicy: 'network-only'
    })
    .then(({ data: { bookings } }) => bookings)
}

export const searchBookings = search => {
  const { start, end } = search
  return apollo
    .query({
      query: SEARCH_BOOKING,
      variables: {
        input: {
          guestIds: [store.state.member.id],
          start: start.utc().toISOString(),
          end: end.utc().toISOString()
        }
      },
      fetchPolicy: 'network-only'
    })
    .then(({ data: { bookings } }) => bookings)
}
