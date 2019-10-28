<template>
  <div>
    <slot name="header"></slot>
    <v-layout align-center row wrap class="plan-headers">
      <v-flex xs1></v-flex>
      <v-flex xs4>
        {{$t('subscriptions.plan.name')}}
        <br/>
        {{$t('subscriptions.plan.price')}}
      </v-flex>
      <v-flex xs3>{{$t('dashboard.tokens')}}</v-flex>
      <v-flex xs4>{{$t('subscriptions.plan.frequency')}}</v-flex>
    </v-layout>
    <template v-for="plan in plans">
      <v-layout
        @click="selectPlan(plan)"
        align-center row wrap
        :key="plan.integrationOid"
        class="plan-options"
        :class="{'active': isSelected(plan)}"
      >
        <v-flex xs1>
          <v-checkbox :input-value="isSelected(plan)" :disabled="plans.length > 0" value></v-checkbox>
        </v-flex>
        <v-flex xs4>
          {{plan.name}}
          <br/>
          <p v-if="discount.integrationOid">
            <span class="old-amount">{{formatAmount(plan.amount, plan.currency)}}</span>
            <br/>
            <span class="discount">{{discountAmount(plan.amount, plan.currency)}}</span>
          </p>
          <p v-else>{{formatAmount(plan.amount, plan.currency)}}</p>
        </v-flex>
        <v-flex xs3>{{plan.metadata.lessons}}</v-flex>
        <v-flex xs4>{{plan.interval.count}} {{plan.interval.unit}}</v-flex>
      </v-layout>
    </template>
    <div>
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>

export default {
  name: 'PlanTable',
  props: ['plans', 'selectedPlan', 'discount'],
  methods: {
    formatAmount(amount, currency) {
      return new Intl
        .NumberFormat('en', { style: 'currency', currency: currency.toUpperCase() })
        .format(amount / 100)
    },
    discountAmount(amount, currency) {
      let discountedAmount = amount
      if (this.discount.amountOff) {
        discountedAmount = amount - this.discount.amountOff
      } else if (this.discount.percentOff) {
        discountedAmount = amount * (1 - (this.discount.percentOff / 100))
      }
      return new Intl
        .NumberFormat('en', { style: 'currency', currency: currency.toUpperCase() })
        .format(discountedAmount / 100)
    },
    selectPlan(plan) {
      this.$emit('planSelected', plan)
    },
    isSelected(plan) {
      if (this.selectedPlan) {
        return this.selectedPlan.integrationOid === plan.integrationOid
      } else {
        return false
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.plan-headers
  padding 5px 8px
  background-color #d8d8d8
  font-size 14px
  text-align center

.plan-options
  margin 15px auto
  padding 10px 8px
  background-color #f3f3f3
  font-size 18px
  text-align center
  border 1px solid #d8d8d8
  cursor pointer

  &.active
    background-color rgba(0,211,230,0.3)

.selected-plan
  margin 15px auto
  padding 10px 8px
  background-color rgba(0,211,230,0.3)
  font-size 18px
  text-align center
  border 1px solid #d8d8d8

.old-amount
  font-size 12px
  text-decoration line-through

.discount
  color red
  font-weight 700
</style>
