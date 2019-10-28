<template>
  <div class="time-block">
    <v-subheader class="center">
      {{label}}
    </v-subheader>
    <div class="unit center">
      <div
        v-for="(unit, index) in units"
        :class="{
          subunit: true,
          pointer: true,
          reserved: unit.reserved,
          selected: isSelected(unit)
        }"
        :key="index"
        @click="select(index)"
      >
        <span class="label">{{unit.label}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { find, get, map } from 'lodash'

export default {
  name: 'BookingTimeBlock',
  props: {
    availability: { type: Array, default: () => [] },
    reservations: { type: Array, default: () => [] },
    value: { type: Array, default: () => [] }
  },
  data() {
    return {
      label: get(this.$props.availability[0], 'start').format('h:mm a'),
      selectAll: false,
      selected: {},
      selections: this.$props.value
    }
  },
  methods: {
    isReserved({ start, end }) {
      return find(this.$props.reservations, res =>
        res.start.valueOf() >= start.valueOf() && res.end.valueOf() <= end.valueOf()
      )
    },
    isSelected(unit) {
      return !this.selections.filter(_ => _.availabilityId === unit.availabilityId)
    },
    select(index) {
      const unit = this.units[index]
      if (unit.reserved) return
      this.selections = [unit]
      this.$emit('input', this.selections)
    }
  },
  computed: {
    units() {
      return map(this.$props.availability, a => {
        return {
          label: a.start.format('h:mm a'),
          reserved: this.isReserved(a),
          ...a
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .time-block
    width 100%
    .unit
      display flex
      flex-wrap wrap
      margin 0px 10px 10px 10px
      .subunit
        border 1px solid #CCC
        border-radius 8px
        margin 5px
        min-width 75px
        padding 5px 0px
        text-align center
        &.selected
          background-color #00D3E4
        &.reserved
          cursor not-allowed
          background-color #AAA
        &:hover
          background-color rgba(0,211,228,.5)
          cursor pointer
    .center
      justify-content center
</style>
