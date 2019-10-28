<template>
  <div @mousemove="checkDemoHover">
    <DemoBanner :demoOpacity="demoOpacity" @hasTag="hasTag" ref="demoBanner" />
    <NaativHeader :member="loggedInMember" alt/>
    <Loading class="center-page"  v-if="loading"/>
    <ProfileDialog :show="showProfileDialog" @profileCreated="showProfileDialog = false"/>
    <v-container v-if="!loading" class="teacher-profile">
      <v-card class="section razzle-dazzle">
        <v-layout row wrap>
          <!-- avatar/rating -->
          <v-layout column>
            <div class="profile">
              <img v-if="profileInfo.profilePic"
                class="profile-pic"
                :src="getAsset(profileInfo.profilePic)"
              />
              <v-icon v-else x-large>account_circle</v-icon>
              <h1>{{ member.displayName }}</h1>
              <!-- Maybe we hide until we actually have a rating to display
              <v-rating
                :readonly="true"
                v-model="member.rating"
                background-color='primary'
              /> -->
            </div>
          </v-layout>
          <!-- Tags/Certification -->
          <v-layout column>
            <v-layout row>
            <div class="tag" v-if="profileInfo.certified">
              <h3>{{$t('teacher.profile.certification')}}</h3>
              <h5>{{profileInfo.certified}}</h5>
            </div>
            <div class="tag" v-if="profileInfo.education">
              <h3>{{$t('teacher.profile.education')}}</h3>
              <h5>{{profileInfo.education}}</h5>
            </div>
            <div class="tag" v-if="profileInfo.onlineHours">
              <h3>{{$t('teacher.profile.hours')}}</h3>
              <h5>{{profileInfo.onlineHours}}</h5>
            </div>
            </v-layout>
            <div class="tag" v-if="profileInfo && profileInfo.selectedPersonalityTags.length">
              <h3>{{$t('teacher.profile.personality')}}</h3>
              <v-chip
                v-for="(tag, index) in profileInfo.selectedPersonalityTags"
                :key="index"
                color="primary"
                text-color="black"
                :disabled="true"
                small
              >
                {{ tag }}
              </v-chip>
            </div>
            <div class="tag" v-if="profileInfo && profileInfo.selectedTeachingTags.length">
              <h3>{{$t('teacher.profile.style')}}</h3>
              <v-chip
                text-color="black"
                v-for="(tag, index) in profileInfo.selectedTeachingTags"
                :key="index"
                color="primary"
                :disabled="true"
                small
              >
                {{ tag }}
              </v-chip>
            </div>
            </v-layout>
          </v-layout>
      </v-card>

      <!-- Welcome Message -->
      <v-card class="section razzle-dazzle" v-if="profileInfo.welcomeMessage">
        <v-card-title class="justify-center" primary-title>
          <h2>{{$t('teacher.profile.welcome')}}</h2>
        </v-card-title>
        <v-card-text>
          <p>{{ profileInfo.welcomeMessage }}</p>
        </v-card-text>
      </v-card>

      <!-- Interests -->
      <v-card class="section razzle-dazzle" v-if="profileInfo.interests">
        <v-card-title class="justify-center" primary-title>
          <h2>{{$t('teacher.profile.interests')}}</h2>
        </v-card-title>
        <v-card-text>
          <p>{{ profileInfo.interests }}</p>
        </v-card-text>
      </v-card>

      <!-- Assets -->
      <v-card
        class="section razzle-dazzle"
        v-if="profileInfo && profileInfo.profileAssets.length"
      >
        <Assets :assets="profileInfo.profileAssets"/>
      </v-card>

      <!-- Booking at originally selected time -->
        <v-card v-if="this.$route.query.end && hasClaimedEmail" class="section razzle-dazzle">
        <v-layout column justify-center align-center>
          <v-card-text class="text-xs-center">
          <h2>{{`${$t('teacher.profile.continue')}`}}</h2>
          </v-card-text>
          <v-card-actions>
            <v-btn block class="primary"
              @click="book()">{{`${formatDate($route.query.start)}`}}</v-btn>
          </v-card-actions>
          <v-layout row justify-center align-center>
          <v-card-text>
          <h2>{{$t('teacher.profile.timeselect')}}</h2>
          </v-card-text>
          </v-layout>
        </v-layout>
      </v-card>

      <v-card class="razzle-dazzle" v-if="!$browser.supported">
        <UnsupportedClient />
      </v-card>
  <!-- BookingCalendar -->
      <v-card class="section razzle-dazzle" v-if="isLoggedIn && hasClaimedEmail && profile">
        <v-layout column align-center justify-space-around>
          <v-btn-toggle
            class="toggle"
            v-if="teachesLessons && teachesConversations"
            v-model="selectedType"
            mandatory
          >
            <v-btn class="toggle">Lesson</v-btn>
            <v-btn class="toggle">Conversation</v-btn>
          </v-btn-toggle>
          <h2 v-if="selectedType === 0">{{$t('teacher.profile.booking.title')}}</h2>
          <h2 v-if="selectedType === 1">{{$t('teacher.profile.conversation.title')}}</h2>
        </v-layout>
        <Booking v-if="member.id" :host="memberWithPic"/>
      </v-card>
      <!-- Booking - Hide if not claimed yet -->
      <v-card class="section" v-else-if="$browser.supported">
        <v-layout row justify-center>
          <h3>
            {{$t('teacher.profile.booking.claim.one', [[member.displayName]])}}
          </h3>
        </v-layout>
        <v-layout row justify-center v-if="isLoggedIn && !hasClaimedEmail">
          <h3>{{$t('teacher.profile.booking.claim.two')}}</h3>
        </v-layout>
        <v-layout column justify-space-around align-center pa-2 v-if="isLoggedIn && hasClaimedEmail && !profile">
            <h3>{{$t('teacher.profile.needlearningprofile')}}</h3>
            <v-btn class="primary" round @click="showProfileCreation">{{$t('learning.profile.create')}}</v-btn>
        </v-layout>
        <v-layout row justify-center v-else-if="!isLoggedIn">
          <v-btn :to="`/?slug=${this.$route.params.slug}&id=${this.member.id}`">{{$t('join')}}</v-btn>
        </v-layout>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import UnsupportedClient from '@/UnsupportedClient.vue'
import NaativHeader from '@/components/Header.vue'
import Loading from '@/components/Loading.vue'
import { GET_PUBLIC_INFO } from '@/graphql/Member'
import * as BookingStore from '@/utils/booking/BookingStore'
import Booking from '@/components/booking/Index.vue'
import Assets from '@/content/AssetDisplay.vue'
import ProfileDialog from '@/LearningProfile/Dialog.vue'
import { getAsset } from '@/utils/AssetService'
import * as LearningProfileStore from '@/LearningProfile/Store'
import * as MemberStore from '@/utils/member/MemberStore'
import { Mutations } from '@/store'

import DemoBanner from '@/components/DemoBanner'

const { Actions: MemberActions } = MemberStore
const { Actions: BookingActions } = BookingStore
const tenantId = ~~process.env.VUE_APP_TENANT_ID
const { Getters: LearningProfileGetters } = LearningProfileStore

export default {
  name: 'TeacherProfile',
  components: { Assets, Booking, DemoBanner, NaativHeader, Loading, ProfileDialog, UnsupportedClient },
  data() {
    return {
      demoOpacity: undefined,
      loading: false,
      showProfileDialog: false,
      getAsset,
      member: {
        displayName: null,
        id: null,
        slug: null
      },
      profileInfo: {
        welcomeMessage: '',
        selectedGenres: [],
        socialMedia: {
          facebook: '',
          instagram: '',
          twitter: ''
        },
        profileAssets: [],
        profilePic: null,
        selectedTeachingTags: [],
        selectedPersonalityTags: []
      },
      teacherTags: null,
      teachesLessons: false,
      teachesConversations: false,
      selectedType: 0,
      types: ['conversation', 'curriculum']
    }
  },
  mounted() {
    this.loading = true
    this.getMemberBySlug()
  },
  methods: {
    ...mapActions({
      upsertBooking: BookingActions.UPSERT_BOOKING,
      getMemberTags: MemberActions.MEMBER_TAGS
    }),
    ...mapMutations({
      setBookingType: Mutations.SET_BOOKING_TYPE
    }),
    async book() {
      const type = this.bookingType
      this.loading = true
      const isAssessment = this.profile.enrollments.length <= 0
      await this.upsertBooking({
        hostId: ~~this.$route.query.host,
        end: this.$route.query.end,
        start: this.$route.query.start,
        availabilityId: ~~this.$route.query.id,
        type,
        isAssessment
      })
      this.$router.push('/homeroom/dashboard')
    },
    checkDemoHover (e) {
      if (!this.$browser.isMobile && this.hasTag('system:demo')) {
        const mouseX = e.clientX
        const mouseY = e.clientY
        const demoBannerRef = this.$refs.demoBanner.$children[0]
        const demoLeft = demoBannerRef.$el.offsetLeft
        const demoTop = demoBannerRef.$el.offsetTop
        const demoHeight = demoBannerRef.$el.offsetHeight
        const demoBottom = demoHeight + demoTop
        const correctedDemoLeft = demoLeft + (((mouseY - demoTop) / demoHeight) * demoHeight)
        const demoHover = mouseX >= correctedDemoLeft && mouseY <= demoBottom
        if (demoHover) {
          this.demoOpacity = 0
        } else {
          this.demoOpacity = undefined
        }
      }
    },
    hasTag(tag) {
      const tags = this.member.tags || []
      return tags.indexOf(tag) > -1
    },
    showProfileCreation() {
      this.showProfileDialog = true
    },
    async getMemberBySlug() {
      const { data: { memberPublicProfile } } = await this.$apollo.query({
        query: GET_PUBLIC_INFO,
        variables: { input: {
          slug: this.$route.params.slug,
          key: 'teacher-profile',
          tenantId
        } }
      })
      if (!memberPublicProfile) {
        return this.$router.push('/')
      }
      this.member = { ...memberPublicProfile, ...memberPublicProfile.value }
      if (this.member) {
        this.profileInfo = { ...this.profileInfo, ...this.member }
        if (this.member.id) {
          if (this.isLoggedIn) {
            const { data } = await this.getMemberTags(this.member.id)
            this.teacherTags = data.member.tags
            this.teachesConversations =
              this.teacherTags.includes('audience:conversation:adult') ||
              this.teacherTags.includes('audience:conversation:child')
            this.teachesLessons =
              this.teacherTags.includes('audience:lesson:adult') ||
              this.teacherTags.includes('audience:lesson:child')
            if (this.teachesLessons) {
              this.setBookingType('lesson')
              this.selectedType = 0
            } else {
              this.setBookingType('conversation')
              this.selectedType = 1
            }
          }
          this.memberAttributesId = this.member.id
        }
      }
      this.loading = false
    },
    formatDate(d) {
      return moment(d).format('dddd MMMM Do, h:mm a')
    },
    checkAvailability() {
      const age = moment(this.profile.birthdate, 'YYYY-MM-DD')
      this.tags = moment().diff(age, 'years') <= 15 ? [20] : [21]
    }
  },
  computed: {
    loggedInMember() {
      return this.$store.state.member
    },
    isLoggedIn() { return this.$store.state.member.id },
    hasClaimedEmail() {
      return !!this.$store.state.member.claimedOn
    },
    memberWithPic() {
      return { ...this.member }
    },
    ...mapGetters({
      profile: LearningProfileGetters.profile,
      bookingType: 'bookingType'
    })
  },
  watch: {
    profile: async function(val) {
      this.checkAvailability()
    },
    selectedType: async function(val) {
      if (val) {
        this.setBookingType('conversation')
      } else {
        this.setBookingType('lesson')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.toggle
  margin-botton 20px! important

.teacher-profile
  margin-top 75px

.center-page
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)

.razzle-dazzle:nth-child(odd)
  background-color rgba(252,186,0,.1)
.razzle-dazzle:nth-child(even)
  background-color rgba(0,211,228,.1)

.section
  margin 10px 0
  padding 20px
  .profile
    min-width 190px
    .profile-pic
      border-radius 8px
      max-height 200px
      max-width 200px
  .tag
    margin 15px
    .chips
      text-align center
      width 120px
</style>
