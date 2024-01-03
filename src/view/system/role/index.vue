<template>
  <!-- 搜索 -->
  <el-card>
    <el-form :inline="true">
      <el-form-item label="名称">
        <el-input placeholder="请输入搜索的名称" v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="关键词">
        <el-input placeholder="请输入搜索的关键词" v-model="label"></el-input>
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
    <el-button type="primary" size="default" @click="addRole"> 添加 </el-button>
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
      :data="roleArr"
      style="margin: 15px 0"
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
        label="名称"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="关键词"
        align="center"
        prop="label"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template #="{ row }">
          <el-tag type="success" v-if="row.status == '1'">正常</el-tag>
          <el-tag type="danger" v-if="row.status == '0'">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150">
        <template #="{ row }">
          <el-button
            type="warning"
            :icon="User"
            circle
            @click="setPermission(row)"
          />
          <el-button
            type="primary"
            :icon="Edit"
            circle
            @click="updataRole(row)"
          />
          <el-popconfirm
            :title="`你确定删除${row.name}`"
            width="260px"
            @confirm="deleteRole(row.id)"
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
    width="800"
    :title="roleParams.id ? '更新角色' : '添加角色'"
    center
  >
    <el-form :model="roleParams">
      <el-form-item label="名称" prop="name">
        <el-input
          placeholder="请您输入名称"
          v-model="roleParams.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="关键词" prop="label">
        <el-input
          placeholder="请您输入关键词"
          v-model="roleParams.label"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="roleParams.status"
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
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮的权限</h4>
    </template>
    <template #default>
      <!-- default-expand-all默认展开 -->
      <!-- default-checked-keys	默认勾选的节点的 key 的数组 -->
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handlerSave">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { Delete, Edit, User } from "@element-plus/icons-vue";
import {
  reqRoleList,
  SaveOrUpdateRole,
  reqRoleDelete,
  reqRoleMenuAdd,
} from "@/api/role";
import { reqMenuListList, reqMenuList, getMenuByRoleId } from "@/api/menu";
//收集用户查找的关键字
let name = ref("");
let label = ref("");
let status = ref("");
//准备批量删除用户的id
let selectIdArr = ref([]);
//复选框选择
const selectChange = (value) => {
  selectIdArr.value = value;
};
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
//获取列表
let roleArr = ref([]);
const getHas = async () => {
  let data = {
    pageSize: pageSize.value,
    pageNum: pageNo.value,
    name: name.value,
    label: label.value,
    status: status.value,
  };
  let res = await reqRoleList({ params: data });
  if (res.data.code == 200) {
    roleArr.value = res.data.data.list;
    total.value = res.data.data.total;
  } else {
    ElMessage({ type: "error", message: "获取列表失败" });
  }
};

//重置按钮
const restart = () => {
  name.value = "";
  label.value = "";
  status.value = "";
  getHas();
};

//搜索按钮
const search = () => {
  getHas();
  name.value = "";
  label.value = "";
  status.value = "";
};

//收集信息
let roleParams = reactive({
  id: 0,
  name: "",
  label: "",
  status: "",
});

//对话框
const centerDialogVisible = ref(false);
//添加用户按钮
const addRole = () => {
  centerDialogVisible.value = true;
  Object.assign(roleParams, {
    id: 0,
    name: "",
    label: "",
    status: "1",
  });
};

//编辑用户按钮
const updataRole = (row) => {
  centerDialogVisible.value = true;
  Object.assign(roleParams, row);
};

//窗口保存按钮
const save = async () => {
  let res = await SaveOrUpdateRole(roleParams);
  if (res.data.code == 200) {
    centerDialogVisible.value = false;
    ElMessage({ type: "success", message: "sueecss" });
    getHas();
  } else {
    ElMessage({ type: "error", message: "error" });
  }
};

// 删除按钮
const deleteRole = async (id) => {
  ids.value.push(id);
  const requestData = { ids: ids.value };
  let res = await reqRoleDelete(requestData);
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
  let res = await reqRoleDelete(requestData);
  if (res.data.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHas();
  } else {
    ElMessage({ type: "error", message: "删除失败" });
  }
};

//权限抽屉
let drawer = ref(false);
//菜单数据收集
let menuArr = ref([]);
//准备数组 存储勾选的四级  选择的权限
let selectArr = ref([]);
//收集数据
let RoleParams = reactive({
  name: "",
  remark: "",
});
let tree = ref();
const setPermission = async (row) => {
  menuArr.value = [];
  selectArr.value = [];
  drawer.value = true;
  Object.assign(RoleParams, row);
  let res = await reqMenuList();
  if (res.data.code == 200) {
    menuArr.value = res.data.data;
  }
  let res1 = await getMenuByRoleId({ params: { id: row.id } });
  if (res1.data.code == 200) {
    selectArr.value = res.data.data.filter((item) =>
      res1.data.data.some((elem) => elem.id === item.id)
    );
    const ids = [];
    findMatchingIds(res.data.data, res1.data.data, ids);
    console.log(ids);
    selectArr.value = ids;
  }
};
//
function findMatchingIds(all, now, ids) {
  for (let i = 0; i < all.length; i++) {
    const allItem = all[i];
    const nowItem = now.find((item) => item.id === allItem.id);

    if (nowItem) {
      ids.push(allItem.id);

      if (allItem.children && nowItem.children) {
        findMatchingIds(allItem.children, nowItem.children, ids);
      }
    }
  }
}

//

const defaultProps = {
  children: "children",
  label: "name",
};

//分配按钮
const handlerSave = async () => {
  const roleId = RoleParams.id;
  //当前节点id
  let arr = tree.value.getCheckedKeys();
  //半选id 把父id给传进去
  let arr1 = tree.value.getHalfCheckedKeys();
  // 合并id
  let permissionId = arr.concat(arr1);
  let res = await reqRoleMenuAdd({
    roleId: roleId,
    menuIds: permissionId,
  });
  if (res.data.code === 200) {
    drawer.value = false;
    // window.location.reload();
    ElMessage({ type: "success", message: res.message });
  } else {
    ElMessage({ type: "error", message: res.message });
  }
};
</script>
