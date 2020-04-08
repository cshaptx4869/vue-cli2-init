import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const Demo = () => import('../components/Demo');

const routes = [
  {
    path: '*',
    redirect: '/demo'
  },
  {
    path: '/demo',
    component: Demo,
    meta: {
      title: 'Demo'
    }
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  document.title = to.matched[0].meta.title;
  next();
});

router.afterEach((to, from) => {

});

export default router
