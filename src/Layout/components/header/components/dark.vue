<template>
  <el-switch
    class="switch"
    v-model="status"
    active-value="true"
    inactive-value="false"
    @change="changeStatus()"
  />
  <!-- style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" -->
</template>

<script setup>
import { ref } from "vue";
const status = ref(false);
//
import useSettingStore from "@/store/setting";
let settingStore = useSettingStore();

if (settingStore.dark == "true") {
  status.value = true;
}
//
const changeStatus = () => {
  settingStore.changeStatus(status.value);
};
</script>

<style>
.switch {
  margin-right: 10px;
}
</style>
