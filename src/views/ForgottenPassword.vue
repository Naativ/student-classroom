<template>
  <div>
    <NaativHeader alt/>
    <v-card
      class="pa-2 reset-card"
      >
      <v-card-text class="centered white">
        <v-form ref="forgotForm" @submit.prevent="send">
          <v-alert
            v-if="error"
            type="error"
            :value="error">
            {{error.message || error}}
          </v-alert>
          <v-alert
            v-if="success"
            type="success"
            :value="success">
            {{success}}
          </v-alert>
          <div>
            <h5>Reset Your Password</h5>
            <v-text-field
              label="Email"
              v-model="username"
              :rules="rules.required"
            />
            <div>
              <v-btn
                v-if="!emailSent"
                color="#00d3e6"
                depressed
                round
                large
                class="text-capitalize white--text font-weight-black"
                type="submit"
                :loading="loading"
              >
                Send Email
              </v-btn>
            </div>
          </div>
        </v-form>
        <v-btn
          color="#00d3e6"
          depressed
          round
          large
          class="text-capitalize white--text font-weight-black"
          v-if="emailSent"
          @click="home"
        >
          Return to Home Page
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import NaativHeader from '@/components/Header.vue'
import { Actions } from '@/store'
import { rules } from '@/utils/Validation'
const tenantId = ~~process.env.VUE_APP_TENANT_ID
const passwordResetTemplateId = process.env.VUE_APP_PASSWORD_RESET_TEMPLATE_ID

export default {
  name: 'Forgot Password',
  components: {
    NaativHeader
  },
  data() {
    return {
      emailSent: false,
      error: null,
      success: null,
      loading: false,
      username: '',
      rules
    }
  },
  methods: {
    home() {
      window.location = '/'
    },
    async send() {
      this.loading = true
      this.error = null
      if (this.$refs.forgotForm.validate()) {
        try {
          await this.$store.dispatch(Actions.GENERATE_TOKEN, {
            email: this.username,
            tenantId,
            type: 'reset',
            templateId: passwordResetTemplateId
          })
          this.success = 'Success! Check your email and follow the instructions provided to reset your password.'
          this.emailSent = true
        } catch (e) {
          this.loading = false
          this.error = e
        }
      }
      this.loading = false
    }
  }
}
</script>
<style lang="stylus" scoped>
.reset-card {
  background-color: transparent;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 500px;

  .white {
    background-color: #ffffff;
  }
}
</style>
