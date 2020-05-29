import Vue from 'vue'
import VueRouter from 'vue-router'
import {routes} from "./routes";
import CommonMethod from '../assets/js/common'

Vue.use(VueRouter);

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

let useAuth = true;
let authWhiteList = ['login', 'welcome', 'error/401', 'error/404'];
// 全局守卫
router.beforeEach(async (to, from, next) => {
  let isLogin = await CommonMethod.checkToken();
  let authorizedPage = CommonMethod.getAuthorizedPage();
  if (to.path !== '/login' && !isLogin) {
    return next('/login');
  } else if (to.path === '/login' && isLogin) {
    return next('/home');
  } else if (useAuth && !authWhiteList.includes(to.name) && !authorizedPage.includes(to.name)) {
    return next('/error/401');
  }
  // document.title = to.matched[0].meta.title;
  document.title = to.meta.title;
  next();
});

router.afterEach((to, from) => {

});

export default router
