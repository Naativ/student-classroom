<template>
  <v-card>
    <ProfileDialog :show="showProfileDialog" @profileCreated="goToBooking" @closeDialog="showProfileDialog = false"/>
    <PleaseClaim :show="pleaseClaimDialog" @closeDialog="pleaseClaimDialog = false"/>
    <v-card-title>
      <h3 v-if="enrollments.length > 0">{{$t('dashboard.enrolled.title')}}</h3>
      <h3 v-else>{{$t('dashboard.assessment.title')}}</h3>
    </v-card-title>
    <v-card-text v-if="enrollments.length > 0">
      {{$t(`curriculum.courses.id.${enrollments[0].courseId}`)}}
    </v-card-text>
    <v-card-text v-else-if="!showBookButton">
      {{$t('dashboard.assessment.text.booked')}}
    </v-card-text>
    <v-card-text v-else>
      <p>{{$t('dashboard.assessment.text')}}</p>
      <v-btn
        data-cy="Book Assessment"
        class="primary text-capitalize"
        flat
        large
        round
        @click="checkForProfiles"
      >
        {{$t('dashboard.assessment.action')}}
      </v-btn>
    </v-card-text>
    <v-card-actions>
      <v-dialog v-if="enrollments.length === 0" v-model="learnMore" max-width="600px">
        <v-btn flat slot="activator">
          {{$t('dashboard.learnMore')}}
        </v-btn>
        <v-card>
          <v-toolbar card dark color="primary">
            <v-spacer></v-spacer>
            <v-btn icon @click="learnMore = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-title primary-title>
            <h3>{{$t('dashboard.assessment.title')}}</h3>
          </v-card-title>
          <v-card-text>
            <p>{{$t('dashboard.assessment.learnmore.text.1')}}</p>
            <p>{{$t('dashboard.assessment.learnmore.text.2')}}</p>
            <ExampleVideos />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapMutations } from 'vuex'
import ProfileDialog from '@/LearningProfile/Dialog.vue'
import * as LearningProfileStore from '@/LearningProfile/Store'
import ExampleVideos from '@/components/dashboard/ExampleVideos.vue'
import PleaseClaim from '@/components/dashboard/PleaseClaim.vue'
import { Mutations } from '@/store'

const { Getters: LearningProfileGetters } = LearningProfileStore

export default {
  name: 'BookingAssessment',
  props: ['bookings'],
  data() {
    return {
      learnMore: false,
      range: {
        start: moment().subtract(1, 'hour'),
        end: moment().add(2, 'weeks')
      },
      showProfileDialog: false,
      pleaseClaimDialog: false
    }
  },
  components: {
    ProfileDialog,
    ExampleVideos,
    PleaseClaim
  },
  methods: {
    goToBooking() {
      this.$router.push('/homeroom/booking')
    },
    checkForProfiles() {
      if (!this.isClaimed) {
        this.pleaseClaimDialog = true
      } else if (!this.profile) {
        this.showProfileDialog = true
      } else {
        this.setBookingType('lesson')
        this.goToBooking()
      }
    },
    ...mapMutations({
      setBookingType: Mutations.SET_BOOKING_TYPE
    })
  },
  computed: {
    ...mapGetters({
      profile: LearningProfileGetters.profile
    }),
    showBookButton() {
      if (!this.profile) {
        return true
      }
      if (this.enrollments.length > 0) {
        return false
      }
      const bookingForCurrentProfile = this.bookings.find(_ => _.profileId === this.profile.id && _.type.key === 'placement')
      return !bookingForCurrentProfile
    },
    enrollments() {
      if (this.profile && this.profile.enrollments) {
        return this.profile.enrollments
      }
      return []
    },
    isClaimed() {
      return !!this.$store.state.member.claimedOn
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
