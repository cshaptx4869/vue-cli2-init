import Vue from 'vue'
import VueRouter from 'vue-router'
import {routes} from "./routes";
import CommonMethod from '../assets/js/common'

Vue.use(VueRouter);

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

// 全局守卫
router.beforeEach(async (to, from, next) => {
  let isLogin = await CommonMethod.checkToken();
  console.log(isLogin);
  if (to.path !== '/login' && !isLogin) {
    return next('/login');
  } else if (to.path === '/login' && isLogin) {
    return next('/home');
  }
  // document.title = to.matched[0].meta.title;
  document.title = to.meta.title;
  next();
});

router.afterEach((to, from) => {

});

export default router
