import store from '@/store'
import * as Service from '@/Subscriptions/Service'

export const Actions = {
  CREATE_CUSTOMER: 'subscriptions:CreateCustomer',
  GET_PLANS: 'subscriptions:Plans',
  ADD_SUBSCRIPTION: 'subscriptions:Add',
  REMOVE_SUBSCRIPTION: 'subscriptions:Remove',
  GET_SUBSCRIPTIONS: 'subscriptions:Get',
  GET_COUPON: 'subscriptions:GetCoupon'
}

export const Mutations = {
  SET_ONE: 'subscriptions:SetOne',
  SET: 'subscriptions:Set',
  INIT: 'init'
}

export const Getters = {
  subscriptions: 'subscriptions:subscriptions',
  plans: 'subscriptions:plans',
  loadingSubscriptions: 'subscriptions:loadingSubscriptions'
}

const DEFAULT_STATE = {
  subscriptions: [],
  plans: [],
  errors: [],
  loadingSubscriptions: true
}

export const subscriptionsStore = {
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
    [Actions.CREATE_CUSTOMER]: async ({ commit, state }, payload) => {
      try {
        await Service.createCustomer(payload)
      } catch (e) {
        console.log(e)
      }
    },
    [Actions.GET_PLANS]: async ({ commit, dispatch, state }) => {
      try {
        const { data } = await Service.getPlans()
        const plans = data.getPlans.map(plan => {
          if (typeof plan.metadata.markets === 'string') {
            try {
              const m = JSON.parse(plan.metadata.markets)
              plan.metadata.markets = m
            } catch (e) {
              console.error(e)
              plan.metadata.markets = []
            }
          }
          return plan
        })
        commit(Mutations.SET_ONE, { property: 'plans', value: plans })
      } catch (e) {
        console.error(e)
      }
    },
    [Actions.GET_SUBSCRIPTIONS]: async ({ commit, dispatch, state }) => {
      try {
        commit(Mutations.SET_ONE, { property: 'loadingSubscriptions', value: true })
        const { data } = await Service.getSubscriptions(store.state.member.id)
        commit(Mutations.SET_ONE, { property: 'subscriptions', value: data.getSubscriptions })
      } catch (e) {
        console.log(e)
      }
      commit(Mutations.SET_ONE, { property: 'loadingSubscriptions', value: false })
    },
    [Actions.ADD_SUBSCRIPTIONS]: async ({ commit, state }, payload) => {
      try {
        const { data } = await Service.addSubscription(payload)
        console.log('subscription added', data.createSubscription)
        commit(Mutations.SET_ONE, { property: 'subscriptions', value: [data.createSubscription] })
      } catch (e) {
        console.log(e)
      }
    },
    [Actions.GET_COUPON]: async ({ commit, state }, couponId) => {
      try {
        const { data } = await Service.getCoupon(couponId)
        return data.getCoupon
      } catch (e) {
        console.log(e)
      }
    },
    [Actions.REMOVE_SUBSCRIPTION]: async ({ commit, state }, payload) => {
      try {
        await Service.removeSubscription(payload)
        commit(Mutations.SET_ONE, { property: 'subscriptions', value: [] })
      } catch (e) {
        console.log(e)
      }
    }
  },
  getters: {
    [Getters.subscriptions]: state => state.subscriptions,
    [Getters.plans]: state => state.plans,
    [Getters.loadingSubscriptions]: state => state.loadingSubscriptions
  }
}
