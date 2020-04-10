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
      <!-- 搜素与天健 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.user_name"
            placeholder="请输入内容"
            :clearable="true"
            @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据 -->
      <el-table :data="userList" :border="true" :stripe="true" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="user_name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="user_email" label="邮箱"></el-table-column>
        <el-table-column prop="user_mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色" :formatter="joinRoleName"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.user_status" @change="userStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.user_id)"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delete(scope.row.user_id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="set(scope.row.user_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 layout属性显示页面要显示的内容-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
    import {request} from "../../http/request";

    export default {
        name: "UserIndex",
        data() {
            return {
                queryInfo: {
                    user_name: '',
                    page: 1,
                    limit: 1
                },
                userList: [],
                total: 0
            }
        },
        methods: {
            getUserList() {
                request({
                    url: '/admin/user/index',
                    method: 'post',
                    data: this.queryInfo
                }).then(res => {
                    if (!res.code === 200) {
                        return this.$message.error('获取用户信息失败');
                    }
                    this.userList = res.data.items;
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
                console.log(userInfo);
            },
            // 处理多角色数据
            joinRoleName(row, col) {
                let roleName = [];
                for (let i = 0; i < row.role_name.length; i++) {
                    roleName.push(row.role_name);
                }
                return roleName.join(' ');
            }
        },
        created() {
            this.getUserList()
        }
    }
</script>

<style scoped>

</style>
