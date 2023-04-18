//该文件专门用于创建整个应用的路由器

import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login', //重定向到login
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/home',
      component: Home,
      redirect:'/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome,
        }, 
        {
          path: '/users',
          component: Users,
        },
        {
          path:'/rights',
          component:Rights,
        },
        {
          path:'/roles',
          component:Roles,
        }
      ],
    },
    
  ],
})
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行    next('/login')强制跳转

  if (to.path === '/login') return next()

  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  //如果token为空，则强制跳转
  if (!tokenStr) return next('/login')
  //否则放行
  next()
})

export default router
