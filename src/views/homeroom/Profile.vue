<template>
  <div class="profile">
    <v-tabs centered color="cyan" dark icons-and-text>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#profile">{{$t('profile.learning.profiles')}}
        <v-icon>portrait</v-icon>
      </v-tab>

      <v-tab href="#account">{{$t('profile.account.information')}}
        <v-icon>subject</v-icon>
      </v-tab>

      <v-tab-item value="profile">
        <ProfileInfo />
      </v-tab-item>

      <v-tab-item value="account">
        <AccountInfo />
      </v-tab-item>
    </v-tabs>
  </div>
</template>
<script>
import AccountInfo from '@/views/homeroom/AccountInfo.vue'
import ProfileInfo from '@/LearningProfile/LearningProfiles.vue'

export default {
  name: 'Profile',
  components: {
    AccountInfo,
    ProfileInfo
  }
}
</script>
<style lang="stylus" scoped>
.profile
  margin -24px
</style>
