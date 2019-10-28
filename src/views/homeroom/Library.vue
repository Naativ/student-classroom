<template>
  <div class="library pa-2">
    <h1>{{$t('menu.library')}}</h1>
    <p>{{$t('library.title.desc.2')}}</p>
    <div class="text-xs-center" v-if="!hasSubscriptions">
      <p>{{$t('library.demo.desc')}}</p>
    </div>
    <Assets :assets="library.assetSearch.results" :loading="library.fetching"/>
    <div class="text-xs-center" v-if="hasSubscriptions">
      <v-pagination v-model="librarySearch.page" :length="library.assetSearch.totalPages" :total-visible="7"></v-pagination>
    </div>
  </div>
</template>

<script>
import Assets from '@/content/AssetList.vue'
import * as SubscriptionStore from '@/Subscriptions/Store.js'

import { mapActions, mapGetters, mapState } from 'vuex'
import { ContentActions, ContentGetters } from '@/content/ContentStore'

export default {
  name: 'Library',
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
      error: null,
      loading: false,
      assetDialog: false,
      librarySearch: {
        pageSize: 20,
        page: 1,
        allTags: []
      }
    }
  },
  computed: {
    ...mapState({
      balance: state => state.MemberStore.balance
    }),
    ...mapGetters({
      library: ContentGetters.libraryAssets,
      subscriptions: SubscriptionStore.Getters.subscriptions
    }),
    hasSubscriptions() {
      return this.balance > 0
    }
  },
  methods: {
    ...mapActions({
      refreshLibrary: ContentActions.REFRESH_LIBRARY_ASSETS
    }),
    async assetsUploaded() {
      await this.refreshLibrary(this.librarySearch)
    }
  },
  watch: {
    'librarySearch.page'(newVal, oldVal) {
      this.refreshLibrary(this.librarySearch)
    }
  }
}
</script>

<style lang="stylus" scoped>
.library {
  position relative
}
</style>
