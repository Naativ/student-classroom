const tenantId = ~~process.env.VUE_APP_TENANT_ID
const BASE_URL = process.env.VUE_APP_ASSET_HTTP || 'http://localhost:3000/assets'

export const getAsset = (assetId) => `${BASE_URL}/${tenantId}/${assetId}`
