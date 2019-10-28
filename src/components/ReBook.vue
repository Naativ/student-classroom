<template>
    <v-card left>
      <v-card-title>
        <h3>{{$t('rebook.title')}}</h3>
      </v-card-title>
      <v-layout v-if="loading" row justify-center>
        <v-progress-circular indeterminate size="64"/>
      </v-layout>
      <div v-if="bookings.length > 0 && !loading">
        <v-list
          two-line
          v-for="(booking, index) in bookings"
          :key="index"
        >
          <div>
            <v-list-tile>
              <v-list-tile-avatar>
                <v-icon v-if="!booking.profilePic" x-large>
                  account_circle
                </v-icon>
                <v-img
                  :lazy-src="searchChipPlaceholder"
                  v-if="booking.profilePic"
                  :src="booking.profilePic"
                  transition="scale-transition"
                />
              </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ booking.displayName }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{ booking.start }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action class="hidden-xs-only">
              <v-btn flat color="primary" @click="goTo(booking)">
                {{$t('teachersearch.viewprofile')}}
              </v-btn>
            </v-list-tile-action>
            </v-list-tile>
          </div>
          <v-divider v-if="index != bookings.length - 1"/>
        </v-list>
      </div>
      <v-card-actions>
        <v-btn
          @click="viewMore()"
          flat
        >{{$t('rebook.view.more')}}</v-btn>
      </v-card-actions>
    </v-card>
</template>

<script>
import sortBy from 'lodash.sortby'
import { getAsset } from '@/utils/AssetService'
import { getMemberAttributes, getMemberInfo } from '@/utils/member/MemberService'
import searchChipPlaceholder from '@/assets/images/searchChipPlaceholder.svg'

import { Actions as bookingActions } from '@/utils/booking/BookingStore'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      end: this.$moment().endOf('month'),
      getAsset,
      bookings: [],
      loading: true,
      searchChipPlaceholder,
      start: this.$moment().startOf('month')
    }
  },
  mounted() {
    this.getSortedBookings()
  },
  methods: {
    ...mapActions({
      searchBookings: bookingActions.SEARCH_BOOKINGS
    }),
    goTo(teacher) {
      this.$router.push(`/teacher/${teacher.slug}`)
    },
    async getSortedBookings() {
      this.loading = true
      const bookings = await this.searchBookings({ start: this.start, end: this.end })
      const filteredBookings = sortBy(bookings, b => new Date(b.start)).reverse()
      const result = []
      const map = new Map()
      for (const item in filteredBookings) {
        if (!map.has(filteredBookings[item].host.displayName) && filteredBookings[item].appointments.length > 0) {
          const teacherInfo = await getMemberInfo([filteredBookings[item].host.id])
          const teacherAttr = await getMemberAttributes({ memberId: filteredBookings[item].host.id, key: 'teacher-profile' })
          const profilePic = this.getAsset(teacherAttr.value.profilePic)
          const slug = teacherInfo[0].slugs[0].slug
          const time = this.$moment(filteredBookings[item].start).format('MM/DD/YYYY')
          map.set(filteredBookings[item].host.displayName)
          result.push({
            displayName: filteredBookings[item].host.displayName,
            profilePic: profilePic,
            slug: slug,
            start: time
          })
        }
      }
      if (result.length > 5) {
        this.bookings = result.slice(0, 5)
      } else {
        this.bookings = result
      }
      this.loading = false
    },
    viewMore() {
      this.$router.push('schedule')
    }
  }
}
</script>

<style>

</style>
