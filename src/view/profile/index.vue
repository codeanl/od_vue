<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <!--  -->
    <el-tab-pane label="个人信息" name="first">
      <el-form label-width="100px" :model="userForm" style="max-width: 460px">
        <el-form-item label="昵称">
          <el-input v-model="userForm.nickname" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="upProfile">修改</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <!--  -->
    <el-tab-pane label="修改密码" name="second">
      <el-form label-width="100px" :model="passForm" style="max-width: 460px">
        <el-form-item label="旧密码">
          <el-input v-model="passForm.old_pwd" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passForm.password" />
        </el-form-item>
        <!-- <el-form-item label="确认密码">
          <el-input v-model="passForm.re_pwd" />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="setPass">修改</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
const activeName = ref("first");
import {
  reqUserUpPass,
  reqUserInfo,
  reqUserProflie,
  reqUpdatePwd,
} from "@/api/user";
onMounted(() => {
  getHas();
});
const getHas = async () => {
  let res = await reqUserInfo();
  Object.assign(userForm, res.data.data);
};

//收集数据
const passForm = reactive({
  old_pwd: "",
  password: "",
  re_pwd: "",
});
const userForm = reactive({
  nickname: "",
  email: "",
  phone: "",
});

//pinia router
import useUserStore from "@/store/user";
let userStore = useUserStore();
import { useRouter } from "vue-router";
const router = useRouter();
//修改密码按钮
const setPass = async () => {
  let res = await reqUpdatePwd(passForm);
  if (res.data.code == 200) {
    ElMessage({ type: "success", message: "sueecss" });
    await userStore.userLogout();
    router.push("/login");
  } else {
    ElMessage({ type: "error", message: res.data.message });
  }
};

const upProfile = async () => {
  let res = await reqUserProflie(userForm);
  console.log(userForm);
  if (res.data.code == 200) {
    await userStore.userInfo();
    ElMessage({ type: "success", message: "sueecss" });
  } else {
    ElMessage({ type: "error", message: res.data.message });
  }
};
</script>
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
