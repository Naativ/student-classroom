<template>
  <v-card flat class="chat">
    <div>
      <div class="bubbles">
        <div v-for="(bubble, i) in chat" :key="i" :class="bubble.type">
          <span class="bubble">{{bubble.value}}</span>
        </div>
      </div>
      <div class="chat-actions">
        <v-form @submit.prevent="sendChat">
          <v-layout row width="100%">
          <v-text-field
            background-color="#fff"
            color="#000"
            v-model.trim="currentChat"
            :label="$t('classroom.enter.message')"
            height="35px"
            flat
            solo
            hide-details
          />
          <!-- <v-card-actions> -->
            <!-- <v-spacer/> -->
          <v-btn color="#fff" depressed icon class="text-capitalize white--text" type="submit">
            <!-- {{$t('classroom.chat.send')}} -->
            <v-icon color="#00d3e4">send</v-icon>
          </v-btn>
          <!-- </v-card-actions> -->
          </v-layout>
        </v-form>
      </div>
    </div>
  </v-card>
</template>
<script>
export default {
  name: 'ClassroomChat',
  props: {
    addChat: {
      type: Function
    },
    chat: {
      type: Array
    }
  },
  data() {
    return {
      currentChat: ''
    }
  },
  methods: {
    sendChat() {
      this.addChat(this.currentChat, 'local')
      this.currentChat = ''
    }
  }
}
</script>
<style lang="stylus" scoped>
.chat
  height 100%
  background-color #eee

  .bubbles
    overflow scroll
    height 340px

  .local
    text-align right

    .bubble
      background-color #04d3e4
      color #FFFFFF
      margin 5px 2px
      padding 2px 10px
      border 2px solid #04d3e4
      border-radius 15px 15px 0 15px
      display inline-block

  .remote
    text-align left

    .bubble
      background-color #fff
      margin 5px 2px
      padding 2px 10px
      border 2px solid #fff
      border-radius 15px 15px 15px 0
      display inline-block

  &.active
    top 0

.chat-actions
  position absolute
  bottom 0
  left 0
  right 0
  background-color #fff
  margin-bottom 6px
</style>
