import moment from 'moment'
import { get } from 'lodash'

import * as Booking from '@/utils/booking/BookingService'
import * as Availability from '@/utils/availability/AvailabilityService'

export const Actions = {
  GET_BOOKINGS: 'bookingGetBookings',
  SEARCH_BOOKINGS: 'bookingSearchBookings',
  UPSERT_BOOKING: 'bookingUpsertBooking'
}

const AVAILABILITY_COLOR_INDEX = {
  0: null,
  1: 'low-availability',
  2: 'limited-availability',
  3: 'plenty-availability'
}
export default {
  mutations: {},
  actions: {
    [Actions.UPSERT_BOOKING]: (state, booking, placement) => {
      return Booking.upsertBooking(booking, booking.isAssessment)
    },
    [Actions.GET_BOOKINGS]: async (_, range) => {
      const { start, end, includeHeatmap, status, tags, interval } = range
      const bookings = await Booking.getBookings({ start, end, status })

      if (!includeHeatmap) return bookings

      const hr = await Availability.getAvailabilityBlockSummaries({
        start,
        end,
        tags,
        interval
      })
      return get(hr, 'data.availabilityBlockSummaries', [])
        .map(s => {
          let color = s.count <= 2
            ? AVAILABILITY_COLOR_INDEX[s.count]
            : AVAILABILITY_COLOR_INDEX[3]

          return {
            title: `Count is ${s.count}`,
            start: moment(s.start),
            end: moment(s.end),
            count: s.count,
            rendering: 'background',
            overlap: true,
            editable: false,
            className: ['availability', color]
          }
        })
    },
    [Actions.SEARCH_BOOKINGS]: async (_, { start, end }) => {
      const bookings = await Booking.searchBookings({ start, end, status })
      return bookings
    }
  }
}
