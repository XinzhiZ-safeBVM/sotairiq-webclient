import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import App from './App.vue'
import LandingPage from './components/LandingPage.vue'
import LoginForm from './components/LoginForm.vue'
import Scoreboard from './components/Scoreboard.vue'
import UserMain from './components/UserMain.vue'
import DetailDashboard from './components/DetailDashboard.vue'
import SessionData from './components/SessionData.vue'
import AdminMain from './components/AdminMain.vue'
import UserManagement from './components/UserManagement.vue'

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage
    },
    {
      path: '/login',
      name: 'LoginForm',
      component: LoginForm
    },
    {
      path: '/scoreboard',
      name: 'Scoreboard',
      component: Scoreboard
    },
    {
      path: '/user',
      name: 'UserMain',
      component: UserMain
    },
    {
      path: '/dashboard/:id',
      name: 'DetailDashboard',
      component: DetailDashboard
    },
    {
      path: '/session/:id',
      name: 'SessionData',
      component: SessionData
    },
    {
      path: '/admin',
      name: 'AdminMain',
      component: AdminMain
    },
    {
      path: '/admin/users',
      name: 'UserManagement',
      component: UserManagement
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isLoggedIn
  const isAdmin = store.getters.isAdmin

  // 登录页面和首页不需要验证
  if (to.path === '/login' || to.path === '/') {
    // 如果已登录且尝试访问登录页，重定向到对应的主页
    if (isLoggedIn && to.path === '/login') {
      next(isAdmin ? '/admin' : '/user')
    } else {
      next()
    }
  } else if (!isLoggedIn) {
    // 未登录用户重定向到登录页
    next('/login')
  } else if (to.path.startsWith('/admin') && !isAdmin) {
    // 非管理员用户尝试访问管理页面
    next('/user')
  } else {
    next()
  }
})

// 创建Vue应用实例
const app = createApp(App)

// 使用路由和状态管理
app.use(router)
app.use(store)

// 挂载应用
app.mount('#app')