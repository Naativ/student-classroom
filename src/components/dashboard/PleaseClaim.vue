<template>
  <div class="text-xs-center">
    <v-dialog v-model="showDialog" width="500">
      <v-card>
        <v-card-title class="headline primary" primary-title>
          {{$t('dashboard.please.claim.account.title')}}
        </v-card-title>
        <v-card-text>
          <v-alert :value="error" type="error">{{error}}</v-alert>
          <v-alert :value="success" type="success">{{success}}</v-alert>
          <i18n path="dashboard.please.claim.account.text" tag="p">
            <a place="resendLink" @click="resendClaimEmail">
              {{ $t('dashboard.verify.email.link') }}
            </a>
          </i18n>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Actions } from '@/store'

const tenantId = ~~process.env.VUE_APP_TENANT_ID
const claimTemplateId = process.env.VUE_APP_CLAIM_TEMPLATE_ID

export default {
  name: 'ProfileDialog',
  props: ['show'],
  data() {
    return {
      success: null,
      error: null
    }
  },
  methods: {
    async resendClaimEmail() {
      try {
        await this.$store.dispatch(Actions.GENERATE_TOKEN, {
          tenantId,
          type: 'claim',
          templateId: claimTemplateId
        })
        this.success = this.$t('dashboard.verify.email.sent.success')
      } catch (e) {
        this.error = e.message || e
      }
    }
  },
  computed: {
    showDialog: {
      get() { return this.show },
      set() { return this.$emit('closeDialog') }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
