<template>
  <div id="vipRoom">
    <MediaPermissions :showPermissionModal="accessDenied"/>
    <div v-if="!$browser.supported">
      <UnsupportedClient/>
    </div>
    <ClassEnd
      v-if="isClassOver"
      class="classEnd"
      :appointment="appointment"
      :booking="booking"
    />
    <div v-else>
    <v-alert type="error" :value="errors.length > 0">
      <h2>{{ errors[0] }}</h2>
    </v-alert>
    <v-layout
      align-center
      justify-space-around
    >
      <div class="waiting" v-if="!everyoneConnected()">
        <v-progress-circular color="#00d3e6" indeterminate/>
        <h3>{{waitingToJoin}}</h3>
        </div>
    </v-layout>
    <div v-if="!showConnect && !connected">
      <v-layout
        class="appointmenttimer"
        column
        justify-space-around
        align-center
      >
        <h5>{{$t('conversation.starts.in')}}:</h5>
        <h5 style="padding-top: 20px;" v-if="booking">{{timeTo}}</h5>
        <v-layout row wrap justify-space-around style="padding-top: 20px" class="connect-room">
          <v-btn
            @click="connectRoom"
            :loading="connecting"
            v-if="!connected && !accessDenied"
            class="connectButton"
              >
              {{$t('conversation.start')}}
          </v-btn>
        </v-layout>
      </v-layout>
    </div>
    <p v-if="remoteConnected " style="margin: 0; padding: 0;">{{remoteName}}</p>
    <v-snackbar class="tip" v-model="tip" top :timeout="5000">
      {{$t('conversation.better.experience')}}
    </v-snackbar>
    <v-card id="vipContainer">
      <div class="logo-fade" v-if="sessionEnding">
        <img class="logo-icon" src="@/assets/images/logo.svg" />
      </div>
      <div class="video-wrapper">
        <!-- Local Video -->
        <v-layout right v-if="!sessionOver" class="av-wrapper">
        <v-flex style="color: white;" v-if="connected" xs12>
          <div class="test">
          <h3>{{$t('classroom.elapsed.time')}}</h3>
          <CountupTimer :from="booking.start" :threshold="60" @thresholdHit="endClass"/>
          </div>
        </v-flex>
        <v-flex xs12>
          <v-tooltip left>
            <template slot="activator">
          <VideoAudioSettings ref="AVSettings" @change="updateTracks" :videoId="videoId" :audioId="audioId" :remoteAudio="remoteAudio" :classroom="true" :conversation="true" :permissionsSet="permissionsSet"/>
          </template>
          <span>{{ $t('conversation.av.settings') }}</span>
          </v-tooltip>
        </v-flex>
        <v-flex xs12>
        <v-tooltip left>
            <template slot="activator">
            <v-btn color="rgb(0,0,0,.4)" v-if="connected" icon @click="toggleVideo">
            <v-icon :color="videoOff ? 'red' : 'white'">
              {{ videoOff ? 'videocam_off' : 'videocam' }}
            </v-icon>
          </v-btn>
          </template>
          <span>{{ videoOff ? $t('conversation.camera.off') : $t('conversation.camera.on') }}</span>
          </v-tooltip>
        </v-flex>
        <v-flex xs12>
          <v-tooltip left>
            <template slot="activator">
          <v-btn color="rgb(0,0,0,.4)" v-if="connected" icon @click="toggleMute">
            <v-icon :color="muted ? 'red' : 'white'">
              {{ muted ? 'volume_off' : 'volume_up' }}
            </v-icon>
          </v-btn>
          </template>
          <span>{{ muted ? $t('conversation.sound.off') : $t('conversation.sound.on') }}</span>
          </v-tooltip>
        </v-flex>
        <v-flex xs12>
          <v-tooltip left>
            <template slot="activator">
          <v-btn color="rgb(0,0,0,.4)" v-if="connected" icon @click="nextVideo">
            <v-icon color="white">switch_camera</v-icon>
          </v-btn>
          </template>
          <span>{{ $t('conversation.camera.switch') }}</span>
          </v-tooltip>
        </v-flex>
        <v-flex xs12>
          <v-tooltip left>
            <template slot="activator">
          <v-btn color="rgb(0,0,0,.4)" icon @click="leaveClassroom">
            <v-icon color="red">cancel</v-icon>
          </v-btn>
          </template>
          <span>{{ $t('conversation.end') }}</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
        <div
          :class="{show: !everyoneConnected()}"
          ref="localTrack"
          id="Local"
        >
          <div :class="{ tracks: true, thumbnail: connected }" />
        </div>
        <!-- Remote Video -->
        <div ref="remoteTrack" id="Remote">
          <div :class="{ tracks: true, main: connected }" />
        </div>
      </div>
    </v-card>
    <v-snackbar v-model="snackbar" bottom :timeout="3000">
      {{snackbarMessage}}
    </v-snackbar>
    <template v-if="connected">
      <Heartbeat :frequency="10000" :fn="heartbeat" />
    </template>
    <template v-if="connected">
      <Heartbeat :frequency="10000" :fn="heartbeat" />
    </template>
    <v-layout
      v-if="!remoteConnected && connected"
      align-center
      justify-space-around
    >
    </v-layout>
    </div>
  </div>
</template>

<script>
import { get } from 'lodash'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'

import { Actions } from '@/utils/appointment/Store'
import { GET_BOOKING } from '@/graphql/Booking.gql'
import ClassEnd from '@/Classroom/ClassEnd.vue'

import {
  upsertAppointment,
  APPOINTMENT_BY_BOOKING_ID
} from '@/graphql/Appointments.gql'

import { VIDEO_ROOM_TOKEN } from '@/graphql/Video.gql.js'
import { MEMBER_INFO } from '@/graphql/Member.js'

import VideoAudioSettings from '@/Classroom/VideoAudioSettings.vue'
import Heartbeat from '@/components/Heartbeat.vue'
import CountupTimer from '@/Classroom/CountupTimer.vue'

import UnsupportedClient from '@/UnsupportedClient.vue'
import MediaPermissions from '@/components/MediaPermissions.vue'

import { delay } from '@/utils/Helpers.js'

const {
  connect,
  createLocalTracks,
  LocalDataTrack,
  createLocalVideoTrack,
  createLocalAudioTrack
} = require('twilio-video')
export default {
  name: 'Conversation',
  components: {
    MediaPermissions,
    UnsupportedClient,
    VideoAudioSettings,
    ClassEnd,
    Heartbeat,
    CountupTimer
  },
  beforeDestroy() {
    if (!this.isClassOver) {
      this.stop()
    }
  },
  async mounted() {
    this.errors = []
    if (this.$browser.supported) {
      await this.getBooking()
      this.calculateTimeTo()
      setInterval(this.calculateTimeTo, 5000)
      this.$nextTick(this.getLocalTracks)
    }
  },
  data() {
    return {
      timeTo: null,
      accessDenied: false,
      booking: null,
      connected: false,
      connecting: false,
      errors: [],
      isHost: false,
      localVid: '',
      muted: false,
      newTracks: {},
      remoteAudio: 'default',
      remoteConnected: false,
      remoteDisconnected: false,
      remoteName: '',
      remoteVid: '',
      room: null,
      sessionEnding: false,
      sessionOver: false,
      showConnect: false,
      showDebug: false,
      snackbar: false,
      snackbarMessage: null,
      timerStarted: false,
      tip: true,
      tracks: {
        video: null,
        audio: null,
        data: null
      },
      videoOff: false,
      networkQualityLevel: 5,
      noAudio: false,
      dataArray: [],
      analyser: null,
      isClassOver: false,
      permissionsSet: false
    }
  },
  methods: {
    ...mapActions({
      insertLog: Actions.INSERT_LOG
    }),
    async endClass() {
      if (this.tracks.data) {
        this.tracks.data.send(JSON.stringify({ type: 'endClass' }))
      }
      await this.updateAppointment({ endTime: moment.utc(), status: 200 })
      this.stop()
      this.room.disconnect()
      this.isClassOver = true
    },
    confirmLeave() {
      const start = moment(this.booking.start)
      const validWindow = moment().isAfter(start.add(15, 'minutes'))
      if (!this.connected || (this.connected && validWindow)) {
        return this.leaveClassroom()
      }
      this.showLeaveEarly = true
    },
    async leaveClassroom() {
      if (this.connected) {
        this.stop()
        // this.isClassOver = true
        this.room.disconnect()
        this.$router.push('/homeroom/dashboard')
      } else {
        this.$router.push('/homeroom/dashboard')
      }
      this.prepareLog('session:ended', { trigger: 'leaveClassroom' })
    },
    isDesktop() { return this.$vuetify.breakpoint.smAndUp },
    convertMoment(dateString) { return moment(dateString) },
    everyoneConnected() {
      return (!this.connected && !this.remoteConnected) || (this.connected && this.remoteConnected)
    },
    checkPermissions(result) {
      if (result.state !== 'granted') {
        this.errors.push('Make sure have allowed the browser access to your camera and mic!')
      }
    },
    toggleMute() {
      this.tracks['audio'].enable(this.muted)
      this.muted = !this.muted
    },
    toggleVideo() {
      this.tracks['video'].enable(this.videoOff)
      this.videoOff = !this.videoOff
    },
    nextVideo() {
      const nextTrack = this.$refs.AVSettings.nextVideoTrack(this.tracks.video)
      this.updateTracks({ video: nextTrack.deviceId })
    },
    detachTracks(tracks) {
      tracks.forEach((track) => {
        track.detach().forEach((detachedElement) => detachedElement.remove())
      })
    },
    attachTracks(tracks, container) {
      tracks.forEach((track) => container.appendChild(track.attach()))
    },
    async getLocalTracks() {
      try {
        const userAgent = window.navigator.userAgent
        let videoConstraints = { facingMode: 'user', width: { ideal: 320 }, frameRate: 20 }
        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
          console.log('USING DIFFERENT CONSTRAINTS ON mobile')
          videoConstraints = { facingMode: 'user', frameRate: 20 }
        }
        const localTrack = await createLocalTracks({
          audio: true,
          video: videoConstraints
        })
        const localMediaContainer = document.querySelector('#Local .tracks')
        localTrack.forEach(track => {
          this.tracks[track.kind] = track
          this.attachTracks([track], localMediaContainer)
        })
        this.permissionsSet = true
      } catch (e) {
        this.accessDenied = true
        this.permissionsSet = false
        console.error(e)
      }
    },
    async testAudio() {
      this.analyser.getByteTimeDomainData(this.dataArray)
      let audioOff = false
      this.dataArray.forEach(_ => {
        if (_ !== 128) {
          audioOff = true
        }
      })
      this.noAudio = !audioOff
      await delay(3000)
      requestAnimationFrame(this.testAudio)
    },
    updateTracks(newTracks) {
      if (newTracks.video) {
        this.tracks.video.stop()
        createLocalVideoTrack({ deviceId: { exact: newTracks.video } })
          .then((localVideoTrack) => {
            const tracks = [this.tracks.video]
            if (this.room) this.room.localParticipant.unpublishTracks(tracks)
            this.detachTracks(tracks)
            if (this.room) {
              this.room.localParticipant.publishTrack(localVideoTrack)
            }
            const localMediaContainer = document.querySelector('#Local .tracks')
            this.attachTracks([localVideoTrack], localMediaContainer)
            this.tracks.video = localVideoTrack
          })
      }
      if (newTracks.audio) {
        this.tracks.audio.stop()
        createLocalAudioTrack({ deviceId: { exact: newTracks.audio } })
          .then((localAudioTrack) => {
            const tracks = [this.tracks.audio]
            if (this.room) this.room.localParticipant.unpublishTracks(tracks)
            this.detachTracks(tracks)

            if (this.room) {
              this.room.localParticipant.publishTrack(localAudioTrack)
            }
            const localMediaContainer = document.querySelector('#Local .tracks')
            this.attachTracks([localAudioTrack], localMediaContainer)
            this.tracks.audio = localAudioTrack
          })
      }
      if (newTracks.speaker) {
        this.remoteAudio = newTracks.speaker
        const elem = document.querySelector('#Remote audio')
        if (elem && elem.setSinkId) elem.setSinkId(newTracks.speaker)
      }
    },
    async connectRoom() {
      this.connecting = true
      this.snackbar = true
      this.snackbarMessage = 'Connecting to conversation'
      this.tracks.data = new LocalDataTrack()
      const room = `classroom-${this.$route.params.bookingId}`
      const { data: { grantVideoAccess } } = await this.$apollo.mutate({
        mutation: VIDEO_ROOM_TOKEN,
        variables: { roomInput: { room } }
      })
      this.room = await connect(
        grantVideoAccess.token,
        {
          name: room,
          tracks: Object.values(this.tracks),
          preferredVideoCodecs: ['H264', 'VP8'],
          networkQuality: true
        }
      )
      this.connected = true
      this.connecting = false
      this.appointment = await this.getAppointment()
      const id = this.isHost ? this.booking.guestId : this.booking.hostId
      // const remoteMembers = await getMemberInfo(id)

      const ids = Array.isArray(id) ? id : [id]
      const remoteMembers = this.$apollo.query({ query: MEMBER_INFO, variables: { ids } })
        .then(({ data: { membersByIds } }) => membersByIds)

      const remoteMember = get(remoteMembers, '[0]', {})
      this.remoteName = remoteMember.displayName

      await this.updateAppointment({ startTime: moment.utc(), status: 100 })
      this.$nextTick(async function() {
        this.room.localParticipant.on('networkQualityLevelChanged', this.networkQualityChanged)
        this.networkQualityLevel = this.room.localParticipant.networkQualityLevel
        this.room.participants.forEach(this.addParticipant)
        this.room.on('participantConnected', this.addParticipant)
        this.room.on('participantDisconnected', this.participantDisconnected)
        this.snackbar = true
        this.snackbarMessage = 'Connected Successfully!'
      })
    },
    networkQualityChanged(level) {
      this.networkQualityLevel = level
    },
    prepareLog(type, metadata) {
      if (this.appointment) {
        this.insertLog({ appointmentId: this.appointment.id, type, metadata: { ...metadata, memberId: this.$store.state.member.id } })
      }
    },
    addParticipant(participant) {
      this.snackbar = true
      this.remoteConnected = true
      this.remoteDisconnected = false
      this.snackbarMessage = `${participant.name} has joined`
      participant.tracks.forEach(this.trackSubscribed)
      this.timerStarted = true
      participant.on('trackSubscribed', this.trackSubscribed)
    },
    trackSubscribed(track) {
      if (track.kind === 'data') {
        track.on('message', this.handleDataMessage)
      } else {
        const removeMe = document.querySelector(`#Remote ${track.kind}`)
        if (removeMe) {
          removeMe.remove()
        }
        const elem = track.attach()
        document.querySelector('#Remote .tracks').appendChild(elem)
        if (track.kind === 'audio') {
          if (elem.setSinkId) {
            elem.setSinkId(this.remoteAudio)
          }
        }
      }
    },
    handleDataMessage(data) {
      const message = JSON.parse(data)
      switch (message.type) {
        case 'endClass':
          this.hostTerminate()
          break
        default:
          console.log('data stream caught', data)
      }
    },
    participantDisconnected(participant) {
      const matchingEmail = this.$store.state.member.contacts[0].emails[0].email === participant.identity
      const status = (this.isHost && !matchingEmail) ? 301 : 300

      this.remoteDisconnected = true
      const remoteVideo = document.getElementById('#Remote .tracks video')
      const remoteAudio = document.getElementById('#Remote .tracks audio')
      this.updateAppointment({ startTime: moment.utc(), status: status })
      this.prepareLog(
        'session:ended',
        { trigger: 'participantDisconnected' }
      )
      if (remoteVideo) {
        remoteVideo.remove()
      }
      if (remoteAudio) {
        remoteAudio.remove()
      }
    },
    stop() {
      this.tracks.audio.stop()
      this.tracks.video.stop()
    },
    async getAppointment() {
      const { data } = await this.$apollo.mutate({
        mutation: APPOINTMENT_BY_BOOKING_ID,
        variables: {
          input: {
            bookingId: ~~this.$route.params.bookingId,
            timeLimit: 5,
            maxParticipant: 2,
            type: 'CONVERSATION'
          }
        }
      })
      return data.appointmentObtain
    },
    async updateAppointment(updates) {
      this.appointment = { ...this.appointment, ...updates }
      await this.$apollo.mutate({
        mutation: upsertAppointment,
        variables: {
          appt: {
            id: this.appointment.id,
            hostId: this.appointment.hostId,
            scheduledDate: this.appointment.scheduledDate,
            participants: this.appointment.participantIds,
            type: this.appointment.type,
            endTime: this.appointment.endTime,
            startTime: this.appointment.startTime,
            status: this.appointment.status
          }
        }
      })
    },
    async getBooking() {
      const { data } = await this.$apollo.query({
        query: GET_BOOKING,
        variables: {
          input: {
            ids: [~~this.$route.params.bookingId],
            start: moment().subtract(30, 'minutes'),
            end: moment().add(1, 'hours')
            // Don't use these until we are ready to go.
            // start: moment().subtract(10, 'minutes'),
            // end: moment().add(20, 'minutes')
          }
        }
      })
      this.booking = get(data, 'bookings[0]', {})
      this.isHost = ~~this.booking.hostId === this.$store.state.member.id
    },
    async terminate() {
      this.tracks.data.send(JSON.stringify({ type: 'hostTerminate' }))
      this.hostTerminate()
    },
    async hostTerminate() {
      document.getElementById('Remote').remove()
      document.getElementById('Local').remove()
      await this.updateAppointment({ endTime: moment.utc(), status: 300 })
      this.stop()
      this.room.disconnect()
      this.isClassOver = true
    },
    async endSession() {
      this.sessionEnding = true
      await delay(5000)
      document.getElementById('Remote').remove()
      document.getElementById('Local').remove()
      this.tracks.data.send(JSON.stringify({ type: 'endRoom' }))
      await this.updateAppointment({ endTime: moment.utc(), status: 200 })
      this.stop()
      this.room.disconnect()
      this.sessionOver = true
      if (this.isHost) { this.$router.push('/account/dashboard') }
    },
    heartbeat() {
      const participant = this.isHost ? 'talent' : 'fan'
      this.prepareLog(
        'tech:misc',
        {
          heartbeat: true,
          participant: participant,
          networkQualityLevel: this.networkQualityLevel,
          muted: this.muted,
          videoOff: this.videoOff,
          remoteConnected: this.remoteConnected,
          remoteDisconnected: this.remoteDisconnected
        }
      )
    },
    calculateTimeTo() {
      this.timeTo = this.$moment().to(this.booking.start)
    }
  },
  computed: {
    ...mapGetters(['cooldown']),
    appointmentEnd() {
      return moment(this.booking.end).subtract(5, 'minutes').toString()
    },
    audioId() {
      return this.tracks.audio &&
        this.tracks.audio.mediaStreamTrack.getSettings().deviceId
    },
    getSurvey() { return this.appointment.participants[0].surveys[0].answers },
    networkIcon() {
      return `/images/network-level-${this.networkQualityLevel}.png`
    },
    videoId() {
      return this.tracks.video &&
        this.tracks.video.mediaStreamTrack.getSettings().deviceId
    },
    countUp() {
      return this.$moment(this.$moment().diff(this.booking.start)).format('m:s')
    },
    waitingToJoin() {
      return this.$t('classroom.waiting.join', [this.remoteName])
    }
  }
}
</script>

<style lang="stylus">

.timer
  font-size 24px
  text-align center

.appointmenttimer
  color white
  background-color rgb(0,211,230)
  border-radius 5px
  font-size 24px
  height 200px
  left 50%
  padding 10px
  position absolute
  top 33%
  text-align center
  transform translateX(-50%)
  width 285px
  z-index 3

.waiting
  color white
  border-radius 5px
  font-size 24px
  height 200px
  left 50%
  padding 10px
  position absolute
  top 33%
  text-align center
  transform translateX(-50%)
  width 285px
  z-index 3

.box-background
  background-color rgba(10,10,10,.6)
  border-radius 5px
  height 200px
  opacity .5
  padding 10px
  position absolute
  width 285px
  z-index 4

.margin
  margin-top 48px

#vipRoom
  height 100vh
  background #000
  .tip
    color: #FFF
  #vipContainer
    background-color #000000
    height 100vh
    width 100%
    padding 55px 0
    .connect
      animation connect-room 3s infinite
      border 1px solid white
      position absolute
      left calc(50% - 90px)
      top 25%
      z-index 1
      .connect-room
        font-size 18px
        height 30px
        padding 4px 0px
    .watermark
      bottom 5px
      height 20%
      left 0
      margin-left auto
      margin-right auto
      opacity .3
      position absolute
      right 0
      z-index 1
    .logo-fade
      animation-name logo
      animation-duration 5s
      background-color #54565A
      height 100vh
      left 0
      margin auto auto
      padding 80px
      position absolute
      width 100%
      z-index 2
    .av-wrapper
      text-align right
      display flex
      flex-direction column
      opacity .7
      position absolute
      right 0
      top 0
      z-index 3
      &:hover
        opacity 1
    .video-wrapper
      max-width: 1189px;
      max-height: 891px;
      margin: auto;
      height: 100%;
      width: 100%;
      position: relative;
      .tracks
        overflow hidden
        transform rotateY(180deg)
        &.thumbnail
          background-color #54565A
          border 1px solid #EEE
          top 10px
          height 150px
          position absolute
          left 0
          width 150px
          z-index 1
        video
          height 100%
          max-height 80vh
          width 100%
      .video-alert
        background-color rgba(0,0,0,0.6)
        color #ffffff
        position absolute
        right 0
        left 0
        padding 20px
        text-align center
        font-size 24px
        z-index 100
.logo-icon
  left 50%
  position absolute
  top 50%
  transform translate(-50%, -50%)
  width 90%

@media (max-width 450px)
  .thumbnail
    height 100px !important
    width 100px !important
    video
      height 100px !important
      width 100px !important
  .main
    video
      left 50% // Not needed for mobile
      position relative // Not needed for mobile
      transform translateX(-50%) // Not needed for mobile
      min-height 450px !important // Not needed for mobile
      width auto !important // Not needed for mobile

.wifi-warn
  color $primary
  margin 20px 0

.feedback
  opacity .95
  width 100%
  height 100%

.show
  opacity 0

.connectButton
  color #FFFFFF!important
  background-color #4CAF50!important

.timer
  font-size 25px!important

.test
  color white!important
  background-color rgb(0,0,0,0.4)!important
  border-radius 50px!important
  padding 10px!important

.classEnd
  height 100%!important

@keyframes connect-room {
  from { background-color: #fff; border-color: #fff; color: #f32735 }
  to {  background-color: #f32735; border-color: #f32735; color: #fff }
}

@keyframes logo {
  from { opacity: 0 }
  to { opacity: 1 }
}

</style>
