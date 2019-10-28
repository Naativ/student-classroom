import gql from 'graphql-tag'

export const GET_PRINCIPAL = gql`
  query principal {
    getPrincipal {
      role
      displayName
      username
      identityId
      tenantId
      permissions
      member {
        id
        name
        firstName
        lastName
        displayName
        mrn
        contacts {
          id
          emails {
            id
            email
          }
        }
        profileUrl
        createdOn
        joinedOn
        claimedOn
        timezoneId
        languageId
        legalLocaleId
        type {
          key
          name
        }
        status
        birthdate
        tags
        subscriptions
      }
    }
  }
`

export const CLAIM_ACCOUNT = gql`
  mutation claim($claimToken: ConsumeOneTimeTokenInput!) {
    consumeOneTimeToken(input: $claimToken)
  }
`

export const GENERATE_TOKEN = gql`
  mutation token($token: GenerateOneTimeTokenInput!) {
    generateOneTimeToken(input: $token)
  }
`

export const USERNAME_AVAILABLE = gql`
  query isUsernameAvailable($input:UsernameInput) {
    isUsernameAvailable(input:$input)
  }
`

export const LOGIN = gql`
  mutation auth($creds: Credentials!) {
    login(input: $creds) {
      token
      success
      reason
      principal {
        identityId
        auditId
        credentialId
        username
        permissionIds
        member {
          id
          name
          firstName
          lastName
          displayName
          mrn
          contacts {
            id
            emails {
              id
              email
            }
          }
          profileUrl
          createdOn
          joinedOn
          claimedOn
          timezoneId
          languageId
          legalLocaleId
          type {
            key
            name
          }
          status
          birthdate
          tags
          subscriptions
        }
      }
    }
  }
`

export const RESET_PASSWORD = gql`
  mutation resetOneTimeToken($input:ResetOneTimeTokenInput!) {
    resetOneTimeToken(input:$input)
  }
`
