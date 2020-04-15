<template>
  <div class="menuIndex">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统资源管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜素与添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.menu_name"
            placeholder="请输入菜单名"
            :clearable="true"
            @clear="getMenuList">
            <el-button slot="append" icon="el-icon-search" @click="getMenuList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="storeMenuDialogVisible=true">添加菜单</el-button>
        </el-col>
      </el-row>

      <!--  菜单列表  -->
      <el-table
        :data="menuData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="menu_id"
        border
        default-expand-all
        :tree-props="{children: 'menu_children', hasChildren: 'hasChildren'}">
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          prop="menu_name"
          label="菜单"
          width="180">
          <template slot-scope="scope">
            <span :class="scope.row.menu_icon"></span> {{scope.row.menu_name}}
          </template>
        </el-table-column>
        <el-table-column
          prop="menu_href"
          label="链接">
        </el-table-column>
        <el-table-column
          prop="menu_href"
          label="级别">
          <template slot-scope="scope">
            <el-button size="mini" plain :type="menuLevelColor(scope.row.menu_level)">
              {{scope.row.menu_level}}级菜单
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          sortable
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="menu_status"
          label="状态"
          width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.menu_status" @change="menuStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!-- 添加 -->
            <el-button type="success" icon="el-icon-plus" size="mini"
                       @click="storeMenuDialogShow(scope.row.menu_id)"></el-button>
            <!--  编辑  -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="updateMenuDialogShow(scope.row.menu_id)"></el-button>
            <!--  删除  -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="deleteMenu(scope.row.menu_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--  添加菜单对话框  -->
    <el-dialog
      title="添加菜单"
      :visible.sync="storeMenuDialogVisible"
      width="50%"
      @close="storeMenuDialogColse">
      <!--   添加菜单表单   -->
      <el-form
        ref="storeMenuFormRef"
        :model="storeMenuFormData"
        :rules="storeMenuRules"
        status-icon
        label-width="80px">
        <el-form-item label="菜单名" prop="menu_name">
          <el-input v-model="storeMenuFormData.menu_name"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="menu_icon">
          <el-input v-model="storeMenuFormData.menu_icon"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="menu_href">
          <el-input v-model="storeMenuFormData.menu_href"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="menu_sort_order">
          <el-input v-model.number="storeMenuFormData.menu_sort_order"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="menu_status">
          <el-radio-group v-model="storeMenuFormData.menu_status">
            <el-radio :label="status.value" v-for="status in previewData" :key="status.value">
              {{status.text}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="storeMenuDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitStoreMenuForm">确 定</el-button>
      </span>
    </el-dialog>

    <!--  修改菜单对话框  -->
    <el-dialog
      title="修改菜单"
      :visible.sync="updateMenuDialogVisible"
      width="50%"
      @close="updateMenuDialogColse">
      <!--   修改菜单表单   -->
      <el-form
        ref="updateMenuFormRef"
        :model="updateMenuFormData"
        :rules="storeMenuRules"
        status-icon
        label-width="80px">
        <el-form-item label="菜单名" prop="menu_name">
          <el-input v-model="updateMenuFormData.menu_name"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="menu_icon">
          <el-input v-model="updateMenuFormData.menu_icon"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="menu_href">
          <el-input v-model="updateMenuFormData.menu_href"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="menu_sort_order">
          <el-input v-model.number="updateMenuFormData.menu_sort_order"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="menu_status">
          <el-radio-group v-model="updateMenuFormData.menu_status">
            <el-radio :label="status.value" v-for="status in previewData" :key="status.value">
              {{status.text}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateMenuDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateMenuForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {request} from "../../http/request";

  export default {
    name: "MenuIndex",
    data() {
      return {
        previewData: [],
        menuData: [],
        storeMenuDialogVisible: false,
        updateMenuDialogVisible: false,
        queryInfo: {
          menu_name: ''
        },
        storeMenuFormData: {
          menu_parent_id: 0,
          menu_name: '',
          menu_icon: '',
          menu_href: '',
          menu_sort_order: 100,
          menu_status: 0
        },
        updateMenuFormData: {
          menu_id: '',
          menu_parent_id: '',
          menu_name: '',
          menu_icon: '',
          menu_href: '',
          menu_sort_order: 100,
          menu_status: 0
        },
        storeMenuRules: {
          menu_name: [
            {required: true, message: '请输入菜单名', trigger: 'blur'},
            {min: 0, max: 20, message: '最多 20 个字符', trigger: 'blur'},
          ],
          menu_icon: [
            {min: 0, max: 20, message: '最多 20 个字符', trigger: 'blur'},
          ],
          menu_href: [
            {min: 0, max: 20, message: '最多 20 个字符', trigger: 'blur'},
          ],
          menu_sort_order: [
            {type: 'number', message: '请输入合法数字', trigger: 'blur'}
          ],
          menu_status: [
            {required: true, message: '请选择角色状态', trigger: 'change'},
          ]
        }
      }
    },
    methods: {
      menuPreview() {
        request({
          url: '/admin/menu/preview',
          method: 'post'
        }).then(res => {
          if (res.code === 200) {
            this.previewData = res.data;
          }
        })
      },
      getMenuList() {
        request({
          url: '/admin/menu/index',
          method: 'post',
          data: this.queryInfo
        }).then(res => {
          if (res.code === 200) {
            this.menuData = res.data;
          }
        })
      },
      menuStatusChange(menuInfo) {
        request({
          url: '/admin/menu/status',
          method: 'post',
          data: {
            menu_id: menuInfo.menu_id,
            menu_status: menuInfo.menu_status ? 0 : 1
          }
        }).then(res => {
          if (res.code !== 200) {
            menuInfo.menu_status = !menuInfo.menu_status;
            return this.$message.error('更新菜单状态失败')
          }
          this.$message.success('更新菜单状态成功');
        })
      },
      storeMenuDialogColse() {
        this.$refs.storeMenuFormRef.resetFields();
      },
      updateMenuDialogColse() {
        this.$refs.updateMenuFormRef.resetFields();
      },
      storeMenuDialogShow(menuParentId) {
        this.storeMenuDialogVisible = true;
        this.storeMenuFormData.menu_parent_id = menuParentId;
      },
      updateMenuDialogShow(menuId) {
        this.updateMenuDialogVisible = true;
        request({
          url: '/admin/menu/show',
          method: 'post',
          data: {
            menu_id: menuId
          }
        }).then(res => {
          if (res.code === 200) {
            this.updateMenuFormData = res.data;
          }
        })
      },
      submitStoreMenuForm() {
        this.$refs.storeMenuFormRef.validate(valid => {
          if (valid) {
            request({
              url: '/admin/menu/store',
              method: 'post',
              data: this.storeMenuFormData
            }).then(res => {
              if (res.code !== 200) {
                return this.$message.error('添加菜单失败');
              }
              this.$message.success('添加菜单成功');
              this.storeMenuDialogVisible = false;
              this.getMenuList();
            });
          }
        });
      },
      submitUpdateMenuForm() {
        this.$refs.updateMenuFormRef.validate(valid => {
          if (valid) {
            request({
              url: '/admin/menu/update',
              method: 'post',
              data: this.updateMenuFormData
            }).then(res => {
              if (res.code !== 200) {
                return this.$message.error('更新菜单失败');
              }
              this.$message.success('更新菜单成功');
              this.updateMenuDialogVisible = false;
              this.getMenuList();
            });
          }
        });
      },
      deleteMenu(menuId) {
        this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request({
            url: '/admin/menu/destroy',
            method: 'post',
            data: {
              menu_id: menuId
            }
          }).then(res => {
            if (res.code !== 200) {
              return this.$message.error('删除菜单失败');
            }
            this.$message.success('删除菜单成功');
            this.getMenuList();
          })
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
      menuLevelColor(level) {
        let colors = ['info', 'primary', 'success', 'warning', 'danger'];
        return colors[level % 5];
      }
    },
    created() {
      this.menuPreview();
      this.getMenuList();
    }
  }
</script>

<style scoped>

</style>
