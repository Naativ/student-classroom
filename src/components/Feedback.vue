<template>
  <v-card width="100%" class="full-height full-center centered">
    <v-layout class="layout" column justify-space-around align-center >
      <img src="../assets/images/logo-alt.svg" class="logo"/>
      <v-alert type="error" :value="error">{{error}}</v-alert>
      <v-card-title class="headline" primary-title wrap style="justify-content: center">
        {{$t('feedback.header')}}
      </v-card-title>
      <v-card-text>
        <v-form ref="feedback">
          <template v-for="(section, index) in feedbackModel">
            <v-textarea
              :key="index"
              v-if="section.type === 'textArea'"
              :label="$t(section.description)"
              :rules="rules.required"
              v-model="values[section.key]"
              solo
            />
            <v-rating
              v-if="section.type === 'rating'"
              :key="index"
              :description="$t(section.description)"
              :rules="rules.required"
              v-model="values[section.key]"
              :hover="true"
              half-icon="$vuetify.icons.ratingHalf"
              half-increments
              color="yellow darken-3"
              background-color="blue lighten-3"
              class="rating"
              size="40px"
            />
          </template>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-layout column>
          <v-btn
            class="primary text-capitalize"
            round
            large
            @click="submit"
            :loading="loading"
          >
            {{$t('feedback.submit')}}
          </v-btn>
          <h4 v-if="loading">{{$t('feedback.redirect.home')}}</h4>
        </v-layout>
      </v-card-actions>
    </v-layout>
  </v-card>
</template>

<script>
import { UPSERT_RATING } from '@/graphql/Rating.js'
import { initialFeedback } from '@/utils/Feedback'
import { rules } from '@/utils/Validation'

import { mapGetters, mapState, mapActions } from 'vuex'
import * as LearningProfileStore from '@/LearningProfile/Store'
import * as MemberStore from '@/utils/member/MemberStore'

const { Getters: LearningProfileGetters } = LearningProfileStore

export default {
  name: 'Feedback',
  props: {
    appointment: Object,
    booking: Object
  },
  data() {
    return {
      error: null,
      feedbackModel: initialFeedback,
      loading: false,
      rules,
      values: {
        overall_experience: 0
      }
    }
  },
  computed: {
    ...mapGetters({
      profile: LearningProfileGetters.profile
    }),
    ...mapState({
      balance: state => state.MemberStore.balance
    })
  },
  methods: {
    ...mapActions({
      getBalance: MemberStore.Actions.MEMBER_BALANCE
    }),
    async submit() {
      this.error = null
      if (this.$refs.feedback.validate()) {
        this.loading = true
        try {
          await this.$apollo.mutate({
            mutation: UPSERT_RATING,
            variables: {
              input: {
                appointmentId: this.appointment.id,
                score: this.values.overall_experience,
                comment: this.values.additional_comments
              }
            }
          })
          this.loading = false
          if (this.booking.type.name === 'Conversation') {
            if (this.balance < 1) {
              this.$router.push('/homeroom/dashboard')
            } else {
              this.$emit('rebook')
            }
          } else {
            if (this.balance < 2) {
              this.$router.push('/homeroom/dashboard')
            } else {
              this.$emit('rebook')
            }
          }
        } catch (e) {
          this.loading = false
          this.error = this.$t('feedback.form.error')
        }
      } else {
        this.error = this.$t('feedback.form.error')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.logo {
  width: 300px;
}
.layout {
  height: 100%;
  max-width: 500px;
  margin: auto;
}
.rating {
  padding-bottom: 75px;
}

</style>
