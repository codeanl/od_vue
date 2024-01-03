<template>
  <!-- 搜索 -->
  <el-card>
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
  </el-card>

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
        label="个性签名"
        align="center"
        prop="intro"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #="{ row }">
          <el-tag type="success" v-if="row.status == '1'">正常</el-tag>
          <el-tag type="danger" v-if="row.status == '0'">禁用</el-tag>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="150">
        <template #="{ row }">
          <el-button
            type="warning"
            :icon="User"
            circle
            @click="loolLoginLog(row)"
          />
          <el-button
            type="primary"
            :icon="Edit"
            circle
            @click="updataUser(row)"
          />
          <el-popconfirm
            :title="`你确定删除${row.nickname}`"
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
      <el-form-item label="昵称" prop="nickname">
        <el-input
          placeholder="请您输入昵称"
          v-model="userParams.nickname"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          placeholder="请您输入邮箱"
          v-model="userParams.email"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="userParams.status"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="avatar" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8080/file/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="userParams.avatar"
            :src="userParams.avatar"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="centerDialogVisible1" title="查看登录日志" center>
    <el-table border :data="loginLog" style="margin: 10px 0">
      <el-table-column
        label="登录时间"
        align="center"
        prop="createdAt"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="ip"
        align="center"
        prop="ip"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { Delete, Edit, User } from "@element-plus/icons-vue";
import {
  reqMemberList,
  reqMemberUpdata,
  reqMemberDelete,
  reqMemberLoginLog,
} from "@/api/member";
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
    nickname: nickname.value,
    phone: phone.value,
    email: email.value,
    status: status.value,
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
// 删除用户按钮
const deleteUser = async (userId) => {
  ids.value.push(userId);
  const requestData = { ids: ids.value }; // 提取 ids 引用的值并构造请求数据对象
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
  const requestData = { ids: ids.value };
  let res = await reqMemberDelete(requestData);
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
  phone: "",
  nickname: "",
  email: "",
  status: "",
  avatar: "",
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
//
const centerDialogVisible1 = ref(false);
const loginLog = ref([]);
const loolLoginLog = async (row) => {
  centerDialogVisible1.value = true;
  let res = await reqMemberLoginLog({ params: { id: row.id } });
  if (res.data.code == 200) {
    loginLog.value = res.data.data;
  }
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

//图片上传成功的钩子
const handleAvatarSuccess = (response) => {
  //上传返回的数据 图片url  uploadFile
  userParams.avatar = response.data;
  formRef.value.clearValidate("pic");
};
//上传图片之前出发的钩子函数
const beforeAvatarUpload = (rawFile) => {
  if (
    rawFile.type === "image/png" ||
    rawFile.type === "image/jpeg" ||
    rawFile.type === "image/gif"
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true;
    } else {
      ElMessage({
        type: "error",
        message: "上传的文件大小应小于4M",
      });
    }
  } else {
    ElMessage({
      type: "error",
      message: "上传的文件类型必须是PNG|JPG|GIF",
    });
    return false;
  }
};
</script>

<style lang="scss" scoped></style>
<style>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
