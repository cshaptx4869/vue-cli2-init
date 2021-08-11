const devServerUrl = 'http://rbac.test';
const prodServerUrl = 'http://rbac.test';

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
