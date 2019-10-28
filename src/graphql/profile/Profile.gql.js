import gql from 'graphql-tag'

export const SET_ADDRESS = gql`
  mutation updateAddress($input:AddressInput) {
    updateAddress(input:$input) {
      street
      street2
      city
      province
      postalCode
    }
  }
`

export const UPDATE_MEMBER = gql`
  mutation updateMemberSubset($input:MemberInfoInputSubset) {
    updateMemberSubset(input:$input) {
      id
      name
      legalLocaleId
      timezoneId
    }
  }
`

export const SET_PASSWORD = gql`
  mutation setMemberPassword($input:SetMemberPasswordInput!){
    setMemberPassword(input:$input)
  }
`

export const SET_PHONE = gql`
  mutation updatePhoneNumber($input:ContactNumberInput!) {
    updatePhoneNumber(input:$input) {
      number
    }
  }
`

export const SET_USERNAME = gql`
  mutation setMemberEmail($input:SetMemberEmailInput!) {
    setMemberEmail(input:$input) {
      member {
        contacts {
          email {
            email
          }
        }
      }
    }
  }
`

export const GET_ADDRESS = gql`
  query addressByContactOrTenant($input:ContactOrTenantInput) {
    addressByContactOrTenant(input:$input) {
      id
      street
      street2
      city
      country
      province
      postalCode
    }
  }
`

export const GET_PHONE = gql`
  query phoneNumberByContact($input:ContactOrTenantInput) {
    phoneNumberByContact(input: $input) {
      id
      number
    }
  }
`

export const UPDATE_EMAIL = gql`
  mutation contactsUpsertEmail($input:EmailInput) {
    contactsUpsertEmail(input:$input) {
      email
    }
  }
`

export const UPDATE_USERNAME = gql`
  mutation iamUpsertUsername($input:IamUpsertUsernameUpsert) {
    iamUpsertUsername(input:$input)
  }
`
