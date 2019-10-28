import { MEMBER_INFO, GET_MEMBER_ATTRIBUTE, GET_BALANCE, MEMBER_TAGS } from '@/graphql/Member.js'
import { SET_MEMBER_ATTRIBUTE } from './api.js'
import { createProvider } from '@/vue-apollo'

const apollo = createProvider().defaultClient

export const getMemberInfo = _ids => {
  const ids = Array.isArray(_ids) ? _ids : [_ids]
  return apollo.query({
    query: MEMBER_INFO,
    variables: { ids },
    fetchPolicy: 'network-only' })
    .then(({ data: { membersByIds } }) => membersByIds)
}

export const getMemberAttributes = (input) => {
  return apollo.query({
    query: GET_MEMBER_ATTRIBUTE,
    variables: { input },
    fetchPolicy: 'no-cache'
  })
    .then(({ data: { getMemberAttribute } }) => getMemberAttribute)
}

export const setMemberAttribtues = (payload) => {
  return apollo.mutate({
    mutation: SET_MEMBER_ATTRIBUTE,
    variables: { input: payload }
  })
}

export const getBalance = (memberId) => {
  return apollo.query({
    query: GET_BALANCE,
    variables: { input: {
      memberId,
      unitId: 1000
    } },
    fetchPolicy: 'network-only'
  })
}

export const getMemberTags = (memberId) => {
  return apollo.query({
    query: MEMBER_TAGS,
    variables: {
      id: memberId
    }
  })
}

// GO BACK AND UPDATE EVERYWHERE ELSE THAT USES GETMEMBERATTRIBUTES AND MAKE
// UPDATE THEM TO USE THE NEW FUNCTION SIGNATURE
