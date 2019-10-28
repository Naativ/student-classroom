<template>
  <v-autocomplete
    v-model="addressSelected"
    :hint="$t('form.address.hint')"
    :label="$t('form.address.label')"
    class="geo-autocomplete"
    :search-input.sync="addressInput"
    :items="results"
    item-text="description"
    hide-no-data
    :loading="loading"
    return-object
    no-filter
    :disabled="disabled"
  />
</template>

<script>
import googleMapsApi from 'load-google-maps-api'

import AddressParser from '@/utils/AddressParser.js'

export default {
  name: 'GoogleMapsInput',
  props: ['disabled'],
  data() {
    return {
      addressInput: '',
      addressSelected: {},
      autoCompleteService: null,
      geocoder: null,
      loading: false,
      placeDetailsService: null,
      results: [],
      sessionToken: null
    }
  },
  async mounted() {
    const mapsAPI = await googleMapsApi({
      key: process.env.VUE_APP_GOOGLE_MAPS_KEY,
      libraries: ['places'],
      language: this.$t('system.bcp.47.language')
    })
    this.geocoder = new mapsAPI.Geocoder().geocode
    this.autoCompleteService = new mapsAPI.places.AutocompleteService()
    this.sessionToken = new mapsAPI.places.AutocompleteSessionToken()
  },
  methods: {
    getDetails(placeObj) {
      const { description } = placeObj
      return new Promise((resolve) => {
        this.geocoder({ address: description }, res => resolve(res[0]))
      })
    },
    getSuggestions(query) {
      return new Promise((resolve) => {
        this.autoCompleteService.getPlacePredictions(query, res => resolve(res))
      })
    },
    async parseAddress(placeObj) {
      const { address_components: address } = await this.getDetails(placeObj)
      const parse = AddressParser(this.locale.current.code)
      return {
        street: parse(address, 'street'),
        city: parse(address, 'city'),
        country: parse(address, 'country'),
        province: parse(address, 'province'),
        postalCode: parse(address, 'postalCode'),
        _raw: placeObj
      }
    }
  },
  watch: {
    async addressInput(input) {
      if (input < 2) return
      this.loading = true
      const query = {
        input,
        sessionToken: this.sessionToken,
        types: ['address']
      }
      const results = await this.getSuggestions(query)
      this.results = results || []
      this.loading = false
    },
    async addressSelected(val) {
      const address = await this.parseAddress(val)
      this.$emit('selected', address)
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
