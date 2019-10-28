<template>
  <v-dialog max-width="600px" v-model="settingsDialog" persistent>
    <v-btn
      color="rgb(0,0,0,.4)"
      class="white--text"
      icon slot="activator">
      <v-icon>settings</v-icon>
    </v-btn>
    <v-card v-if="settingsDialog">
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">{{$t('classroom.settings.confirm')}}</h3>
        </div>
      </v-card-title>
      <v-card-text>
        <v-flex xs12>
          <label for="video-input">{{$t('classroom.settings.video.source')}}</label>
          <v-select
            id="video-input"
            :value="videoId"
            single-line
            @change="trackChanged('video', $event)"
            item-value="deviceId"
            item-text="label"
            :items="availableTracks.video"
            label="Video Source"
            outline
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <label for="audio-input">{{$t('classroom.settings.audio.source')}}</label>
          <v-select
            id="audio-input"
            :value="audioId"
            single-line
            @change="trackChanged('audio', $event)"
            item-value="deviceId"
            item-text="label"
            :items="availableTracks.audioInput"
            label="Audio Input"
            outline
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <label for="speaker">{{$t('classroom.settings.speakers')}}</label>
          <v-select
            id="speaker"
            :value="remoteAudio"
            single-line
            @change="trackChanged('speaker', $event)"
            item-value="deviceId"
            item-text="label"
            :items="availableTracks.audioOutput"
            label="Audio Output"
            outline
          ></v-select>
        </v-flex>
      </v-card-text>
      <v-card-actions>
        <v-btn depressed color="#00d3e6" @click="applyChanges">{{$t('classroom.settings.save')}}</v-btn>
        <v-btn
          depressed
          color="#f382ae"
          @click.native="newTracks = {}; settingsDialog = false"
        >{{$t('classroom.settings.cancel')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { findIndex } from 'lodash'
import { mapActions } from 'vuex'
import { Actions } from '@/utils/appointment/Store'

export default {
  name: 'VideoAudioSettings',
  props: {
    appointmentId: Number,
    conversation: { type: Boolean, default: false },
    videoId: String,
    audioId: String,
    remoteAudio: String,
    permissionsSet: Boolean,
    classroom: {
      type: Boolean,
      default: false
    }
  },
  async mounted() {
    const devices = await navigator.mediaDevices.enumerateDevices()
    devices.forEach(d => {
      if (d.kind === 'audioinput') {
        this.availableTracks.audioInput.push(d)
      }
      if (d.kind === 'audiooutput') {
        this.availableTracks.audioOutput.push(d)
      }
      if (d.kind === 'videoinput') {
        this.availableTracks.video.push(d)
      }
    })
  },
  data() {
    return {
      aptId: null,
      availableTracks: {
        video: [],
        audioOutput: [],
        audioInput: []
      },
      newTracks: {},
      settingsDialog: false
    }
  },
  methods: {
    ...mapActions({
      insertLog: Actions.INSERT_LOG
    }),
    trackChanged(type, event) {
      event !== this[`${type}Id`]
        ? this.newTracks[type] = event
        : delete this.newTracks[type]

      if (this.aptId) {
        this.insertLog({
          appointmentId: this.aptId,
          metadata: { memberId: this.$store.state.member.id, track: this.newTracks[type] },
          type: 'device:updated'
        })
      }
    },
    applyChanges() {
      if (Object.keys(this.newTracks).length > 0) {
        this.$emit('change', this.newTracks)
      }
      this.settingsDialog = false
      if (this.aptId) {
        this.insertLog({
          appointmentId: this.aptId,
          metadata: { memberId: this.$store.state.member.id, applied: true },
          type: 'device:settings'
        })
      }
    },
    async loadLocalTracks() {
      this.availableTracks.audioInput = []
      this.availableTracks.audioOutput = []
      this.availableTracks.video = []
      const devices = await navigator.mediaDevices.enumerateDevices()
      devices.forEach(d => {
        if (d.kind === 'audioinput') {
          this.availableTracks.audioInput.push(d)
        }
        if (d.kind === 'audiooutput') {
          this.availableTracks.audioOutput.push(d)
        }
        if (d.kind === 'videoinput') {
          this.availableTracks.video.push(d)
        }
      })
    },
    nextVideoTrack(curTrack) {
      const tracks = this.availableTracks.video
      const curDeviceId = curTrack.mediaStreamTrack.getSettings().deviceId
      const curIndex = findIndex(tracks, t => t.deviceId === curDeviceId)
      const nextTrack = curIndex >= tracks.length - 1
        ? tracks[0]
        : tracks[curIndex + 1]
      return nextTrack
    }
  },
  watch: {
    appointmentId(val) { this.aptId = val },
    async permissionsSet(newVal, oldVal) {
      this.loadLocalTracks()
    }
  }
}
</script>

<style lang="stylus" scoped>
.icon
  color rgb(0,0,0,0.4)
</style>
