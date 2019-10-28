<template>
  <div class="login">
    <NaativHeader alt hideLogin/>
    <v-card
      class="pa-2 login-card"
      >
      <v-card-text class="centered white">
        <v-form ref="loginForm" @submit.prevent="login">
          <v-alert
            v-if="error"
            type="error"
            :value="error">
            {{error.message || error}}
          </v-alert>
          <v-alert type="error" :value="true" v-if="!$browser.supported">
            {{$t($browser.invalidMessage)}}
          </v-alert>
          <div>
            <v-text-field
              data-cy="Username"
              :label="$t('form.email')"
              v-model="username"
              :rules="rules.required"
            />
            <v-text-field
              data-cy="Password"
              name="password"
              :label="$t('form.password')"
              v-model="password"
              :rules="rules.required"
              type="password"
            />
            <div>
              <v-btn
                data-cy="Login"
                color="#00d3e6"
                depressed
                round
                large
                class="text-capitalize white--text font-weight-black"
                type="submit"
                :loading="loading"
              >{{$t('login.login')}}</v-btn>
            </div>
            <i18n path="login.register" tag="small">
              <router-link :to="{name: 'Prelaunch', query: $route.query}" >{{$t('login.here')}}</router-link>
            </i18n>
            <br/>
            <i18n path="login.forgot.password" tag="small">
              <router-link :to="{name: 'Forgot My Password', query: $route.query}">{{$t('login.here')}}</router-link>
            </i18n>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import NaativHeader from '@/components/Header.vue'
import { rules } from '@/utils/Validation'
import { Actions } from '@/store'
const tenantId = ~~process.env.VUE_APP_TENANT_ID

export default {
  name: 'Home',
  components: {
    NaativHeader
  },
  data() {
    return {
      error: null,
      disabled: false,
      loading: false,
      username: '',
      password: '',
      rules,
      slug: ''
    }
  },
  mounted() {
    if (this.$route.query.slug) {
      this.slug = this.$route.query.slug
    }
  },
  computed: {
    returnTo() {
      return this.$route.query.returnTo
    }
  },
  methods: {
    async login() {
      this.loading = true
      this.error = null
      if (this.$refs.loginForm.validate()) {
        try {
          const { success } = await this.$store.dispatch(Actions.LOGIN, {
            username: this.username,
            password: this.password,
            tenantId
          })
          if (success && this.slug) {
            this.$router.push('/teacher/' + this.slug)
          } else if (success && this.returnTo) {
            this.$router.push(this.returnTo)
          } else if (success) {
            this.$router.push('/homeroom/dashboard')
          } else {
            this.error = 'Invalid Username/Password'
          }
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
.login-card
  background-color transparent
  box-shadow 14px 14px 10px -1px rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 1px 3px 0 rgba(0,0,0,0.12)
  padding 0!important
  position absolute
  top 50%
  left 50%
  transform translate(-50%, -50%)
  width 100%
  max-width 500px

  &::before
    content: ''
    position absolute
    z-index -1
    height 130px
    width 228px
    background-image url('../assets/images/blue-grid.png')
    top -50px
    left -60px
    animation bluemotion 12s ease-in-out infinite
  &::after
    content: ''
    position absolute
    z-index -1
    height 130px
    width 228px
    background-image url('../assets/images/yellow-grid.png')
    bottom -60px
    right -70px
    animation greenmotion 12s ease-in-out infinite

  .white
    background-color #ffffff

@keyframes bluemotion
  0%
    top -50px

  50%
    top -70px

  100%
    top -50px

@keyframes greenmotion
  0%
    bottom -60px

  50%
    bottom -80px

  100%
    bottom -60px

</style>
