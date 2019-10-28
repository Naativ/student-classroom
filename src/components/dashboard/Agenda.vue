<template>
  <v-card>
    <ProfileDialog :show="showProfileDialog" @profileCreated="goToBooking" @closeDialog="showProfileDialog = false"/>
    <PleaseClaim :show="pleaseClaimDialog" @closeDialog="pleaseClaimDialog = false"/>
    <v-card-title>
      <h3 v-if="!loading && !bookings.length">
        {{$t('dashboard.agenda.empty')}}
      </h3>
      <h3 v-else>{{$t('dashboard.agenda.upcoming')}}</h3>
    </v-card-title>
    <v-card-text>
      <v-layout v-if="loading" row justify-center>
        <v-progress-circular indeterminate size="64"/>
      </v-layout>
      <template v-if="!loading && bookings.length">
        <div v-if="containsAssessment(bookings)">
          <p>{{$t('dashboard.agenda.text')}}</p>
          <v-divider/>
        </div>
        <v-list
          v-for="(profile, index) in profilesWithBookings()"
          two-line
          :key="index"
          subheader
        >
        <v-divider v-if="hasBookings(profile)"/>
          <v-list-tile v-if="hasBookings(profile)">
            <v-list-tile-avatar>
              <img :src="getProfileById(profile).avatarUrl"/>
            </v-list-tile-avatar>
            <v-subheader class="learningProfile">
              {{getProfileById(profile).displayName}}
            </v-subheader>
          </v-list-tile>
          <v-list
          v-for="(booking, index) in bookings.filter(x => x.profileId === profile && checkIfOver(x))"
          three-line
          :key="index"
          subheader
          >
            <v-list-tile :key="index" class="topMargin">
              <v-list-tile-avatar>
                <v-icon v-if="!booking.teacherProfile.profilePic" x-large>
                  account_circle
                </v-icon>
                <img
                  v-if="booking.teacherProfile.profilePic"
                  :src="getAsset(booking.teacherProfile.profilePic)"
                >
              </v-list-tile-avatar>
              <v-list-tile-content class="appointment">
                <v-list-tile-title>
                  {{booking.teacher.displayName}}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{
                    `${getStartTime(booking.start)} - ${getEndTime(booking.end)}`
                  }}
                </v-list-tile-sub-title>
                <v-chip :class="convertBookingName(booking.type.name)" class="chip">
                  {{$t(`booking.type.${booking.type.key}`)}}
                </v-chip>
              </v-list-tile-content>
            </v-list-tile>
            <v-layout fluid justify-space-around>
            <v-btn outline color="green" flat small @click="join(booking)" :disabled="!canEnterClass(booking)">
          {{$t('booking.enter.classroom')}}
          </v-btn>
        <CancelBooking :booking="booking" @bookingCancelled="cancel"/>
        </v-layout>
          </v-list>
        </v-list>
      </template>
    </v-card-text>
    <v-btn
      class="primary text-capitalize"
      flat
      large
      round
      @click="checkForProfiles"
      v-if="!loading && !bookings.length"
    >{{$t('dashboard.agenda.action')}}</v-btn>
  </v-card>
</template>

<script>
import get from 'lodash.get'
import moment from 'moment'

import { mapGetters, mapActions } from 'vuex'
import { getAsset } from '@/utils/AssetService'
import ProfileDialog from '@/LearningProfile/Dialog.vue'
import * as BookingStore from '@/utils/booking/BookingStore'
import * as MemberStore from '@/utils/member/MemberStore'
import * as LearningProfileStore from '@/LearningProfile/Store'
import ExampleVideos from '@/components/dashboard/ExampleVideos.vue'
import PleaseClaim from '@/components/dashboard/PleaseClaim.vue'
import CancelBooking from '@/components/CancelBooking.vue'

const { Actions: MemberActions } = MemberStore
const { Actions: BookingActions } = BookingStore
const { Getters: LearningProfileGetters } = LearningProfileStore

export default {
  name: 'BookingAgenda',
  components: { ProfileDialog, ExampleVideos, PleaseClaim, CancelBooking },
  data() {
    return {
      bookings: [],
      getAsset,
      loading: false,
      range: {
        start: moment().subtract(30, 'minutes'),
        end: moment().add(2, 'weeks')
      },
      learnMore: false,
      showProfileDialog: false,
      pleaseClaimDialog: false
    }
  },
  async mounted() {
    await this.getBookings()
    await this.getProfiles()
    setInterval(this.updateTimestamps, 1000)
  },
  methods: {
    ...mapActions({
      getProfiles: LearningProfileStore.Actions.GET
    }),
    hasBookings(profile) {
      const bookings = this.bookings.filter(x => x.profileId === profile && this.checkIfOver(x))
      return bookings.length > 0
    },
    checkIfOver(x) {
      if (x.appointments.length > 0) {
        const appointment = x.appointments[0]
        return appointment.endTime === null
      } else {
        const time = this.$moment(x.end)
        const answer = moment().diff(time) <= 0
        return answer
      }
    },
    goToBooking() {
      this.$router.push('/homeroom/booking')
    },
    checkForProfiles() {
      if (!this.isClaimed) {
        this.pleaseClaimDialog = true
      } else if (!this.profile) {
        this.showProfileDialog = true
      } else {
        this.$emit('handleShowBookingDialog')
      }
    },
    containsAssessment(bookings) {
      const filtered = bookings.filter(booking => {
        return booking.type.key === 'placement'
      })
      return filtered.length > 0
    },
    async cancel() {
      await this.getBookings()
      this.$emit('updateBookings')
    },
    canEnterClass(booking) {
      const safeZone = moment(booking.start).subtract(15, 'minutes')
      if (moment().isAfter(safeZone)) {
        return true
      }
      return false
    },
    getProfileById(id) {
      const profile = this.profiles.find(_ => _.id === id)
      return profile
    },
    async getBookings() {
      this.loading = true
      const action = BookingActions.GET_BOOKINGS
      const bookings = await this.$store.dispatch(action, { ...this.range, status: 200 })
      const members = await this.getTeacherInfo(bookings)
      this.bookings = await this.getProfileInfo(members)
      if (this.bookings.length) {
        this.bookings.sort((a, b) => {
          return moment(a.start) - moment(b.start)
        })
      }
      this.loading = false
    },
    async getTeacherInfo(bookings) {
      const action = MemberActions.MEMBERS_INFO
      const ids = bookings.map(b => b.hostId)
      const info = await this.$store.dispatch(action, ids)
      return bookings.map(b => {
        const match = info.find(i => i.id === b.hostId)
        return { ...b, teacher: { ...match } }
      })
    },
    getEndTime(end) { return moment(end).format('h:mm a') },
    getStartTime(start) { return moment(start).format('MM/DD h:mm') },
    async getProfileInfo(bookings) {
      const action = MemberActions.PROFILE_ATTRIBUTES
      return Promise.all(bookings.map(async b => {
        const payload = { memberId: b.hostId, key: 'teacher-profile' }
        const result = await this.$store.dispatch(action, payload)
        return { ...b, teacherProfile: { ...get(result, 'value') } }
      }))
    },
    join(booking) {
      if (this.$browser.supported) {
        if (booking.typeId === 1007) {
          this.$router.push(`/conversation/${booking.id}`)
        } else {
          this.$router.push(`/classroom/${booking.id}`)
        }
      } else {
        this.$emit('handleShowBookingDialog')
      }
    },
    updateTimestamps() {
      this.bookings.forEach((b, index) => {
        const timeUntil = moment().to(moment(b.start))
        this.$set(this.bookings[index], `timeUntil`, timeUntil)
      })
    },
    profilesWithBookings() {
      var profileIds = []
      this.bookings.forEach(x => profileIds.push(x.profileId))
      profileIds = [...new Set(profileIds)]
      return profileIds
    },
    convertBookingName(name) {
      if (name === 'Placement Test Token') {
        return 'Assessment'
      } else if (name === 'Classroom') {
        return 'Lesson'
      } else {
        return name
      }
    }
  },
  computed: {
    ...mapGetters({
      profiles: LearningProfileGetters.profiles,
      profile: LearningProfileGetters.profile,
      member: 'member'
    }),
    isClaimed() {
      return !!this.member.claimedOn
    }
  }
}
</script>

<style lang="stylus" scoped>
.appointment {
  height: 100px
}
.learningProfile {
  padding: 0px
}
.chip {
  height: 20px
  color: white
}
.topMargin {
  margin-top: 15px
}
.Lesson {
  background-color: rgb(4,211,230)
}
.Assessment {
  background-color: rgb(219,109,138)
}
.Conversation {
  background-color: rgb(252,186,0)
}

</style>
