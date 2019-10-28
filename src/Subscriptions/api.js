import gql from 'graphql-tag'

export const CREATE_CUSTOMER = gql`
mutation createCustomer($input: CreateCustomerInput!) {
  createCustomer(input: $input) {
    id
  }
}
`

export const PROCESS_PAYMENT = gql`
mutation createPayment($input: CreatePaymentInput!) {
  createPayment(input: $input) {
    tenantIntegrationId
    integrationOid
    status
    amount
    currency
    description
  }
}
`

export const GET_PAYMENTS = gql`
query getPayments {
  getPayments{
    tenantIntegrationId
    integrationOid
    status
    amount
    currency
    description
  }
}
`

export const GET_PLANS = gql`
query getPlans {
  getPlans{
    integration
    integrationId
    integrationOid
    status
    amount
    currency
    metadata
    interval
    productId
    name
  }
}
`

export const GET_COUPON = gql`
query getCoupon($input: CouponSearchInput!) {
  getCoupon(input: $input){
    integration
    integrationId
    integrationOid
    name
    amountOff
    duration
    durationInMonths
    percentOff
    valid
  }
}
`

export const ADD_SUBSCRIPTION = gql`
mutation createSubscription($input: CreateSubscriptionInput!) {
  createSubscription(input: $input)
}
`

export const DELETE_SUBSCRIPTION = gql`
mutation deleteSubscription($input: DeleteSubscriptionInput!) {
  deleteSubscription(input: $input)
}
`

export const GET_SUBSCRIPTIONS = gql`
query getSubscriptions {
  getSubscriptions {
    integration
    integrationId
    integrationOid
    quantity
    plan {
      integration
      integrationId
      integrationOid
      status
      amount
      currency
      metadata
      interval
      productId
      name
    }
    items
    periodStart
    periodEnd
  }
}
`
