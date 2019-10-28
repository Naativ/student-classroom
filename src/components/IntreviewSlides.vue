<template>
<div class="eg-slideshow">
  <slide>
    <eg-transition>
      <img src="../assets/images/interview/Slide1.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide2.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide3.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide4.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide5.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide6.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide7.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide8.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide9.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide10.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide11.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide12.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide13.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide14.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide15.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide16.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide17.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide18.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide19.jpg"/>
    </eg-transition>
  </slide>
  <slide>
    <eg-transition enter="slideInRight">
      <img src="../assets/images/interview/Slide20.jpg"/>
    </eg-transition>
  </slide>
</div>
</template>

<script>
import eagle from 'eagle.js'
export default {
  mixins: [eagle.slideshow],
  infos: {
    title: 'Interview Curriculum',
    description: 'Demo curriculum for interview',
    path: 'demo-curriculum'
  }
}
</script>

<style lang="stylus" scoped>
img
  width 100%
</style>
