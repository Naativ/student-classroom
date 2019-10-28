import sortBy from 'lodash.sortby'
import { AVAILABLE_BLOCKS, HEATMAP, AVAILABLE_BLOCKS_BY_MEMBER } from '@/graphql/Availability'
import { createProvider } from '@/vue-apollo'

const apollo = createProvider().defaultClient

export const STATUS = {
  live: 200
}

export const TAGS = {
  interviewer: 4,
  early_access_availability: 10
}

export const TYPE = {
  available: 1001
}

export const getAvailabilityBlocks = availObj => {
  const { start, end, hostId, tags, interval } = availObj
  const request = {
    query: AVAILABLE_BLOCKS,
    fetchPolicy: 'no-cache',
    variables: {
      input: {
        allowBooked: false,
        end: end.utc().toISOString(),
        interval: interval,
        memberTags: [TAGS['early_access_availability'], ...tags],
        start: start.utc().toISOString(),
        statusIds: [STATUS['live']],
        typeIds: [TYPE['available']],
        limit: 50
      }
    }
  }
  if (hostId) request.variables.input.memberIds = [hostId]
  return apollo.query(request)
}

export const getAvailabilityBlocksByMember = availObj => {
  const { start, end, hostId, tags, interval } = availObj
  const request = {
    query: AVAILABLE_BLOCKS_BY_MEMBER,
    fetchPolicy: 'no-cache',
    variables: {
      input: {
        allowBooked: false,
        end: end.utc().toISOString(),
        interval: interval,
        memberTags: [TAGS['early_access_availability'], ...tags],
        start: start.utc().toISOString(),
        statusIds: [STATUS['live']],
        typeIds: [TYPE['available']]
      }
    }
  }
  if (hostId) request.variables.input.memberIds = [hostId]
  return apollo.query(request)
    .then(({ data: { availabilityBlocks } }) => sortBy(availabilityBlocks, a => a.start.valueOf()))
}

export const getAvailabilityBlockSummaries = availObj => {
  const { start, end, tags, interval } = availObj

  const request = {
    query: HEATMAP,
    fetchPolicy: 'no-cache',
    variables: {
      input: {
        allowBooked: false,
        end: end.utc().toISOString(),
        interval: interval,
        memberTags: [TAGS['early_access_availability'], ...tags],
        start: start.utc().toISOString(),
        statusIds: [STATUS['live']],
        typeIds: [TYPE['available']]
      }
    }
  }
  return apollo.query(request)
}
