<template>
  <div>
    <NaativHeader alt/>
    <v-card
      class="pa-2 reset-card"
      >
      <v-card-text class="centered white">
        <v-form ref="resetForm" @submit.prevent="reset">
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
              :rules="rules.email"
            />
            <v-text-field
              label="New Password"
              v-model="password"
              type="password"
              :rules="rules.password"
            />
            <v-text-field
              label="Confirm Password"
              v-model="confirmPassword"
              type="password"
              :rules="confirm"
            />
            <div>
              <v-btn
                v-if="!showLoginBtn"
                color="#00d3e6"
                depressed
                round
                large
                class="text-capitalize white--text font-weight-black"
                type="submit"
                :loading="loading"
              >
                Reset Password
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
          v-if="showLoginBtn"
          @click="login"
        >
          Return to Login
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import NaativHeader from '@/components/Header.vue'
import { Actions } from '@/store'
import { rules } from '@/utils/Validation'

export default {
  name: 'Reset Password',
  components: {
    NaativHeader
  },
  data() {
    return {
      confirm: [
        v => !!v || 'Field is required',
        v => v === this.password || 'Passwords do not match'
      ],
      error: null,
      success: null,
      loading: false,
      password: null,
      confirmPassword: null,
      username: this.$route.params.email || null,
      showLoginBtn: false,
      rules
    }
  },
  methods: {
    login() {
      window.location = '/login'
    },
    async reset() {
      this.loading = true
      this.error = null
      if (this.$refs.resetForm.validate()) {
        try {
          const { confirmPassword, password, username } = this
          const { token } = this.$route.params

          await this.$store.dispatch(Actions.RESET_PASSWORD, {
            password,
            confirmPassword,
            username,
            token
          })

          this.success = 'Password update successful! Try logging in now.'
          this.showLoginBtn = true
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
