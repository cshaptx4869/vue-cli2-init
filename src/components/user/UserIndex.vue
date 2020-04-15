<template>
  <div class="userIndex">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜素与添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.user_name"
            placeholder="请输入用户名"
            :clearable="true"
            @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="storeUserDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据 -->
      <el-table :data="userListData" :border="true" :stripe="true" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="user_name" label="用户名" width="120"></el-table-column>
        <el-table-column prop="role_name" label="角色" :formatter="joinRoleName"></el-table-column>
        <el-table-column prop="user_email" label="邮箱"></el-table-column>
        <el-table-column prop="user_mobile" label="电话" width="100"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" sortable></el-table-column>
        <el-table-column label="状态" width="80px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.user_status" @change="userStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!--  编辑  -->
            <router-link :to="'/user/edit/'+scope.row.user_id">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </router-link>
            <!--  删除  -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.user_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 layout属性显示页面要显示的内容-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="queryInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!--  添加用户对话框  -->
    <el-dialog
      title="添加用户"
      :visible.sync="storeUserDialogVisible"
      width="50%"
      @close="storeUserDialogColse">
      <!--   添加用户表单   -->
      <el-form
        ref="userFormRef"
        :model="userFormData"
        :rules="userFormRules"
        status-icon
        label-width="80px">
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="userFormData.user_name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="user_password">
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
        <slot name="button"></slot>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="storeUserDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitStoreUserForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {request} from "../../http/request";
  import regex from "../../assets/js/regex";

  export default {
    name: "UserIndex",
    data() {
      // 自定义校验规则
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
        queryInfo: {
          user_name: '',
          page: 1,
          limit: 10
        },
        total: 0,
        userListData: [],
        storeUserDialogVisible: false,
        updateUserDialogVisible: false,
        userFormData: {
          user_name: '',
          user_password: '',
          user_mobile: '',
          user_email: '',
          user_status: 0,
          role_ids: []
        },
        userFormRules: {
          user_name: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'},
            {validator: checkUsername, trigger: 'blur'}
          ],
          user_password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
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
      getUserList() {
        request({
          url: '/admin/user/index',
          method: 'post',
          data: this.queryInfo
        }).then(res => {
          if (res.code !== 200) {
            return this.$message.error('获取用户信息失败');
          }
          this.userListData = res.data.items;
          this.total = res.data.total;
        });
      },
      // 监听 pageSize 改变事件
      handleSizeChange(newSize) {
        this.queryInfo.limit = newSize;
        this.getUserList();
      },
      // 监听 page 改变事件
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getUserList();
      },
      // 监听 switch 开关状态改变
      userStatusChange(userInfo) {
        request({
          url: '/admin/user/status',
          method: 'post',
          data: {
            user_id: userInfo.user_id,
            user_status: userInfo.user_status ? 0 : 1
          }
        }).then(res => {
          if (res.code !== 200) {
            userInfo.user_status = !userInfo.user_status;
            return this.$message.error('更新用户状态失败')
          }
          this.$message.success('更新用户状态成功');
        })
      },
      // 处理多角色数据
      joinRoleName(row, col) {
        let roleName = [];
        for (let i = 0; i < row.role_name.length; i++) {
          roleName.push(row.role_name);
        }
        return roleName.join(' ');
      },
      storeUserDialogColse() {
        this.$refs.userFormRef.resetFields();
      },
      submitStoreUserForm() {
        this.$refs.userFormRef.validate((valid) => {
          if (valid) {
            this.userFormData.role_ids = JSON.stringify(this.userFormData.role_ids);
            request({
              url: '/admin/user/store',
              method: 'post',
              data: this.userFormData
            }).then(res => {
              if (res.code !== 200) {
                return this.$message.error('添加用户失败');
              }
              this.$message.success('添加用户成功');
              this.storeUserDialogVisible = false;
              this.getUserList();
            });
          }
        });
      },
      deleteUser(userId) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request({
            url: '/admin/user/destroy',
            method: 'post',
            data: {
              user_id: userId
            }
          }).then(res => {
            if (res.code !== 200) {
              return this.$message.error('删除用户失败');
            }
            this.$message.success('删除用户成功');
            this.getUserList();
          })
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      }
    },
    created() {
      this.userPreview();
      this.getUserList();
    }
  }
</script>

<style scoped>

</style>
