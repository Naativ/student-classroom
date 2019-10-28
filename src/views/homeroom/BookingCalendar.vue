<template>
  <div>
  <div v-if="!$browser.supported" class="calendar-wrapper">
    <h1>{{$t('booking.title')}}</h1>
    <UnsupportedClient />
  </div>
  <div v-else class="calendar-wrapper">
    <h1>{{$t('booking.title')}}</h1>
    <p>{{$t('booking.desc')}}</p>
    <full-calendar id="calendar" :config="config" ref="calendar" style="margin: auto -16px;"/>
    <v-snackbar v-model="snackbar" bottom :timeout="0">{{snackbarMessage}}</v-snackbar>
    <BookingDialog
      :showDialog="showDialog"
      :lessonTime="lessonTime"
      :loading="dialogLoading"
      :teachers="availableTeachers"
      :bookingType="bookingType"
      @selected="book"
      @dismissDialog="dismissDialog"
      :canBook="canBook"
      :canBookMessage="canBookMessage"
    />
    <v-dialog v-model="loadingInfo" persistent max-width="250">
      <v-card>
        <v-card-text>
          <Loading />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
  </div>
</template>

<script>
import get from 'lodash.get'
import moment from 'moment'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { Mutations } from '@/store'

import Loading from '@/components/Loading.vue'

import BookingDialog from '@/components/booking/dialogs/Teachers.vue'
import * as AvailabilityStore from '@/utils/availability/AvailabilityStore'
import * as MemberStore from '@/utils/member/MemberStore'
import * as BookingStore from '@/utils/booking/BookingStore'
import * as LearningProfileStore from '@/LearningProfile/Store'
import UnsupportedClient from '@/UnsupportedClient.vue'

const { Actions: AvailabilityActions } = AvailabilityStore
const { Actions: BookingActions } = BookingStore
const { Actions: MemberActions, Getters: MemberGetters } = MemberStore
const { Getters: LearningProfileGetters } = LearningProfileStore

export default {
  name: 'Booking',
  components: {
    Loading,
    BookingDialog,
    UnsupportedClient
  },
  mounted() {
    if (this.profile) {
      this.checkBookingAvailability()
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.bookingType) {
        return vm.$router.push(`/homeroom/dashboard`)
      }
    })
  },
  data() {
    return {
      availableTeachers: [],
      loadingInfo: true,
      canBook: false,
      canBookMessage: this.$t('booking.cannot.book'),
      config: {
        allDaySlot: false,
        columnHeaderFormat: 'ddd D',
        defaultView: 'agendaWeek',
        editable: true,
        eventColor: '#00d3e4',
        events: this.getBookings,
        header: { left: 'prev,next', center: 'title', right: '' },
        height: 'parent',
        locale: this.$t('system.bcp.47.language'),
        selectLongPressDelay: 200,
        nowIndicator: true,
        eventClick: this.eventClick,
        select: this.onTimeSelected,
        selectAllow: this.onSelect,
        selectHelper: false,
        selectOverlap: true,
        timeFormat: 'h:mm a',
        timezone: 'local',
        validRange: {
          start: moment().add(24, 'hours').endOf('hour'),
          end: moment().add(2, 'weeks')
        }
      },
      dialogLoading: false,
      lessonTime: null,
      showDialog: false,
      snackbar: false,
      snackbarMessage: this.$t('loading.available.teachers'),
      tags: []
    }
  },
  methods: {
    ...mapActions({
      upsertBooking: BookingActions.UPSERT_BOOKING
    }),
    ...mapMutations({
      setBookingType: Mutations.SET_BOOKING_TYPE
    }),
    async book(bookingObject) {
      this.dialogLoading = true
      const teacher = bookingObject.teacher
      const summary = bookingObject.summary
      teacher.start = summary.start
      teacher.end = summary.end
      // We do not want to send the teacher's ID through
      delete teacher.id
      const type = this.bookingType
      const isAssessment = this.profile.enrollments.length <= 0
      await this.upsertBooking({ ...teacher, hostId: teacher.memberId, type, isAssessment })
      this.$refs.calendar.fireMethod('removeEvents')
      this.$refs.calendar.fireMethod('refetchEvents')
      this.showDialog = false
      this.dialogLoading = false
      this.$router.push(`/homeroom/dashboard`)
    },
    dismissDialog() {
      this.showDialog = false
    },
    onSelect(info) {
      return moment.duration(info.end - info.start).asMinutes() <= 30
    },
    async getAvailableBlocks(range) {
      const tags = this.tags
      let interval = ''
      if (this.bookingType === 'conversation') {
        interval = '15 minutes'
      } else if (this.bookingType === 'lesson') {
        interval = '30 minutes'
      }
      try {
        const result = await this.$store.dispatch(AvailabilityActions.AVAILABILITY, { ...range, tags, interval })
        return result
      } catch (e) {
        console.warn(e)
      }
    },
    async getBookings(start, end, _, cb) {
      let interval = ''
      if (this.bookingType === 'conversation') {
        const age = moment(this.profile.birthdate, 'YYYY-MM-DD')
        this.tags = moment().diff(age, 'years') <= 15 ? [22] : [23]
        interval = '15 minutes'
      } else if (this.bookingType === 'lesson') {
        const age = moment(this.profile.birthdate, 'YYYY-MM-DD')
        this.tags = moment().diff(age, 'years') <= 15 ? [20] : [21]
        interval = '30 minutes'
      }
      const tags = this.tags
      this.loadingInfo = true
      if (this.bookingType) {
        const bookings = await this.$store.dispatch(BookingActions.GET_BOOKINGS, {
          start,
          end,
          includeHeatmap: true,
          tags,
          interval
        })
        this.loadingInfo = false
        return cb(bookings)
      }
    },
    async eventClick(a, b, c) {},
    getProfileInfo(members) {
      const action = MemberActions.PROFILE_ATTRIBUTES
      return Promise.all(members.map(async m => {
        const payload = { memberId: m.memberId, key: 'teacher-profile' }
        const result = await this.$store.dispatch(action, payload)
        return { ...m, ...get(result, 'value') }
      }))
    },
    async getBlockInfo(blocks) {
      const action = MemberActions.MEMBERS_INFO
      const teacherIds = blocks.map(b => b.memberId)
      const membersByIds = await this.$store.dispatch(action, teacherIds)
      return blocks.map(b => {
        const found = membersByIds.find(m => m.id === b.memberId)
        return { ...b, ...found }
      })
    },
    addAvailabilitySummaries(teachers) {
      const newTeachers = []
      let existingTeacher = false
      let availabilitySummary = {
        start: String,
        end: String
      }
      teachers.map(teacher => {
        existingTeacher = newTeachers.filter(e => e.memberId === teacher.memberId).length > 0
        availabilitySummary = { start: teacher.start, end: teacher.end }
        if (existingTeacher) {
          const teacherIndex = newTeachers.findIndex(t => t.memberId === teacher.memberId)
          newTeachers[teacherIndex].availabilitySummaries.push(availabilitySummary)
        } else {
          const teacherWithSummary = { ...teacher, availabilitySummaries: [availabilitySummary] }
          newTeachers.push(teacherWithSummary)
        }
      })
      return newTeachers
    },
    async onTimeSelected(start, end) {
      this.availableTeachers = []
      this.lessonTime = start.format('MMM D - h:mm a')
      this.snackbar = true
      this.dialogLoading = true
      this.showDialog = true
      const result = await this.getAvailableBlocks({ start, end })
      const { data: { availabilityBlocksRandom } } = result
      const members = await this.getBlockInfo(availabilityBlocksRandom)
      this.availableTeachers = await this.getProfileInfo(members)
      this.availableTeachers = this.addAvailabilitySummaries(this.availableTeachers)
      this.snackbar = false
      this.dialogLoading = false
    },
    checkBookingAvailability() {
      if ((this.profile && this.profile.enrollments.length === 0) || this.balance > 0) {
        this.canBook = true
      } else {
        if (!this.profile) {
          this.canBookMessage = this.$t('book.select.profile')
        }
        if (this.profile && this.profile.enrollments.length > 0 && this.balance === 0) {
          this.canBookMessage = this.$t('book.insufficient.credit')
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      profile: LearningProfileGetters.profile,
      profileLoading: LearningProfileGetters.loading,
      balance: MemberGetters.BALANCE,
      bookingType: 'bookingType'
    })
  },
  watch: {
    profileLoading(newVal, oldVal) {
      if (!newVal) {
        this.loadingInfo = newVal
        this.checkBookingAvailability()
      }
    },
    profile() {
      this.checkBookingAvailability()
      this.$refs.calendar.fireMethod('removeEvents')
      this.$refs.calendar.fireMethod('refetchEvents')
    }
  }
}
</script>

<style lang="stylus" >
.calendar-wrapper {
  height: 80vh;
}

.low-availability {
  background-color: lightgreen !important;
}

.limited-availability {
  background-color: green !important;
}

.plenty-availability {
  background-color: darkgreen !important;
}
</style>
