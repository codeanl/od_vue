<template>
  <el-row>
    <el-col>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item index="1">
          <el-icon><icon-menu /></el-icon>
          <span><router-link to="/" class="lick">首页</router-link></span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><location /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="2-1"
            ><router-link to="/sys/user" class="lick"
              >用户管理</router-link
            ></el-menu-item
          >
          <el-menu-item index="2-2"
            ><router-link to="/sys/role" class="lick"
              >角色管理</router-link
            ></el-menu-item
          >
          <el-menu-item index="2-3"
            ><router-link to="/sys/menu" class="lick"
              >菜单管理</router-link
            ></el-menu-item
          >
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon><location /></el-icon>
            <span>商品管理</span>
          </template>
          <el-menu-item index="3-1"
            ><router-link to="/product/product" class="lick"
              >商品管理</router-link
            ></el-menu-item
          >
          <el-menu-item index="3-2"
            ><router-link to="/product/category" class="lick"
              >分类管理</router-link
            ></el-menu-item
          >
        </el-sub-menu>
        <el-menu-item index="4">
          <el-icon><icon-menu /></el-icon>
          <span
            ><router-link to="/member/member" class="lick"
              >会员管理</router-link
            ></span
          >
        </el-menu-item>
        <el-menu-item index="5">
          <el-icon><icon-menu /></el-icon>
          <span
            ><router-link to="/order/order" class="lick"
              >订单管理</router-link
            ></span
          >
        </el-menu-item>
        <el-menu-item index="7">
          <el-icon><icon-menu /></el-icon>
          <span
            ><router-link to="/profile" class="lick"
              >个人中心</router-link
            ></span
          >
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
</script>

<style lang="scss">
.lick {
  text-decoration: none; /* 取消下划线 */
  color: inherit; /* 保持链接文本颜色与父元素一致 */
}
</style>
