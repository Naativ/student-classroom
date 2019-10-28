import gql from 'graphql-tag'

export const AVAILABLE_BLOCKS = gql`
  query getAvailabilityBlocks($input: AvailabilityBlockInput!) {
    availabilityBlocksRandom(input: $input) {
      availabilityId
      memberId
      start
      end
      booked
    }
  }
`

export const AVAILABLE_BLOCKS_BY_MEMBER = gql`
  query getAvailabilityBlocks($input: AvailabilityBlockInput!) {
    availabilityBlocks(input: $input) {
      availabilityId
      memberId
      start
      end
      booked
    }
  }
`

export const HEATMAP = gql`
  query AvailBlockSummaries($input: AvailabilityBlockInput!) {
    availabilityBlockSummaries(input: $input) {
      start
      end
      count
    }
  }
`
