import Vue from 'vue';
import App from './app.vue';
import router from './router';
import store from './store';

import './main.css';

import GrCheckbox from '@/utils/components/gr-checkbox.vue';
import { VIEW, EDIT } from './utils/consts';

Vue.component('GrCheckbox', GrCheckbox);

Vue.config.productionTip = false;

Vue.prototype.isViewMode = process.env.VUE_APP_MODE === VIEW;
Vue.prototype.isEditMode = process.env.VUE_APP_MODE === EDIT;
Vue.prototype.appMode = process.env.VUE_APP_MODE;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
