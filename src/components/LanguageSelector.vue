<template>
  <v-menu bottom left>
    <v-btn class="text-capitalize" :dark="dark" flat small slot="activator" style="padding: 0;">
      <v-icon left :dark="dark" style="margin-right: 5px;">language</v-icon>
      {{locale.current.localName}}
      <v-icon left :dark="dark" style="margin-right: 5px;">expand_more</v-icon>
    </v-btn>
    <v-list>
      <v-list-tile
        v-for="(lang, i) in locale.available"
        :key="i"
        @click="setLang(lang)"
      >
        <v-list-tile-title>{{ lang.localName }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'

import { Mutations } from '@/store'

export default {
  name: 'LanguageSelector',
  props: {
    dark: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    ...mapMutations({
      setLocale: Mutations.SET_LOCALE
    }),
    setLang(selectedLang) {
      this.$router.push({ query: { lang: selectedLang.code } })
      this.setLocale(selectedLang)
    }
  },
  computed: {
    ...mapGetters({
      locale: 'locale'
    })
  }
}
</script>
