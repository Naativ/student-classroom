import Vue from 'vue'
import VueScrollClass from 'vue-scroll-class'

Vue.directive('scroll-class', VueScrollClass)
Vue.directive('scroll', {
  inserted: function (el, binding) {
    const top = el.getBoundingClientRect().top
    const offset = top - document.documentElement.clientHeight
    window.addEventListener('scroll', () => {
      const start = el.getBoundingClientRect().top
      let y = (window.scrollY) / binding.value.speed
      if (offset > 0) {
        y = (window.scrollY - offset) / binding.value.speed
      }
      if (start > 0 && start < window.innerHeight && y > 0) {
        el.setAttribute('style', `transform: translateY(${~y}px)`)
      }
    })
  }
})
