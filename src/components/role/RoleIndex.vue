<template>
  <div class="roleIndex">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-button type="primary" @click="storeRoleDialogVisible=true">添加角色</el-button>
      <!-- 表格数据 -->
      <el-table :data="roleListData" :border="true" :stripe="true" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="role_name" label="角色名" width="120"></el-table-column>
        <el-table-column prop="role_desc" label="描述"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" sortable></el-table-column>
        <el-table-column label="状态" width="80px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.role_status" @change="roleStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <router-link :to="'/role/authorize/'+scope.row.role_id">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </router-link>
            </el-tooltip>
            <!--  编辑  -->
            <router-link :to="'/role/edit/'+scope.row.role_id">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </router-link>
            <!--  删除  -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="deleteRole(scope.row.role_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--  添加角色对话框  -->
    <el-dialog
      title="添加角色"
      :visible.sync="storeRoleDialogVisible"
      width="50%"
      @close="storeRoleDialogColse">
      <!--   添加角色表单   -->
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
        <el-form-item label="状态" prop="role_status">
          <el-radio-group v-model="roleFormData.role_status">
            <el-radio :label="status.value" v-for="status in previewData.role_status" :key="status.value">
              {{status.text}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <slot name="button"></slot>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="storeRoleDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitStoreRoleForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {request} from "../../http/request";

  export default {
    name: "RoleIndex",
    data() {
      return {
        queryInfo: {
          page: 1,
          limit: 10
        },
        total: 0,
        previewData: [],
        roleListData: [],
        roleFormData: {
          role_name: '',
          role_desc: '',
          role_status: 0
        },
        storeRoleDialogVisible: false,
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
      getRoleList() {
        request({
          url: '/admin/role/index',
          method: 'post',
          data: this.queryInfo
        }).then(res => {
          if (res.code !== 200) {
            return this.$message.error('获取角色信息失败');
          }
          this.roleListData = res.data.items;
          this.total = res.data.total;
        })
      },
      // 监听 switch 开关状态改变
      roleStatusChange(roleInfo) {
        request({
          url: '/admin/role/status',
          method: 'post',
          data: {
            role_id: roleInfo.role_id,
            role_status: roleInfo.role_status ? 0 : 1
          }
        }).then(res => {
          if (res.code !== 200) {
            roleInfo.role_status = !roleInfo.role_status;
            return this.$message.error('更新角色状态失败')
          }
          this.$message.success('更新角色状态成功');
        })
      },
      storeRoleDialogColse() {
        this.$refs.roleFormRef.resetFields();
      },
      submitStoreRoleForm() {
        this.$refs.roleFormRef.validate(valid => {
          if (valid) {
            request({
              url: '/admin/role/store',
              method: 'post',
              data: this.roleFormData
            }).then(res => {
              if (res.code !== 200) {
                return this.$message.error('添加角色失败');
              }
              this.$message.success('添加角色成功');
              this.storeRoleDialogVisible = false;
              this.getRoleList();
            });
          }
        });
      },
      deleteRole(roleId) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request({
            url: '/admin/role/destroy',
            method: 'post',
            data: {
              role_id: roleId
            }
          }).then(res => {
            if (res.code !== 200) {
              return this.$message.error('删除角色失败');
            }
            this.$message.success('删除角色成功');
            this.getRoleList();
          })
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      }
    },
    created() {
      this.rolePreview();
      this.getRoleList();
    }
  }
</script>

<style scoped>

</style>
