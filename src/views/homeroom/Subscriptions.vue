<template>
  <div class="subscriptions">
    <h1>{{$t('subscriptions.title')}}</h1>
    <v-card class="offers">
      <v-card-text class="pb-4">
        <p class="offers-title">{{$t('dashboard.prelaunch.description.items')}}</p>
        <v-layout justify-center row fill-height wrap>
          <v-flex xs12 sm4 :class="{'offer-border': $vuetify.breakpoint.smAndUp}">
            <ul>
              <li v-for="i in 4" :key="i">
                <v-icon color="yellow">check</v-icon> {{$t(`home.section.3.card.${i}`)}}
              </li>
            </ul>
          </v-flex>
          <v-flex xs12 sm4>
            <ul>
              <li v-for="i in 3" :key="i">
                <v-icon color="yellow">check</v-icon> {{$t(`home.section.3.card.${i+4}`)}}
              </li>
            </ul>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <br/>
    <v-layout v-if="loading" row justify-center>
      <v-progress-circular indeterminate size="64"/>
    </v-layout>
    <div v-if="!loading && subscriptions.length === 0">
      <plans-table :plans="availablePlans" @planSelected="planSelected" :selectedPlan="selectedPlan" :discount="coupon">
        <template v-slot:header>
          <h3>{{$t('subscriptions.available.plans')}}</h3>
        </template>
        <template v-slot:footer>
          <v-dialog max-width="600px" persistent v-model="purchaseDialog">
            <v-btn
              data-cy="Subscription Purchase Subscription"
              class="primary text-capitalize"
              flat
              large
              round
              slot="activator"
            >
              {{selectedPlan ? $t('dashboard.prelaunch.action') : $t('subscriptions.select.plan')}}
            </v-btn>
            <v-card>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">
                    {{$t('dashboard.prelaunch.action')}}
                  </h3>
                </div>
              </v-card-title>
              <v-card-text>
                <p v-if="selectedPlan && coupon.integrationOid">
                  <span class="old-amount">{{$t('subscriptions.plan.price')}}: {{formatAmount(selectedPlan.amount, selectedPlan.currency)}}</span>
                  <br/>
                  <span class="discount">{{$t('subscriptions.plan.price')}}: {{discountAmount(selectedPlan.amount, selectedPlan.currency)}}</span>
                </p>
                <p v-else-if="selectedPlan">{{$t('subscriptions.plan.price')}}: {{formatAmount(selectedPlan.amount, selectedPlan.currency)}}</p>
                <CreditCard
                  @subscriptionAdded="subscriptionAdded"
                  :selectedPlan="selectedPlan"
                  :discount="coupon"
                  @couponUpdated="lookupCoupon"
                  :loadingCoupon="loadingCoupon"
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  flat
                  @click.native="purchaseDialog = false"
                >
                  {{$t('dashboard.prelaunch.action.cancel')}}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </plans-table>
    </div>
    <div v-else-if="!loading && subscriptions.length > 0">
      <plans-table :plans="[subscriptions[0].plan]" :selectedPlan="subscriptions[0].plan" :discount="coupon">
        <template v-slot:header>
          <h3>{{$t('subscriptions.current')}}</h3>
        </template>
        <template v-slot:footer>
          <v-flex class="text-xs-center">
            <v-btn @click="cancelClick" small style="cursor: pointer;">{{$t('subscriptions.cancel')}}</v-btn>
          </v-flex>
          <!-- <small style="cursor: pointer;" @click="cancel(subscriptions[0])">{{$t('subscriptions.cancel')}}</small> -->
        </template>
      </plans-table>
    </div>
    <v-dialog max-width="585px" v-model="showCancelSubDialog">
      <v-card>
        <v-card-text class="headline text-xs-center dialog-headline">Cancel Subscription?</v-card-text>
        <v-card-text class="dialog-msg" style="line-height: 2; max-width: 76%; margin: auto">
          <div style="font-weight: 500;">Cancellation will result in the following:</div>
          <br>
          <ul>
            <li>Your subscription will not be renewed at the next billing period</li>
            <li>Any unspent tokens will remain available</li>
            <li>Access to the Library will be <span style="font-style: italic;">immediately</span> revoked</li>
          </ul>
          <br>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn :loading="loading" color="blue darken-1" flat @click="showCancelSubDialog = false">Close</v-btn>
          <v-btn :disabled="loading" color="blue darken-1" flat @click="cancel(subscriptions[0])">Cancel Subscription</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog max-width="585px" v-model="successDialog.show" id="success-fail-dialog">
      <v-card>
        <v-card-text class="headline dialog-headline text-xs-center">{{successDialog.headline}}</v-card-text>
        <v-card-text class="dialog-msg text-xs-center">{{successDialog.msg}}</v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn data-cy="Close Subscription Dialog" :loading="loading" color="blue darken-1" flat @click="successDialog.show = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CreditCard from '@/components/CreditCard.vue'
import { mapActions, mapGetters } from 'vuex'
import { Actions, Getters } from '@/Subscriptions/Store.js'
import { Actions as GlobalActions } from '@/store.js'
import PlansTable from '@/Subscriptions/PlanTable.vue'

const globalDiscount = process.env.VUE_APP_DISCOUNT_CODE

export default {
  name: 'Subscriptions',
  components: {
    CreditCard,
    PlansTable
  },
  async mounted() {
    this.loading = true
    await this.getPlans()
    const referralCode = await this.getMemberAttr('registration-referral-code')
    let code = globalDiscount
    if (referralCode && referralCode.value) {
      code = referralCode.value.code
    }
    if (code) {
      await this.lookupCoupon(code)
    }
    this.loading = false
  },
  data() {
    return {
      coupon: {},
      loading: false,
      loadingCoupon: false,
      purchaseDialog: false,
      selectedPlan: null,
      showCancelSubDialog: null,
      successDialog: {
        headline: '',
        msg: '',
        show: false
      }
    }
  },
  methods: {
    ...mapActions({
      getPlans: Actions.GET_PLANS,
      getCoupon: Actions.GET_COUPON,
      getSubscriptions: Actions.GET_SUBSCRIPTIONS,
      removeSubscription: Actions.REMOVE_SUBSCRIPTION,
      getMemberAttr: GlobalActions.GET_MEMBER_ATTRIBUTE
    }),
    async lookupCoupon(code) {
      this.loadingCoupon = true
      const tempCoupon = await this.getCoupon(code)
      if (tempCoupon) {
        this.coupon = tempCoupon
      }
      this.loadingCoupon = false
    },
    formatAmount(amount, currency) {
      return new Intl
        .NumberFormat('en', { style: 'currency', currency: currency.toUpperCase() })
        .format(amount / 100)
    },
    discountAmount(amount, currency) {
      let discountedAmount = amount
      if (this.coupon.amountOff) {
        discountedAmount = amount - this.coupon.amountOff
      } else if (this.coupon.percentOff) {
        discountedAmount = amount * (1 - (this.coupon.percentOff / 100))
      }
      return new Intl
        .NumberFormat('en', { style: 'currency', currency: currency.toUpperCase() })
        .format(discountedAmount / 100)
    },
    planSelected(plan) {
      this.selectedPlan = plan
    },
    isPlanInMarket(markets) {
      return markets.indexOf(this.locale.current.code) > 0 - 1
    },
    async subscriptionAdded() {
      this.purchaseDialog = false
      this.successDialog = {
        headline: 'Transaction Success!',
        msg: 'Your payment was processed and your subscription was added to your account!',
        show: true
      }
      setTimeout(() => {
        this.successDialog.show = false
        this.selectedPlan = null
      },
      3000)
      await this.getSubscriptions()
    },
    cancelClick() {
      this.showCancelSubDialog = true
    },
    async cancel(subscription) {
      this.loading = true
      try {
        await this.removeSubscription({
          subscriptionId: subscription.integrationOid,
          memberId: this.member.id
        })
        this.loading = false
        this.showCancelSubDialog = false
        this.successDialog = {
          headline: 'Cancellation Success',
          msg: 'Your subscription was successfully cancelled',
          show: true
        }
        setTimeout(() => {
          this.successDialog.show = false
          this.selectedPlan = null
        },
        3000)
      } catch (error) {
        this.loading = false
        this.showCancelSubDialog = false
        this.successDialog = {
          headline: 'An Error Has Occured',
          msg: error.msg,
          show: true
        }
        setTimeout(() => {
          this.successDialog.show = false
          this.selectedPlan = null
        },
        3000)
        console.error({ error })
      }
    }
  },
  computed: {
    ...mapGetters({
      plans: Getters.plans,
      subscriptions: Getters.subscriptions,
      loadingSubscriptions: Getters.loadingSubscriptions,
      member: 'member',
      locale: 'locale'
    }),
    availablePlans() {
      const availPlans = this.plans.filter(plan => {
        return this.isPlanInMarket(plan.metadata.markets)
      })
      return availPlans
    }
  },
  watch: {
    async subscriptions(newVal, oldVal) {
      if (newVal.length > 0) {
        this.loading = true
        const purchaseCode = await this.getMemberAttr('purchase-referral-code')
        let code = null
        if (purchaseCode && purchaseCode.value) {
          code = purchaseCode.value.code
        }
        if (code) {
          this.coupon = await this.getCoupon(code)
        }
        this.loading = false
      } else {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.dialog-headline
  font-weight 500

.dialog-msg
  line-height 2
  max-width 76%
  margin auto

.dialog-actions
  justify-content center

.offers
  ul
    list-style none
    li
      font-size 16px
      line-height 24px
      display inline-block
      padding 5px 0
  .offers-title
    color #00598f
    font-size 28px
    text-align center

  .offer-border
    border-right 1px solid #d8d8d8

.old-amount
  font-size 12px
  text-decoration line-through

.discount
  color red
  font-weight 700

</style>
