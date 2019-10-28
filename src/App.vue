<template>
  <v-app>
    <div id="classroom-app" :class="$i18n.locale">
      <router-view/>
    </div>
  </v-app>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'

import { Mutations } from '@/store'

export default {
  name: 'App',
  metaInfo() {
    return {
      meta: [
        { name: 'description', content: this.$t('site.meta.description') },
        { name: 'og:title', content: 'Naativ' },
        { name: 'og:site_name', content: 'Naativ' },
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: 'https://learn.naativ.com' },
        { name: 'og:image', content: 'https://learn.naativ.com/naativ.png' },
        { name: 'og:description', content: this.$t('site.meta.description') },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: 'https://learn.naativ.com' },
        { name: 'twitter:title', content: 'Naativ' },
        { name: 'twitter:description', content: this.$t('site.meta.description') },
        { name: 'twitter:creator', content: 'NaativEducation' },
        { name: 'twitter:image:src', content: 'https://learn.naativ.com/naativ.png' }
      ]
    }
  },
  mounted() {
    this.calculateLang(this.$route.query.lang)
  },
  methods: {
    ...mapMutations({
      setLocale: Mutations.SET_LOCALE
    }),
    calculateLang(selectedLocale) {
      const locale = this.locale.available.find(l => l.code === selectedLocale) || this.locale.current
      if (locale) {
        this.setLocale(locale, true)
      }
    }
  },
  computed: {
    ...mapGetters({
      locale: 'locale'
    })
  },
  watch: {
    '$route.query'(newVal) {
      this.calculateLang(newVal.lang)
    }
  }
}
</script>

<style lang="stylus">
#classroom-app
  font-family 'TTNorms', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #000000

#classroom-app
  &.kr
    word-break keep-all

*:not(.v-icon)
  font-variant-ligatures none !important
</style>
