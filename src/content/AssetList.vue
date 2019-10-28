<template>
  <v-layout row wrap>
    <AssetDialog
      :showAssetDialog="showAssetDialog"
      :asset="this.selectedAsset"
      @closeAssetDialog="closeAssetDialog"
    />
    <template>
      <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
    </template>
    <v-flex xs12 sm6 md4 lg3 xl2 pa-1 v-for="(asset, index) in assets" :key="index">
      <v-card  v-if="!loading">
        <div v-if="isPending(asset)" class="v-responsive v-image bordered">
          <div class="v-responsive__sizer" style="padding-bottom: 36.3636%;"></div>
          <div class="v-image__image v-image__image--cover image-missing">
            <strong>File is still processing</strong>
          </div>
          <div class="v-responsive__content"></div>
        </div>
        <div v-else-if="asset.visibilityId === 204" class="v-responsive v-image bordered">
          <div class="v-responsive__sizer" style="padding-bottom: 36.3636%;"></div>
          <div class="v-image__image v-image__image--cover image-missing">Failed. Please try reporcessing</div>
          <div class="v-responsive__content"></div>
        </div>
        <v-img
          @click="showAsset(asset)"
          v-else-if="asset.thumbnailUrl"
          :src="asset.thumbnailUrl"
          aspect-ratio="2.75">
        </v-img>
        <v-img
          @click="showAsset(asset)"
          v-else-if="asset.url && asset.categoryKey === 'image'"
          :src="asset.url"
          aspect-ratio="2.75"
        ></v-img>
        <div v-else-if="asset.categoryKey === 'doc'" class="v-responsive v-image bordered">
          <v-spacer/>
          <object :data="asset.url" type="application/pdf">
            <embed v-if="!$browser.isMobile" :src="asset.url" type="application/pdf" target="_blank"/>
            <p class="pdf">{{$t('worksheets.not.available')}}</p>
          </object>
          <v-spacer />
        </div>
        <div v-else class="v-responsive v-image bordered">
          <div class="v-responsive__sizer" style="padding-bottom: 36.3636%;"></div>
          <div class="v-image__image v-image__image--cover image-missing">Preview not available</div>
          <div class="v-responsive__content"></div>
        </div>
        <v-card-title primary-title style="overflow: hidden;">
          <div>
            <v-chip class="profile-chip" v-if="profile && inProfile(asset)" color="green" text-color="white">In Profile</v-chip>
            <v-chip class="profile-chip" v-if="profile && asset.id === profilePic" color="green" text-color="white">Profile Pic</v-chip>
            <h3 class="headline mb-0" style="text-overflow: ellipsis;">{{asset.name}}</h3>
            <div v-if="asset.categoryKey !== 'doc'">
              <small>{{asset.owner.displayName}} (#{{asset.owner.mrn}})</small>
              <div v-if="filterTags(asset, 'search').length">
                <small>Tags: </small>
                <small>{{filterTags(asset, 'search').join(', ')}}</small>
              </div>
            </div>
            <div style="height: 50px;">{{asset.description}}</div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn v-if="asset.categoryKey === 'image'" flat color="primary" :disabled="asset.visibilityId !== 200" @click="showAsset(asset)">{{$t('library.asset.show')}}</v-btn>
          <a  v-else-if="asset.categoryKey === 'doc'" :href="asset.url" class="download" target="_blank">{{$t('library.asset.download')}}</a>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import AssetDialog from '@/content/AssetDialog.vue'
import { processingStatus } from '@/content/content.gql.js'

import { mapActions, mapGetters } from 'vuex'
import { ContentActions, ContentGetters } from '@/content/ContentStore'
export default {
  name: 'Assets',
  components: {
    AssetDialog
  },
  data() {
    return {
      showAssetDialog: false,
      selectedAsset: {},
      statuses: {
        200: 'Available',
        202: 'Pending',
        203: 'Processing',
        204: 'Failed',
        301: 'Archived'
      }
    }
  },
  mounted() {
    this.assets.forEach(async _ => {
      if (this.isPending(_)) {
        this.refresh(_)
      }
    })
  },
  props: {
    loading: Boolean,
    assets: {
      type: Array,
      default() {
        return []
      }
    },
    manage: {
      type: Boolean,
      default: false
    },
    profile: {
      type: Array
    },
    profilePic: {
      type: Number
    }
  },
  computed: {
    ...mapGetters({
      assetMeta: ContentGetters.assetMeta
    })
  },
  methods: {
    ...mapActions({
      setTags: ContentActions.ADD_ASSET_TAG,
      removeAsset: ContentActions.REMOVE_ASSET
    }),
    filterTags(asset, key) {
      return asset.tags.filter(_ => _.key.indexOf(key) > -1).map(_ => _.name)
    },
    showAsset(asset) {
      this.showAssetDialog = true
      this.selectedAsset = asset
    },
    closeAssetDialog() {
      this.showAssetDialog = false
      this.selectedAsset = {}
    },
    async addTag(asset, tag) {
      const tagData = this.assetMeta.approval.find(e => e.key === `approval:${tag}`)
      const pendingData = this.assetMeta.approval.find(e => e.key === `approval:pending`)
      const filteredTags = asset.tags.filter(_ => _.id !== pendingData.id)
      await this.setTags({
        asset,
        tags: [
          ...filteredTags.map(_ => _.id),
          tagData.id
        ]
      })
      await this.removeAsset(asset)
    },
    async refresh(asset) {
      const { data } = await this.$apollo.query({
        query: processingStatus,
        variables: {
          input: {
            assetId: asset.id
          }
        },
        fetchPolicy: 'network-only'
      })
      if (data.assetProcessingStatus.asset) {
        this.$emit('updated', data.assetProcessingStatus.asset)
      }
    },
    isPending(asset) {
      return [202, 203].indexOf(asset.visibilityId) > -1
    }
  }
}
</script>

<style scoped>
.bordered {
  border-bottom: 1px solid #eee;
}
.image-missing {
  text-align: center;
  margin: auto;
  position: relative;
  height: 100%;
}

.profile-chip{
  position: absolute;
  right: 0;
  top: 0;
}

.download {
  font-weight: 500;
  margin-bottom: 10px;
  margin-left: 10px;
  text-decoration: none;
  text-transform: uppercase;
}

.pdf {
  margin: 15px 0;
}
</style>
