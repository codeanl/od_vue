<template>
  <el-container>
    <el-aside class="menu">
      <!--  -->
      <Menu></Menu>
    </el-aside>
    <el-container>
      <!--  -->
      <el-header class="header">
        <Header></Header>
      </el-header>
      <!--  -->
      <el-main class="main">
        <transition>
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import Menu from "./components/menu/index.vue";
import Header from "./components/header/index.vue";
</script>

<style lang="scss">
.menu {
  width: 200px;
  height: 98vh;
  background-color: #545c64;
}
.header {
  height: 50px;
  background-color: rgb(241, 241, 241);
}
.main {
  height: calc(98vh - 50px);
}
</style>
