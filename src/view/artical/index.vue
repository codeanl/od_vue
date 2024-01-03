<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="名称">
        <el-input placeholder="请输入搜索的名称" v-model="title"></el-input>
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
        label="封面"
        align="center"
        prop="pic"
        show-overflow-tooltip
        width="120"
      >
        <template #="{ row }">
          <img :src="row.pic" alt="封面" style="width: 100px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column
        label="标题"
        align="center"
        prop="title"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="作者"
        align="center"
        prop="pic"
        show-overflow-tooltip
        width="200"
      >
        <template #="{ row }">
          <div style="display: flex">
            <img
              :src="row.member?.avatar"
              alt="封面"
              style="width: 40px; height: 40px; border-radius: 50%"
            />
            <p>{{ row.member?.nickname }}</p>
          </div>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="150">
        <template #="{ row }">
          <el-button
            type="warning"
            :icon="User"
            circle
            @click="lookArtical(row)"
          />
          <el-popconfirm
            :title="`你确定删除${row.title}`"
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
  <el-dialog v-model="centerDialogVisible" center width="600">
    <div v-html="richTextContent" class="rich-text"></div>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import { Delete, Edit, User } from "@element-plus/icons-vue";
import {
  reqAricalList,
  reqAricalDelete,
  SaveOrUpdateArtical,
} from "@/api/artical";
//收集用户查找的关键字
let title = ref("");
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
    title: title.value,
  };
  let res = await reqAricalList({ params: data });
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
  let res = await reqAricalDelete(requestData);
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
  let res = await reqAricalDelete(requestData);
  if (res.data.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHas();
  } else {
    ElMessage({ type: "error", message: "删除失败" });
  }
};
const richTextContent = ref();
const centerDialogVisible = ref(false);
const lookArtical = (row) => {
  richTextContent.value = "";
  richTextContent.value = row.content;
  centerDialogVisible.value = true;
};
//搜索按钮
const search = () => {
  getHas();
  title.value = "";
};
//重置按钮
const restart = () => {
  title.value = "";
  getHas();
};
</script>

<style lang="scss" scoped></style>
<style>
.rich-text img {
  max-width: 100%;
  height: auto;
}
</style>
