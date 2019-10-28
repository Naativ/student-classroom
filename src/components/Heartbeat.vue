<template>
  <a></a>
</template>
<script>
export default {
  name: 'Heartbeat',
  props: {
    frequency: { type: Number, required: true },
    fn: { type: Function, default: () => {} }
  },
  data: () => ({ interval: null }),
  mounted() { this.interval = setInterval(this.fn, this.frequency) },
  destroyed() { clearInterval(this.interval) }
}
</script>
