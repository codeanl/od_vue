<template>
  <!-- 搜索 -->
  <!-- <el-card>
    <el-form :inline="true">
      <el-form-item label="昵称">
        <el-input placeholder="请输入搜索的昵称" v-model="nickname"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input placeholder="请输入搜索的手机号" v-model="phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input placeholder="请输入搜索的邮箱" v-model="email"></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="status" class="m-2" placeholder="请选择状态">
          <el-option label="正常" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="search">
          搜索
        </el-button>
        <el-button size="default" @click="restart">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card> -->

  <!--  -->
  <el-card>
    <el-button
      type="danger"
      size="default"
      :disabled="selectIdArr.length ? false : true"
      @click="deleteSelectUser"
    >
      批量删除
    </el-button>
    <el-table
      border
      :data="memberArr"
      style="margin: 10px 0"
      @selection-change="selectChange"
    >
      <!--复选框 -->
      <el-table-column
        type="selection"
        align="center"
        width="40px"
      ></el-table-column>
      <!--  -->
      <el-table-column
        label="id"
        align="center"
        prop="id"
        width="70"
      ></el-table-column>
      <el-table-column
        label="头像"
        align="center"
        prop="avatar"
        show-overflow-tooltip
        width="70"
      >
        <template #="{ row }">
          <img
            :src="row.avatar"
            alt="头像"
            style="width: 40px; height: 40px; border-radius: 50%"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="昵称"
        align="center"
        prop="nickname"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="邮箱"
        align="center"
        prop="email"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="手机号"
        align="center"
        prop="phone"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="上次登录"
        align="center"
        prop="ip_source"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="登录ip"
        align="center"
        prop="ip_address"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="上次登录时间"
        align="center"
        prop="last_login_time"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="状态"
        align="center"
        prop="status"
        show-overflow-tooltip
        width="60px"
      >
        <template #="{ row }">
          <el-switch
            v-model="row.status"
            class="ml-2"
            active-value="1"
            inactive-value="0"
            @change="handleChange(row)"
          />
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="150">
        <template #="{ row }">
          <el-button type="warning" :icon="User" circle @click="setRole(row)" />
          <el-button
            type="primary"
            :icon="Edit"
            circle
            @click="updataUser(row)"
          />
          <el-popconfirm
            :title="`你确定删除${row.name}`"
            width="260px"
            @confirm="deleteUser(row.id)"
          >
            <template #reference>
              <el-button type="danger" :icon="Delete" circle> </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 15, 20]"
      :background="true"
      layout="prev, pager, next, jumper, -> , sizes, total"
      :total="total"
      @current-change="getHas"
      @size-change="handler"
    />
  </el-card>

  <!--  -->
  <el-dialog
    v-model="centerDialogVisible"
    title="'更新用户'"
    width="800"
    center
  >
    <el-form :model="userParams">
      <el-form-item label="手机号" prop="phone">
        <el-input
          placeholder="请您输入手机号"
          v-model="userParams.phone"
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname" v-if="userParams.id > 0">
        <el-input
          placeholder="请您输入昵称"
          v-model="userParams.nickname"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" v-if="userParams.id > 0">
        <el-input
          placeholder="请您输入邮箱"
          v-model="userParams.email"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { Delete, Edit, User } from "@element-plus/icons-vue";
import { reqMemberList, reqMemberUpdata, reqMemberDelete } from "@/api/member";
//收集用户查找的关键字
let nickname = ref("");
let phone = ref("");
let email = ref("");
let status = ref("");
//准备批量删除用户的id
let selectIdArr = ref([]);
//收集删除的id
let ids = ref([]);
//默认个数 默认页码
let pageNo = ref(1);
let pageSize = ref(10);
let total = ref(0);

onMounted(() => {
  getHas();
});
//下拉改变
const handler = () => {
  getHas();
};
//获取用户信息
let memberArr = ref([]);
const getHas = async () => {
  let data = {
    pageSize: pageSize.value,
    pageNum: pageNo.value,
    // nickname: nickname.value,
    // phone: phone.value,
    // email: email.value,
    // status: status.value,
  };
  let res = await reqMemberList({ params: data });
  if (res.data.code == 200) {
    memberArr.value = res.data.data.list;
    total.value = res.data.data.total;
  } else {
    ElMessage({ type: "error", message: "获取列表失败" });
  }
};
//复选框选择
const selectChange = (value) => {
  selectIdArr.value = value;
};

//搜索按钮
const search = () => {
  getHas();
  phone.value = "";
  nickname.value = "";
  email.value = "";
  status.value = "";
};
//重置按钮
const restart = () => {
  nickname.value = "";
  phone.value = "";
  email.value = "";
  status.value = "";
  getHas();
};

//对话框
const centerDialogVisible = ref(false);
//收集用户信息
let userParams = reactive({
  id: 0,
  phone: "",
  nickname: "",
  email: "",
  status: "",
});

//编辑用户按钮
const updataUser = (row) => {
  centerDialogVisible.value = true;
  Object.assign(userParams, row);
};

//窗口保存按钮
const save = async () => {
  let res = await reqMemberUpdata(userParams);
  if (res.data.code == 200) {
    centerDialogVisible.value = false;
    ElMessage({ type: "success", message: "sueecss" });
    getHas();
  } else {
    ElMessage({ type: "error", message: "error" });
  }
};

// 删除用户按钮
const deleteUser = async (userId) => {
  ids.value.push(userId);
  const requestData = { id: ids.value }; // 提取 ids 引用的值并构造请求数据对象
  let res = await reqMemberDelete(requestData);
  if (res.data.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHas();
  } else {
    ElMessage({ type: "error", message: "删除失败" });
  }
};

//批量删除用户按钮
const deleteSelectUser = async () => {
  ids.value = [];
  ids.value = selectIdArr.value.map((item) => {
    return item.id;
  });
  const requestData = { id: ids.value };
  let res = await reqMemberDelete(requestData);
  if (res.data.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHas();
  } else {
    ElMessage({ type: "error", message: "删除失败" });
  }
};
</script>

<style lang="scss" scoped></style>
