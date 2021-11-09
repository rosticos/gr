import Vue from 'vue'
import VueRouter from 'vue-router'

import Editor from '../views/Editor.vue'
import Textarea from '../views/textarea.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Editor
  },
  {
    path: '/text',
    name: 'Textarea',
    component: Textarea
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
