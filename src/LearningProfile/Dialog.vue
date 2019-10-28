<template>
  <div class="text-xs-center">
    <v-dialog v-model="showDialog" width="500">
      <v-card>
        <v-card-title v-if="profile" class="headline primary" primary-title>
          {{$t('learning.profile.dialog.title.update')}}
        </v-card-title>

        <v-card-title v-else class="headline primary" primary-title>
          {{$t('learning.profile.dialog.title')}}
        </v-card-title>
        <v-card-text>
          <v-form
            @submit.prevent="saveProfile"
            ref="profileCreate"
            lazy-validation
          >
            <v-subheader
              :class="{'error': avatarNotSelected}"
            >{{$t('learning.profile.select.avatar')}}</v-subheader>
            <v-badge overlap v-for="a in avatars" :key="a">
              <span v-if="selectedAvatar === a" slot="badge">
                <v-icon>check</v-icon>
              </span>
              <v-avatar :size="62" @click="selectedAvatar = a">
                <img :src="a">
              </v-avatar>
            </v-badge>
            <v-text-field
              data-cy="Student Name"
              v-model="name"
              :rules="rules.required"
              :label="$t('learning.profile.form.name')"
            />
            <v-text-field
              data-cy="Student Birthdate"
              :label="$t('learning.profile.birthdate')"
              v-model.trim="birthday"
              :rules="rules.birthday"
              :placeholder="$moment('1977-05-25', 'YYYY-MM-DD').format('l')"
              required
            />
            <v-select
              data-cy="Student Gender"
              :label="$t('learning.profile.gender')"
              v-model="gender"
              :rules="rules.required"
              :items="genders"
              item-text="name"
              item-value="id"
              required
            >
              <template slot="item" slot-scope="{ item }">
                {{$t(`profile.${item.key}`)}}
              </template>
              <template slot="selection" slot-scope="{ item }">
                {{$t(`profile.${item.key}`)}}
              </template>
            </v-select>
            <v-btn
              data-cy="Update Profile"
              v-if="profile"
              class="primary"
              type="submit"
              :loading="loading"
              :disabled="loading"
            >{{$t('learning.profile.update')}}</v-btn>

            <v-btn
              data-cy="Create Profile"
              v-else
              class="primary"
              type="submit"
              :loading="loading"
              :disabled="loading"
            >{{$t('learning.profile.create')}}</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import get from 'lodash.get'
import { Actions, Getters } from '@/LearningProfile/Store'
import { mapActions, mapGetters } from 'vuex'
import { rules } from '@/utils/Validation'
export default {
  name: 'ProfileDialog',
  props: {
    profile: Object,
    show: { type: Boolean, default: false }
  },
  data() {
    return {
      name: null,
      birthday: null,
      gender: null,
      selectedAvatar: null,
      loading: false,
      avatarNotSelected: false,
      profileToEdit: null,
      rules
    }
  },
  methods: {
    ...mapActions({
      createProfile: Actions.CREATE
    }),
    async saveProfile() {
      this.avatarNotSelected = !this.selectedAvatar
      if (this.$refs.profileCreate.validate() && !this.avatarNotSelected) {
        const createdProfile = await this.createProfile({
          avatarUrl: this.selectedAvatar,
          birthdate: this.$moment(this.birthday, 'l').format('YYYY-MM-DD'),
          displayName: this.name,
          genderId: this.gender,
          id: get(this.profileToEdit, 'id'),
          priority: 0
        })
        this.loading = false
        this.name = null
        this.birthday = null
        this.selectedAvatar = null
        this.$emit('profileCreated', createdProfile)
      }
    }
  },
  computed: {
    ...mapGetters({
      genders: Getters.genders
    }),
    showDialog: {
      get() { return this.show },
      set() { return this.$emit('closeDialog') }
    },
    avatars() {
      const domain = window.location.origin
      const avatars = [
        `${domain}/avatars/girl1.png`,
        `${domain}/avatars/girl2.png`,
        `${domain}/avatars/boy1.png`,
        `${domain}/avatars/boy2.png`,
        `${domain}/avatars/beanie.png`,
        `${domain}/avatars/flipflops.png`,
        `${domain}/avatars/rainboots.png`,
        `${domain}/avatars/sunglasses.png`,
        `${domain}/avatars/umbrella.png`
      ]
      return avatars
    }
  },
  watch: {
    profile(val) {
      this.profileToEdit = val
      const birthdate = get(this.profileToEdit, 'birthdate')
        ? this.$moment(get(this.profileToEdit, 'birthdate')).format(this.$t('system.date.format'))
        : null
      this.birthday = birthdate
      this.gender = get(this.profileToEdit, 'genderId', null)
      this.name = get(this.profileToEdit, 'displayName', null)
      this.selectedAvatar = get(this.profileToEdit, 'avatarUrl', null)
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
