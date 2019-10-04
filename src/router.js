import Vue from 'vue'
import Router from 'vue-router'
import About from './views/About.vue'
import Party from './views/Party.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'about',
      component: About
    },
    {
      path: '/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})',
      name: 'party',
      component: Party
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
