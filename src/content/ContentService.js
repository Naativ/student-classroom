import pathOr from 'ramda/src/pathOr'
import { assetMeta, seachAllAssets, getAssets } from './content.gql'
import { createProvider } from '@/vue-apollo'
const apolloClient = createProvider().defaultClient

const doQuery = (query, args = {}) => {
  return apolloClient.query({
    query: query,
    variables: args,
    fetchPolicy: 'network-only'
  })
}

export const getAssetMeta = async avail => {
  const result = pathOr(
    {},
    ['data', 'assetManagementConfig'],
    await doQuery(assetMeta)
  )
  const tags = pathOr([], ['tags'], result)
  return {
    providers: result.providers || [],
    approval: tags.filter(e => e.key.indexOf('approval:') === 0),
    tags: tags.filter(e => e.key.indexOf('search:') === 0),
    audiences: tags.filter(e => e.key.indexOf('aud:') === 0),
    types: result.types || []
  }
}

export const searchAssets = async (op, input, jwt) => {
  const result = pathOr(
    { assets: [] },
    ['data'],
    await doQuery(seachAllAssets(op), { input })
  )
  const { assetSearch } = result
  return {
    assetSearch
  }
}

export const getAllAssets = async (op, input, jwt) => {
  const result = pathOr(
    { assets: [] },
    ['data'],
    await doQuery(getAssets(op), { input })
  )
  const { assets } = result
  return {
    assets
  }
}
