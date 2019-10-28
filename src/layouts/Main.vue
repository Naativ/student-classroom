<template>
  <div @mousemove="checkDemoHover" id="main-layout">
    <DemoBanner :demoOpacity="demoOpacity" :hasDemoTag="hasTag('system:demo')" ref="demoBanner" />
    <v-navigation-drawer
      v-model="drawer"
      id="nav"
      class="drawer"
      app
      clipped
      width="200"
    >
      <v-list>
        <v-list-tile
          data-cy="Dashboard"
          color="white"
          :to="{ name: 'Dashboard' }"
          active-class="active"
        >
          <v-list-tile-content>
            <v-list-tile-title class="title-flex">
              <v-icon class="icon">home</v-icon>
              {{$t('menu.dashboard')}}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
         <v-list-tile
          color="white"
          :to="{ name: 'Library'}"
          active-class="active"
        >
          <v-list-tile-content>
            <v-list-tile-title class="title-flex">
              <v-icon class="icon">local_library</v-icon>
              {{$t('menu.library')}}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          color="white"
          :to="{ name: 'Worksheets'}"
          active-class="active"
        >
          <v-list-tile-content>
            <v-list-tile-title class="title-flex">
              <v-icon class="icon">description</v-icon>
              {{$t('menu.worksheets')}}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="subscriptions.length > 0"
          color="white"
          :to="{ name: 'Schedule'}"
          active-class="active"
        >
          <v-list-tile-content>
            <v-list-tile-title class="title-flex">
              <v-icon class="icon">calendar_today</v-icon>
              {{$t('menu.schedule')}}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          color="white"
          :to="{ name: 'Profile'}"
          active-class="active"
        >
          <v-list-tile-content>
            <v-list-tile-title class="title-flex">
              <v-icon data-cy="Menu Profile" class="icon">person</v-icon>
              {{$t('menu.profile')}}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          color="white"
          :to="{ name: 'Subscriptions'}"
          active-class="active"
        >
          <v-list-tile-content>
            <v-list-tile-title class="title-flex">
              <v-icon class="icon">attach_money</v-icon>
              {{$t('menu.subscriptions')}}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <!-- adds to the bottom of the menu -->
      <v-spacer></v-spacer>
      <div class="text-xs-center my-4">
        <a href="/privacy" class="link pa-2">{{$t('menu.privacy.policy')}}</a>
        <span class="dot"></span>
        <a href="/terms" class="link pa-2">{{$t('menu.terms')}}</a>
      </div>
    </v-navigation-drawer>
    <v-toolbar color="#fcba00" app dense fixed clipped-left >
      <v-toolbar-side-icon data-cy="Hamburger Menu" @click.stop="drawer = !drawer">
        <v-icon class="hamburger">menu</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title style="margin-left: -5px;">
        <router-link to="/">
          <img class="logo" src="../assets/images/logo.svg">
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="member">
        <v-menu offset-y offset-x v-if="currentProfile">
          <div slot="activator">
            <span>{{ currentProfile.displayName }}</span>
            <v-avatar size="40" style="margin-left: 10px;">
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
            <v-list-tile @click="logoutAndRedirect()">
              <v-list-tile-title>{{$t('dashboard.logout')}}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-btn data-cy="Logout" v-else flat @click="logoutAndRedirect()">{{$t('dashboard.logout')}}</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content app>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
    <v-snackbar v-model="loadingPrincipal" bottom>
      {{$t('dashboard.loading.data')}}
    </v-snackbar>
    <v-dialog v-model="wrongMemberType" persistent max-width="450px">
      <v-card class="centered">
        <v-card-title class="display-2">
          Hey there, Teacher!
        </v-card-title>
        <v-card-text class="headline">
          The teacher's lounge has been moved to <a :href="hostUrl">{{hostUrl}}</a>.
          Feel free to bookmark it or click on the button below and you will be taken there!
        </v-card-text>
        <v-card-actions>
          <v-btn large primary @click="logoutAndRedirect(hostUrl)">Go to teacher's lounge</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { get } from 'lodash'
import { Mutations, Actions } from '@/store'
import * as LearningProfileStore from '@/LearningProfile/Store'
import * as SubscriptionsStore from '@/Subscriptions/Store'
import * as MemberStore from '@/utils/member/MemberStore'
import DemoBanner from '@/components/DemoBanner'
import { GET_PRINCIPAL } from '@/graphql/Iam.gql.js'
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'MainLayout',
  components: {
    DemoBanner
  },
  data() {
    return {
      demoOpacity: undefined,
      drawer: null,
      loadingPrincipal: true,
      wrongMemberType: false
    }
  },
  methods: {
    ...mapActions({
      makeDefault: LearningProfileStore.Actions.MAKE_DEFAULT,
      getProfiles: LearningProfileStore.Actions.GET,
      getSubscriptions: SubscriptionsStore.Actions.GET_SUBSCRIPTIONS,
      getBalance: MemberStore.Actions.MEMBER_BALANCE,
      logout: Actions.LOGOUT
    }),
    ...mapMutations({
      setMember: Mutations.SET_MEMBER,
      setPrincipal: Mutations.SET_PRINCIPAL,
      setLocale: Mutations.SET_LOCALE
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
      const tags = this.member.tags || []
      return tags.indexOf(tag) > -1
    },
    async logoutAndRedirect(redirectTo = '/') {
      await this.logout()
      // We need to force the page refresh on logout
      window.location = redirectTo
    }
  },
  computed: {
    ...mapGetters({
      member: 'member',
      locale: 'locale',
      hostUrl: 'hostUrl',
      profiles: LearningProfileStore.Getters.profiles,
      currentProfile: LearningProfileStore.Getters.profile,
      subscriptions: SubscriptionsStore.Getters.subscriptions
    })
  },
  apollo: {
    principal: {
      query: GET_PRINCIPAL,
      fetchPolicy: 'network-only',
      async update({ getPrincipal }) {
        if (get(getPrincipal, 'member.type.key') === 'host') {
          this.wrongMemberType = true
        } else {
          this.setPrincipal(getPrincipal)
          this.setMember(getPrincipal.member)
          this.setLocale(this.locale.available.find(l => l.id === getPrincipal.member.languageId))
          this.loadingPrincipal = false
        }
      }
    }
  },
  watch: {
    async member(newVal, oldVal) {
      await this.getBalance(this.member.id)
      await this.getProfiles()
      await this.getSubscriptions()
    }
  }
}
</script>
<style lang="stylus">
#main-layout
  padding-bottom: 50px
  .dashboard-logo
    display block
    margin auto
    height 25px
  .dot
    height: 4px;
    width: 4px;
    background-color: #fff;
    border-radius: 50%;
    display: inline-block;
  .drawer
    display flex
    flex-direction column
  .footer-height
    height 35px
  .hamburger
    color #fff
    font-size 30px
  .icon
    color #fff
    margin-right 10px
  .link
      color #fff
      font-size 11px
      text-decoration none
      transition font-size 300ms cubic-bezier(0.69,-0.56, 0.13, 1.57)
    .link:hover
      font-size 16px
  .logo
    height 30px
    margin-top 10px
    margin-left 15px
  .privacy
    font-size 10px
    line-height 30px
    text-align center
  .title-flex
    display inline-flex
  .toolbar
    z-index 100

  #nav
    background-color #00d3e6
    transform translateY(-75px)

    .active
      color #fff
      font-size 18px
      font-weight bold

</style>
