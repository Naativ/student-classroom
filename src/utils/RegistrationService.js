import { CREATE_MEMBER } from '@/graphql/Member.js'
import { createProvider } from '@/vue-apollo'
const apolloClient = createProvider().defaultClient

const tenantId = ~~process.env.VUE_APP_TENANT_ID
const registrationTemplateId = process.env.VUE_APP_REGISTRATION_TEMPLATE_ID
const typeId = ~~process.env.VUE_APP_MEMBER_TYPE_ID || 1001

/**
 * Create a member
 * @param {object} member - profile to be created or updated.
 * @param {string} profile.name - learning profile's name.
 * @param {string} profile.phone - learning profile's name.
 * @param {string} profile.email - learning profile's avatar.
 * @param {string} profile.password - learning profile's gender id.
 */
export const createMember = async (member) => {
  console.log('registering', member)
  const { data: { register } } = await apolloClient.mutate({
    mutation: CREATE_MEMBER,
    variables: {
      member: { ...member, tenantId, typeId, templateId: registrationTemplateId }
    }
  })

  return register
}
