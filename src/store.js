import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

// Moment Locales
import 'moment/locale/ko'
import 'moment/locale/ja'
import 'moment/locale/pt-br'
import 'moment/locale/zh-tw'
import 'moment/locale/th'
import 'moment/locale/vi'

import { DejaVue } from '@/utils/DejaVue'
import { createProvider } from './vue-apollo'
import i18n from '@/i18n'

// Modules
import AppointmentStore from '@/utils/appointment/Store'
import AvailabilityStore from '@/utils/availability/AvailabilityStore'
import BookingStore from '@/utils/booking/BookingStore'
import { ContentStore } from '@/content/ContentStore'
import { learningProfileStore } from '@/LearningProfile/Store'
import { subscriptionsStore } from '@/Subscriptions/Store'
import MemberStore from '@/utils/member/MemberStore'
import { LessonStore } from '@/Lessons/Store'

// Queries
import { GENERATE_TOKEN, LOGIN, RESET_PASSWORD } from '@/graphql/Iam.gql.js'
import { CREATE_CUSTOMER, PROCESS_PAYMENT, GET_CUSTOMER, GET_PAYMENTS, ADD_SUBSCRIPTION } from '@/graphql/Payment.js'
import { GET_MEMBER_ATTRIBUTE, SET_MEMBER_ATTRIBUTE } from '@/graphql/Member.js'

const tenantId = ~~process.env.VUE_APP_TENANT_ID
const hostUrl = process.env.VUE_APP_HOST_URL
const apollo = createProvider().defaultClient

Vue.use(Vuex)

const LOCAL_STORAGE_NAME = 'store'

const verifyPrincipal = hydratedState => {
  if (!hydratedState.principal || !hydratedState.jwt) {
    localStorage.clear()
  }
}

export const Mutations = {
  INIT: 'init',
  SET_PRINCIPAL: 'setPrincipal',
  SET_JWT: 'setJwt',
  SET_MEMBER: 'setMember',
  SET_CONTACT_EMAIL: 'setContactEmail',
  SET_LOCALE: 'setLocale',
  SET_BOOKING_TYPE: 'setBookingType',
  TOGGLE_IMPERSONATION: 'toggleImpersonation'
}

export const Actions = {
  LOGOUT: 'logout',
  LOGIN: 'login',
  GENERATE_TOKEN: 'generateToken',
  RESET_PASSWORD: 'resetPassword',
  CREATE_CUSTOMER: 'createCustomer',
  PROCESS_PAYMENT: 'processPayment',
  ADD_SUBSCRIPTION: 'addSubscription',
  GET_CUSTOMER: 'getCustomer',
  GET_PAYMENTS: 'getPayments',
  SET_MEMBER_ATTRIBUTE: 'setMemberAttribute',
  GET_MEMBER_ATTRIBUTE: 'getMemberAttribute'
}

const languages = [
  { id: 1, code: 'en', locale: ['en-US', 'en-GB', 'en-AU', 'en-CA', 'en-NZ', 'en-IE'], localName: 'English' },
  { id: 2, code: 'ko', locale: ['ko-KR'], localName: '한국어' },
  { id: 3, code: 'ja', locale: ['ja-JP'], localName: '日本人' },
  { id: 4, code: 'pt', locale: ['pt-BR', 'pt-PT'], localName: 'Português' },
  // We dont support these quite yet
  // { id: 5, code: 'es', locale: ['es-SP', 'es-MX'], localName: 'Español' },
  { id: 6, code: 'zh', locale: ['zh-CN', 'zh-TW'], localName: '中文' },
  { id: 7, code: 'th', locale: ['th-TH'], localName: 'ไทย' },
  { id: 8, code: 'vi', locale: ['vi-VN'], localName: 'Tiếng Việt' }
]

const momentLanguageConversion = {
  en: 'en',
  ko: 'ko',
  ja: 'ja',
  pt: 'pt',
  zh: 'zh-tw',
  th: 'th',
  vi: 'vi'
}

export default new Vuex.Store({
  plugins: [DejaVue.plugin(Mutations.INIT, LOCAL_STORAGE_NAME)],
  modules: {
    AppointmentStore,
    AvailabilityStore,
    BookingStore,
    ContentStore,
    MemberStore,
    learningProfileStore,
    subscriptionsStore,
    LessonStore
  },
  state: {
    jwt: null,
    principal: {},
    member: {},
    locale: {
      current: languages.find(l => l.code === navigator.language.split('-')[0]) || languages[0],
      available: languages
    },
    hostUrl,
    bookingType: '',
    isImpersonating: false
  },
  mutations: {
    [Mutations.INIT]: DejaVue.mutation(LOCAL_STORAGE_NAME, verifyPrincipal),
    [Mutations.SET_PRINCIPAL](state, principal) {
      state.principal = principal
    },
    [Mutations.SET_JWT](state, jwt) {
      state.jwt = jwt
    },
    [Mutations.SET_MEMBER](state, member) {
      state.member = { ...state.member, ...member }
    },
    [Mutations.SET_CONTACT_EMAIL](state, email) {
      state.member.contacts[0].emails[0].email = email
    },
    [Mutations.SET_LOCALE](state, locale) {
      if (typeof locale === 'string') {
        locale = state.locale.available.find(l => l.code === locale)
      }
      if (typeof locale === 'number') {
        locale = state.locale.available.find(l => l.id === locale)
      }
      i18n.locale = locale.code || 'en'
      moment.locale(momentLanguageConversion[locale.code] || 'en')
      state.locale.current = locale
    },
    [Mutations.SET_BOOKING_TYPE](state, bookingType) {
      state.bookingType = bookingType
    },
    [Mutations.TOGGLE_IMPERSONATION]: state => {
      state.isImpersonating = !state.isImpersonating
    }
  },
  actions: {
    [Actions.LOGOUT]({ commit }) {
      localStorage.removeItem(LOCAL_STORAGE_NAME)
    },
    async [Actions.LOGIN]({ commit }, creds) {
      const { data } = await apollo.mutate({
        mutation: LOGIN,
        variables: { creds }
      })
      if (data.login.success) {
        commit(Mutations.SET_JWT, data.login.token)
        commit(Mutations.SET_MEMBER, data.login.principal.member)
        commit(Mutations.SET_PRINCIPAL, data.login.principal)
      }
      return data.login
    },
    async [Actions.GENERATE_TOKEN]({ commit }, payload) {
      await apollo.mutate({
        mutation: GENERATE_TOKEN,
        variables: {
          token: { ...payload, domain: window.location.origin, tenantId }
        }
      })
    },
    async [Actions.SET_MEMBER_ATTRIBUTE]({ commit }, payload) {
      await apollo.mutate({
        mutation: SET_MEMBER_ATTRIBUTE,
        variables: { input: payload }
      })
    },
    async [Actions.GET_MEMBER_ATTRIBUTE]({ commit }, key) {
      const { data } = await apollo.query({
        query: GET_MEMBER_ATTRIBUTE,
        variables: {
          input: { memberId: this.state.member.id, key }
        }
      })
      return data.getMemberAttribute
    },
    async [Actions.RESET_PASSWORD]({ commit }, payload) {
      await apollo.mutate({
        mutation: RESET_PASSWORD,
        variables: { input: payload }
      })
    },
    async [Actions.GET_CUSTOMER]({ commit }, memberId) {
      const { data: { stripeIntegrationByMember } } = await apollo.query({
        query: GET_CUSTOMER,
        variables: { memberId }
      })
      return stripeIntegrationByMember
    },
    async [Actions.CREATE_CUSTOMER]({ commit }, payload) {
      const { data: createCustomer } = await apollo.mutate({
        mutation: CREATE_CUSTOMER,
        variables: { input: payload }
      })
      return createCustomer
    },
    async [Actions.GET_PAYMENTS]({ commit }) {
      const { data: { getPayments } } = await apollo.query({
        query: GET_PAYMENTS
      })
      return getPayments
    },
    async [Actions.PROCESS_PAYMENT]({ commit }, payload) {
      await apollo.mutate({
        mutation: PROCESS_PAYMENT,
        variables: { input: payload }
      })
    },
    async [Actions.ADD_SUBSCRIPTION]({ commit }, payload) {
      await apollo.mutate({
        mutation: ADD_SUBSCRIPTION,
        variables: { input: payload }
      })
    }
  },
  getters: {
    member: state => state.member,
    locale: state => state.locale,
    hostUrl: state => state.hostUrl,
    bookingType: state => state.bookingType,
    isLoggedIn: state => !!state.jwt
  }
})
