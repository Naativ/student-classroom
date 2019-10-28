<template>
  <div v-scroll-class:shrink=50 class="header">
    <div class="logo">
      <img src="../assets/images/logo.svg">
      <br/>
      <span style="white-space: nowrap;">{{$t('logo.subheader')}} <img style="width: 20px; margin: 0px 0 0 2px; vertical-align: middle;" src="../assets/images/usflag.png"/></span>
    </div>
    <v-spacer></v-spacer>
    <div class="text-capitalize white--text font-weight-bold text-xs-center">
      <h3>{{$t('maintenance.header.one')}}</h3>
      <h3>{{$t('maintenance.header.two')}}</h3>
    </div>
    <v-spacer></v-spacer>
  </div>
</template>

<script>
export default {
  name: 'maintenance'
}
</script>

<style lang='stylus' scoped>
.shrink
  background-color #fcba00
  .logo
    img
      width 125px
      margin 0 0 0 5px
    span
      font-size 12px
      margin 0 0 0 5px

.logo
  img
    transition .3s all
    width 150px
    margin 12px 0 0 10px
  a,span
    color #fff
    text-decoration none
  span
    transform translateY(-10px)
    margin -1px 0 0 10px
    display inline-block

.header
  background-color #fcba00
  display flex
  padding: 15px 0 5px 0
  position fixed
  left 0
  right 0
  top 0
  z-index 100

</style>
