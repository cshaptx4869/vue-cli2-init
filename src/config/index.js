const devServerUrl = 'http://rbac.nannanqiaonan.cn/api';
const prodServerUrl = 'http://rbac.nannanqiaonan.cn/api';

let serverUrl = '';
switch (process.env.NODE_ENV) {
  case 'production':
    serverUrl = prodServerUrl;
    break;
  case 'development':
  default:
    serverUrl = devServerUrl;
}

export default {
  serverUrl: serverUrl,
};
