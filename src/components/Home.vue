<template>
  <div class="home">
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
        <el-aside :width="this.isCollapse ? '64px' : '240px'">
          <div class="toggleButton" @click="toggleCollapse">|||</div>
          <el-menu
            background-color="#333744"
            text-color="#FFF"
            active-text-color="#409EFF"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath">
            <!--  一级菜单  -->
            <el-submenu :index="item.menu_id+''" v-for="item in menuData" :key="item.menu_id">
              <!-- 一级菜单模板区域 -->
              <template slot="title">
                <i :class="item.menu_icon"></i>
                <span>{{item.menu_name}}</span>
              </template>

              <!--  二级菜单  -->
              <el-submenu :index="cItem.menu_id+''" v-for="cItem in item.menu_children" :key="cItem.menu_id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{cItem.menu_name}}</span>
                </template>

                <!--  三级菜单  -->
                <el-menu-item
                  :index="ccItem.menu_href"
                  v-for="ccItem in cItem.menu_children"
                  :key="ccItem.menu_id"
                  @click="saveNavState('/'+ccItem.menu_href)">
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{ccItem.menu_name}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>

            </el-submenu>
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
  import {request} from "../http/request";

  export default {
    name: "Home",
    data() {
      return {
        menuData: [],
        elementData: {},
        isCollapse: false,
        activePath: ''
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
      },
      saveNavState(activePath) {
        this.activePath = activePath;
        window.sessionStorage.setItem('activePath', activePath);
      }
    },
    created() {
      this.getPermission();
      this.activePath = window.sessionStorage.getItem('activePath');
    }
  }
</script>

<style scoped>
  .home, .el-container {
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
