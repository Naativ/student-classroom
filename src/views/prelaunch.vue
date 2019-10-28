<template>
  <div class="prelaunch">
    <v-alert
      color="#00d3e6"
      :value="true"
      type="info"
      style="margin: 0; padding: 5px;"
      dismissible
      v-if="!flags.maintenance"
    >
      Are you a Naativ teacher or interested in being one? <a style="color: #fff; font-weight: bold;" :href="hostUrl">Click here</a>
    </v-alert>
    <v-alert
      color="#00d3e6"
      :value="true"
      type="info"
      style="margin: 90px 0 0 0; padding: 5px; border-width: 0;"
      dismissible
      v-if="flags.maintenance"
    >
      Are you a Naativ teacher or interested in being one? <a style="color: #fff; font-weight: bold;" :href="hostUrl">Click here</a>
    </v-alert>
    <Maintenance v-if="flags.maintenance"/>
    <main>
      <section class="section-one">
          <header v-if="!flags.maintenance">
            <div class="wrapper-container">
              <v-layout align-center justify-space-between row fill-height wrap>
                <v-flex xs12 sm4>
                  <div>
                    <img class="logo" src="../assets/images/logo.svg"/>
                  <br/>
                  <span style="white-space: nowrap; color: #ffffff;">{{$t('logo.subheader')}} <img style="width: 20px; margin: 0px 0 0 2px; vertical-align: middle;" src="../assets/images/usflag.png" /></span>
                </div>
                </v-flex>
                <v-flex xs12 sm8>
                <v-layout align-center justify-end row fill-height >
                  <v-flex xs6 sm3>
                    <LanguageSelector />
                  </v-flex>
                  <v-flex xs6 sm3 style="text-align: right; padding-right: 5px;">
                    <router-link data-cy="Home Page Login" :to="{name: 'Login', query: $route.query}">{{$t('login.login')}}</router-link>
                  </v-flex>
                </v-layout>
                </v-flex>
              </v-layout>
            </div>
          </header>
        <div class="wrapper-container">
          <div class="sprinkles">
            <h3>{{$t('prelaunch.event')}}</h3>
            <h1>{{$t('prelaunch.free.assessment')}}</h1>
            <p>{{$t('prelaunch.signup')}}</p>
            <i18n path="system.prelaunch.signup.order" tag="p">
              <span>{{$t('prelaunch.signup.callout')}}</span>
              <span class="underline">{{$t('prelaunch.signup.callout.underline')}}</span>
            </i18n>
            <v-form class="registration-form" ref="registration" @submit.prevent="register">
              <v-alert type="error" :value="error">
                {{ error }}
              </v-alert>
              <v-alert type="error" :value="true" v-if="!$browser.supported">
                {{$t($browser.invalidMessage)}}
              </v-alert>
              <v-text-field
                data-cy="Registration Name"
                solo
                flat
                name="name"
                :rules="rules.required"
                :placeholder="$t('form.name')"
                v-model.trim="registration.name"
                :disabled="flags.maintenance"/>
              <v-text-field
                data-cy="Registration Phone"
                solo
                flat
                name="phone"
                :rules="rules.required"
                :placeholder="$t('form.phone')"
                v-model.trim="registration.phoneNumber.phoneNumber"
                :disabled="flags.maintenance"/>
              <v-text-field
                data-cy="Registration Email"
                solo
                flat
                name="email"
                :rules="rules.email"
                :placeholder="$t('form.email')"
                v-model.trim="registration.email"
                :disabled="flags.maintenance"/>
              <v-text-field
                data-cy="Registration Password"
                solo
                flat
                name="password"
                :rules="rules.password"
                type="password"
                :placeholder="$t('form.password')"
                v-model="registration.password"
                :disabled="flags.maintenance"/>
              <v-text-field
                solo
                flat
                name="referral code"
                :placeholder="$t('form.referral.code')"
                v-model.trim="referralCode"
                :disabled="flags.maintenance"/>
              <v-btn
                data-cy="Sign Up"
                color="#00d3e6"
                depressed
                round
                large
                :loading="loading"
                :disabled="loading || flags.maintenance"
                class="text-capitalize white--text font-weight-black mb-3"
                type="submit">
                  {{$t('prelaunch.signup.register')}}
                </v-btn>
            </v-form>
            <p>{{$t('prelaunch.signup.after')}}</p>
          </div>
        </div>
      </section>
      <section class="section-two">
        <div class="wrapper-container">
          <h2 class="font-weight-light">{{$t('prelaunch.promo.title')}}</h2>
          <v-layout class="my-4">
            <v-flex xs6 class="px-3 mb-4">
              <img src="../assets/images/prelaunch/free.svg" />
              <p>{{$t('prelaunch.promo.one')}}</p>
            </v-flex>
            <v-flex xs6  class="px-3 mb-4">
              <img src="../assets/images/prelaunch/discount.svg" />
              <p>{{$t('prelaunch.promo.two')}}</p>
            </v-flex>
          </v-layout>
          <h3>{{$t('prelaunch.promo.action')}}</h3>
        </div>
      </section>
      <section class="section-three">
        <div class="wrapper-container">
          <v-layout row wrap align-center justify-center>
            <v-flex xs12 sm6>
              <img src="../assets/images/prelaunch/assessment@2x.png" />
            </v-flex>
            <v-flex xs12 sm6 class="small-left-align">
              <h2>{{$t('prelaunch.live.assessment')}}</h2>
              <p>
                <span class="font-weight-black">{{$t('prelaunch.live.assessment.desc.one')}}</span>
                <span>{{$t('prelaunch.live.assessment.desc.two')}}</span>
              </p>
            </v-flex>
          </v-layout>
        </div>
      </section>
      <section class="section-four">
        <div class="wrapper-container">
          <h2>{{$t('prelaunch.about.title')}}</h2>
          <p style="max-width: 832px; margin: auto;">
            <span>{{$t('prelaunch.about.desc.one')}}</span>
            <br/>
            <span class="font-weight-bold">{{$t('prelaunch.about.desc.two')}}</span>
          </p>
          <div class="teacher-bubbles">
            <div class="bubble left-bubble"></div>
            <div class="bubble mid-bubble"></div>
            <div class="bubble right-bubble"></div>
            <div class="bubble teacher-bubble-1"></div>
            <div class="bubble teacher-bubble-2"></div>
            <div class="bubble teacher-bubble-3"></div>
            <div class="bubble teacher-bubble-4"></div>
            <div class="bubble teacher-bubble-5"></div>
            <div class="bubble teacher-bubble-6"></div>
          </div>
          <v-layout row wrap>
            <v-flex xs12 sm2>
              <img src="../assets/images/prelaunch/about.teacher.svg" />
            </v-flex>
            <v-flex xs12 sm10>
              <p>{{$t('prelaunch.about.teacher')}}</p>
            </v-flex>
          </v-layout>
          <hr />
          <v-layout row wrap>
            <v-flex xs12 sm2>
              <img src="../assets/images/prelaunch/about.experience.svg" />
            </v-flex>
            <v-flex xs12 sm10>
              <p>{{$t('prelaunch.about.experience')}}</p>
            </v-flex>
          </v-layout>
        </div>
      </section>
      <section class="section-five">
        <div class="wrapper-container">
          <h2 class="mb-4">
            <span class="font-weight-light">{{$t('prelaunch.company.growth.one')}}</span>
            <span class="font-weight-bold">{{$t('prelaunch.company.growth.two')}}</span>
          </h2>
          <p class="font-weight-regular">{{$t('prelaunch.company.technology')}}</p>
          <div class="founder-box">
            <p class="my-2">{{$t('prelaunch.company.technology.quote')}}</p>
            <v-layout row wrap class="pt-4">
              <v-flex xs12 sm3>
                <img src="../assets/images/prelaunch/ceo@2x.png" />
              </v-flex>
              <v-flex xs12 sm9>
                <p>{{$t('prelaunch.company.founder.name')}}</p>
                <p class="font-weight-regular">{{$t('prelaunch.company.founder.intro')}}</p>
              </v-flex>
            </v-layout>
          </div>
          <div class="media-box">
            <p>{{$t('prelaunch.company.media')}}</p>
            <v-layout align-center justify-center row>
              <v-flex xs2 class="px-1">
                <img src="../assets/images/prelaunch/media-1@2x.png"/>
              </v-flex>
              <v-flex xs2 class="px-1">
                <a href="https://www.thelondoneconomic.com/tech-auto/technology/online-education-the-future-of-learning-a-foreign-language/03/01/"><img src="../assets/images/prelaunch/media-2@2x.png"/></a>
              </v-flex>
              <v-flex xs4 class="px-1">
                <a href="https://finance.yahoo.com/news/naativ-language-learning-platform-stands-000000046.html"><img src="../assets/images/prelaunch/media-3@2x.png"/></a>
              </v-flex>
              <v-flex xs4 class="px-1">
                <a href="https://markets.businessinsider.com/news/stocks/naativ-language-learning-platform-stands-out-with-technology-and-experiential-learning-1027883822"><img src="../assets/images/prelaunch/media-4@2x.png"/></a>
              </v-flex>
            </v-layout>
          </div>
        </div>
      </section>
      <section class="section-six">
        <div class="wrapper-container">
          <div style="max-width: 613px; margin: auto;">
            <h2>{{$t('prelaunch.curriculum.title')}}</h2>
            <p>{{$t('prelaunch.curriculum.desc.one')}}</p>
            <p>{{$t('prelaunch.curriculum.desc.two')}}</p>
          </div>
          <div class="my-3">
            <img :src="getCurriculumChart()"/>
          </div>
          <div class="kid-bubble-wrapper">
            <img src="../assets/images/prelaunch/kid-bubble@2x.jpg"/>
          </div>
          <p class="disclaimer">{{$t('prelaunch.curriculum.disclaimer')}}</p>
        </div>
      </section>
      <footer>
        <div class="wrapper-container">
          <v-layout row wrap align-center justify-center>
            <v-flex xs12 md2>
              <img class="logo" src="../assets/images/logo-alt.svg"/>
            </v-flex>
            <v-flex xs12 md2 class="my-3">
              <a href="privacy" class="link">{{$t('menu.privacy.policy')}}</a>
            </v-flex>
            <v-flex xs12 md2 class="my-3">
              <a href="terms" class="link">{{$t('menu.terms')}}</a>
            </v-flex>
            <v-flex xs12 md2 class="my-3">
              <span>{{$t('prelaunch.rights.reserved')}}</span>
            </v-flex>
            <v-spacer/>
            <v-flex xs12 md4>
              <v-layout align-center justify-center row fill-height>
                <v-flex xs2>
                  <a href="https://facebook.com/Naativ-263842094331101/">
                    <img src="../assets/images/prelaunch/fb.svg"/>
                  </a>
                </v-flex>
                <v-flex xs2>
                  <a href="https://www.instagram.com/naativco">
                    <img src="../assets/images/prelaunch/instagram.svg"/>
                  </a>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </div>
      </footer>
    </main>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'

import { Mutations, Actions } from '@/store'
import featureFlags from '@/utils/FeatureFlags'
import { rules } from '@/utils/Validation.js'
import { createMember } from '@/utils/RegistrationService.js'
import bowser from 'bowser'

import LanguageSelector from '@/components/LanguageSelector.vue'
import Maintenance from '@/components/Maintenance.vue'

export default {
  name: 'PreLaunch',
  components: {
    LanguageSelector,
    Maintenance
  },
  data() {
    return {
      flags: featureFlags,
      id: '',
      slug: '',
      loading: false,
      disabled: false,
      error: null,
      registration: {
        name: null,
        phoneNumber: {
          phoneNumber: null,
          type: 'CELL'
        },
        email: null,
        password: null
      },
      referralCode: null,
      rules
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.slug = this.$route.query.slug
      this.id = this.$route.query.id
    }
  },
  methods: {
    ...mapMutations({
      setJwt: Mutations.SET_JWT,
      setMember: Mutations.SET_MEMBER
    }),
    ...mapActions({
      generateToken: Actions.GENERATE_TOKEN,
      setMemberAttribute: Actions.SET_MEMBER_ATTRIBUTE
    }),
    isValidBrowser() {
      const browser = bowser.getParser(window.navigator.userAgent)
      const validBrowser = browser.satisfies({
        windows: {
          chrome: '>62',
          firefox: '>56'
        },
        macos: {
          chrome: '>62',
          firefox: '>56',
          safari: '>11'
        },
        android: {
          chrome: '>62',
          firefox: '>56'
        },
        iOS: {
          safari: '>11'
        }
      })
      return validBrowser
    },
    async register() {
      this.error = null
      if (this.$refs.registration.validate()) {
        this.loading = true

        try {
          const { token, member } = await createMember({
            ...this.registration,
            languageId: this.locale.current.id,
            displayName: this.registration.name
          })

          this.setJwt(token)
          this.setMember(member)
          await this.generateToken({
            type: 'claim',
            templateId: this.$t('system.claim.template.id')
          })
          try {
            await this.setMemberAttribute({
              key: 'registration-details',
              value: {
                systemLocale: navigator.language,
                slug: this.slug,
                id: this.id
              }
            })
          } catch (e) {
            console.log('There was an error saving the referral ID')
          }
          if (this.referralCode) {
            try {
              await this.setMemberAttribute({
                key: 'registration-referral-code',
                value: { code: this.referralCode }
              })
            } catch (e) {
              console.log('There was an error saving the referral ID')
            }
          }
          this.loading = false
          this.$router.push('/homeroom/dashboard')
        } catch (e) {
          this.loading = false
          if (e.message.indexOf('is already registered') > 0) {
            this.error = this.$t('registration.error.already.registered', [this.registration.email])
          } else {
            this.error = this.$t('registration.error')
          }
        }
      }
    },
    getCurriculumChart() {
      const modifier = this.$vuetify.breakpoint.xs ? '-mobile' : ''
      return `/${this.locale.current.code}-curriculum${modifier}.png`
    }
  },
  computed: {
    ...mapGetters({
      locale: 'locale',
      hostUrl: 'hostUrl'
    })
  }
}
</script>
<style lang="stylus">
// kr gets letter-spacing -0.7px
@media screen and (min-width: 600px)
  .small-left-align
    text-align left
.prelaunch
  header
    margin-bottom 47px
    a
      font-size 18px
      color #ffffff
      font-weight 900
    .logo
      width 120px
      height 25px
      margin-bottom -10px
  .wrapper-container
    max-width 1162px
    margin auto
  p
    font-size 14px
    font-weight 500
    margin-bottom 0
  .section-one
    padding 25px 16px 48px 16px
    background-color #db6d8a
    text-align center

    .error--text
      color #000000 !important
      background-color #ff5252 !important

    .sprinkles
      background url(../assets/images/prelaunch/sprinkles.svg) no-repeat
      background-size contain
      background-position top center
      max-width 1080px
      margin auto

      .underline
        text-decoration underline
        font-weight 900
      h3
        display inline-block
        background-color #ffffff
        color #db6d8a
        padding 3px 8px
      h1
        font-size 28px
        font-weight 900
        padding 0 45px
        color #ffffff
        margin 8px 0 16px 0

    .registration-form
      max-width 351px
      margin 50px auto 5px auto

    p
      color #ffffff

    @media screen and (min-width: 600px)
      padding 25px 16px 96px 16px
      .sprinkles
        h1
          font-size 36px
      p
        font-size 16px

    @media screen and (min-width: 960px)
      .sprinkles
        h1
          font-size 56px
      p
        font-size 18px

  .section-two
    text-align center
    padding 40px 32px
    h2
      font-size 24px

    h3
      font-size 14px
      line-height 24px
      font-weight 400

    .wrapper-container
      max-width 598px
      margin auto

    img
      width 100%

    @media screen and (min-width: 600px)
      padding 100px 32px
      p
        font-size 18px
      h2
        font-size 36px
      h3
        font-size 16px
    @media screen and (min-width: 960px)
      padding 100px 32px
      p
        font-size 20px
      h2
        font-size 56px
      h3
        font-size 20px

  .section-three
    text-align center
    background-color #00d3e4
    padding 40px 16px
    color #ffffff

    .wrapper-container
      max-width 1281px
      margin auto

    h2
      font-size 24px
      font-weight 300
      margin-bottom 32px

    img
      width 100%

    @media screen and (min-width: 600px)
      padding 80px 16px
      h2
        font-size 36px

      p
        font-size 16px

    @media screen and (min-width: 960px)
      padding 100px 16px
      h2
        font-size 56px

      p
        font-size 20px

  .section-four
    text-align center
    background-color #ffac2a
    padding 40px 16px
    color #ffffff
    overflow hidden

    hr
      border #ffc52a solid 2px
      margin 25px 0

    h2
      margin-bottom 28px
      font-size 24px
      font-weight 300

    .wrapper-container
      max-width 832px
      margin auto

    .teacher-bubbles
      height 67vw
      max-height 579px
      position relative

      .bubble
        position absolute
        border-radius 100%
        transition all
        &.left-bubble
          background-color #ffc52a
          width 49%
          height 66%
          left -25%
          top -2%

        &.mid-bubble
          background-color #ffc52a
          width 13%
          height 17%
          left 40%
          bottom 17%

        &.right-bubble
          background-color #ffc52a
          width 49%
          height 66%
          right -22%
          top 22%

        &.teacher-bubble-1
          width 39%
          height 52%
          background-image url('../assets/images/prelaunch/teacher-1@2x.png')
          background-size cover

        &.teacher-bubble-2
          width 20%
          height 27%
          background-image url('../assets/images/prelaunch/teacher-2@2x.png')
          background-size cover
          top 35%
          left 30%

        &.teacher-bubble-3
          width 29%
          height 39%
          background-image url('../assets/images/prelaunch/teacher-3@2x.png')
          background-size cover
          top 21%
          right 11%

        &.teacher-bubble-4
          width 13%
          height 17%
          background-image url('../assets/images/prelaunch/teacher-4@2x.png')
          background-size cover
          top 1%
          right 0

        &.teacher-bubble-5
          width 16%
          height 21%
          background-image url('../assets/images/prelaunch/teacher-5@2x.png')
          background-size cover
          bottom 10%
          left 32%

        &.teacher-bubble-6
          width 20%
          height 27%
          background-image url('../assets/images/prelaunch/teacher-6@2x.png')
          background-size cover
          bottom 15%
          right 1%

    @media screen and (min-width: 600px)
      padding 100px 16px 96px 16px
      .teacher-bubbles
        margin-top 50px
      h2
        font-size 36px
      p
        font-size 16px

    @media screen and (min-width: 960px)
      .teacher-bubbles
        margin-top 100px
      h2
        font-size 56px
      p
        font-size 18px

  .section-five
    background-color #f1f1f1
    padding 40px 16px
    text-align center

    .wrapper-container
      max-width 777px
      margin auto

    .media-box
      background-color #ffffff
      padding 22px 12px
      border-radius 7px

      img
        width 100%

      p
        font-size 16px

    .founder-box
      margin 32px 0 8px 0
      position relative
      border-radius 7px
      background-image linear-gradient(324deg, #03e5bf, #00d3e4)
      width 100%
      padding 24px 16px

      img
        width 80px
        height 80px

      &::before
        content ''
        position absolute
        width 46px
        height 46px
        display block
        background-image url(../assets/images/prelaunch/quotes.svg)
        background-repeat no-repeat
        top -21px
        left 8px
      p
        font-size 16px
        color #ffffff
        font-weight 400

    @media screen and (min-width: 600px)
      padding 100px 16px 96px 16px
      h2
        font-size 36px
      p
        font-size 18px

      .founder-box
        p
          font-size 20px

    @media screen and (min-width: 960px)
      h2
        font-size 56px
      p
        font-size 20px

      .founder-box
        p
          font-size 25px
      .media-box
        padding 22px 100px

  .section-six
    background-color #ffffff
    padding 40px 16px
    text-align center

    h2
      font-size 24px
      font-weight 300
      margin-bottom 28px

    p
      font-weight 400
      margin-bottom 40px

    .wrapper-container
      max-width 1162px
      margin auto

    .disclaimer
      margin 40px auto
      font-size 10px
      color #db6d8a
      max-width 595px

    .kid-bubble-wrapper
      max-width 889px
      margin auto

    img
      width 100%

    @media screen and (min-width: 600px)
      padding 100px 16px 96px 16px
      h2
        font-size 36px
      p
        font-size 16px
      .disclaimer
        font-size 14px

    @media screen and (min-width: 960px)
      h2
        font-size 56px
      p
        font-size 18px
      .disclaimer
        font-size 17px

  footer
    background-color #f6f3f2
    padding 40px 16px
    text-align center
    color #686868
    font-size 14px

    .link
      color #686868
      text-decoration none
    .link:hover
      color #00d3e6
    img
      width 32px
      height 32px

      &.logo
        width 145px

</style>
