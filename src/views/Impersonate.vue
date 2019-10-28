<template>
  <v-content id="content">
    <NaativHeader alt hideLogin/>
    <v-container
      fluid
      fill-height
    >
      <v-layout
        align-center
        justify-center
      >
        <v-flex
          xs12
          sm8
        >
          <v-card class="elevation-12">
            <v-toolbar
              color="#00d3e6"
            >
              <v-toolbar-title>Impersonate</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <router-view />
              <ImpersonatePrompt />
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import ImpersonatePrompt from '@/views/ImpersonatePrompt.vue'
import NaativHeader from '@/components/Header.vue'

export default {
  name: 'ImpersonateFrame',
  components: {
    ImpersonatePrompt,
    NaativHeader
  }
}
</script>

<style scoped>
.box-card {
  width: 480px;
  margin: auto;
}
#content {
  background-color: #db6d8a !important;
  height: 100vh;
}
.error {
  margin: 5px;
  padding: 10px;
  text-align: center;
}
.logo {
  width: 100%;
  max-width: 250px;
  margin: auto;
  display: block;
}
</style>
