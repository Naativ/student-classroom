import store from '@/store'
import moment from 'moment'
import * as Content from '@/content/ContentService'

export const ContentActions = {
  REFRESH_ASSET_META: 'content:RefreshAssetMeta',
  REFRESH_LIBRARY_ASSETS: 'content:RefreshLibraryAssets'
}

export const ContentMutations = {
  SET_ONE: 'contentSetOne',
  SET: 'contentSet',
  INIT: 'init'
}

export const ContentGetters = {
  assetMeta: 'contentAssetMeta',
  libraryAssets: 'libraryAssets'
}

const META_DEFAULT = {
  fetching: false,
  approval: [],
  tags: [],
  audiences: [],
  types: [],
  refreshed: null,
  error: undefined
}

const PAGED_ASSET_DEFAULT = {
  fetching: false,
  assetSearch: {},
  refreshed: null
}

const DEFAULT_STATE = {
  meta: {
    asset: { ...META_DEFAULT }
  },
  assets: {
    library: { ...PAGED_ASSET_DEFAULT }
  }
}
export const ContentStore = {
  state: DEFAULT_STATE,
  mutations: {
    [ContentMutations.SET]: (state, [value, fn]) => fn(state, value),
    [ContentMutations.SET_ONE]: (state, { property, value }) =>
      (state[property] = value),
    [ContentMutations.INIT]: state => {
      Object.assign(state, { ...DEFAULT_STATE, ...state })
    }
  },
  actions: {
    [ContentActions.REFRESH_ASSET_META]: async ({ commit, state }) => {
      // reset state
      commit(ContentMutations.SET, [
        {
          ...state.meta.asset,
          fetching: true,
          error: null
        },
        (state, value) => Object.assign(state.meta.asset, value)
      ])

      const assetMeta = await Content.getAssetMeta()

      commit(ContentMutations.SET, [
        {
          ...META_DEFAULT,
          ...assetMeta,
          refreshed: moment().toISOString()
        },
        (state, value) => Object.assign(state.meta.asset, value)
      ])
    },
    [ContentActions.REFRESH_LIBRARY_ASSETS]: async ({
      dispatch,
      commit,
      state
    }, searchQuery) => {
      // reset state
      commit(ContentMutations.SET, [
        {
          ...state.assets.library,
          fetching: true,
          error: null
        },
        (state, value) => Object.assign(state.assets.library, value)

      ])

      const { member } = store.state
      let meta = state.meta.asset
      // load if meta not initialized
      if (!meta.refreshed) {
        await dispatch(ContentActions.REFRESH_ASSET_META)
      }

      let anyTags = member.tags
        .map(tag => {
          return meta.audiences.filter(a => a.key === 'aud:' + tag)
        })
        .reduce((acc, val) => acc.concat(val), []) // .flatMap(x => x)  iOS 11 Safari does not support flatMap, this is a temporary hackaround
        .map(x => x.id)

      const studentTag = meta.audiences.find(e => e.key === 'aud:student')
      studentTag && anyTags.push(studentTag.id)
      const approvedTag = meta.approval.find(e => e.key === 'approval:approved')
      let allTags = [approvedTag.id].concat(searchQuery.allTags)
      const { anyTags: length } = searchQuery
      if (length) {
        allTags = []
        anyTags = searchQuery.anyTags
      }

      const libraryAssets = await Content.searchAssets('library', {
        allTags,
        anyTags,
        includeThumbnails: false,
        includeSources: false,
        pageSize: searchQuery.pageSize,
        page: searchQuery.page
      })

      commit(ContentMutations.SET, [
        {
          ...PAGED_ASSET_DEFAULT,
          ...libraryAssets,
          refreshed: moment().toISOString()
        },
        (state, value) => {
          Object.assign(state.assets.library, value)
        }
      ])
    }
  },
  getters: {
    [ContentGetters.assetMeta]: state => state.meta.asset,
    [ContentGetters.libraryAssets]: state => state.assets.library
  }
}
