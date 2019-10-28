import _ from 'lodash'
import * as Member from '@/utils/member/MemberService'

export const Actions = {
  MEMBER_BALANCE: 'memberGetBalance',
  MEMBERS_INFO: 'memberGetMembersInfo',
  MEMBER_TAGS: 'memberGetMemberTags',
  PROFILE_ATTRIBUTES: 'memberGetProfileAttributes',
  SET_PROFILE_ATTRIBUTES: 'memberSetProfileAttributes'
}

export const Mutations = {
  SET_ONE: 'MemberSetOne',
  SET: 'MemberSet',
  INIT: 'init'
}

export const Getters = {
  BALANCE: 'memberBalance'
}

const DEFAULT_STATE = {
  balance: 0,
  balanceLoading: false
}

export default {
  state: DEFAULT_STATE,
  mutations: {
    [Mutations.SET]: (state, [value, fn]) => fn(state, value),
    [Mutations.SET_ONE]: (state, { property, value }) =>
      (state[property] = value),
    [Mutations.INIT]: state => {
      Object.assign(state, { ...DEFAULT_STATE, ...state })
    }
  },
  actions: {
    [Actions.MEMBER_BALANCE]:
      _.debounce(async ({ commit }, memberId) => {
        commit(Mutations.SET_ONE, { property: 'balanceLoading', value: true })
        const { data: { ledgerBalance } } = await Member.getBalance(memberId)
        commit(Mutations.SET_ONE, { property: 'balance', value: ledgerBalance.balance })
        commit(Mutations.SET_ONE, { property: 'balanceLoading', value: false })
      }, 1000, { leading: true, trailing: false }),
    [Actions.MEMBERS_INFO]: (_, members) => Member.getMemberInfo(members),
    [Actions.MEMBER_TAGS]: (_, id) => Member.getMemberTags(id),
    [Actions.PROFILE_ATTRIBUTES]: (_, payload) =>
      Member.getMemberAttributes(payload),
    [Actions.SET_PROFILE_ATTRIBUTES]: (_, payload) =>
      Member.getMemberAttributes(payload)
  },
  getters: {
    [Getters.BALANCE]: state => state.balance
  }
}
