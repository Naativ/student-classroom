<template>
  <!-- <v-layout fluid justify-center> -->
  <v-dialog max-width="600px" v-model="cancelBookingDialog" persistent>
    <v-btn data-cy="Cancel Booking" outline small color="error" flat slot="activator">
      {{$t('booking.cancel')}}
    </v-btn>
    <v-card>
      <v-card-title primary-title>
        <h3 class="headline mb-0">{{$t('booking.cancel.title')}}</h3>
      </v-card-title>
      <v-card-text>
        {{$t('booking.cancel.description')}}
      </v-card-text>
      <v-card-actions>
        <v-btn depressed color="#00d3e6" @click="cancelBookingDialog = false">{{$t('booking.cancel.dismiss')}}</v-btn>
        <v-btn data-cy="Confirm Cancel Booking" depressed :loading="loading" :disabled="loading" color="#f382ae" @click.native="cancel">{{$t('booking.cancel.confirm')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- </v-layout> -->
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import * as BookingStore from '@/utils/booking/BookingStore'
import { upsertAppointment, APPOINTMENT_BY_BOOKING_ID } from '@/graphql/Appointments.gql'

const { Actions: BookingActions } = BookingStore

export default {
  name: 'CancelBookingDialog',
  props: ['booking'],
  data() {
    return {
      cancelBookingDialog: false,
      loading: false
    }
  },
  methods: {
    ...mapActions({
      upsertBooking: BookingActions.UPSERT_BOOKING
    }),
    async cancel() {
      this.loading = true
      if (moment().isAfter(moment(this.booking.start).subtract(24, 'hours'))) {
        const isAssessment = this.booking.profile.enrollments.length === 0
        let appointmentType = isAssessment ? 'PLACEMENT' : 'CLASSROOM'
        if (isAssessment) {
          if (this.booking.typeId === 1007) {
            appointmentType = 'CONVERSATION'
            this.booking.type = 'conversation'
          }
        }
        const { data } = await this.$apollo.mutate({
          mutation: APPOINTMENT_BY_BOOKING_ID,
          variables: {
            input: {
              bookingId: this.booking.id,
              timeLimit: 25,
              maxParticipant: 2,
              type: appointmentType
            }
          }
        })
        await this.$apollo.mutate({
          mutation: upsertAppointment,
          variables: {
            appt: {
              id: data.appointmentObtain.id,
              bookingId: this.booking.id,
              hostId: this.booking.hostId,
              scheduledDate: this.booking.start,
              startTime: moment.utc(),
              endTime: moment.utc(),
              type: appointmentType,
              participants: [this.booking.guestId],
              status: 301
            }
          }
        })
        await this.upsertBooking({ ...this.booking, statusId: 301 })
      } else {
        if (this.booking.typeId === 1007) {
          this.booking.type = 'conversation'
        }
        await this.upsertBooking({ ...this.booking, statusId: 204 })
      }
      this.$emit('bookingCancelled')
      this.loading = false
      this.cancelBookingDialog = false
    }
  }
}
</script>
