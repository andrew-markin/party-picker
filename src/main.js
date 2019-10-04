import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'

import App from './App.vue'
import router from './router'
import user from './user'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

axios.defaults.baseURL = process.env.VUE_APP_BACKEND;

axios.interceptors.request.use(config => {
  if (user.token) config.headers['Authorization'] = user.token
  return config
})

Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
