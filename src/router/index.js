import Vue from 'vue'
import VueRouter from 'vue-router'
import CommonMethod from '../assets/js/common'

Vue.use(VueRouter);

const Home = () => import('../components/Home');
const Login = () => import('../components/Login');

const routes = [
  {
    path: '*',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登录'
    }
  }
];

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
  document.title = to.matched[0].meta.title;
  next();
});

router.afterEach((to, from) => {

});

export default router
