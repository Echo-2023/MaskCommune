import App from './App'

// #ifndef VUE3
import Vue from 'vue';
import * as utils from './common/utils.js';
import crypto from './node_modules/crypto-js/crypto-js.js';
import * as config from 'vue.config.js';

import './uni.promisify.adaptor'
Vue.config.productionTip = false
Vue.prototype.$utils     = utils;
Vue.prototype.$crypto    = crypto;

App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif