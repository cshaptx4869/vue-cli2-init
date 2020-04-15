<template>
  <div class="roleAuthorize">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
      <el-tab-pane label="菜单授权" name="menu">
        <el-tree
          ref="menuTree"
          :data="menu"
          highlight-current
          show-checkbox
          check-strictly
          node-key="menu_id"
          :default-checked-keys="authorizedMenu"
          default-expand-all
          :props="defaultProps">
        </el-tree>
      </el-tab-pane>

      <el-tab-pane label="页面元素授权" name="element">
        <el-select v-model="authorizedElement" placeholder="请选择" filterable multiple>
          <el-option
            v-for="item in element"
            :key="item.element_id"
            :label="item.element_name"
            :value="item.element_id">
          </el-option>
        </el-select>
      </el-tab-pane>
    </el-tabs>

    <div style="margin-top: 20px">
      <el-button type="primary" @click="authorize">确定</el-button>
      <el-button type="info" @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>

<script>
  import {request} from "../../http/request";

  export default {
    name: "RoleAuthorize",
    data() {
      return {
        defaultProps: {
          children: 'menu_children',
          label: 'menu_name'
        },
        activeName: 'menu',
        previewData: [],
        menu: [],
        authorizedMenu: [],
        element: [],
        authorizedElement: [],
        authorizeData: {
          role_id: this.$route.params.id,
          menu_id: [],
          element_id: []
        }
      }
    },
    methods: {
      authorizePreview() {
        request({
          url: '/admin/role/authorizePreview',
          method: 'post',
          data: {
            role_id: this.$route.params.id
          }
        }).then(res => {
          if (res.code === 200) {
            this.menu = res.data.menu;
            this.authorizedMenu = res.data.authorized_menu;
            this.element = res.data.element;
            this.authorizedElement = res.data.authorized_element;
          }
        })
      },
      authorize() {
        this.authorizeData.menu_id = JSON.stringify(this.$refs.menuTree.getCheckedKeys());
        this.authorizeData.element_id = JSON.stringify(this.authorizedElement);
        request({
          url: '/admin/role/authorize',
          method: 'post',
          data: this.authorizeData
        }).then(res => {
          if (res.code !== 200) {
            return this.$message.error('授权失败');
          }
          this.$message.success('授权成功');
          this.$router.push('/role/index');
        })
      },
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },
    created() {
      this.authorizePreview();
    }
  }
</script>

<style scoped>

</style>
