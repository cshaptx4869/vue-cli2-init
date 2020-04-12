<template>
  <div class="userEdit">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑用户</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row>
      <el-col :span="12">
        <el-form
          ref="userFormRef"
          :model="userFormData"
          :rules="userFormRules"
          status-icon
          label-width="80px">
          <el-form-item label="用户名" prop="user_name">
            <el-input v-model="userFormData.user_name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="userFormData.user_password"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role_ids">
            <el-checkbox-group v-model="userFormData.role_ids">
              <el-checkbox :label="role.value" v-for="role in previewData.roles" :key="role.value">
                {{role.text}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="手机号" prop="user_mobile">
            <el-input v-model="userFormData.user_mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="user_email">
            <el-input v-model="userFormData.user_email"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="user_status">
            <el-radio-group v-model="userFormData.user_status">
              <el-radio :label="status.value" v-for="status in previewData.user_status" :key="status.value">
                {{status.text}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitUpdateUserForm">确定</el-button>
            <el-button type="info" @click="$router.go(-1)">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {request} from "../../http/request";
  import regex from "../../assets/js/regex";

  export default {
    name: "UserEdit",
    data() {
      let checkMobile = (rule, value, callback) => {
        if (regex.regMobile.test(value)) {
          return callback();
        }
        return callback(new Error('手机号不合法'));
      };

      let checkUsername = (rule, value, callback) => {
        if (regex.regUsername.test(value)) {
          return callback();
        }
        return callback(new Error('用户名只能是数字字母组合'));
      };

      return {
        previewData: [],
        userFormData: {
          user_id: '',
          user_name: '',
          user_password: '',
          user_mobile: '',
          user_email: '',
          user_status: '',
          role_ids: []
        },
        userFormRules: {
          user_name: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'},
            {validator: checkUsername, trigger: 'blur'}
          ],
          role_ids: [
            {required: true, message: '请选择角色', trigger: 'change'}
          ],
          user_mobile: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}
          ],
          user_email: [
            {type: 'email', message: '请输入合法邮箱', trigger: 'blur'}
          ],
          user_status: [
            {required: true, message: '请选择用户状态', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      userPreview() {
        request({
          url: '/admin/user/preview',
          method: 'post'
        }).then(res => {
          if (res.code === 200) {
            this.previewData = res.data;
          }
        })
      },
      getUserData() {
        request({
          url: '/admin/user/show',
          method: 'post',
          data: {
            user_id: this.$route.params.id
          }
        }).then(res => {
          if (res.code === 200) {
            this.userFormData.user_id = res.data.user_id;
            this.userFormData.user_name = res.data.user_name;
            this.userFormData.user_mobile = res.data.user_mobile;
            this.userFormData.user_email = res.data.user_email;
            this.userFormData.user_status = res.data.user_status;
            this.userFormData.role_ids = res.data.role_ids;
          }
        })
      },
      submitUpdateUserForm() {
        this.$refs.userFormRef.validate((valid) => {
          if (valid) {
            this.userFormData.role_ids = JSON.stringify(this.userFormData.role_ids);
            request({
              url: '/admin/user/update',
              method: 'post',
              data: this.userFormData
            }).then(res => {
              if (res.code !== 200) {
                return this.$message.error('更新用户失败');
              }
              this.$message.success('更新用户成功');
              this.$router.push('/user/index');
            });
          }
        });
      }
    },
    created() {
      this.userPreview();
      this.getUserData();
    }
  }
</script>

<style scoped>

</style>
