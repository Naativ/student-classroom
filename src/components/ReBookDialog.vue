<template>
  <v-card class="rebook">
    <v-container>
      <v-layout
        column
        align-center
        justify-space-around
      >
        <img src="../assets/images/logo-alt.svg" class="logo"/>
        <v-card-title class="headline" primary-title wrap style="justify-content: center">
          {{ booking.host.displayName }}
        </v-card-title>
        <p>{{$t('rebook.dialog.description')}}</p>
        <p>{{$t('tokens.remaining.balance')}}: </p>
        <div class="display-3 centered">
          {{balance}}
        </div>
        <v-layout row>
          <v-btn v-if="!show" @click="show = true">{{$t('rebook.dialog.yes')}}</v-btn>
          <v-btn v-if="!show" @click="home()">{{$t('rebook.dialog.no')}}</v-btn>
        </v-layout>
        <Booking v-if="show" :host="booking.host" :booking="booking" @booked="home"/>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import Booking from '@/components/booking/Index.vue'
import { mapState, mapActions } from 'vuex'
import * as MemberStore from '@/utils/member/MemberStore'

export default {
  name: 'Test',
  components: {
    Booking
  },
  props: {
    booking: Object
  },
  async mounted() {
    await this.getBalance(this.booking.guest.id)
    if (this.balance < 1) {
      this.$router.push('/homeroom/dashboard')
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    ...mapActions({
      getBalance: MemberStore.Actions.MEMBER_BALANCE
    }),
    home() {
      this.$router.push('/homeroom/dashboard')
    }
  },
  computed: {
    ...mapState({
      balance: state => state.MemberStore.balance
    })
  }
}
</script>

<style lang="stylus" scoped>
.rebook
  min-height 100%

.logo
  width 300px

</style>
