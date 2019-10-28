<template>
  <v-card>
    <PleaseClaim :show="pleaseClaimDialog" @closeDialog="pleaseClaimDialog = false"/>
    <v-card-title class="green"><h3>{{$t('dashboard.continue.booking.title')}}</h3></v-card-title>
    <v-card-text>
      <p>{{$t('dashboard.continue.booking.description')}}</p>
      <v-list
        two-line
        subheader
        v-if="profileInfo"
      >
        <v-list-tile>
          <v-list-tile-avatar v-if="profileInfo.value">
            <v-icon v-if="!profileInfo.value.profilePic" x-large>
              account_circle
            </v-icon>
            <img
              v-else
              :src="getAsset(profileInfo.value.profilePic)"
            >
          </v-list-tile-avatar>
          <v-list-tile-content v-if="profileInfo.value">
            <v-list-tile-title>
              {{profileInfo.displayName}}
            </v-list-tile-title>
            <v-list-tile-sub-title>
              {{
                profileInfo.value.welcomeMessage
              }}
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-btn
        class="primary text-capitalize"
        flat
        large
        round
        @click="checkForProfiles"
      >
        {{$t('dashboard.continue.booking.button')}}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import PleaseClaim from '@/components/dashboard/PleaseClaim.vue'
import { getAsset } from '@/utils/AssetService'
import { GET_PUBLIC_INFO } from '@/graphql/Member'

const tenantId = ~~process.env.VUE_APP_TENANT_ID

export default {
  components: {
    PleaseClaim
  },
  props: {
    teacher: Object
  },
  data() {
    return {
      pleaseClaimDialog: false,
      profileInfo: {},
      getAsset
    }
  },
  mounted() {
    this.getProfileById()
  },
  methods: {
    checkForProfiles() {
      if (!this.isClaimed) {
        this.pleaseClaimDialog = true
      } else if (!this.profile) {
        this.showProfileDialog = true
      } else {
        this.$router.push('/teacher/' + this.teacherInfo.slug)
      }
    },
    async getProfileById() {
      const { data: { memberPublicProfile } } = await this.$apollo.query({
        query: GET_PUBLIC_INFO,
        variables: { input: {
          slug: this.teacherInfo.slug,
          key: 'teacher-profile',
          tenantId
        } }
      })
      this.profileInfo = { ...memberPublicProfile }
    }
  },
  computed: {
    isClaimed() {
      return !!this.$store.state.member.claimedOn
    },
    teacherInfo: {
      get() { return this.teacher }
    }
  }
}
</script>

<style>
.green {
  background-color: green;
}
</style>
