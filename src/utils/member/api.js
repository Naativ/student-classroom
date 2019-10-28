import gql from 'graphql-tag'

export const GET_MEMBER_ATTRIBUTE = gql`
  query getMemberAttribute($input: GetMemberAttributeInput!) {
    getMemberAttribute(input: $input) {
      key
      value
      memberId
      id
    }
  }
`

export const SET_MEMBER_ATTRIBUTE = gql`
  mutation upsertMemberAttribute($input: MemberAttributeInput!) {
    upsertMemberAttribute(input: $input) {
      key
      value
      memberId
      id
    }
  }
`

export const MEMBER_INFO = gql`
  query membersByIds($ids: [Int]) {
    membersByIds(ids: $ids) {
      id
      displayName
    }
  }
`
