<template>
  <div class="elementIndex">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统资源管理</el-breadcrumb-item>
      <el-breadcrumb-item>元素管理</el-breadcrumb-item>
      <el-breadcrumb-item>元素列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜素与添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.element_name"
            placeholder="请输入元素名"
            :clearable="true"
            @clear="getElementList">
            <el-button slot="append" icon="el-icon-search" @click="getElementList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="storeElementDialogVisible=true">添加元素</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据 -->
      <el-table :data="elementListData" :border="true" :stripe="true" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="element_name" label="元素名" width="120"></el-table-column>
        <el-table-column prop="element_code" label="编号"></el-table-column>
        <el-table-column label="类型" width="100">
          <template slot-scope="scope">
            <el-button size="mini" plain :type="scope.row.element_type==='page'?'primary':'success'">
              {{scope.row.element_type}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="element_desc" label="描述"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" sortable></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!--  编辑  -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="updateElementDialogShow(scope.row.element_id)"></el-button>
            <!--  删除  -->
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="deleteElement(scope.row.element_id)"></el-button>
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

    <!--  添加元素对话框  -->
    <el-dialog
      title="添加元素"
      :visible.sync="storeElementDialogVisible"
      width="50%"
      @close="storeElementDialogColse">
      <!--   添加元素表单   -->
      <el-form
        ref="storeElementFormRef"
        :model="storeElementFormData"
        :rules="storeElementFormRules"
        status-icon
        label-width="80px">
        <el-form-item label="元素名" prop="element_name">
          <el-input v-model="storeElementFormData.element_name"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="element_type">
          <el-radio-group v-model="storeElementFormData.element_type">
            <el-radio :label="item.value" v-for="item in previewData" :key="item.value">
              {{item.text}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="编号" prop="element_code">
          <el-input v-model="storeElementFormData.element_code"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="element_sort_order">
          <el-input v-model.number="storeElementFormData.element_sort_order"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="element_desc">
          <el-input v-model="storeElementFormData.element_desc" type="textarea" :row="2"></el-input>
        </el-form-item>
        <slot name="button"></slot>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="storeElementDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitStoreElementForm">确 定</el-button>
      </span>
    </el-dialog>

    <!--  修改元素对话框  -->
    <el-dialog
      title="修改元素"
      :visible.sync="updateElementDialogVisible"
      width="50%"
      @close="updateElementDialogColse">
      <!--   修改元素表单   -->
      <el-form
        ref="updateElementFormRef"
        :model="updateElementFormData"
        :rules="storeElementFormRules"
        status-icon
        label-width="80px">
        <el-form-item label="元素名" prop="element_name">
          <el-input v-model="updateElementFormData.element_name"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="element_type">
          <el-radio-group v-model="updateElementFormData.element_type">
            <el-radio :label="item.value" v-for="item in previewData" :key="item.value">
              {{item.text}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="编号" prop="element_code">
          <el-input v-model="updateElementFormData.element_code"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="element_sort_order">
          <el-input v-model.number="updateElementFormData.element_sort_order"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="element_desc">
          <el-input v-model="updateElementFormData.element_desc" type="textarea" :row="2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateElementDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateElementForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {request} from "../../http/request";

  export default {
    name: "ElementIndex",
    data() {
      return {
        previewData: [],
        queryInfo: {
          element_name: '',
          page: 1,
          limit: 10
        },
        total: 0,
        elementListData: [],
        storeElementDialogVisible: false,
        updateElementDialogVisible: false,
        storeElementFormData: {
          element_name: '',
          element_type: 'page',
          element_code: '',
          element_desc: '',
          element_sort_order: 100
        },
        updateElementFormData: {
          element_id: '',
          element_name: '',
          element_type: 'page',
          element_code: '',
          element_desc: '',
          element_sort_order: 100
        },
        storeElementFormRules: {
          element_name: [
            {required: true, message: '请输入元素名', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          element_code: [
            {required: true, message: '请输入编号', trigger: 'blur'},
            {min: 0, max: 30, message: '最多 30 个字符', trigger: 'blur'},
          ],
          element_type: [
            {required: true, message: '请选择元素类型', trigger: 'change'}
          ],
          element_sort_order: [
            {type: 'number', message: '请输入合法数字', trigger: 'blur'}
          ],
          element_desc: [
            {min: 0, max: 100, message: '最多 100 个字符', trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      elementPreview() {
        request({
          url: '/admin/element/preview',
          method: 'post'
        }).then(res => {
          if (res.code === 200) {
            this.previewData = res.data;
          }
        })
      },
      getElementList() {
        request({
          url: '/admin/element/index',
          method: 'post',
          data: this.queryInfo
        }).then(res => {
          if (res.code === 200) {
            this.elementListData = res.data;
          }
        })
      },
      // 监听 pageSize 改变事件
      handleSizeChange(newSize) {
        this.queryInfo.limit = newSize;
        this.getElementList();
      },
      // 监听 page 改变事件
      handleCurrentChange(newPage) {
        this.queryInfo.page = newPage;
        this.getElementList();
      },
      storeElementDialogColse() {
        this.$refs.storeElementFormRef.resetFields();
      },
      updateElementDialogColse() {
        this.$refs.updateElementFormRef.resetFields();
      },
      updateElementDialogShow(elementId) {
        this.updateElementDialogVisible = true;
        request({
          url: '/admin/element/show',
          method: 'post',
          data: {
            element_id: elementId
          }
        }).then(res => {
          if (res.code === 200) {
            this.updateElementFormData = res.data;
          }
        })
      },
      submitStoreElementForm() {
        this.$refs.storeElementFormRef.validate((valid) => {
          if (valid) {
            request({
              url: '/admin/element/store',
              method: 'post',
              data: this.storeElementFormData
            }).then(res => {
              if (res.code !== 200) {
                return this.$message.error('添加元素失败');
              }
              this.$message.success('添加元素成功');
              this.storeElementDialogVisible = false;
              this.getElementList();
            });
          }
        });
      },
      submitUpdateElementForm() {
        this.$refs.updateElementFormRef.validate(valid => {
          if (valid) {
            request({
              url: '/admin/element/update',
              method: 'post',
              data: this.updateElementFormData
            }).then(res => {
              if (res.code !== 200) {
                return this.$message.error('更新元素失败');
              }
              this.$message.success('更新元素成功');
              this.updateElementDialogVisible = false;
              this.getElementList();
            });
          }
        });
      },
      deleteElement(elementId) {
        this.$confirm('此操作将永久删除该元素, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request({
            url: '/admin/element/destroy',
            method: 'post',
            data: {
              element_id: elementId
            }
          }).then(res => {
            if (res.code !== 200) {
              return this.$message.error('删除元素失败');
            }
            this.$message.success('删除元素成功');
            this.getElementList();
          })
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      }
    },
    created() {
      this.elementPreview();
      this.getElementList();
    }
  }
</script>

<style scoped>

</style>
