<template>
  <div class="apiIndex">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统资源管理</el-breadcrumb-item>
      <el-breadcrumb-item>接口管理</el-breadcrumb-item>
      <el-breadcrumb-item>接口列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜素与添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.api_name"
            placeholder="请输入接口名"
            :clearable="true"
            @clear="getApiList">
            <el-button slot="append" icon="el-icon-search" @click="getApiList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="storeApiDialogVisible=true">添加接口</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据 -->
      <el-table :data="apiListData" :border="true" :stripe="true" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="api_name" label="元素名" width="120"></el-table-column>
        <el-table-column prop="api_route" label="路由"></el-table-column>
        <el-table-column label="请求方法" width="100">
          <template slot-scope="scope">
            <el-button size="mini" plain type="primary">
              {{scope.row.api_method}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="api_desc" label="描述"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" sortable></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!--  编辑  -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="updateApiDialogShow(scope.row.api_id)"></el-button>
            <!--  删除  -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="deleteApi(scope.row.api_id)"></el-button>
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

    <!--  添加接口对话框  -->
    <el-dialog
      title="添加接口"
      :visible.sync="storeApiDialogVisible"
      width="50%"
      @close="storeApiDialogColse">
      <!--   添加接口表单   -->
      <el-form
        ref="storeApiFormRef"
        :model="storeApiFormData"
        :rules="storeApiFormRules"
        status-icon
        label-width="80px">
        <el-form-item label="接口名" prop="api_name">
          <el-input v-model="storeApiFormData.api_name"></el-input>
        </el-form-item>
        <el-form-item label="路由" prop="api_route">
          <el-input v-model="storeApiFormData.api_route"></el-input>
        </el-form-item>
        <el-form-item label="请求方法" prop="api_method">
          <el-radio-group v-model="storeApiFormData.api_method">
            <el-radio :label="item.value" v-for="item in previewData" :key="item.value">
              {{item.text}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="api_sort_order">
          <el-input v-model.number="storeApiFormData.api_sort_order"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="api_desc">
          <el-input v-model="storeApiFormData.api_desc" type="textarea" :row="2"></el-input>
        </el-form-item>
        <slot name="button"></slot>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="storeApiDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitStoreApiForm">确 定</el-button>
      </span>
    </el-dialog>

    <!--  修改接口对话框  -->
    <el-dialog
      title="修改接口"
      :visible.sync="updateApiDialogVisible"
      width="50%"
      @close="updateApiDialogColse">
      <!--   修改接口表单   -->
      <el-form
        ref="updateApiFormRef"
        :model="updateApiFormData"
        :rules="storeApiFormRules"
        status-icon
        label-width="80px">
        <el-form-item label="接口名" prop="api_name">
          <el-input v-model="updateApiFormData.api_name"></el-input>
        </el-form-item>
        <el-form-item label="路由" prop="api_route">
          <el-input v-model="updateApiFormData.api_route"></el-input>
        </el-form-item>
        <el-form-item label="请求方法" prop="api_method">
          <el-radio-group v-model="updateApiFormData.api_method">
            <el-radio :label="item.value" v-for="item in previewData" :key="item.value">
              {{item.text}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="api_sort_order">
          <el-input v-model.number="updateApiFormData.api_sort_order"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="api_desc">
          <el-input v-model="updateApiFormData.api_desc" type="textarea" :row="2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateApiDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateApiForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {request} from "../../http/request";

  export default {
    name: "ApiIndex",
    data() {
      return {
        previewData: [],
        queryInfo: {
          api_name: '',
          page: 1,
          limit: 10
        },
        total: 0,
        apiListData: [],
        storeApiDialogVisible: false,
        updateApiDialogVisible: false,
        storeApiFormData: {
          api_name: '',
          api_route: '',
          api_method: 'post',
          api_desc: '',
          api_sort_order: 100
        },
        updateApiFormData: {
          api_id: '',
          api_name: '',
          api_route: '',
          api_method: 'post',
          api_desc: '',
          api_sort_order: 100
        },
        storeApiFormRules: {
          api_name: [
            {required: true, message: '请输入接口名', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          api_route: [
            {required: true, message: '请输入路由', trigger: 'blur'},
            {min: 0, max: 30, message: '最多 30 个字符', trigger: 'blur'},
          ],
          api_method: [
            {required: true, message: '请选择请求方法', trigger: 'change'}
          ],
          api_sort_order: [
            {type: 'number', message: '请输入合法数字', trigger: 'blur'}
          ],
          api_desc: [
            {min: 0, max: 100, message: '最多 100 个字符', trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      apiPreview() {
        request({
          url: '/admin/api/preview',
          method: 'post'
        }).then(res => {
          if (res.code === 200) {
            this.previewData = res.data;
          }
        })
      },
      getApiList() {
        request({
          url: '/admin/api/index',
          method: 'post',
          data: this.queryInfo
        }).then(res => {
          if (res.code === 200) {
            this.apiListData = res.data.items;
          }
        })
      },
      // 监听 pageSize 改变事件
      handleSizeChange(newSize) {
        this.queryInfo.limit = newSize;
        this.getApiList();
      },
      // 监听 page 改变事件
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getApiList();
      },
      storeApiDialogColse() {
        this.$refs.storeApiFormRef.resetFields();
      },
      updateApiDialogColse() {
        this.$refs.updateApiFormRef.resetFields();
      },
      updateApiDialogShow(apiId) {
        this.updateApiDialogVisible = true;
        request({
          url: '/admin/api/show',
          method: 'post',
          data: {
            api_id: apiId
          }
        }).then(res => {
          if (res.code === 200) {
            this.updateApiFormData = res.data;
          }
        })
      },
      submitStoreApiForm() {
        this.$refs.storeApiFormRef.validate((valid) => {
          if (valid) {
            request({
              url: '/admin/api/store',
              method: 'post',
              data: this.storeApiFormData
            }).then(res => {
              if (res.code !== 200) {
                return this.$message.error('添加接口失败');
              }
              this.$message.success('添加接口成功');
              this.storeApiDialogVisible = false;
              this.getApiList();
            });
          }
        });
      },
      submitUpdateApiForm() {
        this.$refs.updateApiFormRef.validate(valid => {
          if (valid) {
            request({
              url: '/admin/api/update',
              method: 'post',
              data: this.updateApiFormData
            }).then(res => {
              if (res.code !== 200) {
                return this.$message.error('更新元素失败');
              }
              this.$message.success('更新元素成功');
              this.updateApiDialogVisible = false;
              this.getApiList();
            });
          }
        });
      },
      deleteApi(apiId) {
        this.$confirm('此操作将永久删除该接口, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request({
            url: '/admin/api/destroy',
            method: 'post',
            data: {
              api_id: apiId
            }
          }).then(res => {
            if (res.code !== 200) {
              return this.$message.error('删除接口失败');
            }
            this.$message.success('删除接口成功');
            this.getApiList();
          })
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      }
    },
    created() {
      this.apiPreview();
      this.getApiList();
    }
  }
</script>

<style scoped>

</style>
