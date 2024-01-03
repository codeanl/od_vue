<template>
  <!-- 搜索 -->
  <!-- <el-card>
    <el-form :inline="true">
      <el-form-item label="名称">
        <el-input placeholder="请输入搜索的名称" v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="分类id">
        <el-input
          placeholder="请输入搜索的分类id"
          v-model="category_id"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input placeholder="请输入搜索的邮箱" v-model="email"></el-input>
      </el-form-item>

      <el-form-item label="排序">
        <el-input placeholder="请输入搜索的排序" v-model="sort_type"></el-input>
      </el-form-item>

      <el-form-item label="最大价钱">
        <el-input
          placeholder="请输入搜索的最大价钱"
          v-model="max_price"
        ></el-input>
      </el-form-item>
      <el-form-item label="最小价钱">
        <el-input
          placeholder="请输入搜索的最小价钱"
          v-model="min_price"
        ></el-input>
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
    <el-button type="primary" size="default" @click="addProduct">
      添加
    </el-button>
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
      :data="productArr"
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
        prop="pic"
        show-overflow-tooltip
        width="100"
      >
        <template #="{ row }">
          <img :src="row.pic" alt="图片" style="width: 60px; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column
        label="名称"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="描述"
        align="center"
        prop="desc"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="价格"
        align="center"
        prop="price"
        show-overflow-tooltip
      ></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="150">
        <template #="{ row }">
          <el-button type="warning" :icon="User" circle @click="lookSku(row)" />
          <el-button
            type="primary"
            :icon="Edit"
            circle
            @click="updataPro(row)"
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

  <!-- // -->
  <el-dialog v-model="centerDialogVisible" width="800" center>
    <el-form :model="Params" ref="formRef">
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请您输入名称" v-model="Params.name"></el-input>
      </el-form-item>
      <el-form-item label="category_id" prop="category_id">
        <el-input
          placeholder="category_id"
          v-model="Params.category_id"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品描述" prop="desc">
        <el-input placeholder="商品描述" v-model="Params.desc"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input placeholder="价格" v-model="Params.price"></el-input>
      </el-form-item>
      <el-form-item label="商品封面" prop="pic">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8080/file/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="Params.pic" :src="Params.pic" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!--  -->
    <el-form :model="Params" :inline="true">
      <h2>照片墙</h2>
      <el-upload
        v-model:file-list="fileList"
        action="http://localhost:8080/file/upload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess1"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form>
    <!--  -->
    <!-- 介绍照片墙 -->
    <el-form :model="Params" :inline="true">
      <h2>介绍照片墙</h2>
      <el-upload
        v-model:file-list="introduceImgUrlList"
        action="http://localhost:8080/file/upload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview1"
        :on-remove="handleRemove1"
        :on-success="handleAvatarSuccess2"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible1">
        <img w-full :src="dialogImageUrl1" alt="Preview Image" />
      </el-dialog>
    </el-form>
    <!-- v-if="Params.id == 0" -->
    <div v-if="Params.id == 0">
      <el-button type="primary" @click="addRow">添加行</el-button>
      <el-table :data="tableData" border>
        <el-table-column label="名称">
          <template #="{ row }">
            <el-input v-model="row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="值">
          <template #="{ row }">
            <el-input v-model="row.value"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--  -->
    <template #footer>
      <div style="flex: auto">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>

  <!--  -->
  <el-dialog v-model="centerDialogVisible1" width="1000" center>
    <el-table style="margin: 15px 0" row-key="id" border :data="skuList">
      <el-table-column
        label="id"
        align="center"
        prop="id"
        width="70"
      ></el-table-column>
      <el-table-column
        label="图片"
        align="center"
        prop="pic"
        show-overflow-tooltip
        width="100"
      >
        <template #="{ row }">
          <img :src="row.pic" alt="图片" style="width: 60px; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column
        label="名称"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="描述"
        align="center"
        prop="desc"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="价格"
        align="center"
        prop="price"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="库存"
        align="center"
        prop="stock"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="销量"
        align="center"
        prop="sale"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="规格"
        align="center"
        prop="tag"
        width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template #="{ row }">
          <el-button type="primary" size="small" @click="updataSku(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

  <!--  -->
  <el-dialog v-model="centerDialogVisible2" width="800" title="更新sku" center>
    <el-form :model="skuUp">
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请您输入名称" v-model="skuUp.name"></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="pic">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8080/file/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess6"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="skuUp.pic" :src="skuUp.pic" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input placeholder="请您输入描述" v-model="skuUp.desc"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input placeholder="请您输入价格" v-model="skuUp.price"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input placeholder="请您输入库存" v-model="skuUp.stock"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="centerDialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="upSkusave">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import {
  reqProductList,
  reqProductDelete,
  reqProductSkuList,
  reqProductSkuUpdate,
  reqProductInfo,
  saveOrUpdateProduct,
} from "@/api/product";
import { Delete, Edit, User } from "@element-plus/icons-vue";
const tableData = ref([
  { name: "", value: "" }, // 默认一行
]);
const addRow = () => {
  tableData.value.push({ name: "", value: "" });
};
//准备批量删除用户的id
let selectIdArr = ref([]);
//收集删除的id
let ids = ref([]);
//默认个数 默认页码
let pageNo = ref(1);
let pageSize = ref(10);
let total = ref(0);
//收集用户查找的关键字
let name = ref("");
let category_id = ref();
let sort_type = ref("");
let max_price = ref();
let min_price = ref("");

//复选框选择
const selectChange = (value) => {
  selectIdArr.value = value;
};
onMounted(() => {
  getHas();
});
//下拉改变
const handler = () => {
  getHas();
};
//获取用户信息
let productArr = ref([]);
const getHas = async () => {
  let data = {
    pageSize: pageSize.value,
    pageNum: pageNo.value,
    name: name.value,
    category_id: category_id.value,
    sort_type: sort_type.value,
    max_price: max_price.value,
    min_price: min_price.value,
  };
  let res = await reqProductList({ params: data });
  if (res.data.code == 200) {
    productArr.value = res.data.data.list;
    total.value = res.data.data.total;
  } else {
    ElMessage({ type: "error", message: "获取列表失败" });
  }
};
//重置按钮
const restart = () => {
  name.value = "";
  category_id.value = 0;
  sort_type.value = "";
  max_price.value = 0;
  min_price.value = 0;
  getHas();
};

// 删除用户按钮
const deleteUser = async (userId) => {
  ids.value.push(userId);
  const requestData = { ids: ids.value }; // 提取 ids 引用的值并构造请求数据对象
  let res = await reqProductDelete(requestData);
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
  let res = await reqProductDelete(requestData);
  if (res.data.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHas();
  } else {
    ElMessage({ type: "error", message: "删除失败" });
  }
};

const centerDialogVisible = ref(false);
//收集用户信息
let Params = reactive({
  id: 0,
  category_id: 0,
  name: "",
  pic: "",
  desc: "",
  price: "",
  img: [],
  detail_img: [],
  size: [{ name: "", value: "" }],
});

//添加用户按钮
const addProduct = () => {
  centerDialogVisible.value = true;
  Object.assign(Params, {
    id: 0,
    category_id: 0,
    name: "",
    pic: "",
    desc: "",
    price: "",
    img: [],
    detail_img: [],
    size: [{ name: "", value: "" }],
  });
  tableData.value = [];
  Params.size = tableData.value;
};
const fileList = ref([]);
const introduceImgUrlList = ref([]);
//编辑用户按钮
const updataPro = async (row) => {
  tableData.value = [];
  Params.size = tableData.value;

  centerDialogVisible.value = true;
  Object.assign(Params, row);
  let res = await reqProductInfo({ params: { id: row.id } });
  const imgs = [];
  const detail_imgs = [];
  for (let index = 0; index < res.data.data.img.length; index++) {
    imgs.push(res.data.data.img[index].url);
  }
  for (let index = 0; index < res.data.data.detailImg.length; index++) {
    detail_imgs.push(res.data.data.detailImg[index].url);
  }
  Params.img = imgs;
  Params.detail_img = detail_imgs;
  fileList.value = Params.img.map((url) => ({
    name: url.substring(url.lastIndexOf("/") + 1),
    url: url,
  }));
  introduceImgUrlList.value = Params.detail_img.map((url) => ({
    name: url.substring(url.lastIndexOf("/") + 1),
    url: url,
  }));
};

//窗口保存按钮
const save = async () => {
  console.log(Params);
  let res = await saveOrUpdateProduct(Params);
  if (res.data.code == 200) {
    centerDialogVisible.value = false;
    ElMessage({ type: "success", message: "sueecss" });
    getHas();
  } else {
    ElMessage({ type: "error", message: "error" });
  }
};

//
const skuList = ref([]);
const centerDialogVisible1 = ref(false);
const lookSku = async (row) => {
  centerDialogVisible1.value = true;
  let res = await reqProductSkuList({ params: { id: row.id } });
  if (res.data.code == 200) {
    skuList.value = res.data.data;
  }
};

// reqProductSkuUpdate
//
let skuUp = reactive({
  id: 0,
  name: "",
  pic: "",
  desc: "",
  price: "",
  stock: 1,
});
const centerDialogVisible2 = ref(false);
const updataSku = (row) => {
  centerDialogVisible2.value = true;
  centerDialogVisible1.value = false;
  Object.assign(skuUp, row);
};
const upSkusave = async () => {
  skuUp.price = parseFloat(skuUp.price);
  let res = await reqProductSkuUpdate(skuUp);
  if (res.data.code == 200) {
    centerDialogVisible2.value = false;
    ElMessage({ type: "success", message: "sueecss" });
  } else {
    ElMessage({ type: "error", message: "error" });
  }
};
const dialogImageUrl = ref("");
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};

const handleRemove = (uploadFile, uploadFiles) => {
  Params.img = Params.img.filter((item) => item !== uploadFile.url);
};
const handleAvatarSuccess1 = (response) => {
  //上传返回的数据 图片url  uploadFile
  Params.img.push(response.data);
  Params.img.value.clearValidate("img");
};
const dialogImageUrl1 = ref("");
const handlePictureCardPreview1 = (uploadFile) => {
  dialogImageUrl1.value = uploadFile.url;
  dialogVisible1.value = true;
};
const handleRemove1 = (uploadFile, uploadFiles) => {
  Params.detail_img = Params.detail_img.filter(
    (item) => item !== uploadFile.url
  );
};
const handleAvatarSuccess2 = (response) => {
  if (Params.detail_img === null) {
    Params.detail_img = []; // 创建一个新的空数组
  }
  Params.detail_img.push(response.data);
  Params.detail_img.value.clearValidate("detail_img");
};

let formRef = ref();
//图片上传成功的钩子
const handleAvatarSuccess = (response) => {
  Params.pic = response.data;
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

//图片上传成功的钩子
const handleAvatarSuccess6 = (response) => {
  skuUp.pic = response.data;
  formRef.value.clearValidate("pic");
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
