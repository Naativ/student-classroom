import { Mutations } from '@/store'

import {
  SET_ADDRESS,
  UPDATE_MEMBER,
  SET_PASSWORD,
  SET_PHONE,
  SET_USERNAME,
  UPDATE_EMAIL,
  UPDATE_USERNAME
} from '@/graphql/profile/Profile.gql.js'

const profile = async (apollo, sectionInfo, store) => {
  const { id } = store.state.member
  const { name, legalLocaleId, languageId, timezoneId } = sectionInfo
  const memberUpdates = await apollo.mutate({
    mutation: UPDATE_MEMBER,
    variables: {
      input: { id, legalLocaleId, languageId, timezoneId, name, displayName: name }
    }
  })

  store.commit(Mutations.SET_MEMBER, memberUpdates)
  store.commit(Mutations.SET_LOCALE, languageId)
}

const username = async (apollo, sectionInfo, store) => {
  const { email } = sectionInfo
  const { data: { setMemberEmail: { member } } } = await apollo.mutate({
    mutation: SET_USERNAME,
    variables: { input: { email } }
  })

  store.commit(Mutations.SET_MEMBER, member)
}

const email = async (apollo, sectionInfo, store, memberId, contactId) => {
  const emailId = store.state.member.contacts[0].emails[0].id
  const { email } = sectionInfo
  const { data: { contactsUpsertEmail } } = await apollo.mutate({
    mutation: UPDATE_EMAIL,
    variables: { input: { email, contactId, id: emailId } }
  })
  store.commit(Mutations.SET_CONTACT_EMAIL, contactsUpsertEmail.email)

  const identityId = store.state.principal.identityId
  await apollo.mutate({
    mutation: UPDATE_USERNAME,
    variables: {
      input: {
        identityId,
        username: email
      }
    }
  })
}

const phoneNumber = (apollo, sectionInfo, store, memberId, contactId) => {
  const { id, phoneNumber: number } = sectionInfo
  return apollo.mutate({
    mutation: SET_PHONE,
    variables: { input: { id, number, contactId } }
  })
}

const address = (apollo, sectionInfo, store, memberId, contactId) => {
  const { name } = store.state.member
  const { id, street, street2, city, country, province, postalCode } = sectionInfo
  return apollo.mutate({
    mutation: SET_ADDRESS,
    variables: {
      input: { memberId, contactId, id, country, name, street, street2, city, province, postalCode }
    }
  })
}

const password = (apollo, sectionInfo) => {
  const { newPassword, oldPassword } = sectionInfo
  return apollo.mutate({
    mutation: SET_PASSWORD,
    variables: { input: { newPassword, oldPassword } }
  })
}

export const profileMap = {
  address,
  password,
  phoneNumber,
  profile,
  username,
  email
}
