// 项目启动文件
import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import qs from 'qs'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$qs = qs

// axios.defaults.baseURL = ''

// 设置请求拦截器,请求前拦截token,然后一起放在请求头发送
axios.interceptors.request.use(
  headConfig => {
    // 获取token,在进行验证
    const tokenValue = window.sessionStorage.getItem('token')
    if (tokenValue) {
      headConfig.headers.token = tokenValue
    }
    return headConfig
  })

// 对后端返回的token处理结果进行处理,如token失效等情况
axios.interceptors.response.use(
  responseToken => {
    if (responseToken.data.status === 30001 || responseToken.data.status === 30000) {
      // 后端结果为token失效,清空本地token,并跳转地址,通过router.replace替换地址
      window.sessionStorage.removeItem('token')
      router.replace(
        {
          path: '/login'
        })
    }
    return responseToken
  })

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
