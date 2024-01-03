<template>
  <el-dropdown>
    <div class="avatar">
      <el-avatar :size="40" :src="userStore.avatar" />
      <span class="el-dropdown-link"> {{ userStore.nickname }} </span>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :icon="Plus" @click="profile"
          >个人信息</el-dropdown-item
        >
        <el-dropdown-item :icon="CirclePlusFilled" @click="logout">
          退出登录</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { CirclePlusFilled, Plus } from "@element-plus/icons-vue";

import useUserStore from "@/store/user";
let userStore = useUserStore();
//
import { useRouter } from "vue-router";
const router = useRouter();
const profile = () => {
  router.push("/profile");
};

const logout = async () => {
  await userStore.userLogout();
  router.push("/login");
};
</script>

<style lang="scss">
.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-size: 17px;
    margin: 0 5px 0 5px;
  }
}
</style>
