<template>
  <!-- 搜索 -->
  <el-card>
    <el-form :inline="true">
      <el-form-item label="名称">
        <el-input placeholder="请输入搜索的名称" v-model="name"></el-input>
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
    <el-button type="primary" size="default" @click="add"> 添加 </el-button>
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
      :data="listArr"
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
        label="图片"
        align="center"
        prop="url"
        show-overflow-tooltip
        width="100"
      >
        <template #="{ row }">
          <img :src="row.url" alt="头像" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column
        label="名称"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="排序"
        align="center"
        prop="sort"
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
          <el-button type="primary" :icon="Edit" circle @click="updata(row)" />
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
    :title="Params.id ? '更新' : '添加'"
    width="800"
    center
  >
    <el-form :model="Params">
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请您输入名称" v-model="Params.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input placeholder="请您输入排序" v-model="Params.sort"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="Params.status"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="url" prop="url">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8080/file/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="Params.url" :src="Params.url" class="avatar" />
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
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import {
  reqSlideShowList,
  reqSlideShowDelete,
  SaveOrUpdateSlideShow,
} from "@/api/slideShow";
//收集用户查找的关键字
let name = ref("");
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
let listArr = ref([]);
const getHas = async () => {
  let data = {
    pageSize: pageSize.value,
    pageNum: pageNo.value,
    name: name.value,
    status: status.value,
  };
  let res = await reqSlideShowList({ params: data });
  if (res.data.code == 200) {
    listArr.value = res.data.data.list;
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
  name.value = "";
  status.value = "";
};
//重置按钮
const restart = () => {
  name.value = "";
  status.value = "";
  getHas();
};

// 删除用户按钮
const deleteUser = async (userId) => {
  ids.value.push(userId);
  const requestData = { ids: ids.value }; // 提取 ids 引用的值并构造请求数据对象
  let res = await reqSlideShowDelete(requestData);
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
  let res = await reqSlideShowDelete(requestData);
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
let Params = reactive({
  id: 0,
  name: "",
  url: "",
  status: "",
  sort: 1,
});

//添加用户按钮
const add = () => {
  centerDialogVisible.value = true;
  Object.assign(Params, {
    id: 0,
    name: "",
    url: "",
    status: "1",
    sort: 1,
  });
};

//编辑用户按钮
const updata = (row) => {
  centerDialogVisible.value = true;
  Object.assign(Params, row);
};

//窗口保存按钮
const save = async () => {
  let res = await SaveOrUpdateSlideShow(Params);
  if (res.data.code == 200) {
    centerDialogVisible.value = false;
    ElMessage({ type: "success", message: "sueecss" });
    getHas();
  } else {
    ElMessage({ type: "error", message: "error" });
  }
};

//图片上传成功的钩子
const handleAvatarSuccess = (response) => {
  //上传返回的数据 图片url  uploadFile
  Params.url = response.data;
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
