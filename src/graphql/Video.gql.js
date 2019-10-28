import gql from 'graphql-tag'

export const VIDEO_ROOM_TOKEN = gql`
  mutation grantVideoAccess($roomInput: VideoAccessInput!) {
    grantVideoAccess(input: $roomInput) {
      token
    }
  }
`
