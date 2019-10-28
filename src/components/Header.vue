<template>
  <div
    v-scroll-class:shrink=50
    class="header"
    :class="{alt}">
    <div class="logo">
      <router-link to="/">
        <img src="../assets/images/logo.svg">
        <br/>
        <span style="white-space: nowrap;">{{$t('logo.subheader')}} <img style="width: 20px; margin: 0px 0 0 2px; vertical-align: middle;" src="../assets/images/usflag.png" /></span>
      </router-link>
    </div>
    <div v-if="isLoggedIn" class="actions">
      <v-menu offset-y offset-x v-if="currentProfile">
        <div slot="activator">
          <span>{{ currentProfile.displayName }}</span>
          <v-avatar >
            <img :src="currentProfile.avatarUrl"/>
          </v-avatar>
        </div>
        <v-list>
          <v-list-tile
            v-for="p in profiles"
            :key="p.id"
            @click="makeDefault(p)"
          >
            <v-list-tile-title>{{ p.displayName }}</v-list-tile-title>
            <v-list-tile-avatar>
              <img class="learning-profile avatar" :src="p.avatarUrl">
            </v-list-tile-avatar>
          </v-list-tile>
          <v-list-tile @click="logout()">
            <v-list-tile-title>{{$t('dashboard.logout')}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn v-else flat @click="logout()">{{$t('dashboard.logout')}}</v-btn>
    </div>
    <div v-if="!hideLogin && !isLoggedIn">
      <v-layout>
        <v-spacer class="hide-super-small"/>
        <v-flex>
          <v-btn
            @click="login"
            flat
          >{{$t('login')}}</v-btn>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as LearningProfileStore from '@/LearningProfile/Store'
import { Actions } from '@/store'

export default {
  name: 'NaativHeader',
  props: {
    alt: {
      type: Boolean,
      default: false
    },
    hideLogin: {
      type: Boolean,
      default: false
    },
    member: Object
  },
  async mounted() {
    if (this.isLoggedIn) {
      await this.getProfiles()
    }
  },
  methods: {
    ...mapActions({
      makeDefault: LearningProfileStore.Actions.MAKE_DEFAULT,
      getProfiles: LearningProfileStore.Actions.GET
    }),
    async logout() {
      await this.$store.dispatch(Actions.LOGOUT)
      // We need to force the page refresh on logout
      window.location = '/'
    },
    login() {
      if (this.$route.name === 'Teacher Profile') {
        this.$router.push('/login?returnTo=' + this.$route.path)
      } else {
        this.$router.push('/login')
      }
    }
  },
  computed: {
    ...mapGetters({
      profiles: LearningProfileStore.Getters.profiles,
      currentProfile: LearningProfileStore.Getters.profile,
      isLoggedIn: 'isLoggedIn'
    })
  }
}
</script>
<style lang="stylus" scoped>
.hide-super-small
  @media only screen and (max-width: 374px)
    display none !important

.shrink
  background-color #fcba00
  .logo
    img
      width 125px
      margin 0 0 0 5px
    span
      font-size 12px
      margin 0 0 0 5px
  .actions
    flex 1
    display inline-block
    white-space nowrap

    .v-btn
      margin 0
      @media only screen and (max-width: 425px)
        padding 0 !important
        min-width 78px
.alt
  .actions
    display inline-block
    white-space nowrap
.logo
  flex 1
  img
    transition .3s all
    width 150px
    margin 12px 0 0 10px
  a,span
    color #fff
    text-decoration none
  span
    transform translateY(-10px)
    margin -1px 0 0 10px
    display inline-block

.actions
  display none
  flex 1
  text-align right
  padding-right 10px

  span
    display inline-block
    padding 15px 0

.header
  display flex
  padding: 15px 0 5px 0
  position fixed
  left 0
  right 0
  top 0
  z-index 100

  &.alt
    background-color #fcba00
</style>
