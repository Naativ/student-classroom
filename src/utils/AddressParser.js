import get from 'lodash.get'

const addressParserMap = {
  en: {
    city: ['locality'],
    country: ['country'],
    postalCode: ['postal_code'],
    province: ['administrative_area_level_1'],
    street: ['street_number', 'route']
  },
  jp: {
    city: ['locality'],
    country: ['country'],
    postalCode: ['postal_code'],
    province: ['administrative_area_level_1'],
    street: ['streetNumber', 'route']
  },
  kr: {
    city: ['sublocality_level_2', 'sublocality_level_1'],
    country: ['country'],
    postalCode: ['postal_code'],
    province: ['administrative_area_level_1'],
    street: ['premise', 'sublocality_level_4']
  },
  pt: {
    city: ['locality'],
    country: ['country'],
    postalCode: ['postal_code'],
    province: ['administrative_area_level_1'],
    street: ['streetNumber', 'route']
  }
}

export default (locale) => (components, key) => {
  let value = ''
  const pieces = get(addressParserMap, `[${locale}][${key}]`, [])
  pieces.forEach((p, index) => {
    if (index > 0) value += ' '
    components.forEach(c => {
      if (c.types.find(t => t === p)) value += get(c, 'short_name', '')
    })
  })
  return value
}
