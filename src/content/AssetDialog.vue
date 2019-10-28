<template>
  <v-dialog v-model="show" max-width="768">
    <v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="$emit('closeAssetDialog')">
          {{$t('library.asset.close')}}
        </v-btn>
      </v-card-actions>
      <v-card-text>
        <p>{{displayName}} {{mrn}}</p>
        <p>{{asset.description}}</p>
        <video v-if="asset.categoryKey === 'video' && asset.url" ref="video" style="width: 100%;" controls :src="asset.url" />
        <video v-else-if="asset.categoryKey === 'video' && asset.id" ref="video" style="width: 100%;" controls :src="getAsset(asset.id)" />
        <img
          v-if="asset.categoryKey === 'image' && asset.url"
          ref="image"
          style="width: 100%;"
          controls :src="asset.url"
        />
        <img
          v-else-if="asset.categoryKey === 'image' && asset.id"
          ref="image"
          style="width: 100%;"
          controls
          :src="getAsset(asset.id)"
        />
      </v-card-text>

    </v-card>
  </v-dialog>
</template>

<script>
import { getAsset } from '@/utils/AssetService'

export default {
  name: 'AssetDialog',
  props: {
    showAssetDialog: {
      type: Boolean,
      default: false
    },
    asset: {
      type: Object,
      required: true
    }
  },
  data: () => ({ getAsset }),
  computed: {
    displayName() {
      return this.asset.owner ? this.asset.owner.displayName : ''
    },
    mrn() {
      return this.asset.owner ? `(#${this.asset.owner.mrn})` : ''
    },
    show: {
      get() { return this.showAssetDialog },
      set(v) { this.$emit('closeAssetDialog') }
    }
  }
}
</script>
