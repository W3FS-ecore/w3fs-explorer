import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import "./scss/main.scss";
/* axios */
import http from "./api";
import api from "./api/api";
import web3 from "./utils/web3.js";

Vue.prototype.$web3 = web3;

import * as filters from "./utils/filters.js";
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;
Vue.prototype.$http = http;
Vue.prototype.$api = api;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
