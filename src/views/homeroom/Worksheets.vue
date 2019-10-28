<template>
  <div class="library pa-2">
    <h1>{{$t('menu.worksheets')}}</h1>
    <p>{{$t('worksheets.description')}}</p>
    <Assets :assets="this.worksheets" :loading="library.fetching"/>
    <div class="text-xs-center" v-if="hasSubscriptions">
      <v-pagination v-model="librarySearch.page" :length="library.assetSearch.totalPages" :total-visible="7"></v-pagination>
    </div>
  </div>
</template>

<script>
import Assets from '@/content/AssetList.vue'
import * as SubscriptionStore from '@/Subscriptions/Store.js'

import { mapActions, mapGetters } from 'vuex'
import { ContentActions, ContentGetters } from '@/content/ContentStore'

const worksheetTag = 65

export default {
  name: 'Worksheets',
  components: {
    Assets
  },
  mounted() {
    if (this.hasSubscriptions) {
      this.librarySearch.pageSize = 25
    }
    this.refreshLibrary(this.librarySearch)
  },
  data() {
    return {
      librarySearch: {
        pageSize: 20,
        page: 1,
        anyTags: [worksheetTag]
      },
      worksheets: []
    }
  },
  methods: {
    ...mapActions({
      refreshLibrary: ContentActions.REFRESH_LIBRARY_ASSETS
    })
  },
  computed: {
    ...mapGetters({
      library: ContentGetters.libraryAssets,
      subscriptions: SubscriptionStore.Getters.subscriptions
    }),
    hasSubscriptions() {
      return this.subscriptions.length > 0
    }
  },
  watch: {
    async 'library.assetSearch'(newVal) {
      const test = await Promise.all(newVal.results.map(a => new Promise(resolve => {
        fetch(a.url)
          .then((response) => {
            const test = response.url
            resolve({ ...a, url: test })
          })
      })))
      this.worksheets = test
    }
  }
}
</script>

<style lang="stylus" scoped>
.library {
  position relative
}
</style>
