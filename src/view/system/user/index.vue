<template>
  <el-card>
    <el-button type="primary" size="default" @click="addUser"> 添加 </el-button>
    <el-button
      type="danger"
      size="default"
      :disabled="selectIdArr.length ? false : true"
      @click="deleteSelectUser"
    >
      批量删除
    </el-button>
    <!--  -->
    <el-table
      border
      :data="userArr"
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
        label="用户名"
        align="center"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
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
      <el-table-column prop="status" label="状态" align="center">
        <template #="{ row }">
          <el-tag type="success" v-if="row.status == '1'">正常</el-tag>
          <el-tag type="danger" v-if="row.status == '0'">禁用</el-tag>
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
            :title="`你确定删除${row.username}`"
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
  <!--  -->
  <!-- :title="userParams.id ? '更新用户' : '添加用户'" -->
  <el-dialog v-model="centerDialogVisible" width="800" center>
    <el-form :model="userParams">
      <el-form-item label="用户名" prop="username">
        <el-input
          placeholder="请您输入用户名"
          v-model="userParams.username"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          placeholder="请您输入手机号"
          v-model="userParams.phone"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="userParams.status"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>

  <!--  -->
  <el-dialog v-model="centerDialogVisible1" title="设置角色" width="800" center>
    <el-form>
      <el-form-item label="职位列表">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <el-checkbox-group
          v-model="userRole"
          @change="handleCheckedUsersChange"
        >
          <el-checkbox
            v-for="(role, index) in allRole"
            :key="index"
            :label="role"
          >
            {{ role.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <template #footer>
      <div style="flex: auto">
        <el-button @click="centerDialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { Delete, Edit, User } from "@element-plus/icons-vue";
import {
  reqUserList,
  reqUserDelete,
  reqUserAdd,
  reqUserUpdata,
  reqUserByID,
  reqSaveOrUpadteUser,
  reqUpdateUserRole,
} from "@/api/user";
import { reqRoleList } from "@/api/role";
import { ref, onMounted, reactive } from "vue";
//收集用户查找的关键字
let username = ref("");
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
let userArr = ref([]);
const getHas = async () => {
  let data = {
    pageSize: pageSize.value,
    pageNum: pageNo.value,
  };
  let res = await reqUserList({ params: data });
  if (res.data.code == 200) {
    userArr.value = res.data.data.list;
    total.value = res.data.data.total;
  } else {
    ElMessage({ type: "error", message: "获取列表失败" });
  }
};
//复选框选择
const selectChange = (value) => {
  selectIdArr.value = value;
};

// 删除用户按钮
const deleteUser = async (userId) => {
  ids.value.push(userId);
  const requestData = { ids: ids.value }; // 提取 ids 引用的值并构造请求数据对象
  let res = await reqUserDelete(requestData);
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
  const requestData = { ids: ids.value };
  let res = await reqUserDelete(requestData);
  if (res.data.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHas();
  } else {
    ElMessage({ type: "error", message: "删除失败" });
  }
};

//对话框
const centerDialogVisible = ref(false);
//收集用户信息
let userParams = reactive({
  id: 0,
  username: "",
  phone: "",
  status: "",
});
//添加用户按钮
const addUser = () => {
  centerDialogVisible.value = true;
  Object.assign(userParams, {
    id: 0,
    username: "",
    phone: "",
    status: "1",
  });
};

//编辑用户按钮
const updataUser = (row) => {
  centerDialogVisible.value = true;
  Object.assign(userParams, row);
};

//窗口保存按钮
const save = async () => {
  let res = await reqSaveOrUpadteUser(userParams);
  if (res.data.code == 200) {
    centerDialogVisible.value = false;
    ElMessage({ type: "success", message: "sueecss" });
    getHas();
  } else {
    ElMessage({ type: "error", message: "error" });
  }
};

//所有role
let allRole = ref([]);
// 用户role
let userRole = ref([]);
//全选框
const checkAll = ref(false);
//不确定样式
const isIndeterminate = ref(true);
//分配角色按钮
const centerDialogVisible1 = ref(false);
//选择当前的id
const newID = ref(0);
const setRole = async (row) => {
  newID.value = row.id;
  userRole.value = [];
  centerDialogVisible1.value = true;
  let res = await reqRoleList();
  if (res.data.code == 200) {
    allRole.value = res.data.data.list;
  }
  //   let res2 = await reqUserByID({ params: { id: row.id } });
  //   if (res2.data.code == 200) {
  //     userRole.value = res2.data.data.roles;
  //   }
};

//点击全选框
const handleCheckAllChange = (val) => {
  userRole.value = val ? allRole.value : []; //全选就把所有的role给它 否者为空
  isIndeterminate.value = false;
};
//底部复选框change事件
const handleCheckedUsersChange = (value) => {
  // 已经勾选的长度
  const checkedCount = value.length;
  checkAll.value = checkedCount === allRole.value.length; //boolean 不确定样式
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRole.value.length;
};

//分配角色 确定按钮
const confirmClick = async () => {
  let data = {
    id: newID.value,
    role_id: userRole.value.map((item) => {
      return item.id;
    }),
  };
  let res = await reqUpdateUserRole(data);
  if (res.data.code == 200) {
    centerDialogVisible1.value = false;
    getHas();
    ElMessage({ type: "success", message: "successs" });
  } else {
    ElMessage({ type: "error", message: "error" });
  }
};
</script>

<style lang="scss" scoped></style>
