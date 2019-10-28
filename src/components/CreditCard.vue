<template>
  <form @submit.prevent="getToken">
    <v-alert :value="error" type="error">
      {{error}}
    </v-alert>
    <v-layout row wrap>
      <v-flex xs12 class="stripe-element px-1">
        <div class="field">
          <card-number
            id="card-number"
            class="input card-number"
            :class="ccClass"
            ref="cardNumber"
            :stripe="stripeKey"
            :options="stripeOptions"
          />
          <label for="card-number">{{$t('form.credit.card')}}</label>
          <div class="baseline"></div>
        </div>
      </v-flex>
      <v-flex xs12 sm6 class="stripe-element px-1">
        <div class="field">
          <div id="card-expiry" class="input" :class="expClass">
            <card-expiry
              class='stripe-element card-expiry'
              ref='cardExpiry'
              :stripe='stripeKey'
              :options='stripeOptions'
            />
          </div>
          <label for="card-expiry">{{$t('form.credit.card.expiration')}}</label>
          <div class="baseline"></div>
        </div>
      </v-flex>
      <v-flex xs12 sm6 class="stripe-element px-1">
        <div class="field">
          <div id="card-cvc" class="input" :class="cvcClass">
            <card-cvc
              class='stripe-element card-cvc'
              ref='cardCvc'
              :stripe='stripeKey'
              :options='stripeOptions'
            />
          </div>
          <label for="card-cvc">{{$t('form.credit.card.cvc')}}</label>
          <div class="baseline"></div>
        </div>
      </v-flex>
      <v-flex xs12>
        <v-text-field :label="$t('form.referral.code')" v-model="couponLower" @keyup="updateCoupon"/>
      </v-flex>
      <v-flex xs12 sm6 class="stripe-element px-1">
        <v-btn
          data-cy="Purchase Subscription"
          :loading="loading || loadingCoupon"
          :disabled="loading || loadingCoupon"
          type="submit"
          color="#00d3e6"
          large
          depressed
          round
          class="text-capitalize white--text">
          {{$t('dashboard.prelaunch.action')}}
        </v-btn>
      </v-flex>
    </v-layout>
  </form>
</template>

<script>
import { CardNumber, CardExpiry, CardCvc, createToken } from 'vue-stripe-elements-plus'
import { Actions } from '@/store'
const stripeKey = process.env.VUE_APP_STRIPE_KEY

export default {
  name: 'CreditCardForm',
  components: {
    CardNumber,
    CardExpiry,
    CardCvc
  },
  props: ['selectedPlan', 'discount', 'loadingCoupon'],
  data() {
    return {
      error: false,
      stripeKey,
      stripeData: null,
      verifyCreditCard: false,
      loading: false,
      creatingCharge: false,
      coupon: this.discount.integrationOid,
      ccClass: 'empty',
      expClass: 'empty',
      cvcClass: 'empty',
      stripeOptions: {
        classes: {
          focus: 'focused',
          empty: 'empty',
          invalid: 'invalid'
        },
        style: {
          base: {
            color: 'rgba(0,0,0,0.87)',
            fontWeight: 300,
            fontFamily: 'TTNorms, Helvetica, Arial, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            '::placeholder': {
              color: '#CFD7DF'
            },
            ':-webkit-autofill': {
              color: '#e39f48'
            }
          },
          invalid: {
            color: '#E25950',
            '::placeholder': {
              color: '#FFCCA5'
            }
          }
        }
      }
    }
  },
  methods: {
    updateCoupon() {
      this.$emit('couponUpdated', this.coupon)
    },
    async getToken() {
      this.loading = true
      try {
        if (!this.customer) {
          this.verifyCreditCard = true
          const stripeData = await createToken()
          this.verifyCreditCard = false
          this.creatingCharge = true
          this.customer = await this.$store.dispatch(Actions.CREATE_CUSTOMER, {
            stripeSource: stripeData.token.id,
            memberId: this.$store.state.member.id,
            contactId: this.$store.state.member.contacts[0].id
          })
        }
        await this.$store.dispatch(Actions.ADD_SUBSCRIPTION, {
          plan: this.selectedPlan.integrationOid,
          coupon: this.coupon,
          memberId: this.$store.state.member.id
        })
        if (this.coupon) {
          try {
            await this.$store.dispatch(Actions.SET_MEMBER_ATTRIBUTE, {
              key: 'purchase-referral-code',
              value: { code: this.coupon }
            })
          } catch (e) {
            console.log('There was an error saving the referral ID on purchase')
          }
        }
        this.$emit('subscriptionAdded')
        this.creatingCharge = false
        this.loading = false
      } catch (e) {
        this.loading = false
        this.error = e.message || e
      }
    }
  },
  computed: {
    couponLower: {
      get() {
        return this.coupon
      },
      set(val) {
        this.coupon = val.toLowerCase()
      }
    }
  }
}
</script>

<style lang="stylus">
.stripe-element .field {
  position: relative;
  width: 100%;
  height: 68px;
}

.stripe-element .baseline {
  position: absolute;
  width: 100%;
  height: 1px;
  left: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.42);
  transition: background-color 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.stripe-element:hover .baseline {
  background-color: rgba(0,0,0,1);
}

.stripe-element label {
  font-size: 14px;
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 30px;
  color: rgba(0,0,0,0.54);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: text;
}

.stripe-element .input {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  padding-bottom: 7px;
  color: #32325d;
  background-color: transparent;
}

.stripe-element .input::-webkit-input-placeholder {
  color: transparent;
  transition: color 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.stripe-element .input::-moz-placeholder {
  color: transparent;
  transition: color 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.stripe-element .input:-ms-input-placeholder {
  color: transparent;
  transition: color 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.stripe-element .input.empty .StripeElement {
  opacity: 1;
  transition: opacity 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  will-change: opacity;
}

.stripe-element .input.focused,
.stripe-element .input:not(.empty) {
  opacity: 1;
}

.stripe-element .input.focused::-webkit-input-placeholder,
.stripe-element .input:not(.empty)::-webkit-input-placeholder {
  color: #cfd7df;
}

.stripe-element .input.focused::-moz-placeholder,
.stripe-element .input:not(.empty)::-moz-placeholder {
  color: #cfd7df;
}

.stripe-element .input.focused:-ms-input-placeholder,
.stripe-element .input:not(.empty):-ms-input-placeholder {
  color: #cfd7df;
}

.stripe-element .input.focused + label,
.stripe-element .input:not(.empty) + label {
  color: #aab7c4;
  cursor: default;
}

.stripe-element .input.focused + label {
  color: #75cedf;
}

.stripe-element .input.invalid + label {
  color: #ffa27b;
}

.stripe-element .input.focused + label + .baseline {
  background-color: #75cedf;
}

.stripe-element .input.focused.invalid + label + .baseline {
  background-color: #e25950;
}

.stripe-element input{
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  border-style: none;
}

.stripe-element input:-webkit-autofill {
  -webkit-text-fill-color: #e39f48;
  transition: background-color 100000000s;
  -webkit-animation: 1ms void-animation-out;
}

.stripe-element .StripeElement--webkit-autofill {
  background: transparent !important;
}

.stripe-element input{
  -webkit-animation: 1ms void-animation-out;
}

.stripe-element input:active {
  background-color: #159570;
}
</style>
