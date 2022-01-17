import Vue from 'vue';
import VueRouter from 'vue-router';

import EditorPage from '../views/editor-page.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'EditorPage',
    component: EditorPage
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
