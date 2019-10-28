<template>
<div class="eg-slideshow">
  <slide v-for="(slide, index) in currSlides" :key="slide.id">
    <eg-transition v-for="asset in slide.assets" :key="`${asset.id}${index}`">
      <img :src="asset.url"/>
    </eg-transition>
  </slide>
  <div style="visibility: hidden; width: 0px; heigth: 0px">
    <template v-for="(slide, index) in currSlides">
      <img v-for="asset in slide.assets" :key="`${asset.id}${index}`" :src="slide.url"/>
    </template>
  </div>
</div>
</template>

<script>
import eagle from 'eagle.js'
import sortBy from 'lodash.sortby'

export default {
  mixins: [eagle.slideshow],
  props: ['lesson'],
  data: function() {
    return {
      currSlides: []
    }
  },
  async created() {
    this.currSlides = sortBy(this.lesson.slides, 'priority')
    const assets = this.currSlides.reduce((final, current) => final.concat(current.assets), [])
    await Promise.all(assets.map(a => new Promise(resolve => {
      const image = new Image()
      image.src = a.url
      image.onload = (test) => resolve()
      image.onerror = () => resolve()
    })))
    this.$emit('slidesReady')
  }
}
</script>

<style lang="stylus" scoped>
img
  width 100%
</style>
