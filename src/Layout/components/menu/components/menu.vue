<template>
  <el-menu
    :default-active="'/'"
    :border="false"
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    default-active="2"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
  >
    <template v-for="item in userStore.menuList" :index="item.path">
      <!-- 没有子路由 -->
      <template v-if="item.children.length == 0">
        <el-menu-item :index="item.path" @click="goRoute(item.path)">
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 有子路由但只有一个 -->
      <template v-if="item.children.length == 1">
        <el-menu-item
          :index="item.children[0].path"
          @click="goRoute(item.children[0].path)"
        >
          <template #title>
            <el-icon>
              <component :is="item.children[0].icon"></component>
            </el-icon>
            <span>{{ item.children[0].name }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 有子路由且大于一个 -->
      <template v-if="item.children.length > 1">
        <el-sub-menu :index="item.path">
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="i in item.children"
            :index="i.path"
            @click="goRoute(i.path)"
          >
            <template #title>
              <el-icon>
                <component :is="i.icon"></component>
              </el-icon>
              <span>{{ i.name }}</span>
            </template>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </template>
  </el-menu>
</template>

<script setup>
import useUserStore from "@/store/user";
let userStore = useUserStore();

import { useRouter } from "vue-router";
const router = useRouter();
const goRoute = (vc) => {
  router.push(vc);
};
</script>

<style></style>
