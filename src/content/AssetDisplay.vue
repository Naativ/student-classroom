<template>
  <v-layout justify-space-between align-center class="profile-assets" row>
    <AssetDialog
      :showAssetDialog="showAssetDialog"
      :asset="this.selectedAsset"
      @closeAssetDialog="closeAssetDialog"
    />
    <v-flex pa-4 d-flex xs12 v-for="(asset, index) in assets" :key="index">
      <v-card class="content">
        <v-img
          class="asset"
          @click="showAsset(asset)"
          v-if="asset.thumbnailUrl"
          :src="asset.thumbnailUrl"
          aspect-ratio="2.75"
          transition="scale-transition"
        ></v-img>
        <v-img
          class="asset"
          @click="showAsset(asset)"
          v-else-if="asset.id && asset.categoryKey === 'image'"
          :src="getAsset(asset.id)"
          aspect-ratio="2.75"
          transition="scale-transition"
        ></v-img>
        <div
          v-else-if="asset.url && asset.categoryKey === 'doc'"
          class="v-responsive v-image bordered"
        >
          <div class="v-responsive__sizer" style="padding-bottom: 36.3636%;"></div>
          <div class="v-image__image v-image__image--cover image-missing">
            <v-icon large>insert_drive_file</v-icon>
          </div>
          <div class="v-responsive__content"></div>
        </div>
        <div v-else class="v-responsive v-image bordered">
          <div class="v-responsive__sizer" style="padding-bottom: 36.3636%;"></div>
          <div class="v-image__image v-image__image--cover image-missing">Preview not available</div>
          <div class="v-responsive__content"></div>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import AssetDialog from '@/content/AssetDialog.vue'
import { getAsset } from '@/utils/AssetService'

// This whole file will need to be updated once we have ALL of the profileAsset
// info from the membersAttribute response
export default {
  name: 'Assets',
  components: { AssetDialog },
  data() {
    return {
      getAsset,
      showAssetDialog: false,
      selectedAsset: {}
    }
  },
  props: {
    assets: { type: Array, default() { return [] } }
  },
  methods: {
    showAsset(asset) {
      if (asset.categoryKey === 'doc') {
        window.open(asset.url, '_blank')
      } else {
        this.showAssetDialog = true
        this.selectedAsset = asset
      }
    },
    closeAssetDialog() {
      this.showAssetDialog = false
      this.selectedAsset = {}
    },
    isPending(asset) {
      return [202, 203].indexOf(asset.visibilityId) > -1
    }
  }
}
</script>

<style lang="stylus" scoped>
.bordered {
  border-bottom: 1px solid #eee;
}
.image-missing {
  text-align: center;
  margin: auto;
  position: relative;
  height: 100%;
}

.profile-chip {
  position: absolute;
  right: 0;
  top: 0;
}

.profile-assets {
  overflow-x: scroll;
}
.asset
  height: 200px
  &:hover
    cursor pointer
    opacity .5

.content
  margin 0 auto
  max-width 250px

.asset:hover {
  opacity: .5;
}
</style>
