import Vue from 'vue'
import VueI18n from 'vue-i18n'
import countries from './lang/countries.json'

Vue.use(VueI18n)

function loadLocaleMessages () {
  const locales = require.context('./lang', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = { ...locales(key), ...countries }
    }
  })
  return messages
}

const locale = navigator.language.split('-')[0]

const l = new VueI18n({
  locale,
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
  silentFallbackWarn: true
})

export default l
