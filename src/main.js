// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router';
import store from './store'
import Fragment from 'vue-fragment'
import './plugins/element'
import './assets/css/global.css'
import Common from './assets/js/common'
import './directive/permission'
import App from './App'

Vue.config.productionTip = false;
Vue.use(Fragment.Plugin);
Vue.prototype.$common = Common;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {App},
  template: '<App/>',
  router: router,
  store: store
});
