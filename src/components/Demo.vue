<template>
  <div class="demo">
    <h3>Demo</h3>
    <button @click="loginIn">网络请求</button>
  </div>
</template>

<script>
    import {request} from '../http/request';
    import {loginIn} from "../store/mutations-types";

    export default {
        name: "Demo",
        data() {
            return {
                username: 'zombie',
                password: '123456',
                loginType: 2,
            }
        },
        methods: {
            loginIn: function () {
                //发送网络请求
                request({
                    url: '/admin/login/signIn',
                    method: 'post',
                    data: {
                        'username': this.username,
                        'password': this.password,
                        'type': this.loginType
                    }
                }).then(res => {
                    console.log(res);
                    if (res.data) {
                        this.$store.commit({
                            type: loginIn,
                            accessToken: res.data.access_token,
                            refreshToken: res.data.refresh_token
                        });
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style scoped>

</style>
