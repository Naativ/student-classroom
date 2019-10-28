<template>
  <v-card>
    <v-card-title><h3>{{$t('dashboard.prelaunch.action.title')}}</h3></v-card-title>
    <v-card-text v-if="subscriptions.length === 0">
      <p>{{$t('dashboard.subscription.text')}}</p>
      <v-btn
        data-cy="Dashboard Purchase Subscription"
        class="primary text-capitalize"
        flat
        large
        round
        :to="{ name: 'Subscriptions'}"
      >
        {{$t('dashboard.prelaunch.action')}}
      </v-btn>
    </v-card-text>
    <v-card-text v-else>
      <p>{{$t('dashboard.prelaunch.thank.you')}}</p>
      <ul style="text-align: left;">
        <li>{{$t('dashboard.subscription.learnmore.1')}}</li>
        <li>{{$t('dashboard.subscription.learnmore.2')}}</li>
        <li>{{$t('dashboard.subscription.learnmore.3')}}</li>
        <li>{{$t('dashboard.subscription.learnmore.4')}}</li>
        <li>{{$t('dashboard.subscription.learnmore.5')}}</li>
        <li>{{$t('dashboard.subscription.learnmore.6')}}</li>
        <li>{{$t('dashboard.subscription.learnmore.7')}}</li>
      </ul>
    </v-card-text>
    <v-card-actions>
      <v-dialog v-if="subscriptions.length === 0" v-model="learnMore" max-width="600px">
        <v-btn flat slot="activator">
          {{$t('dashboard.learnMore')}}
        </v-btn>
        <v-card>
          <v-toolbar card dark color="primary">
            <v-spacer></v-spacer>
            <v-btn icon @click="learnMore = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-title primary-title>
            <h3>{{$t('dashboard.subscription.learnmore.title')}}</h3>
          </v-card-title>
          <v-card-text>
            <ul>
              <li>{{$t('dashboard.subscription.learnmore.1')}}</li>
              <li>{{$t('dashboard.subscription.learnmore.2')}}</li>
              <li>{{$t('dashboard.subscription.learnmore.3')}}</li>
              <li>{{$t('dashboard.subscription.learnmore.4')}}</li>
              <li>{{$t('dashboard.subscription.learnmore.5')}}</li>
              <li>{{$t('dashboard.subscription.learnmore.6')}}</li>
              <li>{{$t('dashboard.subscription.learnmore.7')}}</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'DashboardSubscription',
  props: ['subscriptions'],
  data() {
    return {
      learnMore: false,
      loading: false
    }
  }
}
</script>

<style lang="stylus" scoped>
.avatar {
  margin: 10px 0;
  border-radius: 100% 0 100% 100% !important;
}

.application-close {
  margin-left: auto;
}

.application-title {
  flex-wrap: nowrap;
}
</style>
