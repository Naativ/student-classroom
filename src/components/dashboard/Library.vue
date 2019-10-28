<template>
  <v-card>
    <v-card-title>
      <h3>{{$t('dashboard.library.title')}}</h3>
    </v-card-title>
    <v-card-text>
      <p>{{$t('dashboard.library.text')}}</p>
      <v-btn
        class="primary text-capitalize"
        flat
        large
        round
        to="/homeroom/library"
      >
        {{$t('dashboard.library.action')}}
      </v-btn>
    </v-card-text>
    <v-card-actions>
      <v-btn flat @click="goToLibrary()">{{$t('dashboard.learnMore')}}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'DashboardLibrary',
  methods: {
    goToLibrary() { return this.$router.push('/homeroom/library') }
  }
}
</script>

<style lang="stylus" scoped>
</style>
