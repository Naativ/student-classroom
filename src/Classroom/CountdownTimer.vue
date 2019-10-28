<template>
  <div class="countdown" :class="{'past': seconds < 0}">
    <p class="mx-1" v-if="days > 0">
      <strong>{{ days }}</strong>d
    </p>
    <p class="mx-1" v-if="hours > 0">
      <strong>{{hours }}</strong>h
    </p>
    <p class="mx-1" v-if="minutes > 0">
      <strong>{{ minutes }}</strong>m
    </p>
    <p class="mx-1">
      <strong>{{ seconds }}</strong>s
    </p>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data() {
    return {
      actualTime: moment().format('X'),
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  },
  props: ['countdownTo', 'threshold'],
  methods: {
    addOneSecondToActualTimeEverySecond() {
      if (this.threshold && this.seconds > 0) {
        this.checkThreshold()
      }
      var component = this
      component.actualTime = moment().format('X')
      setTimeout(function () {
        component.addOneSecondToActualTimeEverySecond()
      }, 1000)
    },
    getDiffInSeconds() {
      return moment(this.countdownTo).format('X') - this.actualTime
    },
    compute() {
      var duration = moment.duration(this.getDiffInSeconds(), 'seconds')
      this.days = duration.days()
      this.hours = duration.hours()
      this.minutes = duration.minutes()
      this.seconds = duration.seconds()
    },
    checkThreshold() {
      const thresh = moment(this.countdownTo).subtract(this.threshold, 'milliseconds')
      if (moment().isAfter(thresh)) {
        this.$emit('thresholdHit')
      }
    }
  },
  created() {
    this.compute()
    this.addOneSecondToActualTimeEverySecond()
  },
  watch: {
    actualTime(val, oldVal) {
      this.compute()
    }
  }
}
</script>

<style scoped>
.countdown {
  display: flex;
  font-size: x-small;
  justify-content: center;
}

.past strong{
  color: darkred;
}
</style>
