import { getProfiles, upsertProfile, getGenders, getEnrollments } from './LearningProfiles.gql'
import { createProvider } from '@/vue-apollo'
const apolloClient = createProvider().defaultClient

/**
 * Gets enrollments for profiles
 * @param {number[]} profileIds - profiles ids
 */
export const getProfileEnrollments = (profileIds) => {
  return apolloClient.query({
    query: getEnrollments,
    variables: {
      input: {
        profileIds: profileIds,
        page: 1,
        pageSize: 100 // Hmmm... idk if we wanna support 100 enrollments
      }
    },
    fetchPolicy: 'network-only'
  })
}

/**
 * Gets all available learning profiles for a member.
 * @param {number} memberId - member id to get all profiles for.
 */
export const get = (memberId) => {
  return apolloClient.query({
    query: getProfiles,
    variables: {
      input: {
        memberIds: [memberId],
        page: 1,
        pageSize: 100 // Hmmm... idk if we wanna support 100 learning profiles
      }
    },
    fetchPolicy: 'network-only'
  })
}

/**
 * Create or update a learning profile.
 * @param {object} profile - profile to be created or updated.
 * @param {number} [profile.id] - id of profile to update.
 * @param {string} profile.name - learning profile's name.
 * @param {date} profile.birthday - learning profile's name.
 * @param {string} profile.avatarUrl - learning profile's avatar.
 * @param {number} profile.gender - learning profile's gender id.
 */
export const upsert = (profile) => {
  return apolloClient.mutate({
    mutation: upsertProfile,
    variables: {
      input: profile
    }
  })
}

/**
 * Get Meta Data related to learning profiles
 */
export const loadMeta = (profile) => {
  return apolloClient.query({
    query: getGenders,
    fetchPolicy: 'network-only'
  })
}
