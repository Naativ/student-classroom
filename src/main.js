import '@/assets/css/styles.styl'
import 'fullcalendar/dist/fullcalendar.css'

import Eagle from 'eagle.js'
import FullCalendar from 'vue-full-calendar'
import moment from 'moment'
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import Meta from 'vue-meta'

import App from './App.vue'
import i18n from './i18n'
import router from './router'
import store from './store'
import * as Sentry from '@sentry/browser'
import { createProvider } from './vue-apollo'
import bowser from 'bowser'

import './directives'
import './vuetify'
import '@/utils/Filters'

Vue.config.productionTip = false
Vue.use(Eagle)
Vue.use(FullCalendar)
Vue.use(Meta)

if (process.env.VUE_APP_GOOGLE_ANALYTICS) {
  Vue.use(VueAnalytics, {
    id: process.env.VUE_APP_GOOGLE_ANALYTICS,
    router
  })
}

if (process.env.VUE_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY_DSN,
    integrations: [new Sentry.Integrations.Vue({ Vue })]
  })
}

const isSupportedBrowser = () => {
  const browser = bowser.getParser(window.navigator.userAgent)
  return browser.satisfies({
    android: {
      chrome: '>62',
      firefox: '>56'
    },
    iOS: {
      safari: '>11'
    },
    desktop: {
      chrome: '>62',
      firefox: '>56',
      safari: '>11'
    }
  })
}

let details = {}
let parsedResult
let isInAppMobileBrowser = false
let isMobile = false
let invalidMessage = 'registration.invalidbrowser'
try {
  const browser = bowser.getParser(window.navigator.userAgent)
  parsedResult = browser.parsedResult
  details = browser.parsedResult.browser
  if (parsedResult.platform.type === 'mobile') {
    isMobile = true
  }
  if (!isSupportedBrowser() && browser.parsedResult.os.name === 'iOS') {
    invalidMessage = 'registration.iOSinvalidbrowser'
  }

  // we don't want people using the Facebook/KaKao browser
  // so detect cases here
  isInAppMobileBrowser = details.name === 'Safari' &&
    (!details.version || details.version.toString().trim() === '')
} catch (err) {
  // warn and set browser to something safe?
}
Vue.prototype.$browser = {
  details,
  invalidMessage,
  isInAppMobileBrowser,
  isMobile,
  parsedResult,
  supported: isSupportedBrowser()
}

Vue.prototype.$moment = moment

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  i18n,
  render: h => h(App)
}).$mount('#app')
