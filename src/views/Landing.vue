<template>
  <div>
    <header>
      <div class="wrapper-container">
        <v-layout align-center justify-space-between row fill-height wrap>
          <v-flex xs12 sm6 class="text-xs-center text-sm-left">
            <img class="logo" src="../assets/images/logo-alt.svg"/>
          </v-flex>
          <v-flex xs12 sm6>
            <v-layout
              row
              fill-height
              align-center
              :class="{'justify-end': $vuetify.breakpoint.smAndUp, 'justify-space-around': $vuetify.breakpoint.xsOnly}">
              <LanguageSelector :dark="false"/>
              <v-btn
                flat
                small
                class="text-capitalize"
                data-cy="Home Page Login"
                :to="{name: 'Login', query: $route.query}">
                {{$t('login.login')}}
              </v-btn>
              <ApplyDialog class="hidden-xs-only"/>
            </v-layout>
          </v-flex>
        </v-layout>
      </div>
    </header>
    <div class="wrapper-container">
      <div class="hero">
        <div>
          <img src="../assets/images/logo-icons.svg"/>
        </div>
        <div>
          <h1>{{$t('landing.hero.title')}}</h1>
          <p>{{$t('landing.hero.desc')}}</p>
          <ApplyDialog/>
        </div>
      </div>
    </div>
    <div class="greybar section-1">
      <div class="wrapper-container">
        <v-layout row wrap align-center justify-space-around>
          <v-flex xs12 sm6 class="pa-5">
            <h2 class="py-3">{{$t('landing.section.1.title')}}</h2>
            <p>{{$t('landing.section.1.desc')}}</p>
            <div>
              <h4>{{$t('landing.section.1.list.title')}}</h4>
              <ul class="checkmark-list">
                <li>{{$t('landing.section.1.list.1')}}</li>
                <li>{{$t('landing.section.1.list.2')}}</li>
              </ul>
            </div>
          </v-flex>
          <v-flex xs12 sm6>
            <img src="/landing/journey.jpg" class="" />
          </v-flex>
        </v-layout>
        <div class="parallax-dots">
          <img v-scroll="{speed: 12}" src="/landing/background_dots.svg" />
        </div>
      </div>
    </div>
    <div class="section-2 wrapper-container">
      <h2 class="text-xs-center py-5">{{$t('landing.section.2.title')}}</h2>
      <v-layout row wrap align-stretch justify-space-between>
        <v-flex xs12 sm4 class="px-5">
          <img src="/landing/register.jpg" />
          <h3 class="py-2">{{$t('landing.section.2.list.1.title')}}</h3>
          <p class="py-2">{{$t('landing.section.2.list.1.desc')}}</p>
        </v-flex>
        <v-flex xs12 sm4 class="px-5">
          <img src="/landing/assessment.jpg" />
          <h3 class="py-2">{{$t('landing.section.2.list.2.title')}}</h3>
          <p class="py-2">{{$t('landing.section.2.list.2.desc')}}</p>
        </v-flex>
        <v-flex xs12 sm4 class="px-5">
          <img src="/landing/community.jpg" />
          <h3 class="py-2">{{$t('landing.section.2.list.3.title')}}</h3>
          <p class="py-2">{{$t('landing.section.2.list.3.desc')}}</p>
        </v-flex>
      </v-layout>
      <div class="text-xs-center py-5">
        <ApplyDialog/>
      </div>
    </div>
    <div class="greybar section-3">
      <div class="wrapper-container">
        <v-layout row wrap align-center justify-space-around>
          <v-flex xs12 sm6 class="pa-5">
            <hr class="blue-rule"/>
            <h2 class="py-4">{{$t('landing.section.3.title')}}</h2>
            <p class="py-1">{{$t('landing.section.3.desc')}}</p>
          </v-flex>
          <v-flex xs12 sm6 class="parallax-images">
            <img v-scroll="{speed: 20}" class="top-image" src="/landing/growing_little_kid.jpg" />
            <img v-scroll="{speed: 16}" class="dots" src="/landing/background_dots.svg" />
            <img v-scroll="{speed: 10}" class="bottom-image" src="/landing/teen.jpg" />
          </v-flex>
        </v-layout>
      </div>
    </div>
    <div class="section-4 wrapper-container">
      <h2 class="py-4 text-xs-center">{{$t('landing.section.4.title')}}</h2>
      <v-layout row wrap align-center justify-space-between>
        <v-flex xs12 sm3 class="text-xs-center">
          <img src="/landing/fox-news.jpg" />
        </v-flex>
        <v-flex xs12 sm3 class="text-xs-center">
          <img src="/landing/tle.jpg" />
        </v-flex>
        <v-flex xs12 sm3 class="text-xs-center">
          <img src="/landing/yahoo.jpg" />
        </v-flex>
        <v-flex xs12 sm3 class="text-xs-center">
          <img src="/landing/business-insider.jpg" />
        </v-flex>
      </v-layout>
    </div>
    <div class="section-5 wrapper-container">
      <v-layout row wrap align-center justify-space-around>
        <v-flex xs12 sm6 class="pa-4" style="z-index: 10;">
          <hr class="blue-rule"/>
          <div class="pl-4 pr-5">
            <h2 class="pb-4">{{$t('landing.section.5.title')}}</h2>
            <p>{{$t('landing.section.5.desc.1')}}</p>
          </div>
          <!-- <img class="bottom-image" src="/landing/world-class-assessment.jpg" /> -->
          <img v-scroll="{speed: 24}" class="bottom-image" src="/landing/world-class-assessment.jpg" />
        </v-flex>
        <v-flex xs12 sm6  style="z-index: 10;">
          <img class="top-image" src="/landing/world-class.jpg" />
          <p class="px-5">{{$t('landing.section.5.desc.2')}}</p>
        </v-flex>
      </v-layout>
    </div>
    <div class="section-6 greybar hidden-sm-and-down my-5">
      <div class="wrapper-container">
        <v-layout row justify-center align-center class="skinny">
          <v-flex xs12 class="text-xs-center">
            <div class="floaty-logos">
              <img src="/landing/background_dots.svg" class="dots"/>
              <img src="../assets/images/logo-icons.svg" class="logo-bubbles"/>
            </div>
            <ApplyDialog/>
          </v-flex>
        </v-layout>
      </div>
    </div>
    <div class="section-7 wrapper-container curriculum">
      <v-layout row align-stretch>
        <v-flex>
          <v-layout column fill-height>
            <v-flex xs2 class="curriculum-header">
              &nbsp;
            </v-flex>
            <v-flex class="header-cell" xs2>{{$t('curriculum.title.speaking')}}</v-flex>
            <v-flex class="header-cell" xs2>{{$t('curriculum.title.listening')}}</v-flex>
            <v-flex class="header-cell" xs2>{{$t('curriculum.title.pronunciation')}}</v-flex>
            <v-flex class="header-cell" xs2>{{$t('curriculum.title.grammar')}}</v-flex>
            <v-flex xs2>&nbsp;</v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout column fill-height>
            <v-flex xs2 class="curriculum-header beginner">
              <h2>{{$t('curriculum.title.beginner')}}</h2>
            </v-flex>
            <v-flex xs2>
              <v-layout row>
                <v-flex class="cell" xs4>{{$t('curriculum.desc.speaking.beginner.early')}}</v-flex>
                <v-flex class="cell" xs4>{{$t('curriculum.desc.speaking.beginner.low')}}</v-flex>
                <v-flex class="cell" xs4>{{$t('curriculum.desc.speaking.beginner.high')}}</v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs2>
              <v-layout row>
                <v-flex class="cell" xs4>{{$t('curriculum.desc.listening.beginner.early')}}</v-flex>
                <v-flex class="cell" xs4>{{$t('curriculum.desc.listening.beginner.low')}}</v-flex>
                <v-flex class="cell" xs4>{{$t('curriculum.desc.listening.beginner.high')}}</v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs2>
              <v-layout row>
                <v-flex class="cell" xs4>{{$t('curriculum.desc.pronunciation.beginner.early')}}</v-flex>
                <v-flex class="cell" xs4>{{$t('curriculum.desc.pronunciation.beginner.low')}}</v-flex>
                <v-flex class="cell" xs4>{{$t('curriculum.desc.pronunciation.beginner.high')}}</v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs2>
              <v-layout row>
                <v-flex class="cell" xs4>{{$t('curriculum.desc.grammar.beginner.early')}}</v-flex>
                <v-flex class="cell" xs4>{{$t('curriculum.desc.grammar.beginner.low')}}</v-flex>
                <v-flex class="cell" xs4>{{$t('curriculum.desc.grammar.beginner.high')}}</v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs2>
              <v-layout row>
                <v-flex xs4 class="footer-cell beginner">
                  <h4>Early Pre K</h4>
                  <h4>GSE 10</h4>
                  <h4>Pre A1</h4>
                </v-flex>
                <v-flex xs4 class="footer-cell beginner">
                  <h4>K-1</h4>
                  <h4>GSE 20</h4>
                  <h4>A1</h4>
                </v-flex>
                <v-flex xs4 class="footer-cell beginner">
                  <h4>1-2</h4>
                  <h4>GSE 30</h4>
                  <h4>A2</h4>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout column fill-height>
            <v-flex class="curriculum-header intermediate">
              <h2>{{$t('curriculum.title.intermediate')}}</h2>
            </v-flex>
            <v-flex xs2>
              <v-layout row>
                <v-flex class="cell">{{$t('curriculum.desc.speaking.intermediate.low')}}</v-flex>
                <v-flex class="cell">{{$t('curriculum.desc.speaking.intermediate.high')}}</v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs2>
              <v-layout row>
                <v-flex class="cell">{{$t('curriculum.desc.listening.intermediate.low')}}</v-flex>
                <v-flex class="cell">{{$t('curriculum.desc.listening.intermediate.high')}}</v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs2>
              <v-layout row>
                <v-flex class="cell">{{$t('curriculum.desc.pronunciation.intermediate.low')}}</v-flex>
                <v-flex class="cell">{{$t('curriculum.desc.pronunciation.intermediate.high')}}</v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs2>
              <v-layout row>
                <v-flex class="cell">{{$t('curriculum.desc.grammar.intermediate.low')}}</v-flex>
                <v-flex class="cell">{{$t('curriculum.desc.grammar.intermediate.high')}}</v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs2>
              <v-layout row>
                <v-flex class="footer-cell intermediate">
                  <h4>2-4</h4>
                  <h4>GSE 40</h4>
                  <h4>A2</h4>
                </v-flex>
                <v-flex class="footer-cell intermediate">
                  <h4>3-5</h4>
                  <h4>GSE 50</h4>
                  <h4>B1</h4>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout column fill-height>
            <div class="curriculum-header advanced">
              <h2>{{$t('curriculum.title.advanced')}}</h2>
            </div>
            <div class="cell">{{$t('curriculum.desc.speaking.advanced')}}</div>
            <div class="cell">{{$t('curriculum.desc.listening.advanced')}}</div>
            <div class="cell">{{$t('curriculum.desc.pronunciation.advanced')}}</div>
            <div class="cell">{{$t('curriculum.desc.grammar.advanced')}}</div>
            <div class="footer-cell advanced">
              <h4>6+</h4>
              <h4>GSE 60</h4>
              <h4>B2</h4>
            </div>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
    <div class="footer">
      <div class="wrapper-container">
        <v-layout row wrap justify-space-between align-center>
          <v-flex xs12 sm3>
            <img class="logo" src="../assets/images/logo-alt.svg"/>
          </v-flex>
          <v-flex xs12 sm3>
            <a href="">{{$t('menu.privacy.policy')}}</a>
            <a href="">{{$t('form.terms.pdf.link')}}</a>
          </v-flex>
          <v-flex xs12 sm3>
            <a href="https://facebook.com/Naativ-263842094331101/">
              <img src="../assets/images/prelaunch/fb.svg"/>
            </a>
            <a href="https://www.instagram.com/naativco">
              <img src="../assets/images/prelaunch/instagram.svg"/>
            </a>
          </v-flex>
          <v-flex xs12 sm3>
            <p>{{$t('landing.footer.copyright', [new Date().getFullYear()])}}</p>
          </v-flex>
        </v-layout>
      </div>
    </div>
  </div>
</template>

<script>
import ApplyDialog from '@/components/landing/Apply.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'

export default {
  name: 'LandingPage',
  components: {
    LanguageSelector,
    ApplyDialog
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="sass" scoped>
.wrapper-container
    max-width: 1162px
    margin: auto

a
  font-size: 15px
  color: #000000
  text-decoration: none

.logo
  margin: 5px
  width: 155px
  height: 35px

.hero
  max-width: 430px
  width: 100%
  margin: 55px auto
  text-align: center

  img
    width: 55px
    margin-bottom: 30px

  h1
    font-size: 40px
    line-height: 57px
    font-weight: normal
    margin-bottom: 30px

    @media screen and (min-width: 600px)
      font-size: 55px

.checkmark-list
   list-style-image: url('/landing/check-mark.png')

.greybar
  background-color: #f7f7f7

.section-1
  position: relative
  img
    width: 100%
  .parallax-dots
    position: absolute
    width: 150px
    bottom: 0
    left: 50%
    transform: translateX(-50%)

.section-2
  position: relative
  padding: 65px 0
  img
    width: 100%

.blue-rule
  width: 75px
  border: 3px solid #aadaff
  margin: 25px 0 45px 0

.section-3
  .parallax-images
    position: relative

    .top-image
      width: 100%
      top: 110px
      position: relative
      @media screen and (min-width: 600px)
        position: relative
        top: 20px
    .dots
      position: absolute
      left: 11px
      bottom: -140px
      width: 45%
      @media screen and (min-width: 600px)
        left: 25%
        bottom: 5%
        width: 150px
    .bottom-image
      box-shadow: 0px 33px 56px -45px #000
      position: absolute
      width: 60%
      bottom: -260px
      left: 121px
      @media screen and (min-width: 600px)
        width: 45%
        bottom: -34%
        left: 45%

.section-4
  margin: 150px auto
  img
    height: 50px

.section-5
  position: relative
  margin: 150px auto

  &::after
    content: ''
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    width: 100%
    max-width: 800px
    background-color: #f7f7f7
    height: 100%

  .bottom-image
    width: 100%
    max-width: 350px
    box-shadow: 0px 33px 56px -45px #000
    position: relative
    top: 122px
    @media screen and (min-width: 600px)
        top: 80px

  .top-image
    width: 100%
    box-shadow: 0px 33px 56px -45px #000
    transform: translateY(-37%)
.section-6
  height: 75px
  position: relative

  .skinny
    height: 75px

  .floaty-logos
    position: absolute
    width: 150px
    length: 150px
    top: -30px
    left: 30vw
  .dots
    width: 100%

  .logo-bubbles
    width: 50px
    height: 50px
    position: absolute
    left: 50px
    top: 40px

.footer
  border-top: 1px solid #f1f1f1
  padding: 15px
  @media screen and (min-width: 600px)
    padding: 15px 0
  img
    height: 50px

.curriculum
  margin: 85px auto
  overflow-x: scroll
  .curriculum-header
    text-align: center
    padding: 5px 0
    text-transform: uppercase

    &.beginner
      background-color: #c2e3fc

    &.intermediate
      background-color: #ffeac9

    &.advanced
      background-color: #f7cece

  .cell
    border-right: .5px solid #e5e5e5
    padding: 25px 10px
    border-left: .5px solid #e5e5e5
    width: 178px
    height: 185px
  .header-cell
    height: 185px
  .footer-cell
    background-color: #f1f1f1
    padding: 15px 10px
    line-height: 25px
    &.beginner
      border-top: 6px solid #c2e3fc
    &.intermediate
      border-top: 6px solid #ffeac9
    &.advanced
      border-top: 6px solid #f7cece
</style>
