<template>
  <v-dialog max-width="500px" v-model="showPermissionModal" persistent>
    <v-card>
      <v-card-title primary-title>{{$t('media.permissions.title')}}</v-card-title>
      <v-subheader>{{$t('media.permissions.description')}}</v-subheader>
      <v-subheader>{{$t('media.permissions.details')}}</v-subheader>
      <v-btn
        @click="getLocalTracks"
        color="#00d3e6"
        large
        depressed
        class="text-capitalize white--text"
      >{{$t('media.permissions.retry')}}</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['showPermissionModal'],
  methods: {
    async getLocalTracks() {
      window.location.reload(true)
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
