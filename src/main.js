import Vue from 'vue'
import App from './App.vue'
import VueFormulate from '@braid/vue-formulate'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './main.css'

Vue.use(VueFormulate)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
