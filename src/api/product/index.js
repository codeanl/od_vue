import http from "@/utils/http";

//获取分类列表
export const reqCateList = (data) => http.get("/api/category/list", data);
//获取列表
export const SaveOrUpdateCate = (data) =>
  http.post("/api/category/category", data);
//删除分类
export const reqCateDelete = (data) => http.post("/api/category/del", data);
//获取商品列表
export const reqProductList = (data) => http.get("/api/product/list", data);
//删除商品
export const reqProductDelete = (data) => http.post("/api/product/del", data);
//sku list
export const reqProductSkuList = (data) =>
  http.get("/api/product/skuList", data);
//
export const reqProductSkuUpdate = (data) =>
  http.post("/api/product/updateSku", data);

export const reqProductInfo = (data) => http.get("/api/product/info", data);

export const saveOrUpdateProduct = (data) =>
  http.post("/api/product/product", data);
