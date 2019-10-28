import {
  GET_SUBSCRIPTIONS,
  ADD_SUBSCRIPTION,
  GET_PLANS,
  CREATE_CUSTOMER,
  DELETE_SUBSCRIPTION,
  GET_COUPON
} from './api.js'
import { createProvider } from '@/vue-apollo'
const apolloClient = createProvider().defaultClient

/**
 * Gets Subscriptions for logged in user
 */
export const getSubscriptions = () => {
  return apolloClient.query({
    query: GET_SUBSCRIPTIONS,
    fetchPolicy: 'network-only'
  })
}

/**
 * Create subscription for specified member
 * @param {object} payload - object with subscription info.
 * @param {string} [payload.coupon] - Coupon to be applied to subscription
 * @param {number} payload.memberId - Id for member getting the new subscription
 * @param {string} payload.plan - stripe plan to add as subscription
 */
export const addSubscription = (payload) => {
  return apolloClient.mutate({
    mutation: ADD_SUBSCRIPTION,
    variables: {
      input: payload
    }
  })
}

/**
 * Create subscription for specified member
 * @param {object} payload - object with subscription info.
 * @param {string} payload.subscriptionId - Subscription id to be removed
 * @param {number} payload.memberId - Id for member who is deleting the subscriptions
 */
export const removeSubscription = (payload) => {
  return apolloClient.mutate({
    mutation: DELETE_SUBSCRIPTION,
    variables: {
      input: payload
    }
  })
}

/**
 * Get available plans for tenant
 */
export const getPlans = (profile) => {
  return apolloClient.query({
    query: GET_PLANS,
    variables: {
      input: profile
    }
  })
}

/**
 * Get coupon by id
 * @param {string} couponId
 */
export const getCoupon = (couponId) => {
  return apolloClient.query({
    query: GET_COUPON,
    variables: {
      input: {
        id: couponId
      }
    }
  })
}

/**
 * Create Stripe customer
 * @param {object} payload - object with customer info.
 * @param {string} payload.stripeSource - stripe token.
 * @param {number} payload.memberId - Id for member we want to create a customer account in stripe.
 */
export const createCustomer = (payload) => {
  return apolloClient.mutate({
    mutation: CREATE_CUSTOMER,
    variables: {
      input: payload
    }
  })
}
