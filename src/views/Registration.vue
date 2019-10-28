<template>
  <v-content>
    <NaativHeader :alt="true"/>
    <v-container class="register">
      <div>
        <span>
        <v-alert type="success" :value="success">
          {{$t('registration.success')}}
        </v-alert>
        <v-alert type="error" :value="errors.length > 0">
          <ul>
            <li v-for="error in errors" :key="error.message">
              {{ error.message || error }}
            </li>
          </ul>
        </v-alert>
        <v-alert type="error" :value="errors" v-if="!$browser.supported">{{$t($browser.invalidMessage)}}</v-alert>
        </span>
        <h2>{{$t('registration.title')}}</h2>
        <v-form
          class="registration"
          ref="registration"
          @submit.prevent="createAccount"
          lazy-validation>
          <div class="yellow-bubble"/>
          <v-layout row wrap>
            <v-layout row wrap v-if="flippedName">
              <v-flex xs12 sm6 px-1>
                <v-text-field
                  :label="$t('form.last.name')"
                  v-model.trim="applicant.lastName"
                  :rules="rules.required"
                  required
                  tabindex="1"
                />
              </v-flex>
              <v-flex xs12 sm6 px-1>
                <v-text-field
                  :label="$t('form.first.name')"
                  v-model.trim="applicant.firstName"
                  :rules="rules.required"
                  required
                  tabindex="2"
                />
              </v-flex>
            </v-layout>
            <v-layout row wrap v-else>
              <v-flex xs12 sm6 px-1>
                <v-text-field
                  :label="$t('form.first.name')"
                  v-model.trim="applicant.firstName"
                  :rules="rules.required"
                  required
                  tabindex="1"
                />
              </v-flex>
              <v-flex xs12 sm6 px-1>
                <v-text-field
                  :label="$t('form.last.name')"
                  v-model.trim="applicant.lastName"
                  :rules="rules.required"
                  required
                  tabindex="2"
                />
              </v-flex>
            </v-layout>
            <v-flex xs12>
              <v-text-field
                :label="$t('form.email')"
                v-model.trim="applicant.email"
                :rules="rules.email"
                :error-messages="usernameErrors"
                @change="checkAvailability()"
                tabindex="3"
              />
            </v-flex>
            <v-flex xs12 sm6 px-1>
              <v-text-field
                name="password"
                :label="$t('form.password')"
                :hint="$t('form.password.hint')"
                v-model="applicant.password"
                min="8"
                :rules="rules.password"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                @click:append="showPassword = !showPassword"
                counter
                tabindex="4"
              />
            </v-flex>
            <v-flex xs12 sm6 px-1>
              <v-text-field
                :label="$t('form.phone')"
                v-model.trim="applicant.phoneNumber.phoneNumber"
                :rules="rules.required"
                tabindex="5"
              />
            </v-flex>
            <v-layout row wrap v-show="showAddress">
              <v-flex xs12>
                <v-checkbox
                  color="#00d3e4"
                  v-model="showAddress"
                  :label="$t('form.address.manual')"
                />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  :label="$t('form.street.1')"
                  v-model.trim="applicant.address.street"
                  :rules="rules.required"
                  tabindex="6"
                />
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  :label="$t('form.street.2')"
                  v-model.trim="applicant.address.street2"
                  tabindex="7"
                />
              </v-flex>
              <v-flex xs12 sm4 px-1>
                <v-text-field
                  :label="$t('form.city')"
                  v-model.trim="applicant.address.city"
                  :rules="rules.required"
                  tabindex="8"
                />
              </v-flex>
              <v-flex xs12 sm4 px-1>
                <v-text-field
                  :label="$t('form.province')"
                  v-model.trim="applicant.address.province"
                  :rules="rules.required"
                  tabindex="9"
                />
              </v-flex>
              <v-flex xs12 sm4 px-1>
                <v-text-field
                  :label="$t('form.postal.code')"
                  v-model.trim="applicant.address.postalCode"
                  tabindex="10"
                />
              </v-flex>
            </v-layout>
            <v-layout row wrap v-show="!showAddress">
              <v-flex xs12 sm10 px-1>
                <AutocompleteInput @selected="updateApplicant" tabindex="6"/>
              </v-flex>
              <v-flex xs12 sm2 px-1>
                <v-checkbox
                  color="#00d3e4"
                  v-model="showAddress"
                  :label="$t('form.address.manual')"
                />
              </v-flex>
            </v-layout>
            <v-flex xs12>
              <v-text-field
                :label="$t('form.referral.code')"
                v-model.trim="referralCode"
                tabindex="11"
              />
            </v-flex>
            <v-flex xs12>
              <v-select
                v-model="applicant.address.country"
                :label="$t('form.country')"
                :rules="rules.required"
                :items="availableCountries"
                item-text="name"
                item-value="code"
                tabindex="12"
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
              </v-select>
            </v-flex>
            <v-flex xs12>
              <v-select
                v-model="applicant.legalLocaleId"
                :label="$t('form.country.citizenship')"
                persistent-hint
                :hint="$t('form.country.citizenship.hint')"
                :rules="rules.required"
                :items="settings.legalLocales"
                item-text="name"
                item-value="id"
                tabindex="13"
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
              </v-select>
            </v-flex>
            <v-flex xs12>
              <v-btn
                color="#00d3e6"
                depressed
                round
                large
                class="text-capitalize white--text font-weight-black"
                type="submit"
                :loading="loading"
              >{{$t('form.create.account')}}</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </div>
    </v-container>
  </v-content>
</template>
<script>
import get from 'lodash.get'
import { rules } from '@/utils/Validation.js'
import NaativHeader from '@/components/Header.vue'
import AutocompleteInput from '@/components/AutocompleteInput.vue'
import { Mutations, Actions } from '@/store'
import { mapGetters } from 'vuex'

import { CREATE_MEMBER } from '@/graphql/Member.js'
import { SETTINGS } from '@/graphql/Settings.gql.js'
import { USERNAME_AVAILABLE } from '@/graphql/Iam.gql.js'

const tenantId = ~~process.env.VUE_APP_TENANT_ID
const defaultPostalCode = '00000'

export default {
  name: 'Registration',
  components: {
    AutocompleteInput,
    NaativHeader
  },
  data() {
    return {
      disabled: [],
      accepted: false,
      acceptedPP: false,
      applicant: {
        password: null,
        firstName: null,
        lastName: null,
        email: null,
        languageId: 1,
        legalLocaleId: 0,
        phoneNumber: {
          phoneNumber: null,
          type: 'CELL'
        },
        address: {
          street: null,
          street2: null,
          city: null,
          province: null,
          postalCode: null,
          country: null,
          type: 'BILLING'
        },
        tags: ['guardian']
      },
      autocompleteAddress: {},
      availableCountries: [],
      checkingUsername: false,
      errors: [],
      flippedName: process.env.VUE_APP_FLIPPED_NAME || false,
      loading: false,
      referralCode: null,
      rules,
      settings: {},
      success: false,
      showAddress: false,
      showPassword: false,
      usernameErrors: []
    }
  },
  methods: {
    async createAccount() {
      this.errors = []

      if (this.$refs.registration.validate()) {
        this.success = false
        this.loading = true

        // Find Timezone
        const [timezone] = this.settings.timezones.filter(
          _ => _.name === Intl.DateTimeFormat().resolvedOptions().timeZone
        )
        let name = `${this.applicant.firstName} ${this.applicant.lastName}`
        if (process.env.VUE_APP_FLIPPED_NAME) {
          name = `${this.applicant.lastName} ${this.applicant.firstName}`
        }
        this.applicant.address.name = name
        if (!this.applicant.address.postalCode) {
          this.applicant.address.postalCode = defaultPostalCode
        }
        const member = {
          ...this.applicant,
          tenantId,
          displayName: name,
          name,
          slug: name.replace(' ', ''),
          timezoneId: timezone.id,
          templateId: this.$t('system.registration.template.id'),
          typeId: 1001,
          // need to figure out language id
          languageId: this.locale.current.id
        }
        try {
          const {
            data: { register }
          } = await this.$apollo.mutate({
            mutation: CREATE_MEMBER,
            variables: { member }
          })
          this.$store.commit(Mutations.SET_JWT, register.token)
          this.$store.commit(Mutations.SET_MEMBER, register.member)
          await this.$store.dispatch(Actions.GENERATE_TOKEN, {
            tenantId,
            type: 'claim',
            templateId: this.$t('system.claim.template.id')
          })
          if (this.referralCode) {
            try {
              await this.$store.dispatch(Actions.SET_MEMBER_ATTRIBUTE, {
                key: 'registration-referral-code',
                value: { code: this.referralCode }
              })
            } catch (e) {
              console.log('There was an error saving the referral ID')
            }
          }
          this.success = true
          this.loading = false
          this.$router.push('/homeroom/dashboard')
        } catch (e) {
          this.success = false
          this.loading = false
          // this.errors.push(e)
          // TODO: This is just a band aid until we get schema stitching errors working
          this.showAddress = true
          this.errors.push(this.$t('registration.error'))
        }
      }
    },
    async checkAvailability() {
      this.checkingUsername = true
      const { data: { isUsernameAvailable } } = await this.$apollo.query({
        query: USERNAME_AVAILABLE,
        variables: { input: { tenantId, username: this.applicant.email } }
      })

      this.usernameErrors = isUsernameAvailable === false
        ? [this.$t('form.email.taken')]
        : []
      this.checkingUsername = false
    },
    updateApplicant(address) {
      this.autocompleteAddress = get(address, '_raw')
      this.applicant.address.street = get(address, 'street')
      this.applicant.address.city = get(address, 'city')
      this.applicant.address.province = get(address, 'province')
      this.applicant.address.postalCode = get(address, 'postalCode')
    }
  },
  computed: {
    ...mapGetters({
      locale: 'locale'
    })
  },
  apollo: {
    settings: {
      query: SETTINGS,
      update({ allLegalLocales, allTimezones, allLanguages }) {
        this.availableCountries = allLegalLocales.nodes
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
.register {
  padding-top: 125px;
  max-width: 850px;
  margin: auto;
}

.registration {
  background-color: #ffffff;
  padding: 10px;
  position: relative;
}

.yellow-bubble {
  position: absolute;
  z-index: 100;
  width: 130px;
  height: 79px;
  background-image: url('../assets/images/yellow-bubble.png');
  animation: yellowmotion 12s ease-in-out infinite;
  right: -25px;
}

@keyframes yellowmotion {
  0% {
    bottom: -5px;
  }

  50% {
    bottom: -25px;
  }

  100% {
    bottom: -5px;
  }
}
</style>
