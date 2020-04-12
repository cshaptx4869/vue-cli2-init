<template>
  <div class="layout">
    <el-container>
      <!--  头部区  -->
      <el-header>
        <div class="headerLeft">
          <img src="../assets/img/logo.jpg" alt="logo">
          <span>白開水の后花园</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>

      <el-container>
        <!--  左侧区  -->
        <el-aside :width="this.isCollapse ? '64px' : '200px'">
          <div class="toggleButton" @click="toggleCollapse">|||</div>
          <!--  菜单  -->
          <el-menu
            background-color="#333744"
            text-color="#FFF"
            active-text-color="#409EFF"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="$route.path">
            <MenuTree :menuData="this.menuData"></MenuTree>
          </el-menu>
        </el-aside>
        <!--  主体区  -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import {request} from "../http/request"
  import MenuTree from './aside/MenuTree'

  export default {
    name: "Layout",
    data() {
      return {
        menuData: [],
        elementData: {},
        isCollapse: false,
        collapseClass: {}
      }
    },
    methods: {
      logout: function () {
        this.$common.clearToken();
        this.$router.push('/login');
      },
      getPermission: function () {
        request({
          url: '/admin/user/permission',
          method: 'post'
        }).then(res => {
          if (res.code === 200) {
            this.menuData = res.data.menu;
            this.elementData = res.data.element;
          }
        })
      },
      toggleCollapse: function () {
        this.isCollapse = !this.isCollapse;
      }
    },
    created() {
      this.getPermission();
    },
    components: {
      MenuTree
    }
  }
</script>

<style scoped>
  .layout, .el-container {
    height: 100%;
  }

  .el-header {
    background-color: #373D41;
    padding-left: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #FFF;
    font-size: 20px;
  }

  .headerLeft {
    height: 100%;
    display: flex;
    align-items: center;
    border-radius: 50%;
  }

  .headerLeft img {
    height: 100%;
    margin-right: 15px;
    border-radius: 50%;
  }

  .el-aside {
    background-color: #333744;
  }

  .el-main {
    background-color: #EAEDF1;
  }

  .el-menu {
    border-right: none;
  }

  .el-menu--collapse {
    width: 64px;
  }

  .toggleButton {
    background-color: #4A5064;
    color: #FFF;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
