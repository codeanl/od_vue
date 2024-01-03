<template>
  <el-card>
    <el-button type="primary" size="default" icon="Plus" @click="addCate">
      添加
    </el-button>
    <!--  -->
    <el-table style="margin: 15px 0" row-key="id" border :data="cateArr">
      <el-table-column prop="name" label="名称" width="120px" />
      <el-table-column
        label="图标"
        align="center"
        prop="icon"
        show-overflow-tooltip
        width="120px"
      >
        <template #="{ row }">
          <img :src="row.pic" alt="图标" style="width: 60px; height: auto" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #="{ row }">
          <el-tag type="success" v-if="row.status == '1'">正常</el-tag>
          <el-tag type="danger" v-if="row.status == '0'">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260px">
        <template #="{ row }">
          <el-button type="primary" size="small" @click="updataCate(row)">
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.name}?`"
            @confirm="deleteCate(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!--  -->
  <el-dialog
    v-model="centerDialogVisible"
    width="800"
    :title="cateParams.id ? '更新分类' : '添加分类'"
    center
  >
    <el-form :model="cateParams">
      <el-form-item label="名称" prop="name">
        <el-input
          placeholder="请您输入名称"
          v-model="cateParams.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input
          placeholder="请您输入排序"
          v-model="cateParams.sort"
        ></el-input>
      </el-form-item>
      <el-form-item label="父级id" prop="parent_id">
        <el-input
          placeholder="请您输入父级id"
          v-model="cateParams.pid"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="cateParams.status"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="pic" prop="pic">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8080/file/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="cateParams.pic" :src="cateParams.pic" class="avatar" />
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
import { reqCateList, SaveOrUpdateCate, reqCateDelete } from "@/api/product";
onMounted(() => {
  getHas();
});

//获取列表
let cateArr = ref([]);
const getHas = async () => {
  let res = await reqCateList({});
  if (res.data.code == 200) {
    cateArr.value = res.data.data;
    total.value = res.data.data.total;
  } else {
    ElMessage({ type: "error", message: "获取列表失败" });
  }
};

//对话框
const centerDialogVisible = ref(false);
//收集用户信息
let cateParams = reactive({
  id: 0,
  name: "",
  pic: "",
  sort: 0,
  pid: 0,
  status: "1",
});
//添加用户按钮
const addCate = () => {
  centerDialogVisible.value = true;
  Object.assign(cateParams, {
    id: 0,
    name: "",
    pic: "",
    sort: 0,
    parent_id: 0,
    status: "1",
  });
};

//编辑用户按钮
const updataCate = (row) => {
  centerDialogVisible.value = true;
  Object.assign(cateParams, row);
};

//窗口保存按钮
const save = async () => {
  let res = await SaveOrUpdateCate(cateParams);
  if (res.data.code == 200) {
    centerDialogVisible.value = false;
    ElMessage({ type: "success", message: "sueecss" });
    getHas();
  } else {
    ElMessage({ type: "error", message: "error" });
  }
};

//状态修改
let handleChange = async (row) => {
  let res = await SaveOrUpdateCate({
    id: row.id,
    status: row.status,
  });
  if (res.data.code === 200) {
    ElMessage({ type: "success", message: "success" });
  } else {
    ElMessage({ type: "error", message: "error" });
  }
};
//收集删除的id
let ids = ref([]);
// 删除用户按钮
const deleteCate = async (id) => {
  ids.value = [];
  ids.value.push(id);
  const requestData = { ids: ids.value };
  let res = await reqCateDelete(requestData);
  if (res.data.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHas();
  } else {
    ElMessage({ type: "error", message: "删除失败" });
  }
};

//图片上传成功的钩子
const handleAvatarSuccess = (response) => {
  //上传返回的数据 图片url  uploadFile
  cateParams.pic = response.data;
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
