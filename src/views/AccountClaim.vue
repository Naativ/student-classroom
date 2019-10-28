<template>
  <v-content>
    <LanguageSelector :dark="false"/>
    <v-container>
      <v-card>
        <v-alert v-if="tokenIsValid" type="error" :value="error">
          {{$t('registration.error')}}
        </v-alert>
        <v-card class="pa-5" v-if="!tokenIsValid" type="error" :value="error">
          <v-layout row justify-center>
            <img src="@/assets/images/logo-alt.svg" width="30%"/>
          </v-layout>
          <v-layout class="pt-3" justify-space-around align>
            <i18n path="claim.token.invalid" tag="h2">
              <a place="resendLink" @click="resendClaimEmail">
               {{ $t('dashboard.verify.email.link') }}
              </a>
            </i18n>
          </v-layout>
        </v-card>
        <v-container v-if="loading && !submitted && tokenIsValid">
          <v-layout row justify-center>
            <Loading />
          </v-layout>
          <h2 class="centered">{{$t("claim.email.verify")}}</h2>
        </v-container>
        <v-container v-if="!loading && !submitted && tokenIsValid">
          <v-layout row justify-center>
            <img src="@/assets/images/logo-alt.svg" width="30%"/>
          </v-layout>
          <h2 class="centered">{{$t('claim.origin.verify')}}</h2>
          <v-autocomplete
            v-model="legalLocaleId"
            :label="$t('form.country.citizenship')"
            persistent-hint
            :hint="$t('form.country.citizenship.hint')"
            :rules="rules.required"
            :items="settings.legalLocales"
            item-text="name"
            item-value="id"
            tabindex="13"
          >
            <template slot="item" slot-scope="{ item }">
              {{$t(item.code)}}
            </template>
            <template slot="selection" slot-scope="{ item }">
              {{$t(item.code)}}
            </template>
          </v-autocomplete>
          <v-layout row justify-center>
            <v-btn
              depressed
              round
              large
              class="primary text-capitalize"
              @click="onConfirm"
              :disabled="loading"
              :loading="loading"
            >
              {{$t('claim.email.verify.action')}}
            </v-btn>
          </v-layout>
        </v-container>
        <v-container v-if="!loading && submitted">
          <v-layout row justify-center>
            <img src="@/assets/images/logo-alt.svg" width="30%"/>
          </v-layout>
          <h2 class="centered">{{$t("claim.email.verify.success")}}</h2>
          <h2 class="centered">{{$t("claim.email.redirect")}}</h2>
        </v-container>
      </v-card>
    </v-container>
  </v-content>
</template>

<script>
import { SETTINGS } from '@/graphql/Settings.gql.js'
import { CLAIM_ACCOUNT } from '@/graphql/Iam.gql.js'

import Loading from '@/components/Loading.vue'
import { rules } from '@/utils/Validation.js'
import { delay } from '@/utils/Helpers.js'
import { Actions } from '@/store'

import LanguageSelector from '@/components/LanguageSelector.vue'

const claimTemplateId = process.env.VUE_APP_CLAIM_TEMPLATE_ID
const tenantId = ~~process.env.VUE_APP_TENANT_ID

export default {
  name: 'AccountClaim',
  components: {
    Loading,
    LanguageSelector
  },
  data() {
    return {
      error: null,
      legalLocaleId: null,
      loading: true,
      rules,
      settings: {},
      submitted: false,
      tokenIsValid: true
    }
  },
  methods: {
    async onConfirm() {
      const [timezone] = this.settings.timezones.filter(
        _ => _.name === Intl.DateTimeFormat().resolvedOptions().timeZone
      )
      this.loading = true
      this.error = null
      try {
        await this.$apollo.mutate({
          mutation: CLAIM_ACCOUNT,
          variables: {
            claimToken: {
              timezoneId: timezone.id,
              legalLocaleId: this.legalLocaleId,
              simpleClaim: true,
              token: this.$route.params.token
            }
          }
        })
        this.submitted = true
      } catch (e) {
        this.error = `There was an error claiming your account: ${e}`
        if (e.message.includes('is not valid')) {
          this.tokenIsValid = false
        }
      }

      await delay(1000)
      this.loading = false
      if (!this.error) {
        await delay(2000)
        this.$router.push({ name: 'Dashboard' })
      }
    },
    async resendClaimEmail() {
      try {
        await this.$store.dispatch(Actions.GENERATE_TOKEN, {
          tenantId,
          type: 'claim',
          templateId: claimTemplateId
        })
      } catch (e) {
        this.error = e.message || e
      }
    }
  },
  apollo: {
    settings: {
      query: SETTINGS,
      update({ allLegalLocales, allTimezones, allLanguages }) {
        this.availableCountries = allLegalLocales.nodes
        this.loading = false
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
