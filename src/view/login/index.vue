<template>
  <div class="center-card">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>欢迎登录后台管理</span>
        </div>
      </template>
      <div class="form">
        <el-input
          style="margin: 5px 0"
          v-model="form.username"
          placeholder="请输入账户"
        />
        <el-input
          style="margin: 5px 0"
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
        />
        <el-button
          type="primary"
          style="width: 100%; margin: 10px 0"
          @click="login"
          >登录</el-button
        >
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
const form = reactive({
  username: "admin",
  password: "123456",
});

import { useRouter } from "vue-router";
const router = useRouter();
//
import useUserStore from "@/store/user";
let userStore = useUserStore();

const login = async () => {
  let res = await userStore.userLogin(form);
  let res1 = await userStore.userInfo();
  if (res == "ok") {
    if (res1 == "ok") {
      ElMessage({
        message: "登录成功",
        type: "success",
      });
      router.push("/");
    } else {
      ElMessage({
        message: "获取用户信息失败",
        type: "error",
      });
    }
  } else {
    ElMessage({
      message: "登录失败",
      type: "error",
    });
  }
};
</script>
<style lang="scss">
.center-card {
  background: url(@/assets/img/login_bg.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 98vh;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .box-card {
      width: 500px;
    }
  }
}
</style>
