<template>
  <div @mousemove="checkDemoHover" id="classroom">
    <DemoBanner :demoOpacity="demoOpacity" @hasTag="hasTag" ref="demoBanner" />
    <div v-if="!$browser.supported ">
      <UnsupportedClient/>
    </div>
    <ClassEnd
      v-if="isClassOver"
      isAssessment
      :appointment="appointment"
      :booking="booking"
    />
    <div v-else id="classroom-container">
      <MediaPermissions :showPermissionModal="showPermissionModal"/>
      <div class="top-row">
        <div class="vid">
          <v-flex xs12>
            <v-tooltip left>
              <template slot="activator">
                <VideoAudioSettings class="settings" @change="updateTracks" :appointmentId="appointmentId" :videoId="videoId" :audioId="audioId" :remoteAudio="remoteAudio" :classroom="true" :permissionsSet="permissionsSet" />
              </template>
              <span>{{$t('classroom.settings')}}</span>
            </v-tooltip>
          </v-flex>
          <v-card class="ma-1" ref="localTrack" id="Local">
            <div v-if="connected" class="av-wrapper">
            <v-tooltip left>
              <template slot="activator">
                <v-btn color="rgb(0,0,0,.4)" icon @click="toggleVideo">
                  <v-icon v-if="!videoOff" color="white">videocam</v-icon>
                  <v-icon v-else color="red">videocam_off</v-icon>
                </v-btn>
              </template>
              <span v-if="!videoOff">{{$t('conversation.camera.off')}}</span>
              <span v-else >{{$t('conversation.camera.on')}}</span>
            </v-tooltip>
            <v-tooltip left>
              <template slot="activator">
                <v-btn color="rgb(0,0,0,.4)" icon @click="toggleMute">
                  <v-icon color="white" v-if="!muted">volume_up</v-icon>
                  <v-icon color="red" v-else>volume_off</v-icon>
                </v-btn>
              </template>
              <span v-if="!muted">{{$t('conversation.sound.off')}}</span>
              <span v-else >{{$t('conversation.sound.on')}}</span>
            </v-tooltip>
              <!-- <img :src="networkIcon" style="width: 20px; height: 20px; float: right;" /> -->
            </div>
            <div class="tracks"></div>
          </v-card>
          <v-card class="ma-1 centered" ref="remoteTrack" id="Remote">
            <p v-if="remoteName" class="remote-name">{{remoteName}}</p>
            <div class="tracks"></div>
          </v-card>
          <v-card class="ma-1 my-1 centered actions" id="streamActions">
            <v-toolbar height="40px" class="chat-header" color="#fbba00">
              <v-toolbar-title class="text-color dashboard-logo">
                <img class="dashboard-logo" src="../assets/images/logo.svg" />
              </v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-layout style="padding-top: 10px;" column>
              <v-flex v-if="connected" xs12>
                <h2>{{$t('classroom.elapsed.time')}}</h2>
                <CountupTimer style="font-size: 30px" :from="booking.start" :threshold="60" @thresholdHit="leaveClassroom"/>
              </v-flex>
              <v-flex v-if="!canEnterClass && booking" xs12>
                <h2 class="text-color">{{$t('classroom.class.starts')}}</h2>
                <CountdownTimer :countdownTo="booking.start" :threshold="300000" @thresholdHit="canEnterClass = true"/>
              </v-flex>
              <v-flex xs12 v-if="!connected">
                <v-btn
                  :disabled="canEnter()"
                  :loading="!booking || connecting || !slidesReady"
                  color="#4CAF50"
                  large
                  depressed
                  class="text-capitalize text-color font-weight"
                  @click="connectRoom"
                >
                {{$t('classroom.connect')}}
                </v-btn>
              </v-flex>
              <v-flex v-if="showDebug">
                <v-btn color="#fcba00" small depressed class="mx-1 text-capitalize " @click="showStats" >Show Stats</v-btn>
              </v-flex>
              <v-card-actions class="leave">
               <v-flex xs12>
                <v-btn
                  color="#FF0000"
                  large
                  depressed
                  class="text-capitalize text-color font-weight"
                  @click="leaveClassroom"
                >
                  {{$t('classroom.leave')}}
                </v-btn>
              </v-flex>
              </v-card-actions>
            </v-layout>
          </v-card>
        </div>
      </div>
      <div class="bottom-row">
        <div v-if="!connected" class="before-connect">
          <v-card style="height: 100%; text-align: center; background: transparent;">
            <v-card-title color="#fcba00" style="justify-content: center;">
              <p class="display-2">{{$t('classroom.welcome')}}</p>
            </v-card-title>
            <v-card-text>
              <p class="headline">
                <i18n path="classroom.welcome.please.connect" tag="span">
                  <span place="connectLink">
                    {{$t('classroom.connect')}}
                  </span>
                </i18n>
              </p>
            </v-card-text>
            <!-- <v-card-actions style="justify-content: center;">
              <v-btn
                  :disabled="canEnter()"
                  :loading="!booking || connecting || !slidesReady"
                  color="#4CAF50"
                  depressed
                  class="text-capitalize text-color"
                  @click="connectRoom"
                >{{$t('classroom.connect')}}</v-btn>
            </v-card-actions> -->
          </v-card>
        </div>
        <div v-if="!loadingLesson && lesson" style="display: inline-block; vertical-align: top; width: 700px;">
          <div class="whiteboard mx-1" ref="whiteboard" style="width: 100%; height: 394px;">
            <canvas
              :class="{'enabled' : whiteboardEnabled}"
              width="700"
              height="394"
              id="localCanvas"
              @touchstart.prevent="handleMouseDown"
              @touchmove.prevent="handleMouseMove"
              @touchend.prevent="handleMouseUp"
              @mousedown="handleMouseDown"
              @mouseup="handleMouseUp"
              @mousemove="handleMouseMove"
            ></canvas>
            <canvas width="700" height="394" id="remoteCanvas"></canvas>
            <slides
              ref="curriculumSlides"
              :onStartExit="endOfSlides"
              :onEndExit="endOfSlides"
              :mouseNavigation="false"
              :keyboardNavigation="false"
              class="slides"
              :repeat="false"
              :lesson="lesson"
              @slidesReady="slidesReady = true"
            />
          </div>
          <v-card class="ma-1 centered pa-1" id="whiteboardActions" style="width: 699px; height: 56px; background-color: #eee;">
            <v-layout align-center justify-space-around row fill-height>
              <!-- <v-flex xs12> -->
                <h3 :class="{'whiteboardDisabled' : !whiteboardEnabled}">{{whiteboardEnabled ? $t('classroom.whiteboard.enabled') : $t('classroom.whiteboard.disabled')}}</h3>
                <v-btn
                  color="#fff"
                  depressed
                  class="text-capitalize black--text font-weight"
                  @click="clearWhiteboard"
                >{{$t('classroom.whiteboard.clear')}}</v-btn>
              <!-- </v-flex> -->
            </v-layout>
          </v-card>
        </div>
        <v-card
          id="whiteboardNotes"
          style="max-height: 454px; overflow: hidden; display: inline-block; width: 312px; vertical-align: top; margin-left: 7px;"
        >
        <v-toolbar class="chat-header" color="#fbba00">
          <v-toolbar-title class="text-color">Chat</v-toolbar-title>
        </v-toolbar>
        <div key="chat" style="height: 406px; overflow: scroll; padding-bottom: 10px">
          <div v-if="!connected" style="padding: 10px;">
            {{$t('classroom.please.connect')}}
          </div>
          <Chat v-else :addChat="addChat" :chat="chat"/>
        </div>
          <!-- <v-tabs grow color="#00355f" slider-color="#FFFFFF">
            <v-tab class="text-color" ripple key="chat">
              Chat
            </v-tab>
            <v-tab-item key="chat" style="height: 406px; overflow: scroll; padding: 10px">
              <div v-if="!connected">
                {{$t('classroom.please.connect')}}
              </div>
              <Chat v-else :addChat="addChat" :chat="chat"/>
            </v-tab-item>
          </v-tabs> -->
        </v-card>
      </div>
    </div>
    <v-snackbar v-model="snackbar" bottom :timeout="3000">{{snackbarMessage}}</v-snackbar>
    <template v-if="appointment">
      <Heartbeat :frequency="10000" :fn="heartBeat" />
    </template>
  </div>
</template>

<script>
import get from 'lodash.get'
import moment from 'moment'
import { mapActions } from 'vuex'
import Chat from '@/Classroom/Chat.vue'
import { delay } from '@/utils/Helpers.js'
import UnsupportedClient from '@/UnsupportedClient.vue'
import { VIDEO_ROOM_TOKEN } from '@/graphql/Video.gql.js'
import { upsertAppointment, APPOINTMENT_BY_BOOKING_ID } from '@/graphql/Appointments.gql'
import { GET_BOOKING } from '@/graphql/Booking.gql'
import { Actions as LessonActions } from '@/Lessons/Store'
import MediaPermissions from '@/components/MediaPermissions.vue'
import slides from '@/Classroom/Slides.vue'
import TeacherTips from '@/Classroom/TeacherTips.vue'
import Heartbeat from '@/components/Heartbeat.vue'
import ActionsOutput from '@/Classroom/ActionsOutput.vue'
import CountupTimer from '@/Classroom/CountupTimer.vue'
import CountdownTimer from '@/Classroom/CountdownTimer.vue'
import ClassEnd from '@/Classroom/ClassEnd.vue'
import VideoAudioSettings from '@/Classroom/VideoAudioSettings.vue'
import { Actions } from '@/utils/appointment/Store'
import DemoBanner from '@/components/DemoBanner'

const { connect, createLocalTracks, LocalDataTrack, createLocalVideoTrack, createLocalAudioTrack } = require('twilio-video')
export default {
  name: 'Classroom',
  components: {
    slides,
    CountupTimer,
    ActionsOutput,
    ClassEnd,
    TeacherTips,
    VideoAudioSettings,
    UnsupportedClient,
    CountdownTimer,
    MediaPermissions,
    Heartbeat,
    Chat,
    DemoBanner
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isClassOver) {
      this.stop()
    }
    next()
  },
  beforeDestroy() {
    if (!this.isClassOver) {
      this.stop()
    }
  },
  mounted() {
    const kode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
    const length = kode.length
    var pos = 0
    document.addEventListener('keydown', (event) => {
      if (event.keyCode === kode[pos++]) {
        if (length === pos) {
          this.showDebug = !this.showDebug
          pos = 0
          return false
        }
      } else {
        pos = 0
      }
    }, false)
    this.$nextTick(function () {
      this.getLocalTracks()
    })
  },
  data() {
    return {
      demoOpacity: undefined,
      loadingLesson: true,
      slidesReady: false,
      lesson: null,
      totalSlides: [],
      booking: null,
      showPermissionModal: false,
      networkQualityLevel: 5,
      showDebug: false,
      connecting: false,
      currentSlide: 1,
      slideLoading: false,
      appointment: null,
      disabledNext: false,
      disabledPrevious: true,
      remoteConnected: false,
      snackbar: false,
      snackbarMessage: null,
      isClassOver: false,
      connected: false,
      canEnterClass: null,
      remoteDisconnected: false,
      whiteboardEnabled: false,
      isAssessment: false,
      chat: [],
      remoteAudio: 'default',
      room: null,
      mouse: {
        current: {
          x: 0,
          y: 0
        },
        previous: {
          x: 0,
          y: 0
        },
        remote: {
          x: 0,
          y: 0
        },
        down: false
      },
      localVid: '',
      remoteVid: '',
      tracks: {
        video: null,
        audio: null,
        data: null
      },
      newTracks: {},
      muted: false,
      videoOff: false,
      permissionsSet: false
    }
  },
  methods: {
    ...mapActions({
      insertLog: Actions.INSERT_LOG,
      getLesson: LessonActions.GET
    }),
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
      const tags = this.tags || []
      return tags.indexOf(tag) > -1
    },
    prepareLog(type, metadata) {
      if (this.appointment) {
        this.insertLog({
          appointmentId: this.appointmentId,
          type,
          metadata: {
            ...metadata, memberId: this.$store.state.member.id }
        })
      }
    },
    heartBeat() {
      this.prepareLog('tech:misc', {
        heartbeat: true,
        participant: 'student',
        networkQualityLevel: this.networkQualityLevel,
        whiteboardEnabled: this.whiteboardEnabled,
        currentSlide: this.currentSlide,
        muted: this.muted,
        videoOff: this.videoOff,
        remoteConnected: this.remoteConnected,
        remoteDisconnected: this.remoteDisconnected
      })
    },
    async showStats() {
      const convert = 1000
      let stats = await this.room.getStats()
      console.log(stats[0].localVideoTrackStats[0])
      let first = stats[0].localVideoTrackStats[0].bytesSent / convert
      await delay(1000)
      console.log('1 Second')
      stats = await this.room.getStats()
      let second = stats[0].localVideoTrackStats[0].bytesSent / convert
      console.log(`${second - first} kbs`)
      first = second
      await delay(1000)
      console.log('2 Second')
      stats = await this.room.getStats()
      second = stats[0].localVideoTrackStats[0].bytesSent / convert
      console.log(`${second - first} kbs`)
      first = second
      await delay(1000)
      console.log('3 Second')
      stats = await this.room.getStats()
      second = stats[0].localVideoTrackStats[0].bytesSent / convert
      console.log(`${second - first} kbs`)
      first = second
      await delay(1000)
      console.log('4 Second')
      stats = await this.room.getStats()
      second = stats[0].localVideoTrackStats[0].bytesSent / convert
      console.log(`${second - first} kbs`)
      first = second
      await delay(1000)
      console.log('5 Second')
      stats = await this.room.getStats()
      second = stats[0].localVideoTrackStats[0].bytesSent / convert
      console.log(`${second - first} kbs`)
      first = second
    },
    canEnter() {
      if (this.booking && this.canEnterClass && !this.connecting) {
        return false
      }
      return true
    },
    disableWhiteboard() {
      this.tracks.data.send(
        JSON.stringify({ type: 'remoteWhiteboard', value: !this.remoteWhiteboard })
      )
      console.log('disableWhiteboard')
    },
    async getLocalTracks() {
      this.showPermissionModal = false
      try {
        const userAgent = window.navigator.userAgent
        let videoConstraints = { facingMode: 'user', width: { ideal: 320 }, frameRate: 30 }
        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
          console.log('USING DIFFERENT CONSTRAINTS ON mobile')
          videoConstraints = { facingMode: 'user' }
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
        this.showPermissionModal = true
        this.permissionsSet = false
        console.log(e)
      }
    },
    detachTracks(tracks) {
      tracks.forEach((track) => {
        track.detach().forEach((detachedElement) => {
          detachedElement.remove()
        })
      })
    },
    attachTracks(tracks, container) {
      tracks.forEach((track) => {
        container.appendChild(track.attach())
      })
    },
    updateTracks(newTracks) {
      if (newTracks.video) {
        this.tracks.video.stop()
        createLocalVideoTrack({ deviceId: { exact: newTracks.video } })
          .then(localVideoTrack => {
            const tracks = [this.tracks.video]
            if (this.room) {
              this.room.localParticipant.unpublishTracks(tracks)
            }
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
        createLocalAudioTrack({
          deviceId: { exact: newTracks.audio }
        }).then((localAudioTrack) => {
          const tracks = [this.tracks.audio]
          if (this.room) {
            this.room.localParticipant.unpublishTracks(tracks)
          }
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
        if (elem && elem.setSinkId) {
          elem.setSinkId(newTracks.speaker)
        }
      }
    },
    endOfSlides() {
      return false
    },
    nextSlide(type) {
      this.slideLoading = true
      const nextSlide = this.$refs.curriculumSlides.currentSlideIndex + 1
      this.$refs.curriculumSlides.currentSlideIndex = nextSlide
      this.currentSlide = this.$refs.curriculumSlides.currentSlideIndex
      if (type !== 'remote' && this.tracks.data) {
        this.tracks.data.send(JSON.stringify({ type: 'goToSlide', slide: nextSlide }))
      }
      this.clearWhiteboard(type)
      this.updateSlideButtons()
      this.prepareLog('lesson:slide', { type: 'next' })
    },
    previousSlide(type) {
      this.slideLoading = true
      const prevSlide = this.$refs.curriculumSlides.currentSlideIndex - 1
      this.$refs.curriculumSlides.currentSlideIndex = prevSlide
      this.currentSlide = this.$refs.curriculumSlides.currentSlideIndex
      if (type !== 'remote' && this.tracks.data) {
        this.tracks.data.send(JSON.stringify({ type: 'goToSlide', slide: prevSlide }))
      }
      this.clearWhiteboard(type)
      this.updateSlideButtons()
      this.prepareLog('lesson:slide', { type: 'previous' })
    },
    goToSlide(slide, force) {
      this.slideLoading = true
      this.$refs.curriculumSlides.currentSlideIndex = slide
      this.currentSlide = this.$refs.curriculumSlides.currentSlideIndex
      this.updateSlideButtons()
      if (force && this.tracks.data) {
        this.tracks.data.send(JSON.stringify({ type: 'goToSlide', slide }))
      }
      this.prepareLog('lesson:slide', { type: 'goToSlide', slide, force })
    },
    updateSlideButtons() {
      if (this.$refs.curriculumSlides.currentSlideIndex === 1) {
        this.disabledPrevious = true
      } else {
        this.disabledPrevious = false
      }
      if (this.$refs.curriculumSlides.currentSlideIndex === this.$refs.curriculumSlides.slides.length) {
        this.disabledNext = true
      } else {
        this.disabledNext = false
      }
      this.slideLoading = false
    },
    clearWhiteboard(type) {
      if (type === 'remote') {
        const c1 = document.getElementById('localCanvas')
        const context1 = c1.getContext('2d')
        context1.clearRect(0, 0, c1.width, c1.height)
        const c2 = document.getElementById('remoteCanvas')
        const context2 = c2.getContext('2d')
        context2.clearRect(0, 0, c2.width, c2.height)
      } else {
        const c1 = document.getElementById('localCanvas')
        const context1 = c1.getContext('2d')
        context1.clearRect(0, 0, c1.width, c1.height)
        if (type !== 'remote' && this.tracks.data) {
          this.tracks.data.send(JSON.stringify({ type: 'clear' }))
        }
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
    async connectRoom() {
      this.connecting = true
      this.snackbar = true
      this.snackbarMessage = this.$t('classroom.connecting')
      this.tracks.data = new LocalDataTrack()
      const roomName = `classroom-${this.$route.params.bookingId}`
      const { data: { grantVideoAccess } } = await this.$apollo.mutate({
        mutation: VIDEO_ROOM_TOKEN,
        variables: { roomInput: { room: roomName } }
      })
      this.room = await connect(
        grantVideoAccess.token,
        {
          name: roomName,
          tracks: Object.values(this.tracks),
          preferredVideoCodecs: ['H264', 'VP8'],
          networkQuality: true
        }
      )
      this.connected = true
      this.connecting = false
      if (!this.appointment.startTime) {
        await this.updateAppointment({ startTime: moment.utc(), status: 100 })
      }
      this.prepareLog('room:connected', { userAgent: navigator.userAgent })
      this.$nextTick(async function () {
        this.room.localParticipant.on('networkQualityLevelChanged', this.networkQualityChanged)
        this.networkQualityLevel = this.room.localParticipant.networkQualityLevel
        this.room.participants.forEach(this.addParticipant)
        this.room.on('participantConnected', this.addParticipant)
        this.room.on('participantDisconnected', this.participantDisconnected)
        this.snackbar = true
        this.snackbarMessage = this.$t('classroom.connect.success')
      })
    },
    networkQualityChanged(level) {
      this.networkQualityLevel = level
    },
    addParticipant(participant) {
      this.remoteConnected = true
      this.remoteDisconnected = false
      this.snackbarMessage = this.$t('classroom.teacher.joined')
      this.snackbar = true
      participant.tracks.forEach(this.trackSubscribed)
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
    participantDisconnected(participant) {
      this.remoteDisconnected = true
      const remoteVideo = document.getElementById('#Remote .tracks video')
      const remoteAudio = document.getElementById('#Remote .tracks audio')
      if (remoteVideo) {
        remoteVideo.remove()
      }
      if (remoteAudio) {
        remoteAudio.remove()
      }
      this.prepareLog('room:disconnected', { identity: participant.identity })
    },
    handleDataMessage(data) {
      const { type, value, slide } = JSON.parse(data)
      if (type === 'whiteboard') {
        const { x, y } = value
        this.mouse.remote = { x, y }
        this.draw(null, 'remote')
      } else if (type === 'clear') {
        this.clearWhiteboard('remote')
      } else if (type === 'mouseDown') {
        this.handleMouseDown(null, 'remote', value)
      } else if (type === 'nextSlide') {
        this.nextSlide('remote')
      } else if (type === 'previousSlide') {
        this.previousSlide('remote')
      } else if (type === 'goToSlide') {
        this.goToSlide(slide)
      } else if (type === 'endClass') {
        this.leaveClassroom()
      } else if (type === 'chat') {
        this.addChat(value, 'remote')
      } else if (type === 'remoteWhiteboard') {
        this.whiteboardEnabled = value
      }
    },
    addChat(message, type) {
      if (type === 'local') {
        this.tracks.data.send(
          JSON.stringify({ type: 'chat', value: message })
        )
      }
      this.chat.push({
        type,
        value: message
      })
    },
    draw(event, type) {
      let c = document.getElementById('localCanvas')
      let ctx = c.getContext('2d')
      if (type === 'remote') {
        c = document.getElementById('remoteCanvas')
        ctx = c.getContext('2d')
      }
      if (this.mouse.down || type === 'remote') {
        if (type === 'remote') {
          ctx.strokeStyle = '#0D122B'
          ctx.lineTo(this.mouse.remote.x, this.mouse.remote.y)
        } else {
          if (this.tracks.data) {
            this.tracks.data.send(
              JSON.stringify({ type: 'whiteboard', value: this.currentMouse })
            )
          }
          ctx.lineTo(this.currentMouse.x, this.currentMouse.y)
          ctx.strokeStyle = '#f382ae'
        }
        ctx.lineWidth = 2
        ctx.stroke()
      }
    },
    handleMouseDown(event, type, data) {
      let c = document.getElementById('localCanvas')
      let ctx = c.getContext('2d')
      if (type === 'remote' && data) {
        c = document.getElementById('remoteCanvas')
        ctx = c.getContext('2d')
        ctx.beginPath()
        ctx.moveTo(data.x, data.y)
      } else {
        if (this.whiteboardEnabled) {
          const x = event.touches ? event.touches[0].clientX : event.clientX
          const y = event.touches ? event.touches[0].clientY : event.clientY
          this.mouse.current = { x, y }
          this.mouse.down = true
          ctx.beginPath()
          ctx.moveTo(this.currentMouse.x, this.currentMouse.y)
          if (this.tracks.data) {
            this.tracks.data.send(
              JSON.stringify({ type: 'mouseDown', value: this.currentMouse })
            )
          }
        }
      }
    },
    handleMouseUp(type) {
      if (type === 'remote') {
        let c = document.getElementById('remoteCanvas')
        let ctx = c.getContext('2d')
        ctx.closePath()
      } else {
        let c = document.getElementById('localCanvas')
        let ctx = c.getContext('2d')
        ctx.closePath()
        if (this.tracks.data) {
          this.tracks.data.send(
            JSON.stringify({ type: 'mouseDown' })
          )
        }
        this.mouse.down = false
        this.prepareLog('drawing:completed')
      }
    },
    handleMouseMove(event) {
      let c = document.getElementById('localCanvas')
      c.getBoundingClientRect()
      if (this.mouse.down) {
        const x = event.touches ? event.touches[0].clientX : event.clientX
        const y = event.touches ? event.touches[0].clientY : event.clientY
        this.mouse.current = { x, y }
        this.draw(event)
      }
    },
    stop() {
      if (this.tracks.audio) {
        this.tracks.audio.stop()
      }
      if (this.tracks.video) {
        this.tracks.video.stop()
      }
    },
    async updateAppointment(updates) {
      this.appointment = { ...this.appointment, ...updates }
      await this.$apollo.mutate({
        mutation: upsertAppointment,
        variables: {
          appt: {
            id: this.appointment.id,
            hostId: this.booking.hostId,
            scheduledDate: this.booking.start,
            type: this.appointment.type,
            participants: [this.booking.guestId],
            endTime: this.appointment.endTime,
            startTime: this.appointment.startTime,
            status: this.appointment.status
          }
        }
      })
    },
    async endClass() {
      this.stop()
      this.room.disconnect()
      this.isClassOver = true
    },
    async leaveClassroom() {
      if (this.connected) {
        this.stop()
        this.isClassOver = true
        this.room.disconnect()
      } else {
        this.$router.push('/homeroom/dashboard')
      }
      this.prepareLog('session:ended', { trigger: 'leaveClassroom' })
    },
    unreadMessage() {
      this.unreadMessage++
    }
  },
  apollo: {
    booking: {
      query: GET_BOOKING,
      variables() {
        return { input:
          {
            ids: [~~this.$route.params.bookingId],
            start: moment().subtract(30, 'minutes'),
            end: moment().add(1, 'hours')
          }
        }
      },
      update({ bookings }) {
        if (bookings && bookings.length) {
          const booking = bookings[0]
          const classStart = moment(booking.start)
          const canEnterClass = moment(classStart).subtract(5, 'minutes')
          this.booking = booking
          this.canEnterClass = moment().isAfter(canEnterClass)
          return booking
        }
        console.log('There is no booking with this id')
        return null
      }
    }
  },
  computed: {
    networkIcon() {
      return `/images/network-level-${this.networkQualityLevel}.png`
    },
    appointmentId() { return get(this.appointment, 'id') },
    videoId() {
      return this.tracks.video && this.tracks.video.mediaStreamTrack.getSettings().deviceId
    },
    audioId() {
      return this.tracks.audio && this.tracks.audio.mediaStreamTrack.getSettings().deviceId
    },
    remoteName() {
      if (this.connected || this.booking) {
        if (this.remoteDisconnected) {
          return this.$t('classroom.remote.disconnected', [this.booking.host.displayName])
        }
        if (!this.remoteConnected && this.connected) {
          return this.$t('classroom.waiting.join', [this.booking.host.displayName])
        }
        return this.booking.host.displayName
      }
    },
    currentMouse: function () {
      var c = document.getElementById('localCanvas')
      var rect = c.getBoundingClientRect()
      return {
        x: this.mouse.current.x - rect.left,
        y: this.mouse.current.y - rect.top
      }
    }
  },
  watch: {
    async booking(newVal, oldVal) {
      if (newVal) {
        this.isAssessment = newVal.profile.enrollments.length === 0
        const { data } = await this.$apollo.mutate({
          mutation: APPOINTMENT_BY_BOOKING_ID,
          variables: {
            input: {
              bookingId: ~~this.$route.params.bookingId,
              timeLimit: 25,
              maxParticipant: 2,
              type: this.isAssessment ? 'PLACEMENT' : 'CLASSROOM'
            }
          }
        })
        this.appointment = data.appointmentObtain
        this.loadingLesson = true
        const age = moment(newVal.profile.birthdate, 'YYYY-MM-DD')

        let lessonId = moment().diff(age, 'years') <= 14 ? ~~process.env.VUE_APP_ASSESSMENT_LESSON_ID : ~~process.env.VUE_APP_ASSESSMENT_ADULT_LESSON_ID
        if (!this.isAssessment) {
          console.log(newVal.profile)
          lessonId = newVal.profile.enrollments[0].nextLessonIds[0]
        }
        this.lesson = await this.getLesson(lessonId)
        this.loadingLesson = false
        this.$nextTick(() => {
          this.totalSlides = this.$refs.curriculumSlides.slides.map((slide, index) => { return index + 1 })
        })
      }
    }
  }
}
</script>

<style lang="stylus">
.whiteboardDisabled
  color grey

.dashboard-logo
  display block
  margin auto
  height 25px
  width 100%
  z-index 5

.leave
  position absolute
  bottom 0
  font-weight 600

.font-weight
  font-weight 600

.enabled
  cursor url('/images/create.svg') 4 22, default

.text-color
  color #FFFFFF!important

.settings
  z-index 200
  position absolute
  padding-left 4px
  top 0

.actions
  background-color #eee!important

.chat-header
  z-index 2

#classroom {
  #classroom-container {
    width: 1024px;
    height: 768px;
    margin: auto;
    background-color: #00355f;
    border-radius: 5px;
    position: relative;
    .av-wrapper {
      text-align left
      display flex
      flex-direction column
      opacity .7
      position absolute
      left 0
      top 15%
      z-index: 1000;
      &:hover {
        opacity 1
      }
    }
    .remote-name {
      width: 100%;
      margin: 0px;
      padding: 0px;
      position: absolute;
      padding: 5px;
      background-color: rgba(0, 0, 0, 0.4);
      color: #fff;
      right: 0;
      font-weight: bold;
    }

    .bottom-row {
      position: absolute;
      width: 1022px;
      height: 440px;
      margin: 1px;
    }

    #streamActions {
      height: 300px;
      width: 200px;
    }

    .full-height {
      height: 100%;
      position: relative;
    }

    .full-height--actions {
      height: calc(100% - 48px);
      position: relative;
    }

    .full-center {
      position: relative;

      .center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .vid {
      width: 100%;
      display: inline-block;
      position: relative;
      height: 100%;

      & > div {
        display: inline-block;
        vertical-align: middle;
      }

      #Local, #Remote {
        width: 400px;
        height: 300px;
        background-color: #f4f4f4;
        background-image: url(../assets/images/webcam-placeholder.png);
        background-position: center;

        .tracks {
          width: 100%;
        }

        video {
          width: 100%;
        }
      }

      .video-alert {
        background-color: rgba(0, 0, 0, 0.6);
        color: #ffffff;
        position: absolute;
        right: 0;
        left: 0;
        padding: 20px;
        text-align: center;
        font-size: 24px;
        z-index: 100;
      }
    }

    #whiteboard {
      min-height: 460px;
    }

    .before-connect {
      left: 4px;
      display: inline-block;
      vertical-align: top;
      width: 700px;
      height: 454px;
      position: absolute;
      z-index: 200;
      background-image: url(../assets/images/bubble-snip.jpeg)
      background-size: cover;
      background-position: center;
    }

    .whiteboard {
      position: relative;
      height: 450px;

      canvas {
        box-shadow: 0px 0px 1px #000000;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0;

        &#localCanvas {
          z-index: 100;
        }

        &#remoteCanvas {
          z-index: 50;
        }
      }
    }

  }

  .slides {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    width: 699px;
    height: 394px;
    overflow: hidden;
    /* 750/422 */
    /* 700/394 */
    /* 650/365 */
    /* 600/337 */
    /* 550/309 */
  }
}
</style>
