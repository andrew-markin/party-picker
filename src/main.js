import Vue from 'vue'
import axios from 'axios'

import App from './App.vue'
import router from './router'

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ?
    'http://party-picker-backend.cloudno.de' : 'http://localhost:3000'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
