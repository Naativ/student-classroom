<template>
  <v-dialog max-width="600px" v-model="showBrowserDialog" persistent>
    <v-card>
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
            {{$t('unsupported.browser.system')}}&nbsp;&nbsp;{{ system.name }}
          </p>
        </div>
      </v-card-text>
        <v-divider></v-divider>
      <v-card-text>
        <div class="text-xs-center">
          {{$t('unsupported.browser.update')}}
        </div>
      </v-card-text>
        <v-divider></v-divider>
      <v-container>
        <v-layout row wrap justify-space-between>
          <v-layout column align-center>
            <a href="https://www.google.com/chrome/">
              <img src="../assets/images/chrome.png" alt="Chrome" height="100px" width="100px"/>
            </a>
          </v-layout>
          <v-layout column align-center>
            <a href="https://www.mozilla.org/en-US/firefox/new/">
              <img src="../assets/images/firefox.png" alt="firefox" height="100px" width="100px"/>
            </a>
          </v-layout>
          <v-layout column align-center>
            <a href="https://support.apple.com/en-us/HT201541">
              <img src="../assets/images/safari.png" alt="safari" height="100px" width="100px"/>
            </a>
          </v-layout>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import bowser from 'bowser'
const browser = bowser.getParser(window.navigator.userAgent)
const isValidBrowser = browser.satisfies({
  android: {
    chrome: '>62',
    firefox: '>56'
  },
  iOS: {
    safari: '>11'
  },
  chrome: '>62',
  firefox: '>56',
  safari: '>11'
})

export default {
  name: 'BrowserAlert',
  data() {
    return {
      showBrowserDialog: !isValidBrowser
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
    }
  }
}
</script>

<style lang="stylus" scoped>

  .invalidBrowser
    font-weight 500em
    color red

</style>
