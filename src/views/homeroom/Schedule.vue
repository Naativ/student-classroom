<template>
  <div class="schedule">
    <h1>{{$t('schedule.title')}}</h1>
    <div>
      <v-layout align-center justify-space-between row fill-height>
        <v-flex xs1>
          <v-btn icon @click="previousMonth">
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs10 class="centered">
          <p class="headline">
          {{getMonth(start)}}
          </p>
        </v-flex>
        <v-flex xs1>
          <v-btn icon @click="nextMonth">
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </div>
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="bookings"
      hide-actions
      class="elevation-1"
    >
      <template v-slot:no-data>
        <p class="headline centered">
          {{$t('schedule.no.bookings.this.month')}}
        </p>
      </template>
      <template v-slot:items="props">
        <td>{{ $moment(props.item.start).format('dddd Do h:mm a') }}</td>
        <td>{{ props.item.host.displayName }}</td>
        <td>{{ props.item.profile.displayName }}</td>
        <td :class="bookingStatusClass(props.item)">{{ checkBookingStatus(props.item) }}</td>
        <td>
          <v-btn v-if="canEnter(props.item)" small @click="enterClassroom(props.item)">{{ $t('booking.enter.classroom') }}</v-btn>
          <CancelBooking v-if="canCancel(props.item)" :booking="props.item" @bookingCancelled="getSortedBookings"/>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import sortBy from 'lodash.sortby'
import { mapActions } from 'vuex'
import { Actions as bookingActions } from '@/utils/booking/BookingStore'
import CancelBooking from '@/components/CancelBooking.vue'

export default {
  name: 'Schedule',
  components: { CancelBooking },
  data() {
    return {
      loading: false,
      start: this.$moment().startOf('month'),
      end: this.$moment().endOf('month'),
      bookings: [],
      headers: [
        { text: this.$t('schedule.booking.start'), align: 'left', sortable: false },
        { text: this.$t('schedule.booking.teacher'), align: 'left', sortable: false },
        { text: this.$t('schedule.booking.student'), align: 'left', sortable: false },
        { text: this.$t('schedule.booking.status'), align: 'left', sortable: false },
        { text: this.$t('schedule.booking.actions'), align: 'left', sortable: false }
      ]
    }
  },
  mounted() {
    this.getSortedBookings()
  },
  methods: {
    ...mapActions({
      searchBookings: bookingActions.SEARCH_BOOKINGS
    }),
    async getSortedBookings() {
      this.loading = true
      const bookings = await this.searchBookings({ start: this.start, end: this.end })
      this.bookings = sortBy(bookings, b => new Date(b.start)).reverse()
      this.loading = false
    },
    checkBookingStatus(booking) {
      if (this.canCancel(booking)) {
        return this.$t('schedule.status.upcoming')
      }
      if (booking.status.key !== 'reserved') {
        return this.$t('schedule.status.cancelled')
      }
      if (booking.appointments.length > 0 && booking.appointments[0].endTime) {
        return this.$t('schedule.status.done')
      }
      return this.$t('schedule.status.incomplete')
    },
    bookingStatusClass(booking) {
      if (booking.statusId !== 200) {
        return 'cancelled'
      }
      if (this.canCancel(booking)) {
        return 'upcoming'
      }
      if (booking.appointments.length > 0 && booking.appointments[0].endTime) {
        return 'done'
      }
      return 'incomplete'
    },
    canEnter(booking) {
      if (booking.statusId !== 200) {
        return false
      }
      return this.$moment().add(15, 'minutes').isAfter(this.$moment(booking.start)) && this.canCancel(booking)
    },
    canCancel(booking) {
      if (booking.statusId !== 200) {
        return false
      }
      return this.$moment(booking.start).isAfter(this.$moment())
    },
    enterClassroom(booking) {
      this.$router.push(`/classroom/${booking.id}`)
    },
    previousMonth() {
      this.start = this.$moment(this.start).subtract(1, 'month').startOf('month')
      this.end = this.$moment(this.start).endOf('month')
      this.getSortedBookings()
    },
    nextMonth() {
      this.start = this.$moment(this.start).add(1, 'month').startOf('month')
      this.end = this.$moment(this.start).endOf('month')
      this.getSortedBookings()
    },
    getMonth() {
      return this.$moment(this.start).format('MMMM YYYY')
    }
  }
}
</script>

<style lang="stylus" scoped>
.done
  color: green
.upcoming
  color: blue
.cancelled
  color: red
</style>
