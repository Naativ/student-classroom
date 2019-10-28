<template>
  <v-container>
    <v-dialog v-model="showBookingDialog" width="500">
      <v-card>
        <v-card-title>
          <h1>{{$t('teacher.profile.booking.dialog.title')}}</h1>
        </v-card-title>
        <v-list two-line>
          <v-list-tile>
            <v-list-tile-avatar>
              <img
                v-if="host.profilePic"
                :src="getAsset(host.profilePic)"
              />
              <v-icon v-else x-large>account_circle</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{host.displayName}}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              {{booking.start.format('MMM Do h:mm a')}}
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <v-card-actions class="justify-center">
          <v-btn
            class="primary text-capitalize"
            depressed
            round
            large
            @click="book"
          >
            {{$t('teacher.profile.booking.dialog.action')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { getAsset } from '@/utils/AssetService'

export default {
  name: 'ConfirmBooking',
  props: {
    booking: { type: Object, required: true },
    host: { type: Object, required: true },
    showDialog: Boolean
  },
  data() {
    return {
      getAsset,
      loading: false,
      showConfirmation: this.disabled
    }
  },
  methods: {
    async book() { this.$emit('book') }
  },
  computed: {
    showBookingDialog: {
      get() { return this.showDialog },
      set(v) {
        this.$emit('dismissBookingDialog')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
