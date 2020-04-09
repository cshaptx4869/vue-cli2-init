<template>
  <div class="login">
    <div class="loginContainer">
      <!--  logo   -->
      <div class="logoBox">
        <img src="../assets/img/logo.jpg" alt="logo">
      </div>
      <!--   表单   -->
      <div class="formBox">
        <el-form ref="loginformRef" :model="formData" :rules="formRule">
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              placeholder="用户名"
              prefix-icon="el-icon-user-solid"
            ></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              placeholder="密码"
              prefix-icon="el-icon-key"
            ></el-input>
          </el-form-item>

          <el-form-item class="loginBtn">
            <el-button type="primary" @click="submit">登录</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
    import {request} from "../http/request";

    export default {
        name: "Login",
        data() {
            return {
                formData: {
                    username: '',
                    password: '',
                    type: 2
                },
                formRule: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submit: function () {
                this.$refs.loginformRef.validate(valid => {
                    if (valid) {
                        request({
                            url: '/admin/login/signIn',
                            method: 'post',
                            data: this.formData
                        }).then(res => {
                            if (res.code === 200) {
                                this.$message.success('登录成功');
                                this.$common.setToken('accessToken', res.data.access_token);
                                this.$common.setToken('refreshToken', res.data.refresh_token);
                                this.$router.push('/home');
                            } else {
                                this.$message.error('登录失败');
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                    }
                });
            },
            reset: function () {
                this.$refs.loginformRef.resetFields();
            }
        }
    }
</script>

<style scoped>
  .login {
    background-color: #2b4b6b;
    height: 100%;
  }

  .loginContainer {
    width: 450px;
    height: 300px;
    background-color: #FFF;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .logoBox {
    width: 100px;
    height: 100px;
    border: 1px solid #EEE;
    border-radius: 50%;
    background-color: #FFF;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 3px;
    box-shadow: 0 0 10px #ddd;
  }

  .logoBox img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .formBox {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .loginBtn {
    display: flex;
    justify-content: flex-end;
  }
</style>
