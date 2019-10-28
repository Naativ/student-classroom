<template>
  <div class="classroom pa-2">
    <h1>{{$t('profile.header')}}</h1>
    <div>
      <h2>{{$t('profile.info.subheader')}}</h2>
      <v-alert type="success" :value="profile.success">{{profile.success}}</v-alert>
      <v-alert type="error" :value="profile.error">{{profile.error}}</v-alert>
      <v-form ref="profile" @submit.prevent="update('profile')" lazy-validation>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field :label="$t('form.name')" v-model.trim="profile.name" :rules="rules.required" required />
          </v-flex>
          <v-flex xs12>
            <v-autocomplete
                v-model="profile.legalLocaleId"
                :label="$t('form.country.citizenship')"
                persistent-hint
                :hint="$t('form.country.citizenship.hint')"
                :rules="rules.required"
                :items="settings.legalLocales"
                item-text="name"
                item-value="id"
              >
                <template
                  slot="item"
                  slot-scope="{ item }"
                >
                  {{$t(item.code)}}
                </template>
                <template
                  slot="selection"
                  slot-scope="{ item }"
                >
                  {{$t(item.code)}}
                </template>
              </v-autocomplete>
          </v-flex>
          <v-flex xs12>
            <v-autocomplete :label="$t('form.timezone')" v-model="profile.timezoneId" :rules="rules.required" :items="settings.timezones" item-text="name" item-value="id" />
          </v-flex>
          <v-flex xs12>
            <v-select :label="$t('form.language')" v-model="profile.languageId" :rules="rules.required" :items="locale.available" item-text="localName" item-value="id" />
          </v-flex>
          <v-flex xs12>
            <v-btn color="#00d3e6" depressed round large class="text-capitalize white--text font-weight-black" type="submit" :loading="profile.loading" >
              {{$t('profile.info.action')}}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
      <v-divider class="my-5"/>
      <h2>{{$t('profile.phone.subheader')}}</h2>
      <v-alert type="success" :value="phoneNumber.success">{{phoneNumber.success}}</v-alert>
      <v-alert type="error" :value="phoneNumber.error">{{phoneNumber.error}}</v-alert>
      <v-form ref="phoneNumber" @submit.prevent="update('phoneNumber')" lazy-validation>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field :label="$t('form.phone')" v-model.trim="phoneNumber.phoneNumber" :rules="rules.phone" />
          </v-flex>
          <v-flex xs12>
            <v-btn color="#00d3e6" depressed round large class="text-capitalize white--text font-weight-black" type="submit" :loading="phoneNumber.loading" >
              {{$t('profile.phone.action')}}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
      <v-divider class="my-5"/>
      <h2>{{$t('profile.address.subheader')}}</h2>
      <v-alert type="success" :value="address.success">{{address.success}}</v-alert>
      <v-alert type="error" :value="address.error">{{address.error}}</v-alert>
      <v-form  ref="address" @submit.prevent="update('address')" lazy-validation>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field :label="$t('form.street.1')" v-model.trim="address.street" :rules="rules.required" />
          </v-flex>
          <v-flex xs12>
            <v-text-field :label="$t('form.street.2')" v-model.trim="address.street2" />
          </v-flex>
          <v-flex xs12 sm4 px-1>
            <v-text-field :label="$t('form.city')" v-model.trim="address.city" :rules="rules.required"/>
          </v-flex>
          <v-flex xs12 sm4 px-1>
            <v-text-field :label="$t('form.province')" v-model.trim="address.province" :rules="rules.required" />
          </v-flex>
          <v-flex xs12 sm4 px-1>
            <v-text-field :label="$t('form.postal.code')" v-model.trim="address.postalCode" :rules="rules.required" />
          </v-flex>
          <v-flex xs12>
            <v-btn color="#00d3e6" depressed round large class="text-capitalize white--text font-weight-black" type="submit" :loading="address.loading" >
              {{$t('profile.address.action')}}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
      <v-divider class="my-5"/>
      <h2>{{$t('profile.email.subheader')}}</h2>
      <v-alert type="success" :value="email.success">{{email.success}}</v-alert>
      <v-alert type="error" :value="email.error">{{email.error}}</v-alert>
      <v-form  ref="email" @submit.prevent="update('email')" lazy-validation>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field :label="$t('form.email')" v-model.trim="email.email" :rules="rules.email" />
          </v-flex>
          <v-flex xs12>
            <v-btn color="#00d3e6" depressed round large class="text-capitalize white--text font-weight-black" type="submit" :loading="username.loading" >
              {{$t('profile.email.action')}}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
       <v-divider class="my-5"/>
      <h2>{{$t('profile.password.subheader')}}</h2>
      <v-alert type="success" :value="password.success">{{password.success}}</v-alert>
      <v-alert type="error" :value="password.error">{{password.error}}</v-alert>
      <v-form  ref="password" @submit.prevent="update('password')" lazy-validation>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field :label="$t('form.password.old')" v-model="password.oldPassword" type="password" :rules="rules.password" />
          </v-flex>
          <v-flex xs12>
            <v-text-field :label="$t('form.password.new')" v-model="password.newPassword" type="password" :rules="rules.password" />
          </v-flex>
          <v-flex xs12>
            <v-btn color="#00d3e6" depressed round large class="text-capitalize white--text font-weight-black" type="submit" :loading="password.loading" >
              {{$t('profile.password.action')}}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { delay } from '@/utils/Helpers.js'
import { rules } from '@/utils/Validation.js'
import { profileMap } from '@/utils/Mutations.js'

import { GET_ADDRESS, GET_PHONE } from '@/graphql/profile/Profile.gql.js'

import { SETTINGS } from '@/graphql/Settings.gql.js'
import { USERNAME_AVAILABLE } from '@/graphql/Iam.gql.js'

const tenantId = ~~process.env.VUE_APP_TENANT_ID

export default {
  name: 'Profile',
  data() {
    return {
      flippedName: process.env.VUE_APP_FLIPPED_NAME || false,
      profile: {
        loading: false,
        success: false,
        error: null,
        name: this.$store.state.member.name,
        languageId: this.$store.state.member.languageId,
        legalLocaleId: this.$store.state.member.legalLocaleId,
        timezoneId: this.$store.state.member.timezoneId
      },
      phoneNumber: {
        loading: false,
        success: false,
        error: null,
        id: null,
        phoneNumber: null,
        type: 'CELL'
      },
      address: {
        loading: false,
        success: false,
        error: null,
        id: null,
        street: null,
        street2: null,
        city: null,
        province: null,
        postalCode: null,
        country: 'USA',
        type: 'BILLING'
      },
      username: {
        loading: false,
        success: false,
        error: null,
        email: this.$store.state.member.contacts[0].emails[0].email
      },
      email: {
        loading: false,
        success: false,
        error: null,
        email: this.$store.state.member.contacts[0].emails[0].email,
        id: this.$store.state.member.contacts[0].emails[0].id
      },
      password: {
        loading: false,
        success: false,
        error: null,
        oldPassword: null,
        newPassword: null
      },
      rules,
      settings: {}
    }
  },
  methods: {
    async checkAvailability() {
      const { data: { isUsernameAvailable } } = await this.$apollo.query({
        query: USERNAME_AVAILABLE,
        variables: {
          input: { tenantId, username: this.username.email }
        }
      })
      return isUsernameAvailable === false ? 'Email is already taken' : true
    },
    async update(section) {
      if (!this.$refs[section].validate()) {
        this[section].error = 'Fix the errors above to update your info'
        await delay(2000)
        this[section].error = null
        return
      }
      try {
        this[section].loading = true
        const memberId = this.$store.state.member.id
        const contactId = this.$store.state.member.contacts[0].id
        await profileMap[section](this.$apollo, this[section], this.$store, memberId, contactId)
        this[section].loading = false
        this[section].success = 'Update Successful'
        await delay(3000)
        this[section].success = null
      } catch (e) {
        console.error(e)
        this[section].loading = false
        this[section].error = 'Update Failed'
        await delay(3000)
        this[section].error = null
      }
    }
  },
  computed: {
    ...mapGetters({
      locale: 'locale'
    })
  },
  apollo: {
    address() {
      return {
        query: GET_ADDRESS,
        variables: {
          input: { tenantId, contactId: this.$store.state.member.contacts[0].id }
        },
        update({ addressByContactOrTenant }) {
          return { ...this.address, ...addressByContactOrTenant[0] }
        }
      }
    },
    phoneNumber() {
      return {
        query: GET_PHONE,
        variables: {
          input: { tenantId, contactId: this.$store.state.member.contacts[0].id }
        },
        update({ phoneNumberByContact }) {
          const { id, number: phoneNumber } = phoneNumberByContact[0]
          return { ...this.phoneNumber, id, phoneNumber }
        }
      }
    },
    settings: {
      query: SETTINGS,
      update({ allLegalLocales, allTimezones, allLanguages }) {
        return {
          legalLocales: allLegalLocales.nodes,
          timezones: allTimezones.nodes,
          languages: allLanguages.nodes
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
