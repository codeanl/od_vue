<template>
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
        label="用户"
        align="center"
        show-overflow-tooltip
        width="120"
      >
        <template #="{ row }">
          <div style="display: flex">
            <img
              :src="row.user?.avatar"
              alt="头像"
              style="width: 40px; height: 40px; border-radius: 50%"
            />
            <p>{{ row.user?.username }}</p>
          </div>
        </template>
      </el-table-column>
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
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="150">
        <template #="{ row }">
          <el-button type="primary" :icon="Edit" circle @click="updata(row)" />
          <el-popconfirm
            :title="`你确定删除${row.id}`"
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
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import { reqLoginLogList, reqLoginLogDelete } from "@/api/loginLog";
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
  };
  let res = await reqLoginLogList({ params: data });
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
// 删除用户按钮
const deleteUser = async (userId) => {
  ids.value.push(userId);
  const requestData = { ids: ids.value }; // 提取 ids 引用的值并构造请求数据对象
  let res = await reqLoginLogDelete(requestData);
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
  let res = await reqLoginLogDelete(requestData);
  if (res.data.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHas();
  } else {
    ElMessage({ type: "error", message: "删除失败" });
  }
};
</script>

<style lang="scss" scoped></style>
