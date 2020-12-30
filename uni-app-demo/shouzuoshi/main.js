import Vue from 'vue'
import App from './App'
import uniLink from './components/uni-link/uni-link.vue'
Vue.config.productionTip = false

Vue.component('uLink',uniLink);

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
