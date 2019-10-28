<template>
  <div>
    <v-img id="demo-banner" :src="DEMO_SVG" :style="`transition: opacity 400ms ease-out 0s; opacity: ${demoOpacity};`" v-if="hasDemoTag &&!$browser.isMobile"></v-img>
    <v-bottom-nav app :value="true" color="#00d3e6" id="mobile-footer" v-if="hasDemoTag && $browser.isMobile">
      <h1>Demo</h1>
    </v-bottom-nav>
  </div>
</template>

<script>
import DEMO_SVG from '@/assets/images/demo.svg'
const DEMO_MSG = 'You Are in Demo Mode'

export default {
  name: 'DemoBanner',
  data () {
    return {
      DEMO_MSG,
      DEMO_SVG
    }
  },
  props: {
    demoOpacity: {
      type: Number,
      default: 0.9,
      required: true
    },
    hasDemoTag: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang='stylus' scoped>

#demo-banner
  position fixed
  z-index 101
  width 314px
  top 0
  pointer-events none
  right 0

#mobile-footer
  display flex
  flex-direction row
  justify-content center
  align-items center
  color white
  text-align center
</style>
