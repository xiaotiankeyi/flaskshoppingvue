// 路由处理模块, 引入了login组件和全局的css
import Vue from 'vue'
import VueRouter from 'vue-router'
import loing from '../components/login.vue'
import '../assets/css/.global.css'
import home from '../components/home.vue'
import Welecome from '../components/welecome.vue'
import Userlist from '../components/user/userlist.vue'
import Powerlist from '../components/power/powerlist.vue'
import Rolelist from '../components/role/rolelist.vue'
import GoodsClassify from '../components/shopping/goodsClassify.vue'
import GoodsList from '../components/shopping/goodsList.vue'
import addGoods from '../components/shopping/addgoods.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: loing
  },
  {
    path: '/home',
    component: home,
    // 自动跳转到子路由
    redirect: '/welecome',
    // children子路由
    children: [
      {
        path: '/welecome', component: Welecome
      },
      {
        path: '/user_list', component: Userlist
      },
      {
        path: '/auto_list', component: Powerlist
      },
      {
        path: '/role_list', component: Rolelist
      },
      {
        path: '/goods_list', component: GoodsList
      },
      {
        path: '/goods_class', component: GoodsClassify
      },
      {
        path: '/create_goods', component: addGoods
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

// 打开home页面前进行判断
router.beforeEach((to, from, next) => {
  // 如果是打开'login'页面就进行下一步
  if (to.path === '/login') return next()
  // 否则验证是否登录过,在本地区token验证
  const tokenValue = window.sessionStorage.getItem('token')
  // 不通过就进入登录页面
  if (!tokenValue) return next('/login')
  next()
})
