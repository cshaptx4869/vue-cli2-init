/* 申明路由 */
const Login = () => import('../components/Login');
const Layout = () => import('../components/Layout');
const Welcome = () => import('../components/Welcome');
const UserIndex = () => import('../components/user/UserIndex');
const UserEdit = () => import('../components/user/UserEdit');

export const routes = [
  {
    path: '*',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Layout,
    meta: {
      title: '首页'
    },
    children: [
      {
        path: '',
        redirect: '/welcome'
      },
      {
        name: 'welcome',
        path: '/welcome',
        component: Welcome,
        meta: {
          title: '欢迎'
        }
      },
      {
        name: 'user/index',
        path: '/user/index',
        component: UserIndex,
        meta: {
          title: '用户列表'
        }
      },
      {
        name: 'user/edit',
        path: '/user/edit/:id',
        component: UserEdit,
        meta: {
          title: '编辑用户'
        }
      }
    ]
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      title: '登录'
    }
  }
];