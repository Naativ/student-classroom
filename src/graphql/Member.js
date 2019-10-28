import gql from 'graphql-tag'

export const MEMBER_TAGS = gql`
  query getMemberTags($id: Int!){
    member(id: $id){
      tags
    }
  }
`

export const CREATE_MEMBER = gql`
  mutation registerMember($member: RegisterInput!) {
    register(input: $member) {
      token
      member{
        id
      }
    }
  }
`

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
      tags
      displayName,
      slugs {
        slug
      }
    }
  }
`

export const MEMBER_INFO_BY_SLUG = gql`
  query membersBySlugs($input: SlugsInput!) {
    membersBySlugs(input: $input) {
      id
      displayName
      slugs {
        slug
      }
    }
  }
`

export const FIND_MEMBER_BY_SLUG = gql`
  query findMemberBySlug($input: SlugInput!) {
    findMemberBySlug(input: $input) {
      id
      displayName
      tags
      slugs {
        slug
      }
    }
  }
`

export const GET_BALANCE = gql`
  query ledgerBalance($input: LedgerBalanceRequest!) {
    ledgerBalance(input: $input) {
      unit {
        id
        name
        key
      }
      balance
    }
  }
`
export const GET_PUBLIC_INFO = gql`
  query memberPublicProfile($input: MemberPublicProfileFilter) {
    memberPublicProfile(input: $input) {
      id
      displayName
      profileType
      profileUrl
      value
    }
  }
`
export const FIND_MEMBERS = gql`
  query members ($input: MemberSearchCondition!) {
    members(condition: $input) {
      nodes{
        id
        displayName
        mrn
      }
    }
  }
`
