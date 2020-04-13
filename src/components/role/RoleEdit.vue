<template>
  <div class="roleEdit">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑角色</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row>
      <el-col :span="12">
        <el-form
          ref="roleFormRef"
          :model="roleFormData"
          :rules="roleFormRules"
          status-icon
          label-width="80px">
          <el-form-item label="角色名" prop="role_name">
            <el-input v-model="roleFormData.role_name"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="role_desc">
            <el-input v-model="roleFormData.role_desc" type="textarea" :rows="2"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="user_status">
            <el-radio-group v-model="roleFormData.role_status">
              <el-radio :label="status.value" v-for="status in previewData.role_status" :key="status.value">
                {{status.text}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitUpdateRoleForm">确定</el-button>
            <el-button type="info" @click="$router.go(-1)">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {request} from "../../http/request";

  export default {
    name: "RoleEdit",
    data() {
      return {
        previewData: [],
        roleFormData: {
          role_id: '',
          role_name: '',
          role_desc: '',
          user_status: ''
        },
        roleFormRules: {
          role_name: [
            {required: true, message: '请输入角色名', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'},
          ],
          role_desc: [
            {min: 0, max: 100, message: '最多 100 个字符', trigger: 'blur'},
          ],
          role_status: [
            {required: true, message: '请选择角色状态', trigger: 'change'},
          ]
        }
      }
    },
    methods: {
      rolePreview() {
        request({
          url: '/admin/role/preview',
          method: 'post'
        }).then(res => {
          if (res.code === 200) {
            this.previewData = res.data;
          }
        })
      },
      getRoleData() {
        request({
          url: '/admin/role/show',
          method: 'post',
          data: {
            role_id: this.$route.params.id
          }
        }).then(res => {
          if (res.code === 200) {
            this.roleFormData = res.data;
          }
        })
      },
      submitUpdateRoleForm() {
        this.$refs.roleFormRef.validate((valid) => {
          if (valid) {
            request({
              url: '/admin/role/update',
              method: 'post',
              data: this.roleFormData
            }).then(res => {
              if (res.code !== 200) {
                return this.$message.error('更新角色失败');
              }
              this.$message.success('更新角色成功');
              this.$router.push('/role/index');
            });
          }
        });
      }
    },
    created() {
      this.rolePreview();
      this.getRoleData();
    }
  }
</script>

<style scoped>

</style>
