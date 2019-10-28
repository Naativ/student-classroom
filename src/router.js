import Vue from 'vue'
import Router from 'vue-router'

import store from './store'
import featureFlags from './utils/FeatureFlags'

// Base
// import Prelaunch from './views/prelaunch.vue'
import LandingPage from './views/Landing.vue'
import PageNotFound from './views/PageNotFound.vue'

// Registration/Auth
import AccountClaim from './views/AccountClaim.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
    beforeEnter: (to, from, next) => {
      if (store.state.jwt && !featureFlags.maintenance) {
        next('/homeroom/dashboard')
      }
      next()
    }
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound
  },
  {
    path: '/impersonate/:token',
    name: 'impersonate',
    component: () => import(/* webpackChunkName: "Impersonate" */ './views/Impersonate.vue')
  },
  {
    path: '/account/reset',
    name: 'Forgot My Password',
    component: () => import(/* webpackChunkName: "ForgotPassword" */ './views/ForgottenPassword.vue')
  },
  {
    path: '/account/reset/:token/:email',
    name: 'Reset Password',
    component: () => import(/* webpackChunkName: "ResetPassword" */ './views/ResetPassword.vue')
  },
  {
    path: '/account/claim/:token',
    name: 'AccountClaim',
    component: AccountClaim
  },
  {
    path: '/teacher/:slug',
    component: () => import(/* webpackChunkName: "MainView" */ './views/TeacherProfile.vue'),
    name: 'Teacher Profile'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ './views/Login.vue'),
    beforeEnter: (to, from, next) =>
      store.state.jwt ? next('/homeroom/dashboard') : next()
  },
  {
    path: '/classroom/:bookingId',
    name: 'Classroom',
    component: () => import(/* webpackChunkName: "Classroom" */ './views/Classroom.vue'),
    beforeEnter: (to, from, next) =>
      !store.state.jwt ? next('/login') : next()
  },
  {
    path: '/conversation/:bookingId',
    name: 'Conversation',
    component: () => import(/* webpackChunkName: "Classroom" */ './views/Conversation.vue'),
    beforeEnter: (to, from, next) =>
      !store.state.jwt ? next('/login') : next()
  },
  {
    path: '/privacy',
    name: 'PrivacyPolicy',
    component: () => import(/* webpackChunkName: "Subscriptions" */ './views/PrivacyPolicy.vue')
  },
  {
    path: '/terms',
    name: 'TermsOfService',
    component: () => import(/* webpackChunkName: "Subscriptions" */ './views/TermsOfService.vue')
  },
  {
    path: '/homeroom',
    component: () => import(/* webpackChunkName: "MainView" */ './layouts/Main.vue'),
    beforeEnter: (to, from, next) =>
      !store.state.jwt ? next('/login') : next(),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "Dashboard" */ './views/homeroom/Dashboard.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import(/* webpackChunkName: "Profile" */ './views/homeroom/Profile.vue')
      },
      {
        path: 'booking',
        name: 'Booking',
        component: () => import(/* webpackChunkName: "Booking" */ './views/homeroom/BookingCalendar.vue')
      },
      {
        path: 'library',
        name: 'Library',
        component: () => import(/* webpackChunkName: "Library" */ './views/homeroom/Library.vue')
      },
      {
        path: 'schedule',
        name: 'Schedule',
        component: () => import(/* webpackChunkName: "Schedule" */ './views/homeroom/Schedule.vue')
      },
      {
        path: 'subscriptions',
        name: 'Subscriptions',
        component: () => import(/* webpackChunkName: "Subscriptions" */ './views/homeroom/Subscriptions.vue')
      },
      {
        path: 'worksheets',
        name: 'Worksheets',
        component: () => import(/* webpackChunkName: "Subscriptions" */ './views/homeroom/Worksheets.vue')
      }
    ]
  }
]

const homeroomRoutes = new Router({
  mode: 'history',
  routes
})

homeroomRoutes.beforeEach((to, from, next) => {
  if (featureFlags.maintenance && to.path !== '/') {
    next('/')
  }
  next()
})

export default homeroomRoutes
