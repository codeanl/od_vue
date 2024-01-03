<template>
  <!-- 搜索 -->
  <!-- <el-card>
    <el-form :inline="true">
      <el-form-item label="订单类型:">
        <el-select v-model="status" class="m-2" placeholder="请选择状态">
          <el-option label="正常" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="支付类型:">
        <el-select v-model="status" class="m-2" placeholder="请选择状态">
          <el-option label="正常" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="status" class="m-2" placeholder="请选择状态">
          <el-option label="正常" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="地址">
        <el-input placeholder="请输入搜索的地址" v-model="address"></el-input>
      </el-form-item>
      <el-form-item label="最大价钱">
        <el-input placeholder="请输入搜索的最大价钱" v-model="phone"></el-input>
      </el-form-item>
      <el-form-item label="最大价钱">
        <el-input placeholder="请输入搜索的最大价钱" v-model="email"></el-input>
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
    <el-table
      border
      :data="orderArr"
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
        label="订单号码"
        align="center"
        prop="order_sn"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="总金额"
        align="center"
        prop="total_amount"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="支付方式"
        align="center"
        prop="pay_amount"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="订单类型"
        align="center"
        prop="pay_type"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="类型"
        align="center"
        prop="status"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="备注"
        align="center"
        prop="note"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="下单时间"
        align="center"
        prop="created_at"
        show-overflow-tooltip
      ></el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="150">
        <template #="{ row }">
          <el-button type="warning" :icon="User" circle @click="info(row)" />
          <el-button
            type="primary"
            :icon="Edit"
            circle
            @click="updataStatus(row)"
          />
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
    title="'订单详情'"
    width="800"
    center
  >
    订单详情
  </el-dialog>

  <!--  -->
  <el-dialog
    v-model="centerDialogVisible1"
    title="'修改订单状态'"
    width="800"
    center
  >
    修改订单状态
  </el-dialog>
</template>

<script setup>
import { Delete, Edit, User } from "@element-plus/icons-vue";
import { reqOrderList } from "@/api/order";
import { ref, onMounted, reactive } from "vue";
//收集用户查找的关键字
let order_type = ref("");
let pay_type = ref("");
let status = ref("");
let address = ref("");
let max_prices = ref(0);
let min_prices = ref(0);
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
let orderArr = ref([]);
const getHas = async () => {
  let data = {
    pageSize: pageSize.value,
    pageNum: pageNo.value,
    order_type: order_type.value,
    pay_type: pay_type.value,
    status: status.value,
    address: address.value,
    max_prices: max_prices.value,
    min_prices: min_prices.value,
  };
  let res = await reqOrderList({ params: data });
  if (res.data.code == 200) {
    orderArr.value = res.data.data;
    total.value = res.data.data.total;
  } else {
    ElMessage({ type: "error", message: "获取列表失败" });
  }
};

//搜索按钮
const search = () => {
  getHas();
  username.value = "";
  nickname.value = "";
  email.value = "";
  status.value = "";
};

//复选框选择
const selectChange = (value) => {
  selectIdArr.value = value;
};

//对话框
const centerDialogVisible = ref(false);
const centerDialogVisible1 = ref(false);
//订单详情
const info = () => {
  centerDialogVisible.value = true;
};
//订单详情
const updataStatus = () => {
  centerDialogVisible1.value = true;
};
</script>

<style lang="scss" scoped></style>
