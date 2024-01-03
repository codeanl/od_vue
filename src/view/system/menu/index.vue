<template>
  <el-card>
    <el-button type="primary" size="default" icon="Plus" @click="addMenu">
      添加
    </el-button>
    <!--  -->
    <el-table style="margin: 15px 0" row-key="id" border :data="menuArr">
      <el-table-column prop="name" label="名称" width="120px" />
      <el-table-column prop="path" label="路径"> </el-table-column>
      <el-table-column prop="component" label="组件"> </el-table-column>
      <el-table-column prop="icon" label="图标"> </el-table-column>
      <el-table-column prop="sort" label="排序"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #="{ row }">
          <el-tag type="success" v-if="row.status == '1'">正常</el-tag>
          <el-tag type="danger" v-if="row.status == '0'">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260px">
        <template #="{ row }">
          <el-button
            type="primary"
            :icon="Edit"
            circle
            @click="updataMenu(row)"
          />
          <el-popconfirm
            :title="`你确定删除${row.name}`"
            width="260px"
            @confirm="deleteCate(row.id)"
          >
            <template #reference>
              <el-button type="danger" :icon="Delete" circle> </el-button>
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
    :title="menuParams.id ? '更新分类' : '添加分类'"
    center
  >
    <el-form :model="menuParams">
      <el-form-item label="名称" prop="name">
        <el-input
          placeholder="请您输入名称"
          v-model="menuParams.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="路径" prop="path">
        <el-input
          placeholder="请您输入路径"
          v-model="menuParams.path"
        ></el-input>
      </el-form-item>
      <el-form-item label="组件" prop="component">
        <el-input
          placeholder="请您输入组件"
          v-model="menuParams.component"
        ></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input
          placeholder="请您输入图标"
          v-model="menuParams.icon"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input
          placeholder="请您输入排序"
          v-model="menuParams.sort"
        ></el-input>
      </el-form-item>
      <el-form-item label="父级id" prop="parent_id">
        <el-input
          placeholder="请您输入父级id"
          v-model="menuParams.pid"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="menuParams.status"
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
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { reqMenuList, SaveOrUpdateMenu, reqMenuDelete } from "@/api/menu";
import { Delete, Edit, User } from "@element-plus/icons-vue";
onMounted(() => {
  getHas();
});

//获取列表
let menuArr = ref([]);
const getHas = async () => {
  let res = await reqMenuList({});
  if (res.data.code == 200) {
    menuArr.value = res.data.data;
  } else {
    ElMessage({ type: "error", message: "获取列表失败" });
  }
};

//对话框
const centerDialogVisible = ref(false);
//收集用户信息
let menuParams = reactive({
  id: 0,
  name: "",
  path: "",
  component: "",
  icon: "",
  sort: 1,
  pid: 0,
  status: "1",
});
//添加用户按钮
const addMenu = () => {
  centerDialogVisible.value = true;
  Object.assign(menuParams, {
    id: 0,
    name: "",
    path: "",
    component: "",
    icon: "",
    sort: 1,
    pid: 0,
    status: "1",
  });
};

//编辑用户按钮
const updataMenu = (row) => {
  centerDialogVisible.value = true;
  // menuParams.id = row.id;
  // menuParams.name = row.name;
  // menuParams.path = row.path;
  // menuParams.component = row.component;
  // menuParams.icon = row.icon;
  // menuParams.sort = row.sort;
  // menuParams.pid = row.pid;
  // menuParams.status = row.status;
  Object.assign(menuParams, row);
};

//窗口保存按钮
const save = async () => {
  let res = await SaveOrUpdateMenu(menuParams);
  if (res.data.code == 200) {
    centerDialogVisible.value = false;
    ElMessage({ type: "success", message: "sueecss" });
    getHas();
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
  let res = await reqMenuDelete(requestData);
  if (res.data.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHas();
  } else {
    ElMessage({ type: "error", message: "删除失败" });
  }
};
</script>

<style lang="scss" scoped></style>
