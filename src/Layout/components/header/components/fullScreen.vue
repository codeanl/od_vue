<template>
  <el-button :icon="FullScreen" circle class="btn" @click="fullScreen" />
</template>

<script setup>
import { FullScreen } from "@element-plus/icons-vue";

const fullScreen = () => {
  let full = document.fullscreenElement;
  if (!full) {
    //文档跟节点requestFullscreen实现全屏模式
    document.documentElement.requestFullscreen();
  } else {
    //退出全屏
    document.exitFullscreen();
  }
};
</script>

<style lang="scss" scoped>
.btn {
  margin-top: 5px;
  margin-right: 10px;
}
</style>
