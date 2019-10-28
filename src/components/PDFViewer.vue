<template>
  <div class="pdf-viewer">
    <object :data="link" type="application/pdf" width="410px" height="600px">
      <a :href="link" :download="link" target="_blank">Your Browser does not support PDF previews. Please click here to download.</a>
    </object>
  </div>
</template>
<script>
export default {
  name: 'PDFViewer',
  props: ['link']
}
</script>
<style lang="stylus" scoped>
.pdf-viewer
  height 292px
  width 50px
</style>
