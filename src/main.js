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

// Create router instance
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

// Route guards
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isLoggedIn
  const isAdmin = store.getters.isAdmin

  // Login page and home page don't need authentication
  if (to.path === '/login' || to.path === '/') {
    // If already logged in and trying to access login page, redirect to appropriate main page
    if (isLoggedIn && to.path === '/login') {
      next(isAdmin ? '/admin' : '/user')
    } else {
      next()
    }
  } else if (!isLoggedIn) {
    // Redirect unauthenticated users to login page
    next('/login')
  } else if (to.path.startsWith('/admin') && !isAdmin) {
    // Non-admin users trying to access admin pages
    next('/user')
  } else {
    next()
  }
})

// Create Vue application instance
const app = createApp(App)

// Use router and state management
app.use(router)
app.use(store)

// Mount application
app.mount('#app')