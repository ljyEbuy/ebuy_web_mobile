import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// 引入axios
import axios from 'axios'

// 导入Vant组件
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'

/* ljy创建的用来存放公共变量 */
import myVariable from '@/api/my/my_variable.js'

// 使用Vant
Vue.use(Lazyload)
Vue.use(Vant)
/* ljy创建的用来存放公共变量 */
Vue.prototype.myVariable = myVariable// 组件中通过this.myVariable.variable调用

axios.defaults.headers = {
  'Content-Type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Methods': '*'
}
// ljy特别说明：在和服务端交互时，服务端会返回客户端set-cookie那一行有path=/ebuy，说明这个cookie是有范围限制的，只能在/ebuy才会带上cookie
// 所以如果使用proxyTable代理要注意这个问题，虚拟目录必须和服务端项目的地址一致
// 给axios设置baseURL，用于开发模式调用
axios.defaults.baseURL = myVariable.baseUrl// 设置初始URL
axios.defaults.withCredentials = true // 跨域携带cookie
// 挂在在vue的原型上
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
