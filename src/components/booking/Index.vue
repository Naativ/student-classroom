<template>
  <div>
    <v-alert :value="success" type="success">{{success}}</v-alert>
    <v-layout row justify-center>
      <v-progress-circular v-if="loading" indeterminate />
      <h4 v-if="!loading && !availabilities.length">
        <p>
          {{`Looks like everything has been booked from ${range.start.format('M/D')} to ${range.end.format('M/D')}!`}}
        </p>
        <p>Please check back in a day or two for new slots to open!</p>
      </h4>
    </v-layout>
    <v-tabs v-if="!loading && availabilities.length" centered>
      <template v-for="(week, index) in weeks ">
        <template v-if="week.availability.length">
          <v-tab :key="index" ripple>
            {{`${week.start.format('M/D')}-${week.end.format('M/D')}`}}
          </v-tab>
          <v-tab-item :key="index">
            <Week
              :availability="week.availability"
              :end="week.end"
              :start="week.start"
              v-model="selections"
            />
          </v-tab-item>
        </template>
      </template>
    </v-tabs>
    <ConfirmBooking
      class="confirm"
      @dismissBookingDialog="dismissBookingDialog"
      @book="book"
      :booking="selectedBlock"
      :host="host"
      :showDialog="showDialog"
      v-if="selectedBlock"
    />
    <v-snackbar id="snackbar" v-model="snackbar" bottom :timeout="0">
      {{snackbarMessage}}
    </v-snackbar>
  </div>
</template>

<script>
import { each, last } from 'lodash'
import moment from 'moment'
import { mapActions, mapGetters, mapState } from 'vuex'

import ConfirmBooking from '@/components/booking/dialogs/ConfirmBooking.vue'
import Week from '@/components/booking/Week.vue'
import { Actions as AvailabilityActions } from '@/utils/availability/AvailabilityStore'
import { Actions as BookingActions } from '@/utils/booking/BookingStore'
import { delay } from '@/utils/Helpers'
import * as LearningProfileStore from '@/LearningProfile/Store'

const { Getters: LearningProfileGetters } = LearningProfileStore

const MEMBER_TAGS = {
  lessonYouth: 20,
  lessonAdult: 21,
  conversationChild: 22,
  conversationAdult: 23
}

export default {
  name: 'Booking',
  components: { ConfirmBooking, Week },
  props: {
    host: { type: Object, required: true },
    booking: { type: Object, default: null }
  },
  data() {
    return {
      availabilities: [],
      disabled: false,
      loading: false,
      range: {},
      selectedBlock: null,
      selections: [],
      showDialog: false,
      snackbar: false,
      snackbarMessage: 'Loading Availability',
      success: null,
      weeks: [],
      tags: []
    }
  },
  mounted() {
    const start = this.principalTags.indexOf('system:demo') > -1 ? moment() : moment().add(24, 'hours').endOf('hour')
    const end = start.clone().add(2, 'week')
    this.weeks = this.getWeeks({ start, end })
    this.range = { start, end }
    this.getEvents()
  },
  computed: {
    ...mapGetters({
      bookingType: 'bookingType',
      profile: LearningProfileGetters.profile
    }),
    ...mapState({
      principalTags: state => state.member.tags
    })
  },
  methods: {
    ...mapActions({
      getAvailability: AvailabilityActions.MEMBER_AVAILABILITY,
      upsertBooking: BookingActions.UPSERT_BOOKING
    }),
    async getEvents() {
      let interval = ''
      let age = ''
      if (this.booking) {
        age = moment(this.booking.profile.birthdate, 'YYYY-MM-DD')
        if (this.booking.type.key === 'conversation') {
          this.tags = moment().diff(age, 'years') <= 14
            ? [MEMBER_TAGS['conversationChild']]
            : [MEMBER_TAGS['conversationAdult']]
          interval = '15 minutes'
        } else if (this.booking.type.key === 'classroom') {
          this.tags = moment().diff(age, 'years') <= 14
            ? [MEMBER_TAGS['lessonYouth']]
            : [MEMBER_TAGS['lessonAdult']]
          interval = '30 minutes'
        }
      } else {
        age = moment(this.profile.birthdate, 'YYYY-MM-DD')
        if (this.bookingType === 'conversation') {
          this.tags = moment().diff(age, 'years') <= 14
            ? [MEMBER_TAGS['conversationChild']]
            : [MEMBER_TAGS['conversationAdult']]
          interval = '15 minutes'
        } else if (this.bookingType === 'lesson') {
          this.tags = moment().diff(age, 'years') <= 14
            ? [MEMBER_TAGS['lessonYouth']]
            : [MEMBER_TAGS['lessonAdult']]
          interval = '30 minutes'
        }
      }
      const tags = this.tags
      this.snackbar = this.loading = true
      this.snackbarMessage = `Loading Availability for ${this.host.displayName}`
      const availObj = { hostId: this.host.id, ...this.range, tags, interval }
      this.availabilities = await this.getAvailability(availObj)
      this.assignEvents(this.availabilities)
      this.snackbar = this.loading = false
    },
    getWeeks({ start, end }) {
      return [
        {
          availability: [],
          end: start.clone().endOf('week'),
          start: start.clone()
        },
        {
          availability: [],
          end: start.clone().add(1, 'week').endOf('week'),
          start: start.clone().add(1, 'week').startOf('week')
        },
        {
          availability: [],
          end: start.clone().add(2, 'weeks'),
          start: start.clone().add(2, 'weeks').startOf('week')
        }
      ]
    },
    parseEvent(block) {
      return {
        ...block,
        end: moment(block.end),
        start: moment(block.start)
      }
    },
    assignEvents(blocks) {
      each(this.weeks, week => {
        each(blocks, b => {
          const block = this.parseEvent(b)
          if (
            block.start.valueOf() > week.start.valueOf() &&
            block.end.valueOf() < week.end.valueOf()
          ) return week.availability.push(block)
        })
      })
    },
    update(booking) { this.$emit('update', booking) },
    async book() {
      this.showDialog = false
      this.loading = true
      let type = this.bookingType
      if (this.booking) {
        type = this.booking.type.key
      }
      let isAssessment = false
      if (!this.booking) {
        isAssessment = this.profile.enrollments.length <= 0
      }
      let profileId
      if (this.booking) {
        profileId = this.booking.profileId
      }
      await this.upsertBooking({ ...this.selectedBlock, hostId: this.host.id, type, isAssessment, profileId })
      this.$emit('booked')
      this.success = 'You have successfully booked a class!'
      this.loading = false
      this.weeks = this.getWeeks(this.range)
      this.getEvents()
      await delay(5000)
      this.success = null
    },
    dismissBookingDialog() {
      this.showDialog = false
      this.selectedBlock = null
      this.selections = []
    }
  },
  watch: {
    selections(bookings) {
      this.selectedBlock = last(bookings)
      this.showDialog = true
    },
    profile: async function(val) {
      this.weeks = this.getWeeks(this.range)
      this.getEvents()
    },
    bookingType: async function(val) {
      this.weeks = this.getWeeks(this.range)
      this.getEvents()
    }
  }
}
</script>

<style lang="stylus" scoped>
.booking
  max-width 100%
  margin auto
  padding 12px 0px
  .marg-top
    margin-top 15px

.confirm
  z-index 300
  margin 12px
</style>
