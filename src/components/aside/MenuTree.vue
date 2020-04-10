<template>
  <fragment class="menuTree">
    <template v-for="item in this.menuData">
      <!--  有子菜单  -->
      <el-submenu :index="item.menu_id+''" v-if="item.menu_children.length">
        <template slot="title">
          <i :class="item.menu_icon"></i>
          <span>{{item.menu_name}}</span>
        </template>
        <!--  递归调用  -->
        <MenuTree :menuData="item.menu_children"></MenuTree>
      </el-submenu>

      <!--  没有下级菜单  -->
      <el-menu-item :index="'/'+item.menu_href" v-else>
        <i :class="item.menu_icon"></i>
        <span slot="title">{{item.menu_name}}</span>
      </el-menu-item>
    </template>
  </fragment>
</template>

<script>
    export default {
        name: "MenuTree",
        props: {
            menuData: {
                type: Array,
                default() {
                    return []
                },
                required: true
            }
        }
    }
</script>

<style scoped>

</style>
