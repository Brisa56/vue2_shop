import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router/index'
//导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL= 'http://127.0.0.1:8888/api/private/v1/'
//axios请求拦截
axios.interceptors.request.use(config =>{
  // console.log(config)
  // 为请求头对象，添加Token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //最后必须返回config
  return config
})
//把axios挂载到Vue原型对象上的http中
Vue.prototype.$http = axios

Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
