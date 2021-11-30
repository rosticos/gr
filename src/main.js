import Vue from 'vue';
import App from './app-1.vue';
import router from './router';
import store from './store';

import './main.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
