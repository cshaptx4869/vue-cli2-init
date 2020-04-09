import Vue from 'vue'
import VueRouter from 'vue-router'
import CommonMethod from '../assets/js/common'

Vue.use(VueRouter);

const Login = () => import('../components/Login');
const Home = () => import('../components/Home');
const Welcome = () => import('../components/Welcome');

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
    },
    children: [
      {
        path: '',
        redirect: '/welcome'
      },
      {
        path: '/welcome',
        component: Welcome,
        meta: {
          title: '欢迎'
        }
      }
    ]
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
  // document.title = to.matched[0].meta.title;
  document.title = to.meta.title;
  next();
});

router.afterEach((to, from) => {

});

export default router
