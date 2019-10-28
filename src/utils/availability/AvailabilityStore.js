import { getAvailabilityBlocks, getAvailabilityBlocksByMember } from '@/utils/availability/AvailabilityService'

export const Actions = {
  AVAILABILITY: 'availability:GetRandom',
  MEMBER_AVAILABILITY: 'availability:GetByMember'
}

export default {
  mutations: {},
  actions: {
    [Actions.AVAILABILITY]: (_, range) => getAvailabilityBlocks(range),
    [Actions.MEMBER_AVAILABILITY]: (_, range) => getAvailabilityBlocksByMember(range)
  }
}
