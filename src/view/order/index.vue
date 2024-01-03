<template>
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
        label="下单时间"
        align="center"
        prop="createdTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="订单号码"
        align="center"
        prop="orderSn"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="总金额"
        align="center"
        prop="totalAmount"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column
        label="订单类型"
        align="center"
        prop="payType"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template #="{ row }">
          <el-tag type="success" v-if="row.status == '1'">1</el-tag>
          <el-tag type="danger" v-if="row.status == '0'">0</el-tag>
          <el-tag type="danger" v-if="row.status == '2'">2</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="订单类型"
        align="center"
        prop="orderType"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="备注"
        align="center"
        prop="note"
        show-overflow-tooltip
      ></el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="150">
        <template #="{ row }">
          <el-button
            type="warning"
            :icon="User"
            circle
            @click="lookInfo(row)"
          />
          <el-button
            type="primary"
            :icon="Edit"
            circle
            @click="updataStatus(row)"
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
  <el-drawer v-model="drawer" size="600">
    <!--  -->
    <el-table :data="skuList">
      <!--  -->
      <el-table-column
        label="图片"
        align="center"
        prop="url"
        show-overflow-tooltip
        width="100"
      >
        <template #="{ row }">
          <img :src="row.pic" alt="头像" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        align="center"
        prop="desc"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column
        label="规格"
        align="center"
        prop="tag"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="价格"
        align="center"
        prop="price"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="数量"
        align="center"
        prop="count"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
    <!--  -->
    <el-descriptions
      title="订单详情"
      direction="horizontal"
      :column="1"
      :size="size"
      border
    >
      <!-- <el-descriptions-item label="订单号">{{
        orderInfo.orderSn
      }}</el-descriptions-item> -->
      <el-descriptions-item label="总金额">
        <p style="color: red">¥{{ orderInfo?.totalAmount }}</p>
      </el-descriptions-item>

      <el-descriptions-item label="支付方式">
        <el-tag class="mx-1" effect="success" v-if="orderInfo?.payType == '1'">
          微信
        </el-tag>
        <el-tag class="mx-1" effect="dark" v-if="orderInfo?.payType == '2'">
          支付宝
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="订单类型">
        <el-tag
          class="mx-1"
          effect="success"
          v-if="orderInfo?.orderType == '1'"
        >
          正常订单
        </el-tag>
        <el-tag
          class="mx-1"
          type="dark"
          effect="dark"
          v-if="orderInfo?.orderType == '2'"
        >
          秒杀订单
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="备注">{{
        orderInfo?.note
      }}</el-descriptions-item>
      <el-descriptions-item label="支付时间">{{
        orderInfo?.paymentTime
      }}</el-descriptions-item>
      <el-descriptions-item label="发货时间">{{
        orderInfo?.deliveryTime
      }}</el-descriptions-item>
      <el-descriptions-item label="确认收货时间">{{
        orderInfo?.receiveTime
      }}</el-descriptions-item>
      <el-descriptions-item label="收货人">{{
        orderInfo?.name + orderInfo?.phone
      }}</el-descriptions-item>
      <el-descriptions-item label="地址">{{
        orderInfo?.address
      }}</el-descriptions-item>
    </el-descriptions>
    <!--  -->
  </el-drawer>

  <el-dialog v-model="drawer1">
    <el-radio-group v-model="radio1" size="large" @change="changeStatus">
      <el-radio-button label="1" disabled>未付款</el-radio-button>
      <el-radio-button label="2">准备中</el-radio-button>
      <el-radio-button label="3">待提货</el-radio-button>
      <el-radio-button label="4">租赁中</el-radio-button>
      <el-radio-button label="5">完成</el-radio-button>
    </el-radio-group>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { Delete, Edit, User } from "@element-plus/icons-vue";
import { reqOrderList, reqOrderInfo, reqOrderUpdate } from "@/api/order";
//收集用户查找的关键字
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
  let res = await reqOrderList({ params: data });
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
//
const drawer = ref(false);
const orderInfo = ref();
const skuList = ref([]);
const size = ref("");
const lookInfo = async (row) => {
  drawer.value = true;
  let res = await reqOrderInfo({ params: { id: row.id } });
  if (res.data.code == 200) {
    orderInfo.value = res.data.data;
    skuList.value = res.data.data.sku;
  } else {
    ElMessage({ type: "error", message: "获取列表失败" });
  }
};
//
const drawer1 = ref(false);
const radio1 = ref("1");
let nowId = ref(0);
const updataStatus = (row) => {
  radio1.value = row.status;
  drawer1.value = true;
  nowId.value = row.id;
};
// reqOrderUpdate
const changeStatus = async (value) => {
  console.log(value);
  const data = {
    id: nowId.value,
    status: value,
  };
  let res = await reqOrderUpdate(data);
  if (res.data.code == 200) {
    drawer1.value = false;
    getHas();
  }
};
</script>

<style lang="scss" scoped></style>
