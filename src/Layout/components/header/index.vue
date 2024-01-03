<template>
  <div class="tabbar">
    <div class="left">
      <!-- 面包屑 -->
      <Breadcrumb />
    </div>
    <div class="right">
      <!-- 暗黑模式 -->
      <Dark />
      <!-- 全屏按钮 -->
      <FullScreen />
      <!-- 头像下拉 -->
      <Avatar />
    </div>
  </div>
</template>

<script setup>
import Avatar from "./components/avatar.vue";
import FullScreen from "./components/fullScreen.vue";
import Breadcrumb from "./components/breadcrumb.vue";
import Dark from "./components/dark.vue";
</script>

<style lang="scss" scoped>
.tabbar {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  //background-color: rgb(245, 247, 246);
}
</style>
