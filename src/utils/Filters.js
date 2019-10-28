import Vue from 'vue'
import moment from 'moment'

const dateFormat = (value, format) => {
  if (value) {
    return moment(String(value)).format(format || 'MM/DD/YY')
  }
}

Vue.filter('dateFormat', dateFormat)
