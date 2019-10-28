<template>
  <v-tabs centered>
    <template v-for="(availability, index) in week ">
      <v-tab :key="index" ripple>{{weekdayLabels[index]}}</v-tab>
      <v-tab-item :key="index">
        <Day
          @update="update"
          :availability="availability"
          v-if="availability"
          v-model="selections"
        />
      </v-tab-item>
    </template>
  </v-tabs>
</template>

<script>
import { each } from 'lodash'
import moment from 'moment'

import Day from '@/components/booking/Day.vue'

export default {
  name: 'BookingWeek',
  components: { Day },
  props: {
    availability: { type: Array, required: true },
    end: { type: Object, required: true },
    start: { type: Object, required: true },
    value: { type: Array, default: () => [] }
  },
  data() {
    return {
      weekdayLabels: moment.localeData().weekdaysShort()
    }
  },
  methods: {
    buildWeek() {
      const week = {}
      each(this.$props.availability, a => {
        const index = a.start.weekday()
        week[index] ? week[index].push(a) : week[index] = [a]
      })
      return week
    },
    update(availObj) { this.$emit('update', availObj) }
  },
  computed: {
    selections: {
      get() { return this.$props.value },
      set(v) { this.$emit('input', v) }
    },
    week: {
      get() { return this.buildWeek() }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
