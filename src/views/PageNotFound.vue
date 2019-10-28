<template>
  <v-flex xs12>
    <div>
      <NaativHeader :alt="true"/>
      <div>
        <v-card class="pa-2 error-card">
          <v-form>
            <v-card-text class="centered white">
              <h3>You Have Left School Grounds</h3>
              <h3>Error 404: This Page Cannot Be Found</h3>
            </v-card-text>
            <div class="centered">
              <router-link to="/homeroom/dashboard">
                <v-btn
                  color="#00d3e6"
                  depressed
                  round
                  large
                  class="text-capitalize white--text font-weight-black"
                  type="submit"
                  :loading="loading"
                >Return To Dashboard</v-btn>
              </router-link>
            </div>
          </v-form>
        </v-card>
      </div>
    </div>
  </v-flex>
</template>

<script>
import NaativHeader from '@/components/Header.vue'
export default {
  name: 'PageNotFound',
  components: { NaativHeader },
  props: {
    loading: Boolean
  }
}

</script>
<style scoped>
.error-card {
  background-color: transparent;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 500px;
}
.white {
  background-color: #ffffff;
}
</style>
