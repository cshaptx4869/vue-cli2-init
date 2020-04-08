import Axios from 'axios'
import Qs from 'qs'
import SysConfig from '../config'

export function request(config) {
  const instance = new Axios.create({
    baseURL: SysConfig.serverUrl,
    timeout: 5000
  });

  instance.interceptors.request.use(config => {
    config.data = Qs.stringify(config.data);
    return config;
  }, err => {
    return err;
  });

  instance.interceptors.response.use(response => {
    return response.data;
  }, err => {
    return err;
  });

  return instance(config);
}
