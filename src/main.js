import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ?
    'https://party-picker.cloudno.de' : 'http://localhost:3000'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
