import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// 引入axios
// import axios from "axios"//因为要进行全局配置，所以这里不引入，直接引入配置好的axios
import axios from '@/api/my/my_axios.js' // 用自己的全局设置axios代替

// 导入滚动插件，用于无缝滚动图片
// import scroll from 'vue-seamless-scroll'
// 导入Vant组件
// 说明： ImagePreview不能在这里引用，要在使用该组件的地方引用，否则无效
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'

/* ljy创建的用来存放公共变量 */
import myVariable from '@/api/my/my_variable.js'

// Vue.use(scroll)
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

// 用于在前端过滤产品的价格，保留两位小数。否则服务端传递过来的，如12.00，会自动去掉两位小数
// 用法：如{{product.price | decimalFilter}}
Vue.filter('decimalFilter', function (value) {
  value = Number(value);
  return value.toFixed(2);
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
