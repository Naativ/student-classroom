<template>
  <v-card v-if="$browser.isInAppMobileBrowser" class="align-center justify-center">
    <v-card-title class="justify-center" primary-title>
      <div>
        <h3 class=" text-xs-center headline mb-0">{{$t('unsupported.browser.title')}}</h3>
      </div>
    </v-card-title>
    <v-divider/>
    <v-card-text>
      <div class="inAppBrowser">
        <p>{{$t('unsupported.inapp.one')}}</p>
        <p>{{$t('unsupported.inapp.two')}}</p>
        <p>
          {{$t('unsupported.inapp.three')}}
          <br/>
          <a :href="url">{{url}}</a>
        </p>
      </div>
    </v-card-text>
  </v-card>
  <v-card v-else>
    <v-card-title class="justify-center" primary-title>
      <div>
        <h3 class=" text-xs-center headline mb-0">{{$t('unsupported.browser.title')}}</h3>
      </div>
    </v-card-title>
    <v-card-text>
      <div class="invalidBrowser">
        <p>
        {{$t('unsupported.browser.browser')}}&nbsp;&nbsp;{{ browser.name }}
        <br>
        {{$t('unsupported.browser.version')}}&nbsp;&nbsp;{{ browser.version }}
        <br>
        {{$t('unsupported.browser.system')}}&nbsp;&nbsp;{{ system.name}}
        </p>
      </div>
    </v-card-text>
      <v-divider></v-divider>
    <v-card-text>
      <div class="text-xs-center">
        {{$t($browser.invalidMessage)}}
      </div>
    </v-card-text>
      <v-divider></v-divider>
    <v-container>
      <v-layout row wrap justify-space-between>
        <v-layout v-if="$browser.parsedResult.os.name !== 'iOS'" column align-center>
          <a href="https://www.google.com/chrome/">
            <img src="./assets/images/chrome.png" alt="Chrome" height="100px" width="100px"/>
          </a>
        </v-layout>
        <v-layout v-if="$browser.parsedResult.os.name !== 'iOS'" column align-center>
          <a href="https://www.mozilla.org/en-US/firefox/new/">
            <img src="./assets/images/firefox.png" alt="firefox" height="100px" width="100px"/>
          </a>
        </v-layout>
        <v-layout column align-center>
          <a href="https://support.apple.com/en-us/HT201541">
            <img src="./assets/images/safari.png" alt="safari" height="100px" width="100px"/>
          </a>
        </v-layout>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import bowser from 'bowser'

export default {
  name: 'BrowserAlert',
  data() {
    return {
      show: true
    }
  },
  computed: {
    browser() {
      const browser = bowser.getParser(window.navigator.userAgent)
      return browser.parsedResult.browser
    },
    system() {
      const system = bowser.getParser(window.navigator.userAgent)
      return system.parsedResult.os
    },
    url() {
      return window.location.href
    }
  }
}
</script>

<style lang="stylus" scoped>

.invalidBrowser
  font-weight 500em
  color red
  text-align center

.inAppBrowser
  font-weight 500em
  color black
  text-align left

</style>
