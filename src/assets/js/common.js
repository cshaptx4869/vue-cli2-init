/*
公共函数
*/

import {request} from "../../http/request";

function setToken(key, value) {
  window.sessionStorage.setItem(key, value);
}

function clearToken() {
  window.sessionStorage.clear();
}

function getToken(key = 'accessToken') {
  return window.sessionStorage.getItem(key);
}

/**
 * 验证 token 有效性
 * 1、accessToken 是否存在。不存在,跳转登录; 存在,验证有效性
 * 2、accessToken 是否有效。无效,带上 refresh_token 重新获取 access_token; 有效,不作处理
 * 3、refreshToken 是否有效。无效,跳转登录; 有效,返回新的 accessToken
 */
async function checkToken() {
  let bool = false;
  if (getToken('accessToken')) {
    await request({
      url: '/admin/login/check',
      method: 'post'
    }).then(async res => {
      console.log('access_token验证');
      if (res.data.is_valid) {
        bool = true;
      } else {
        await request({
          url: '/admin/login/refresh',
          method: 'post',
          data: {
            refresh_token: getToken('refreshToken')
          }
        }).then(res => {
          console.log('refresh_token验证');
          if (res.code === 200) {
            setToken('accessToken', res.data.access_token);
            bool = true;
          }
        });
      }
    });
  }
  console.log('返回结果');
  return bool;
}

export default {
  setToken,
  getToken,
  checkToken,
  clearToken
}
