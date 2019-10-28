<template>
  <div class="text-xs-center">
    <v-dialog
      v-model="showBookingDialog"
      fullscreen
      transition="dialog-bottom-transition"
      persistent
      scrollable
    >
      <v-card>
        <v-toolbar class="headline primary" justify-center primary-title>
          <v-spacer></v-spacer>
          <v-toolbar-title>{{`${$t('booking.dialog.title')} ${lessonTime}`}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showBookingDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-layout v-if="loading" row justify-center>
            <v-progress-circular indeterminate size="64"/>
          </v-layout>
          <v-spacer></v-spacer>
          <h2
            v-if="!loading && !teachers.length"
            style="text-align: center; color: red;"
          >{{$t('booking.dialog.empty')}}</h2>
          <div v-else class="fluid grid-list-xl justify-center fill-height" style="padding: 0;">
            <v-layout row wrap>
              <v-flex d-flex xs12 sm6 md4 ma-3 v-for="(teacher, index) in teachers" :key="index">
                <v-card hover>
                  <v-card-title>
                    <v-layout column>
                    <h3>{{teacher.displayName.toUpperCase()}}</h3>
                    </v-layout>
                    <br/>
                    <v-chip small color="green" v-if="hasCert(teacher.certified)">
                      {{teacher.certified.toUpperCase()}}
                    </v-chip>
                  </v-card-title>
                  <v-divider></v-divider>
                  <div class="centered pa-2" >
                    <v-icon v-if="!teacher.profilePic" size="200px">person</v-icon>
                    <img
                      v-if="teacher.profilePic"
                      :src="getAsset(teacher.profilePic)"
                      height="200px"
                    >
                  </div>
                  <v-card-text text-xs-left>
                    <p>
                      <strong>{{$t('teacher.profile.about')}}:</strong>
                      {{ellipses(teacher.welcomeMessage, 353)}}
                    </p>
                    <div>
                      <p>
                        <strong>{{$t('teacher.profile.style')}}:</strong>
                      </p>
                      <v-chip
                        small
                        v-for="(tag, index) in teacher.selectedTeachingTags"
                        :key="index"
                      >{{ tag }}</v-chip>
                    </div>
                    <br>
                    <div>
                      <p>
                        <strong>{{$t('teacher.profile.personality')}}:</strong>
                      </p>
                      <v-chip
                        small
                        v-for="(tag, index) in teacher.selectedPersonalityTags"
                        :key="index"
                      >{{ tag }}</v-chip>
                    </div>
                  </v-card-text>
                  <v-spacer></v-spacer>
                  <v-divider></v-divider>
                  <div class="pl-3">{{ capitalize(bookingType) }} duration: {{ bookingTypeDuration }} {{$t('dashboard.minutes')}}</div>
                  <v-card-actions>
                    <v-flex d-flex xs12 sm6 md4 align-baseline justify-space-around v-for="(summary, index) in teacher.availabilitySummaries" :key="index">
                      <v-tooltip bottom :disabled="canBook">
                        <v-btn
                          round
                          class="primary"
                          @click="book(teacher, summary)"
                          :disabled="!canBook"
                          slot="activator"
                        >{{ format(summary.start) }}</v-btn>
                        <span>{{canBookMessage}}</span>
                      </v-tooltip>
                    </v-flex>
                      <v-spacer></v-spacer>
                      <v-flex d-flex xs12 sm6 md4 align-baseline justify-end>
                      <v-btn
                        v-if="teacher.slug"
                        round
                        class="text-capitalize white--text"
                        color="#fcba00"
                        :to="`/teacher/${teacher.slug}/?host=${teacher.memberId}&id=${teacher.availabilityId}&start=${teacher.start}&end=${teacher.end}`"
                        >
                        {{$t('teacher.profile.learnmore')}}
                        </v-btn>
                      </v-flex>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { getAsset } from '@/utils/AssetService'
import moment from 'moment'

export default {
  name: 'BookingDialog',
  props: {
    lessonTime: String,
    loading: Boolean,
    teachers: { type: Array, default: () => [] },
    showDialog: Boolean,
    canBook: Boolean,
    canBookMessage: String,
    bookingType: String
  },
  data() {
    return {
      getAsset
    }
  },
  watch: {
    teachers(newValue, oldValue) {
      newValue.forEach(teacher => {
        teacher.availabilitySummaries.sort(function(a, b) {
          return moment(a.start) - moment(b.start)
        })
      })
    }
  },
  methods: {
    book(teacher, summary) {
      this.$emit('selected', { teacher, summary })
    },
    ellipses(content, count) {
      if (content.length > count) {
        return content.slice(0, count) + '...'
      }
      return content
    },
    hasCert(certifications) {
      if (certifications && certifications.toLowerCase() !== 'no certification') {
        return true
      }
      return false
    },
    format(time) {
      let formattedTime = moment(time)
      return formattedTime.format('h:mm a')
    },
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  },
  computed: {
    showBookingDialog: {
      get() { return this.showDialog },
      set(v) { this.$emit('dismissDialog') }
    },
    bookingTypeDuration() {
      if (this.bookingType === 'conversation') {
        return '12'
      } else {
        return '25'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
