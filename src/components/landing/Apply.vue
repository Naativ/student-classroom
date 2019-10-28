<template>
  <v-dialog
    v-model="dialog"
    width="350">
    <template slot="activator">
      <v-btn
        depressed
        color="#ffac2a"
        dark
        class="text-capitalize"
        data-cy="Apply For Free"
        >{{$t('apply.for.free')}}
      </v-btn>
    </template>
    <v-card class="pa-4">
      <v-icon style="float: right;" @click="dialog = false">close</v-icon>
      <v-form style="clear: both;" class="registration-form" ref="registration" @submit.prevent="register">
        <v-alert type="error" :value="error">
          {{ error }}
        </v-alert>
        <v-alert type="error" :value="true" v-if="!$browser.supported">
          {{$t($browser.invalidMessage)}}
        </v-alert>
        <v-text-field
          data-cy="Registration Name"
          name="name"
          :rules="rules.required"
          :label="$t('form.name')"
          v-model.trim="registration.name"/>
        <v-text-field
          data-cy="Registration Phone"
          name="phone"
          :rules="rules.required"
          :label="$t('form.phone')"
          v-model.trim="registration.phoneNumber.phoneNumber"/>
        <v-text-field
          data-cy="Registration Email"
          name="email"
          :rules="rules.email"
          :label="$t('form.email')"
          v-model.trim="registration.email"/>
        <v-text-field
          data-cy="Registration Password"
          name="password"
          :rules="rules.password"
          type="password"
          :label="$t('form.password')"
          v-model="registration.password"/>
        <v-text-field
          name="referral code"
          :label="$t('form.referral.code')"
          v-model.trim="referralCode"/>
        <v-btn
          data-cy="Sign Up"
          depressed
          color="#ffac2a"
          dark
          block
          class="text-capitalize"
          :loading="loading"

          type="submit">
            {{$t('prelaunch.signup.register')}}
          </v-btn>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Mutations, Actions } from '@/store'
import { rules } from '@/utils/Validation.js'
import { createMember } from '@/utils/RegistrationService.js'

export default {
  name: 'Apply',
  data() {
    return {
      dialog: false,
      error: null,
      registration: {
        name: null,
        phoneNumber: {
          phoneNumber: null,
          type: 'CELL'
        },
        email: null,
        password: null
      },
      loading: false,
      referralCode: null,
      rules
    }
  },
  methods: {
    ...mapMutations({
      setJwt: Mutations.SET_JWT,
      setMember: Mutations.SET_MEMBER
    }),
    ...mapActions({
      generateToken: Actions.GENERATE_TOKEN,
      setMemberAttribute: Actions.SET_MEMBER_ATTRIBUTE
    }),
    async register() {
      this.error = null
      if (this.$refs.registration.validate()) {
        this.loading = true

        try {
          const { token, member } = await createMember({
            ...this.registration,
            languageId: this.locale.current.id,
            displayName: this.registration.name
          })

          this.setJwt(token)
          this.setMember(member)
          await this.generateToken({
            type: 'claim',
            templateId: this.$t('system.claim.template.id')
          })
          try {
            await this.setMemberAttribute({
              key: 'registration-details',
              value: {
                systemLocale: navigator.language,
                slug: this.slug,
                id: this.id
              }
            })
          } catch (e) {
            console.log('There was an error saving the referral ID')
          }
          if (this.referralCode) {
            try {
              await this.setMemberAttribute({
                key: 'registration-referral-code',
                value: { code: this.referralCode }
              })
            } catch (e) {
              console.log('There was an error saving the referral ID')
            }
          }
          this.loading = false
          this.$router.push('/homeroom/dashboard')
        } catch (e) {
          this.loading = false
          console.log(e)
          if (e.message.indexOf('is already registered') > 0) {
            this.error = this.$t('registration.error.already.registered', [this.registration.email])
          } else {
            this.error = this.$t('registration.error')
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      locale: 'locale'
    })
  }
}
</script>
