<template>
  <div class="pa-2">
    <ProfileDialog
      :profile="profileToEdit"
      :show="showProfileDialog"
      @profileCreated="profileCreated"
      @closeDialog="dialogClosed"
    />
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar color="#003660" dark>
            <v-toolbar-title>{{$t('profile.learning.profiles')}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn data-cy="Add Learning Profile" icon @click="showProfileDialog = true">
              <v-icon>add</v-icon>
            </v-btn>
          </v-toolbar>
          <v-list two-line>
            <v-list-tile
              v-for="profile in profiles"
              :key="profile.id"
              avatar
              @click="makeDefault(profile)"
            >
              <v-list-tile-action>
                <v-icon
                  v-if="checkSelectedProfile(profile)"
                  :color="getGenderColor(profile.genderId)"
                >star</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{profile.displayName}}</v-list-tile-title>
                <v-list-tile-sub-title>{{formatDate(profile.birthdate)}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-avatar>
                <img class="learning-profile avatar" :src="profile.avatarUrl">
              </v-list-tile-avatar>
              <v-list-tile-action>
                <v-btn icon @click.prevent="editProfile(profile)">
                  <v-icon>edit</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import moment from 'moment'
import ProfileDialog from '@/LearningProfile/Dialog.vue'
import { Actions, Getters } from '@/LearningProfile/Store'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'LearningProfiles',
  data() {
    return {
      profileToEdit: null,
      genderColors: {
        'gender:unspecified': 'green',
        'gender:female': 'pink',
        'gender:male': 'blue'
      },
      showProfileDialog: false
    }
  },
  components: {
    ProfileDialog
  },
  methods: {
    ...mapActions({
      makeDefault: Actions.MAKE_DEFAULT,
      loadProfiles: Actions.GET
    }),
    checkSelectedProfile(profile) {
      return this.currentProfile
        ? profile.id === this.currentProfile.id
        : false
    },
    dialogClosed() {
      this.showProfileDialog = false
      this.profileToEdit = null
    },
    editProfile(profile) {
      this.profileToEdit = profile
      this.showProfileDialog = true
    },
    formatDate(date) {
      return moment(date, 'YYYY-MM-DD').format('LL')
    },
    getGenderColor(genderId) {
      const gender = this.genders.find(g => g.id === genderId)
      return this.genderColors[gender.key]
    },
    async profileCreated(profile) {
      this.showProfileDialog = false
      await this.loadProfiles()
    }
  },
  computed: {
    ...mapGetters({
      profiles: Getters.profiles,
      currentProfile: Getters.profile,
      genders: Getters.genders
    })
  }
}
</script>
<style lang="stylus" scoped>
</style>
