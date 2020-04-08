const devServerUrl = 'http://rbac.nannanqiaonan.cn';
const prodServerUrl = 'http://www.prod.test';

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
