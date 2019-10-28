<template>
  <v-tabs centered>
    <template v-for="(_, period) in periods">
      <template v-if="!isEmpty(periods[period])">
        <v-tab :key="period" ripple>{{period}}</v-tab>
        <v-tab-item :key="period">
          <template v-for="(block, index) in periods[period]">
            <TimeBlock
              :availability="block.items"
              :key="index"
              :reservations="reservations"
              :start="block.start"
              v-if="block.items.length"
              v-model="selections"
            />
          </template>
        </v-tab-item>
      </template>
    </template>
  </v-tabs>
</template>

<script>
import { filter, get } from 'lodash'

import TimeBlock from '@/components/booking/Block.vue'

export default {
  name: 'BookingDay',
  components: { TimeBlock },
  props: {
    availability: { type: Array, default: () => [] },
    reservations: { type: Array, default: () => [] },
    unitSize: { type: Number, default: 1 },
    unitType: { type: String, default: 'hour' },
    value: { type: Array, default: () => [] }
  },
  data() {
    const periods = {
      Morning: this.generateBlocks(0, 11),
      Afternoon: this.generateBlocks(12, 16),
      Evening: this.generateBlocks(17, 23)
    }
    return { periods }
  },
  computed: {
    selections: {
      get() { return this.$props.value },
      set(v) { this.$emit('input', v) }
    }
  },
  methods: {
    isEmpty(period) { return !filter(period, p => p.items.length).length },
    generateBlocks(periodStart, periodEnd) {
      const { start, end } = this.getRange()
      const blocks = []
      const time = start.hour() < periodStart
        ? start.clone().hour(periodStart).startOf('hour')
        : start.clone().startOf('hour')
      while (
        time.hour() <= periodEnd &&
        time.valueOf() < end.valueOf() &&
        time.day() === start.day()
      ) {
        blocks.push({
          start: time.clone(),
          items: this.getAvailabilityForBlock(time)
        })
        time.add(this.$props.unitSize, this.$props.unitType)
      }
      return blocks
    },
    getAvailabilityForBlock(start) {
      const end = start.clone().add(this.$props.unitSize, this.$props.unitType)
      return filter(this.$props.availability, a =>
        start.valueOf() <= a.start.valueOf() &&
        a.end.valueOf() <= end.valueOf())
    },
    getRange() {
      const { availability } = this.$props
      return {
        start: get(availability[0], 'start'),
        end: get(availability[availability.length - 1], 'end')
      }
    }
  }
}
</script>
