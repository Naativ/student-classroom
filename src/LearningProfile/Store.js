import store from '@/store'
import * as Service from '@/LearningProfile/Service'

export const Actions = {
  CREATE: 'learningProfiles:Create',
  GET: 'learningProfiles:Get',
  UPDATE: 'learningProfiles:Update',
  MAKE_DEFAULT: 'learningProfiles:MakeDefault',
  LOAD_PROFILE_META: 'learningProfiles:loadMeta'
}

export const Mutations = {
  SET_ONE: 'lmsSetOne',
  SET: 'lmsSet',
  INIT: 'init'
}

export const Getters = {
  profiles: 'getLearningProfiles',
  profile: 'getCurrentProfile',
  genders: 'genders',
  loading: 'learningProfileLoading'
}

const DEFAULT_STATE = {
  genders: [],
  learningProfiles: [],
  currentLearningProfile: null,
  loadingProfiles: true
}

export const learningProfileStore = {
  state: DEFAULT_STATE,
  mutations: {
    [Mutations.SET]: (state, [value, fn]) => fn(state, value),
    [Mutations.SET_ONE]: (state, { property, value }) => {
      state[property] = value
    },
    [Mutations.INIT]: state => {
      Object.assign(state, { ...DEFAULT_STATE, ...state })
    }
  },
  actions: {
    [Actions.LOAD_PROFILE_META]: async ({ commit, state }) => {
      const { data } = await Service.loadMeta()
      commit(Mutations.SET_ONE, { property: 'genders', value: data.getGenders })
    },
    [Actions.CREATE]: async ({ commit, state }, profile) => {
      const { data } = await Service.upsert({ ...profile, memberId: store.state.member.id })
      const createdProfile = data.lmsProfileUpsert
      commit(Mutations.SET_ONE, { property: 'currentLearningProfile', value: createdProfile })
      commit(Mutations.SET_ONE, { property: 'learningProfiles', value: [...state.learningProfiles, createdProfile] })
      return createdProfile
    },
    [Actions.GET]: async ({ commit, dispatch, state }) => {
      if (state.genders.length === 0) {
        await dispatch(Actions.LOAD_PROFILE_META)
      }
      const { data } = await Service.get(store.state.member.id)
      if (data.lmsProfiles && data.lmsProfiles.results.length > 0) {
        const profiles = data.lmsProfiles.results
        commit(Mutations.SET_ONE, { property: 'learningProfiles',
          value: profiles
        })
        if (!state.currentLearningProfile) {
          commit(Mutations.SET_ONE, { property: 'currentLearningProfile', value: profiles[0] })
        }
      } else {
        commit(Mutations.SET_ONE, { property: 'learningProfiles', value: [] })
      }
      commit(Mutations.SET_ONE, { property: 'loadingProfiles', value: false })
    },
    [Actions.UPDATE]: async ({ commit, state }) => {},
    [Actions.MAKE_DEFAULT]: async ({ commit, state }, profile) => {
      commit(Mutations.SET_ONE, { property: 'currentLearningProfile', value: profile })
    }
  },
  getters: {
    [Getters.profiles]: state => state.learningProfiles,
    [Getters.profile]: state => state.currentLearningProfile,
    [Getters.genders]: state => state.genders,
    [Getters.loading]: state => state.loadingProfiles
  }
}
