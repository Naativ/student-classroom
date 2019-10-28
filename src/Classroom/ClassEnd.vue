<template>
  <v-layout column class="class-end">
    <v-flex xs12>
      <Feedback
        class="feedback"
        v-if="!feedbackSubmitted"
        :appointment="appointment"
        :booking="booking"
        @rebook="rebook"
      />
      <ReBookDialog
        v-else
        class="feedback"
        :booking="booking"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import Feedback from '@/components/Feedback.vue'
import ReBookDialog from '@/components/ReBookDialog.vue'

export default {
  name: 'ClassEnd',
  components: {
    Feedback,
    ReBookDialog
  },
  props: {
    appointment: Object,
    booking: Object,
    isAssessment: Boolean
  },
  data() {
    return {
      feedbackSubmitted: false
    }
  },
  methods: {
    rebook() {
      this.feedbackSubmitted = true
    }
  }
}
</script>
<style lang="stylus" scoped>
  .class-end
    height 100%!important
    position absolute
    width 100%
    z-index 200
</style>
