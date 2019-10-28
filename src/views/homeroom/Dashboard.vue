<template>
  <div class="homeroom" ref="homeroom">
    <ProfileDialog :show="showProfileDialog" @profileCreated="profileCreated(type)" @closeDialog="showProfileDialog = false"/>
    <v-layout align-center justify-space-around>
      <v-dialog max-width="500px" v-model="showBookingDialog">
        <v-card>
          <v-card-title class="headline mb-0" align-center primary-title>
            <v-spacer/>
            {{$t('tokens.remaining.balance')}}: {{balance}} {{$t('dashboard.tokens')}}
            <v-spacer/>
          </v-card-title>
          <v-divider
          ></v-divider>
          <v-layout row>
            <v-layout justify-space-around align-center column>
              <!-- <v-container justify-space-around align-center> -->
                <h2 style="padding: 5px 0;">{{$t('lesson')}}</h2>
                <div style="padding: 5px 0;">25 {{$t('dashboard.minutes')}}</div>
                <div style="padding: 5px 0;">2 {{$t('dashboard.tokens')}}</div>
                <v-btn style="margin-bottom: 30px" round :disabled="balance < 2" @click="goToBooking" class="primary text-capitalize">{{$t('booking.dialog.action')}}</v-btn>
              <!-- </v-container> -->
            </v-layout>
            <v-divider
              class="mx-3"
              vertical
            ></v-divider>
            <v-layout justify-space-around align-center column>
              <!-- <v-container> -->
                <h2 style="padding: 5px 0;">{{$t('conversation')}}</h2>
                <div style="padding: 5px 0;">12 {{$t('dashboard.minutes')}}</div>
                <div style="padding: 5px 0;">1 {{$t('dashboard.tokens')}}</div>
                <v-btn style="margin-bottom: 30px" :disabled="balance < 1" @click="goToConversation" round class="primary text-capitalize">{{$t('booking.dialog.action')}}</v-btn>
              <!-- </v-container> -->
            </v-layout>
          </v-layout>
        </v-card>
      </v-dialog>
    </v-layout>
    <div class="loading" v-if="!member.id"><Loading/></div>
    <v-alert :value="error" type="error">{{error}}</v-alert>
    <v-alert :value="success" type="success">{{success}}</v-alert>
    <v-alert :value="!isClaimed" type="error">
      <i18n path="dashboard.verify.email" tag="p">
        <a place="resendLink" @click="resendClaimEmail">
          {{ $t('dashboard.verify.email.link') }}
        </a>
      </i18n>
    </v-alert>
    <div class="centered" v-if="member.id">
      <v-layout row wrap>
        <v-flex pa-2 d-flex xs12>
          <v-card :class="[completedAssessment ? 'welcomePadding' : 'assessmentPadding' ]" class="welcome-card">
            <div class="pa-2" style="max-width: 800px; margin: auto;">
              <h2>{{$t('dashboard.prelaunch.title')}}</h2>
              <p v-if="!completedAssessment">{{$t('dashboard.prelaunch.text')}}</p>
              <v-btn
                v-if="!completedAssessment"
                class="primary text-capitalize"
                flat
                large
                round
                @click="checkForProfiles(lesson)"
              >
                {{$t('dashboard.assessment.action')}}
              </v-btn>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
        <v-flex pa-2 d-flex xs12 sm12 lg12>
          <TeacherSearch isWidget />
        </v-flex>
      <v-layout row wrap fill-height class="disable-cards">
        <v-flex v-if="showTeacherBooking()" pa-2 d-flex xs12 sm6 lg4>
          <TeacherBooking :teacher="teacher" @updateBookings="updateBookings"/>
        </v-flex>
        <v-flex v-if="balance > 0 || subscriptions.length > 0" pa-2 d-flex xs12 sm6 lg4>
           <v-card>
            <v-card-title>
              <h3>{{$t('dashboard.available.tokens')}}</h3>
            </v-card-title>
            <v-card-text>
              <div v-if="!balanceLoading" class="display-3 centered">
              {{balance}}
              </div>
              <h3>{{$t('dashboard.tokens')}}</h3>
              <v-progress-circular v-if="balanceLoading" indeterminate />
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn round class="primary text-capitalize" @click="handleShowBookingDialog" :disabled="$store.state.MemberStore.balance === 0" flat>
                {{$t('booking.dialog.action')}}
              </v-btn>
              <v-spacer/>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex pa-2 d-flex xs12 sm6 lg4>
          <Assessment :bookings="bookings"/>
        </v-flex>
        <v-flex pa-2 d-flex xs12 sm6 lg4 v-if="profile && profile.enrollments.length > 0">
          <ReBook/>
        </v-flex>
        <v-flex v-if="showAgenda()" pa-2 d-flex xs12 sm6 lg4>
          <Agenda @updateBookings="updateBookings" @handleShowBookingDialog="handleShowBookingDialog"/>
        </v-flex>
        <v-flex pa-2 d-flex xs12 sm6 lg4>
          <Subscription :subscriptions="subscriptions"/>
        </v-flex>
        <v-flex pa-2 d-flex xs12 sm6 lg4>
          <v-card>
            <v-card-title>
              <h3>{{$t('dashboard.customer.support.title')}}</h3>
            </v-card-title>
            <v-card-text>
              <p>{{$t('dashboard.customer.support.text')}}</p>
              <a :href="`mailto:${supportEmail}`">{{supportEmail}}</a>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'

import * as BookingStore from '@/utils/booking/BookingStore'
import * as LearningProfileStore from '@/LearningProfile/Store'
import * as SubscriptionStore from '@/Subscriptions/Store.js'
import * as MemberStore from '@/utils/member/MemberStore'

import Agenda from '@/components/dashboard/Agenda.vue'
import Assessment from '@/components/dashboard/Assessment.vue'
import Library from '@/components/dashboard/Library.vue'
import Subscription from '@/components/dashboard/Subscription.vue'
import Loading from '@/components/Loading.vue'
import TeacherBooking from '@/components/dashboard/TeacherBooking.vue'
import TeacherSearch from '@/views/homeroom/TeacherSearch.vue'
import ProfileDialog from '@/LearningProfile/Dialog.vue'
import ReBook from '@/components/ReBook.vue'

import { Actions, Mutations } from '@/store'
import { delay } from '@/utils/Helpers.js'

const { Actions: BookingActions } = BookingStore
const { Getters: LearningProfileGetters } = LearningProfileStore

const tenantId = ~~process.env.VUE_APP_TENANT_ID
const claimTemplateId = process.env.VUE_APP_CLAIM_TEMPLATE_ID

export default {
  name: 'homeroom',
  components: {
    Agenda,
    Assessment,
    Library,
    Loading,
    ReBook,
    Subscription,
    TeacherBooking,
    TeacherSearch,
    ProfileDialog
  },
  async mounted() {
    if (this.member && this.member.id) {
      await this.getBalance(this.member.id)
      await this.updateBookings()
    }
    if (this.profile && this.profile.enrollments) {
      this.completedAssessment = this.profile.enrollments.length > 0
    }
    this.$nextTick(() => {
      this.supportEmail = `${this.locale.current.code}support@naativ.com`
    })
  },
  data() {
    return {
      completedAssessment: true,
      showBookingDialog: false,
      loading: true,
      success: null,
      error: null,
      lesson: 'lesson',
      conversation: 'conversation',
      supportEmail: 'support@naativ.com',
      bookings: [],
      range: {
        start: moment().subtract(30, 'minutes'),
        end: moment().add(2, 'weeks')
      },
      teacher: {},
      showProfileDialog: false,
      type: ''
    }
  },
  watch: {
    member: async function(val) {
      if (val.id) {
        await this.updateBookings()
        await this.getBalance(val.id)
        const details = await this.getMemberAttr('registration-details')
        if (details && details.value && details.value.slug && details.value.id) {
          this.teacher.slug = details.value.slug
          this.teacher.id = details.value.id
        }
      }
    },
    profile: async function(val) {
      this.completedAssessment = this.profile.enrollments.length > 0
    },
    locale: function(val) {
      this.supportEmail = `${val.code}support@naativ.com`
    }
  },
  methods: {
    ...mapActions({
      getBookings: BookingActions.GET_BOOKINGS,
      getMemberAttr: Actions.GET_MEMBER_ATTRIBUTE,
      getBalance: MemberStore.Actions.MEMBER_BALANCE
    }),
    ...mapMutations({
      setBookingType: Mutations.SET_BOOKING_TYPE
    }),
    goToBooking() {
      this.setBookingType('lesson')
      this.$router.push('/homeroom/booking')
    },
    goToConversation() {
      this.setBookingType('conversation')
      this.$router.push('/homeroom/booking')
    },
    handleShowBookingDialog() {
      if (this.$browser.supported) {
        this.showBookingDialog = true
      } else {
        this.goToBooking()
      }
    },
    async updateBookings() {
      this.bookings = await this.getBookings({ ...this.range, status: 200 })
      await this.getBalance(this.member.id)
    },
    async resendClaimEmail() {
      try {
        await this.$store.dispatch(Actions.GENERATE_TOKEN, {
          tenantId,
          type: 'claim',
          templateId: claimTemplateId
        })
        this.setSuccess(this.$t('dashboard.verify.email.sent.success'))
      } catch (e) {
        this.setError(e.message || e)
      }
    },
    async showAgenda() {
      if (this.bookings.length > 0) {
        return true
      }
      return false
    },
    showTeacherBooking() {
      if (this.teacher && this.teacher.slug && this.teacher.id) {
        if (
          this.bookings.length === 0 &&
          (!this.profile || this.profile.enrollments.length === 0)
        ) {
          return true
        }
      }
      return false
    },
    hasTag(tag) {
      const tags = this.member.tags
      return tags.indexOf(tag) > -1
    },
    async setSuccess(message) {
      this.success = message
      await delay(5000)
      this.success = null
    },
    async setError(message) {
      this.error = message
      await delay(6000)
      this.error = null
    },
    checkForProfiles(type) {
      if (!this.profile) {
        this.showProfileDialog = true
        this.type = type
      } else if (type === this.lesson) {
        this.setBookingType('lesson')
        this.goToBooking()
      } else if (type === this.conversation) {
        this.goToConversation()
      }
    },
    profileCreated(type) {
      if (type === this.lesson) {
        this.goToBooking()
      } else if (type === this.conversation) {
        this.goToConversation()
      }
    }
  },
  computed: {
    ...mapState({
      balance: state => state.MemberStore.balance,
      balanceLoading: state => state.MemberStore.balanceLoading,
      locale: state => state.locale
    }),
    ...mapGetters({
      locale: 'locale',
      profile: LearningProfileGetters.profile,
      subscriptions: SubscriptionStore.Getters.subscriptions,
      member: 'member'
    }),
    joinedOn() {
      return moment.utc(this.member.joinedOn).format('MMM Do YYYY')
    },
    isClaimed() {
      return !!this.member.claimedOn
    }
  }
}
</script>
<style lang="stylus">
.homeroom
  min-height calc(100vh - 48px)
  overflow scroll

  .welcome-card
    color white !important
    background-image url(../../assets/images/prelaunch/sprinkles.svg)
    background-repeat no-repeat
    background-color #db6d8a !important
    background-position 0px 45px
    background-size contain
    padding 40px 5px

    h2
      font-size: 34px

    p
      font-size: 16px

    @media screen and (min-width: 600px)
      background-position top center
      padding 45px 25px
      h2
        font-size: 56px

      p
        font-size: 24px

  .assessmentPadding
    padding 40px 5px
    @media screen and (min-width: 600px)
      padding 45px 25px

  .welcomePadding
    padding 16px 25px
    @media screen and (min-width: 600px)
      padding 16px 25px

  .v-icon
    width 40px
    height 40px
    display inline-block

  .loading
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)

  .v-card__title
    background-color rgba(255, 197, 42, 0.4)

  .booking
    padding 20px 0px

</style>
